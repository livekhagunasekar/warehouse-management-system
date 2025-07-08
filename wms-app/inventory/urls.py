from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProductViewSet, SupplierViewSet, InboundViewSet, OutboundViewSet, 
    dashboard_summary, low_stock_alerts, recent_activity, 
    daily_transaction_volume, CycleCountViewSet, get_product_by_barcode, 
    user_list, create_audit_log, user_detail, audit_summary, 
    UserViewSet, UserListCreateView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'suppliers', SupplierViewSet, basename='suppliers')
router.register(r'inbounds', InboundViewSet, basename='inbounds')
router.register(r'outbounds', OutboundViewSet, basename='outbounds')
router.register(r'cycle-counts', CycleCountViewSet, basename='cyclecount')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)), 
    path('dashboard/summary/', dashboard_summary),
    path('dashboard/low-stock/', low_stock_alerts),
    path('dashboard/recent-activity/', recent_activity),
    path('dashboard/daily-transactions/', daily_transaction_volume, name='daily-transactions'),
    path('products/barcode/<str:barcode>/', get_product_by_barcode, name='get_product_by_barcode'),
    path('users/', user_list, name='user-list'),
    path('users/<int:pk>/', user_detail, name='user-detail'),
    path('audit-logs/', create_audit_log, name='create-audit-log'),
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('dashboard/audit-summary/', audit_summary, name='audit-summary'),
]
