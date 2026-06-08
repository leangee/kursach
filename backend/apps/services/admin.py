from django.contrib import admin
from .models import ServiceCategory, Service

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'sort_order', 'is_active')
    list_editable = ('sort_order', 'is_active')
    search_fields = ('title',)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'price', 'duration_minutes', 'is_active')
    list_editable = ('price', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('title', 'description')