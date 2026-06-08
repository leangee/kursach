from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Order, OrderStatus
from datetime import datetime

def send_status_update(order_id, old_status, new_status):
    """Отправка WebSocket-уведомления при изменении статуса заказа"""
    channel_layer = get_channel_layer()
    
    from .models import Order
    try:
        order = Order.objects.select_related('client', 'master').get(id=order_id)
        
        # Уведомляем группу заказа
        async_to_sync(channel_layer.group_send)(
            f'order_{order_id}',
            {
                'type': 'status_update',
                'order_id': order_id,
                'old_status': OrderStatus(old_status).label,
                'new_status': OrderStatus(new_status).label,
                'updated_at': datetime.now().strftime('%d.%m.%Y %H:%M')
            }
        )
        
        # Персональное уведомление клиенту
        if order.client:
            async_to_sync(channel_layer.group_send)(
                f'user_{order.client.id}',
                {
                    'type': 'send_notification',
                    'title': 'Статус заказа изменён',
                    'message': f'Ваш заказ #{order_id} переведён в статус "{OrderStatus(new_status).label}"',
                    'order_id': order_id,
                    'created_at': datetime.now().strftime('%d.%m.%Y %H:%M')
                }
            )
        
        # Персональное уведомление мастеру (если назначен)
        if order.master:
            async_to_sync(channel_layer.group_send)(
                f'user_{order.master.id}',
                {
                    'type': 'send_notification',
                    'title': 'Новый статус заказа',
                    'message': f'Заказ #{order_id} - {OrderStatus(new_status).label}',
                    'order_id': order_id,
                    'created_at': datetime.now().strftime('%d.%m.%Y %H:%M')
                }
            )
    except Order.DoesNotExist:
        pass