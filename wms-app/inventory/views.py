from django.shortcuts import render
from django.db import models
from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.parsers import JSONParser
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import serializers
from rest_framework import generics
from django.contrib.auth import get_user_model
User = get_user_model()
from django.contrib.auth.hashers import make_password

from django.db.models import Sum
from django.utils.timezone import now
from django.db.models import Count, DateField
from collections import defaultdict
from django.utils.timezone import now, timedelta
from django.db.models.functions import Cast
# from .views import user_list

from .models import Product, InventoryAuditLog, Supplier, Inbound, Outbound
from .serializers import ProductSerializer, SupplierSerializer, InboundSerializer, OutboundSerializer, InventoryAuditLogSerializer
from users.permissions import IsAdminOrManager
from .permissions import RolePermission

from .models import CycleCount
from .serializers import CycleCountSerializer

import pandas as pd
import csv
import io

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'sku', 'tags', 'category']

    def get_queryset(self):
        return Product.objects.filter(is_archived=False).order_by('-created_at')
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'bulk_upload']:
            return [permissions.IsAuthenticated(), IsAdminOrManager()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        product = Product.objects.get(id=response.data['id'])
        InventoryAuditLog.objects.create(
            user=request.user,
            product=product,
            action='create',
            description=f"Product '{product.name}' created."
        )
        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        product = self.get_object()
        InventoryAuditLog.objects.create(
            user=request.user,
            product=product,
            action='update',
            description=f"Product '{product.name}' updated."
        )
        return response

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        product.is_archived = True
        product.save()
        InventoryAuditLog.objects.create(
            user=request.user,
            product=product,
            action='archive',
            description=f"Product '{product.name}' archived."
        )
        return Response({"detail": "Product archived successfully."}, status=204)

    @action(detail=False, methods=['post'], url_path='upload')
    def bulk_upload(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file uploaded'}, status=400)

        try:
            if file.name.endswith('.csv'):
                df = pd.read_csv(file)
            elif file.name.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(file)
            else:
                return Response({'error': 'Unsupported file format'}, status=400)

            created_products = []
            for _, row in df.iterrows():
                product_data = {
                    "name": row.get("name"),
                    "sku": row.get("sku"),
                    "tags": row.get("tags", ""),
                    "description": row.get("description", ""),
                    "category": row.get("category", ""),
                    "quantity": int(row.get("quantity", 0)),
                    "low_stock_threshold": int(row.get("low_stock_threshold", 10)),
                }
                serializer = self.get_serializer(data=product_data)
                if serializer.is_valid():
                    product = serializer.save()
                    InventoryAuditLog.objects.create(
                        user=request.user,
                        product=product,
                        action='create',
                        description=f"Bulk upload: {product.name}"
                    )
                    created_products.append(serializer.data)
                else:
                    return Response(serializer.errors, status=400)

            return Response({
                "message": f"{len(created_products)} products uploaded successfully.",
                "products": created_products
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=500)


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]


class InboundViewSet(viewsets.ModelViewSet):
    queryset = Inbound.objects.all()
    serializer_class = InboundSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    def perform_create(self, serializer):
        inbound = serializer.save(created_by=self.request.user)
        # Update inventory quantity automatically
        inbound.product.quantity += inbound.quantity
        inbound.product.save()

        InventoryAuditLog.objects.create(
        user=self.request.user,
        product=inbound.product,
        action='update',
        description=f"Inbound stock added: {inbound.quantity} units (Ref: {inbound.reference})"
    )

    @action(detail=False, methods=['post'], url_path='upload')
    def bulk_upload(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file uploaded'}, status=400)

        try:
            if file.name.endswith('.csv'):
                df = pd.read_csv(file)
            elif file.name.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(file)
            else:
                return Response({'error': 'Unsupported file format'}, status=400)

            created_inbounds = []
            for _, row in df.iterrows():
                product_id = row.get("product_id")
                supplier_id = row.get("supplier_id")

                try:
                    product = Product.objects.get(id=product_id)
                    supplier = Supplier.objects.get(id=supplier_id)
                except (Product.DoesNotExist, Supplier.DoesNotExist):
                    continue  # Skip invalid entries

                inbound = Inbound.objects.create(
                    product=product,
                    supplier=supplier,
                    quantity=int(row.get("quantity", 0)),
                    reference=row.get("invoice_ref", ""),  # FIXED HERE
                    received_date=row.get("received_date"),
                    created_by=request.user
                )


                # Update inventory
                product.quantity += inbound.quantity
                product.save()

                created_inbounds.append(inbound.id)

            return Response({
                "message": f"{len(created_inbounds)} inbounds uploaded successfully.",
                "inbound_ids": created_inbounds
            }, status=201)

        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
class OutboundViewSet(viewsets.ModelViewSet):
    queryset = Outbound.objects.all().order_by('-dispatched_date')
    serializer_class = OutboundSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        outbound = serializer.save(created_by=self.request.user)

        # Prevent negative stock
        if outbound.product.quantity < outbound.quantity:
            raise serializers.ValidationError("Insufficient stock for dispatch.")

        # Deduct stock
        outbound.product.quantity -= outbound.quantity
        outbound.product.save()

        InventoryAuditLog.objects.create(
        user=self.request.user,
        product=outbound.product,
        action='update',
        description=f"Outbound dispatched: {outbound.quantity} units to {outbound.customer} (Ref: {outbound.so_reference})"
    )
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    today = now().date()

    total_products = Product.objects.filter(is_archived=False).count()
    total_quantity = Product.objects.filter(is_archived=False).aggregate(total=Sum('quantity'))['total'] or 0
    total_suppliers = Supplier.objects.count()
    inbound_today = Inbound.objects.filter(received_date=today).count()
    outbound_today = Outbound.objects.filter(dispatched_date=today).count()

    return Response({
        "total_products": total_products,
        "total_quantity": total_quantity,
        "total_suppliers": total_suppliers,
        "inbound_today": inbound_today,
        "outbound_today": outbound_today,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def low_stock_alerts(request):
    low_stock_products = Product.objects.filter(
        is_archived=False,
        quantity__lte=models.F('low_stock_threshold')
    )

    data = [
        {
            "id": p.id,
            "name": p.name,
            "sku": p.sku,
            "quantity": p.quantity,
            "low_stock_threshold": p.low_stock_threshold,
        }
        for p in low_stock_products
    ]

    return Response({"low_stock_products": data})

@api_view(['GET'])
def get_product_by_barcode(request, barcode):
    try:
        product = Product.objects.get(sku=barcode)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_activity(request):
    logs = InventoryAuditLog.objects.select_related('user', 'product').order_by('-timestamp')[:20]

    data = [
        {
            "timestamp": log.timestamp,
            "user": log.user.username if log.user else "Unknown",
            "product": log.product.name,
            "action": log.action,
            "description": log.description
        }
        for log in logs
    ]
    return Response({"recent_activity": data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_transaction_volume(request):
    today = now().date()
    seven_days_ago = today - timedelta(days=6)

    inbound_data = (
        Inbound.objects
        .filter(received_date__range=(seven_days_ago, today))
        .annotate(day=Cast('received_date', output_field=DateField()))
        .values('day')
        .annotate(count=Count('id'))
    )

    outbound_data = (
        Outbound.objects
        .filter(dispatched_date__range=(seven_days_ago, today))
        .annotate(day=Cast('dispatched_date', output_field=DateField()))
        .values('day')
        .annotate(count=Count('id'))
    )

    inbound_map = {entry['day']: entry['count'] for entry in inbound_data}
    outbound_map = {entry['day']: entry['count'] for entry in outbound_data}

    result = []
    for i in range(7):
        date = seven_days_ago + timedelta(days=i)
        result.append({
            "date": date,
            "inbound": inbound_map.get(date, 0),
            "outbound": outbound_map.get(date, 0)
        })

    return Response(result)


class CycleCountViewSet(viewsets.ModelViewSet):
    queryset = CycleCount.objects.all().order_by('-adjusted_at')
    serializer_class = CycleCountSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser]

    def perform_create(self, serializer):
        product = serializer.validated_data['product']
        counted_quantity = serializer.validated_data['counted_quantity']
        system_quantity = product.quantity

        # Adjust inventory
        product.quantity = counted_quantity
        product.save()

        # Save the cycle count record
        serializer.save(
            adjusted_by=self.request.user,
            system_quantity=system_quantity
        )

        # Log it
        InventoryAuditLog.objects.create(
            user=self.request.user,
            product=product,
            action='reconcile',
            description=f"Cycle count adjusted from {system_quantity} to {counted_quantity}"
)

# Define a simple serializer for the User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'is_staff']

# Define the view to return all users
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_audit_log(request):
    serializer = InventoryAuditLogSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        password = serializer.validated_data.get('password')
        serializer.save(password=make_password(password))

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Ensure password is hashed before saving
        serializer.save(password=make_password(self.request.data['password']))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def audit_summary(request):
    # Most edited products
    product_updates = (
        InventoryAuditLog.objects.filter(action="update")
        .values('product__name')
        .annotate(count=Count('id'))
        .order_by('-count')[:5]
    )

    # Most active users
    user_activity = (
        InventoryAuditLog.objects
        .values('user__username')
        .annotate(count=Count('id'))
        .order_by('-count')[:5]
    )

    # Count by action type
    action_counts = (
        InventoryAuditLog.objects
        .values('action')
        .annotate(count=Count('id'))
    )

    # Total logs
    total_logs = InventoryAuditLog.objects.count()

    return Response({
        "product_updates": product_updates,
        "user_activity": user_activity,
        "action_counts": action_counts,
        "total_logs": total_logs
    })
