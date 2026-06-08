from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Order, CarPost, Comment
from .serializers import (
    OrderSerializer, OrderCreateSerializer, OrderUpdateSerializer,
    CarPostSerializer, CommentSerializer
)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'service', 'client']
    search_fields = ['car_model', 'car_license_plate', 'client__username']
    ordering_fields = ['scheduled_date', 'created_at', 'status']
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Order.objects.none()
        if user.role == 'admin':
            return Order.objects.all().select_related('client', 'service', 'master')
        if user.role == 'master':
            return Order.objects.filter(Q(master=user) | Q(status='pending')).select_related('client', 'service')
        return Order.objects.filter(client=user).select_related('service', 'master')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        if self.action in ['update', 'partial_update']:
            return OrderUpdateSerializer
        return OrderSerializer
    
    def perform_create(self, serializer):
        serializer.save(client=self.request.user)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.client != request.user and not request.user.is_staff:
            return Response({'error': 'Нет прав'}, status=status.HTTP_403_FORBIDDEN)
        if order.status in ['completed', 'cancelled']:
            return Response({'error': 'Нельзя отменить выполненный или уже отменённый заказ'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'cancelled'
        order.save()
        return Response({'status': 'cancelled'})
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_comment(self, request, pk=None):
        order = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, order=order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CarPostViewSet(viewsets.ModelViewSet):
    queryset = CarPost.objects.filter(is_published=True)
    serializer_class = CarPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'views']
    
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role in ['master', 'admin']:
            return CarPost.objects.all()
        return CarPost.objects.filter(is_published=True)
    
    def perform_create(self, serializer):
        serializer.save(client=self.request.user)
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        post = self.get_object()
        post.views += 1
        post.save(update_fields=['views'])
        return Response({'views': post.views})

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)