from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class OrderStatus(models.TextChoices):
    PENDING = 'pending', 'Новая'
    CONFIRMED = 'confirmed', 'Подтверждена'
    IN_PROGRESS = 'in_progress', 'В работе'
    COMPLETED = 'completed', 'Выполнена'
    CANCELLED = 'cancelled', 'Отменена'

class Order(models.Model):
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders', verbose_name='Клиент')
    service = models.ForeignKey('services.Service', on_delete=models.PROTECT, related_name='orders', verbose_name='Услуга')
    car_model = models.CharField('Марка и модель авто', max_length=200)
    car_license_plate = models.CharField('Госномер', max_length=20, blank=True)
    scheduled_date = models.DateTimeField('Запланированная дата')
    status = models.CharField('Статус', max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    master = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_orders', verbose_name='Мастер')
    notes = models.TextField('Комментарий к заказу', blank=True)
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлён', auto_now=True)
    
    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'Заказ #{self.id} - {self.client.username} - {self.service.title}'
    
    def save(self, *args, **kwargs):
        old_status = None
        if self.pk:
            old_status = Order.objects.get(pk=self.pk).status
        super().save(*args, **kwargs)
        if old_status and old_status != self.status:
            # Сигнал для отправки WebSocket-уведомления будет в signals.py
            from .signals import send_status_update
            send_status_update(self.id, old_status, self.status)

class CarPost(models.Model):
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='car_posts', verbose_name='Автор')
    title = models.CharField('Заголовок', max_length=200)
    content = models.TextField('Описание работ')
    before_photo = models.ImageField('Фото ДО', upload_to='car_posts/before/', blank=True, null=True)
    after_photo = models.ImageField('Фото ПОСЛЕ', upload_to='car_posts/after/', blank=True, null=True)
    created_at = models.DateTimeField('Дата публикации', auto_now_add=True)
    views = models.PositiveIntegerField('Просмотры', default=0)
    is_published = models.BooleanField('Опубликовано', default=True)
    
    class Meta:
        verbose_name = 'Портфолио (пост)'
        verbose_name_plural = 'Портфолио'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class Comment(models.Model):
    car_post = models.ForeignKey(CarPost, on_delete=models.CASCADE, related_name='comments', verbose_name='Пост', null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='comments', verbose_name='Заказ', null=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments', verbose_name='Автор')
    text = models.TextField('Текст отзыва')
    rating = models.IntegerField('Оценка', validators=[MinValueValidator(1), MaxValueValidator(5)], default=5)
    created_at = models.DateTimeField('Дата', auto_now_add=True)
    
    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'Отзыв от {self.author.username}'