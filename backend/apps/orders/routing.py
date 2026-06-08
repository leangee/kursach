from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/orders/<int:order_id>/', consumers.OrderConsumer.as_asgi()),
    path('ws/notifications/', consumers.NotificationConsumer.as_asgi()),
]