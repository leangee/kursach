from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class ServiceCategory(models.Model):
    title = models.CharField('Название категории', max_length=150, db_index=True)
    description = models.TextField('Описание', blank=True)
    icon = models.CharField('Иконка (CSS класс)', max_length=50, blank=True)
    sort_order = models.IntegerField('Порядок сортировки', default=0)
    is_active = models.BooleanField('Активна', default=True)
    
    class Meta:
        verbose_name = 'Категория услуги'
        verbose_name_plural = 'Категории услуг'
        ordering = ['sort_order', 'title']
    
    def __str__(self):
        return self.title

class Service(models.Model):
    category = models.ForeignKey(ServiceCategory, on_delete=models.PROTECT, related_name='services', verbose_name='Категория')
    title = models.CharField('Название услуги', max_length=200)
    description = models.TextField('Описание')
    price = models.DecimalField('Цена', max_digits=10, decimal_places=2)
    duration_minutes = models.PositiveIntegerField('Длительность (минуты)', default=60)
    is_active = models.BooleanField('Активна', default=True)
    image = models.ImageField('Изображение', upload_to='services/', blank=True, null=True)
    
    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'
        ordering = ['category__sort_order', 'title']
    
    def __str__(self):
        return f'{self.title} - {self.price} руб.'