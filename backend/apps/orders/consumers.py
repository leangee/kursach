import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

class OrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.order_id = self.scope['url_route']['kwargs']['order_id']
        self.room_group_name = f'order_{self.order_id}'
        
        # Присоединяемся к группе заказа
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
    
    async def disconnect(self, close_code):
        # Выходим из группы
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'comment':
            # Обработка комментария через WebSocket
            comment = await self.save_comment(data)
            if comment:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'new_comment',
                        'comment': comment
                    }
                )
    
    async def status_update(self, event):
        # Отправляем сообщение о смене статуса
        await self.send(text_data=json.dumps({
            'type': 'status_update',
            'order_id': event['order_id'],
            'old_status': event['old_status'],
            'new_status': event['new_status'],
            'updated_at': event['updated_at']
        }))
    
    async def new_comment(self, event):
        # Отправляем новый комментарий
        await self.send(text_data=json.dumps({
            'type': 'comment',
            'comment': event['comment']
        }))
    
    @database_sync_to_async
    def save_comment(self, data):
        from .models import Order, Comment
        user = self.scope['user']
        if not user.is_authenticated:
            return None
        
        try:
            order = Order.objects.get(id=self.order_id)
            comment = Comment.objects.create(
                order=order,
                author=user,
                text=data['text'],
                rating=data.get('rating', 5)
            )
            return {
                'id': comment.id,
                'text': comment.text,
                'rating': comment.rating,
                'author': user.username,
                'created_at': comment.created_at.strftime('%d.%m.%Y %H:%M')
            }
        except Order.DoesNotExist:
            return None


class NotificationConsumer(AsyncWebsocketConsumer):
    """Consumer для личных уведомлений пользователя"""
    
    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            await self.close()
            return
        
        self.room_group_name = f'user_{self.user.id}'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
    
    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'title': event['title'],
            'message': event['message'],
            'order_id': event.get('order_id'),
            'created_at': event['created_at']
        }))