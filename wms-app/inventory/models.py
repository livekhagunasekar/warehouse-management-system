from django.db import models
from django.contrib.auth import get_user_model
from users.models import User

from django.conf import settings
from django.core.files.base import ContentFile
from io import BytesIO
import barcode
from barcode.writer import ImageWriter

class Product(models.Model):
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, unique=True)
    tags = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)
    low_stock_threshold = models.IntegerField(default=10)
    is_archived = models.BooleanField(default=False)
    barcode_image = models.ImageField(upload_to='barcodes/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Generate barcode image only if SKU exists
        if self.sku:
            CODE128 = barcode.get_barcode_class('code128')
            barcode_instance = CODE128(self.sku, writer=ImageWriter())
            buffer = BytesIO()
            barcode_instance.write(buffer)
            image_name = f'{self.sku}.png'
            self.barcode_image.save(image_name, ContentFile(buffer.getvalue()), save=False)
        super().save(*args, **kwargs)
    
class InventoryAuditLog(models.Model):
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('archive', 'Archive'),
    ]

    user = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user} {self.action} {self.product.name} at {self.timestamp}"

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact_info = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Inbound(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='inbounds')
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField()
    reference = models.CharField(max_length=255, help_text="Invoice or delivery note reference")
    received_date = models.DateField()
    file = models.FileField(upload_to='inbound_docs/', null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inbound: {self.product.name} - {self.quantity} pcs"

class Outbound(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='outbounds')
    quantity = models.PositiveIntegerField()
    customer = models.CharField(max_length=255)
    so_reference = models.CharField(max_length=255, help_text="Sales order or delivery note reference")
    dispatched_date = models.DateField()
    file = models.FileField(upload_to='outbound_docs/', null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Outbound: {self.product.name} - {self.quantity} pcs to {self.customer}"
    
class CycleCount(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    counted_quantity = models.PositiveIntegerField()
    system_quantity = models.PositiveIntegerField()
    discrepancy_reason = models.TextField(blank=True, null=True)
    adjusted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    adjusted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} | Counted: {self.counted_quantity} | System: {self.system_quantity}"

