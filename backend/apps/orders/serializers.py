from rest_framework import serializers
from .models import Order, CarPost, Comment
from apps.services.models import Service

class OrderSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)
    service_title = serializers.CharField(source='service.title', read_only=True)
    service_price = serializers.DecimalField(source='service.price', read_only=True, max_digits=10, decimal_places=2)
    master_name = serializers.CharField(source='master.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'client', 'client_name', 'service', 'service_title', 'service_price',
                  'car_model', 'car_license_plate', 'scheduled_date', 'status', 'status_display',
                  'master', 'master_name', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'client']

class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['service', 'car_model', 'car_license_plate', 'scheduled_date', 'notes']

class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status', 'master', 'notes']

class CarPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='client.username', read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)
    
    class Meta:
        model = CarPost
        fields = ['id', 'client', 'author_name', 'title', 'content', 'before_photo', 
                  'after_photo', 'created_at', 'views', 'is_published', 'comments_count']
        read_only_fields = ['id', 'created_at', 'views', 'client']

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'car_post', 'order', 'author', 'author_name', 'text', 'rating', 'created_at']
        read_only_fields = ['id', 'created_at', 'author']