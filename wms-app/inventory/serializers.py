from rest_framework import serializers
from .models import Product
from .models import CycleCount
from .models import Supplier, Inbound, Outbound, InventoryAuditLog
# from .models import User

class ProductSerializer(serializers.ModelSerializer):
    low_stock = serializers.SerializerMethodField()
    barcode_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'  # Or list them all if you want

    def get_low_stock(self, obj):
        return obj.quantity <= obj.low_stock_threshold
    
    def get_barcode_url(self, obj):
        request = self.context.get('request')
        if obj.barcode_image:
            if request:
                return request.build_absolute_uri(obj.barcode_image.url)
            return obj.barcode_image.url
        return None
    
class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class InboundSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)

    class Meta:
        model = Inbound
        fields = [
            'id', 'product', 'product_name',
            'quantity', 'supplier', 'supplier_name',
            'reference', 'received_date', 'created_by'
        ]

class OutboundSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    created_by_username = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Outbound
        fields = [
            'id',
            'product',
            'product_name',
            'quantity',
            'customer',
            'so_reference',
            'dispatched_date',
            'file',
            'created_at',
            'created_by',
            'created_by_username',
        ]
        read_only_fields = ['id', 'product_name', 'created_at', 'created_by_username']

class CycleCountSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    adjusted_by_username = serializers.ReadOnlyField(source='adjusted_by.username')

    class Meta:
        model = CycleCount
        fields = [
            'id',
            'product',
            'product_name',
            'counted_quantity',
            'system_quantity',
            'discrepancy_reason',
            'adjusted_by',
            'adjusted_by_username',
            'adjusted_at'
        ]
        read_only_fields = ['id', 'adjusted_by', 'adjusted_by_username', 'adjusted_at']


class InventoryAuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryAuditLog
        fields = '__all__'
        read_only_fields = ['timestamp']





