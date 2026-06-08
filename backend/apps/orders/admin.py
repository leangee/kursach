from django.contrib import admin
from .models import Order, CarPost, Comment

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'service', 'car_model', 'status', 'scheduled_date', 'created_at')
    list_filter = ('status', 'created_at', 'service')
    search_fields = ('client__username', 'car_model', 'car_license_plate')
    list_editable = ('status',)
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'scheduled_date'

@admin.register(CarPost)
class CarPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'client', 'created_at', 'views', 'is_published')
    list_filter = ('is_published', 'created_at')
    search_fields = ('title', 'content')
    list_editable = ('is_published',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'order', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('text', 'author__username')