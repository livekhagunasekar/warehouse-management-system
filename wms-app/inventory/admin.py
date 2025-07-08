from django.contrib import admin
from .models import Product, InventoryAuditLog, Supplier, Inbound, Outbound, CycleCount

@admin.register(InventoryAuditLog)
class InventoryAuditLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'user', 'action', 'product', 'description')
    list_filter = ('action', 'user')
    search_fields = ('product__name', 'description', 'user__username')

@admin.register(CycleCount)
class CycleCountAdmin(admin.ModelAdmin):
    list_display = ('product', 'counted_quantity', 'system_quantity', 'adjusted_by', 'adjusted_at')
    list_filter = ('adjusted_by',)
    search_fields = ('product__name',)

admin.site.register(Product)
admin.site.register(Supplier)
admin.site.register(Inbound)
admin.site.register(Outbound)


