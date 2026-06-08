from rest_framework import serializers
from .models import ServiceCategory, Service

class ServiceCategorySerializer(serializers.ModelSerializer):
    services_count = serializers.IntegerField(source='services.count', read_only=True)
    
    class Meta:
        model = ServiceCategory
        fields = ['id', 'title', 'description', 'icon', 'sort_order', 'is_active', 'services_count']

class ServiceListSerializer(serializers.ModelSerializer):
    category_title = serializers.CharField(source='category.title', read_only=True)
    category_id = serializers.IntegerField(source='category.id', read_only=True)
    
    class Meta:
        model = Service
        fields = ['id', 'title', 'price', 'duration_minutes', 'image', 'category_id', 'category_title']

class ServiceSerializer(serializers.ModelSerializer):
    category_title = serializers.CharField(source='category.title', read_only=True)
    category_id = serializers.IntegerField(source='category.id', read_only=True)
    
    class Meta:
        model = Service
        fields = ['id', 'category', 'category_id', 'category_title', 'title', 'description', 
                  'price', 'duration_minutes', 'is_active', 'image']
        read_only_fields = ['id']

class ServiceCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['category', 'title', 'description', 'price', 'duration_minutes', 'is_active', 'image']