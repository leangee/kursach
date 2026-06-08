from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

class User(AbstractUser):
    ROLE_CHOICES = (
        ('client', 'Клиент'),
        ('master', 'Мастер'),
        ('admin', 'Администратор'),
    )
    
    role = models.CharField('Роль', max_length=20, choices=ROLE_CHOICES, default='client')
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message='Некорректный номер телефона')
    phone = models.CharField('Телефон', validators=[phone_regex], max_length=17, blank=True)
    avatar = models.ImageField('Аватар', upload_to='avatars/%Y/%m/%d', blank=True, null=True)
    bio = models.TextField('О себе', blank=True)
    address = models.CharField('Адрес', max_length=255, blank=True)
    
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['-date_joined']
    
    def __str__(self):
        return f'{self.username} ({self.get_role_display()})'
    
    @property
    def is_master(self):
        return self.role == 'master'
    
    @property
    def is_client(self):
        return self.role == 'client'