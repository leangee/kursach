# DetailingStudio — Веб-приложение для детейлинг-студии

Курсовой проект по дисциплине «Технология разработки программного обеспечения»  
Траектория В: Django REST + React SPA + AJAX + JWT + WebSocket

---

## Содержание

1. [О проекте](#1-о-проекте)
2. [Технологический стек](#2-технологический-стек)
3. [Структура репозитория](#3-структура-репозитория)
4. [Требования к окружению](#4-требования-к-окружению)
5. [Установка и настройка Backend](#5-установка-и-настройка-backend)
6. [Установка и настройка Frontend](#6-установка-и-настройка-frontend)
7. [Запуск приложения](#7-запуск-приложения)
8. [Переменные окружения](#8-переменные-окружения)
9. [API — эндпоинты](#9-api--эндпоинты)
10. [Функциональность](#10-функциональность)
11. [Механика заказов](#11-механика-заказов)
12. [Администрирование](#12-администрирование)
13. [Тестирование](#13-тестирование)

---

## 1. О проекте

**DetailingStudio** — веб-приложение для автоматизации работы детейлинг-студии.  
Поддерживает три режима работы:

- **Каталог услуг** — просмотр, фильтрация по категориям и поиск услуг.
- **Запись на услуги** — создание, отслеживание и управление заказами.
- **Портфолио** — просмотр выполненных работ с фото «до/после» и системой избранного.

Авторизованные пользователи получают доступ к личному кабинету.  
При изменении статуса заказа приложение мгновенно обновляет интерфейс через WebSocket.

---

## 2. Технологический стек

### Backend
| Компонент | Технология |
|---|---|
| Язык | Python 3.11 |
| Фреймворк | Django 5.0 + Django REST Framework 3.15 |
| Аутентификация | JWT (djangorestframework-simplejwt) |
| WebSocket | Django Channels 4.1 + Daphne 4.1 |
| База данных | SQLite / PostgreSQL |
| CORS | django-cors-headers |
| Фильтрация | django-filter |

### Frontend
| Компонент | Технология |
|---|---|
| Язык | JavaScript (ES2022) + JSX |
| Фреймворк | React 18 |
| Маршрутизация | React Router 6 |
| HTTP-клиент | Axios (с JWT-интерцепторами) |
| Кэширование | React Query |
| Сборщик | Create React App |
| Стили | Bootstrap 5 + CSS |

---

## 3. Структура репозитория
detailing-studio/
├── backend/ # Django REST API + Channels
│ ├── config/
│ │ ├── init.py
│ │ ├── settings.py
│ │ ├── urls.py
│ │ ├── asgi.py # ASGI + WebSocket
│ │ └── wsgi.py
│ ├── apps/
│ │ ├── users/ # Аутентификация и профиль
│ │ │ ├── models.py # Расширенная модель User
│ │ │ ├── serializers.py
│ │ │ ├── views.py
│ │ │ ├── urls.py
│ │ │ └── admin.py
│ │ ├── services/ # Услуги и категории
│ │ │ ├── models.py # ServiceCategory, Service
│ │ │ ├── serializers.py
│ │ │ ├── views.py
│ │ │ └── urls.py
│ │ └── orders/ # Заказы, портфолио, WebSocket
│ │ ├── models.py # Order, CarPost, Comment
│ │ ├── serializers.py
│ │ ├── views.py
│ │ ├── urls.py
│ │ ├── consumers.py # WebSocket consumer
│ │ ├── routing.py
│ │ ├── signals.py # Сигналы для уведомлений
│ │ └── admin.py
│ ├── manage.py
│ ├── requirements.txt
│ └── .env.example
│
├── frontend/ # React SPA
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── components/
│ │ │ └── Navbar.js
│ │ ├── pages/
│ │ │ ├── HomePage.js
│ │ │ ├── ServicesPage.js
│ │ │ ├── OrdersPage.js
│ │ │ ├── OrderDetailPage.js
│ │ │ ├── CreateOrderPage.js
│ │ │ ├── PortfolioPage.js
│ │ │ ├── PortfolioDetailPage.js
│ │ │ ├── LoginPage.js
│ │ │ ├── RegisterPage.js
│ │ │ ├── ProfilePage.js
│ │ │ └── AdminPanel.js
│ │ ├── contexts/
│ │ │ ├── AuthContext.js
│ │ │ └── WebSocketContext.js
│ │ ├── App.js
│ │ └── index.js
│ ├── package.json
│ └── .env.example
│
└── README.md

text

---

## 4. Требования к окружению

| Инструмент | Версия |
|---|---|
| Python | ≥ 3.11 |
| Node.js | ≥ 18.0 |
| npm | ≥ 9.0 |
| Git | ≥ 2.40 |

---

## 5. Установка и настройка Backend

### 5.1. Клонирование репозитория

``bash
git clone https://github.com/leangee/detailing-studio.git
cd detailing-studio/backend
5.2. Виртуальное окружение

bash
# Создание
python -m venv venv

# Активация (Windows)
venv\Scripts\activate

# Активация (Linux / macOS)
source venv/bin/activate
5.3. Установка зависимостей

bash
pip install -r requirements.txt
requirements.txt:

text
Django==5.0.6
djangorestframework==3.15.1
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.1
channels==4.1.0
daphne==4.1.0
django-filter==24.2
Pillow==10.3.0
python-dotenv==1.0.1
5.4. Переменные окружения

bash
cp .env.example .env
# Отредактировать .env (см. раздел 8)
5.5. Миграции и начальные данные

bash
python manage.py makemigrations users services orders
python manage.py migrate

# Создание суперпользователя (администратора)
python manage.py createsuperuser
5.6. Запуск тестов

bash
python manage.py test
6. Установка и настройка Frontend

6.1. Переход в директорию

bash
cd ../frontend
6.2. Установка зависимостей

bash
npm install
6.3. Переменные окружения

bash
cp .env.example .env
# Отредактировать .env (см. раздел 8)
7. Запуск приложения

Backend

WebSocket требует ASGI-сервера. Используйте Daphne:

bash
cd detailing-studio/backend
source venv/bin/activate
daphne -p 8000 config.asgi:application
Альтернативно (только HTTP, без WebSocket):

bash
python manage.py runserver
Frontend

bash
cd detailing-studio/frontend
npm start
Приложение откроется по адресу http://localhost:3000
Backend доступен по адресу http://localhost:8000
Django Admin — http://localhost:8000/admin/

8. Переменные окружения

backend/.env

env
SECRET_KEY=django-insecure-your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT
JWT_ACCESS_TOKEN_LIFETIME=30       # минуты
JWT_REFRESH_TOKEN_LIFETIME=1440    # минуты (1 сутки)

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
frontend/.env

env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000
9. API — эндпоинты

Аутентификация (/api/auth/)

Метод	Эндпоинт	Доступ	Описание
POST	/api/auth/register/	Все	Регистрация
POST	/api/auth/login/	Все	Получение JWT access/refresh
POST	/api/auth/token/refresh/	Все	Обновление access-токена
GET	/api/auth/profile/	Авторизован	Профиль пользователя
PUT/PATCH	/api/auth/profile/	Авторизован	Обновление профиля
Услуги (/api/services/)

Метод	Эндпоинт	Доступ	Описание
GET	/api/services/	Все	Список услуг
GET	/api/services/?category=1	Все	Фильтр по категории
GET	/api/services/?search=текст	Все	Поиск по названию/описанию
GET	/api/services/{id}/	Все	Детали услуги
Категории (/api/services/categories/)

Метод	Эндпоинт	Доступ	Описание
GET	/api/services/categories/	Все	Список категорий
Заказы (/api/orders/orders/)

Метод	Эндпоинт	Доступ	Описание
GET	/api/orders/orders/	Авторизован	Список заказов
POST	/api/orders/orders/	Авторизован	Создать заказ
GET	/api/orders/orders/{id}/	Авторизован	Детали заказа
PATCH	/api/orders/orders/{id}/	Мастер/Админ	Изменить статус
POST	/api/orders/orders/{id}/cancel/	Клиент	Отменить заказ
POST	/api/orders/orders/{id}/add_comment/	Клиент	Добавить отзыв
Портфолио (/api/orders/car-posts/)

Метод	Эндпоинт	Доступ	Описание
GET	/api/orders/car-posts/	Все	Список работ
GET	/api/orders/car-posts/{id}/	Все	Детали работы
POST	/api/orders/car-posts/{id}/toggle_favorite/	Авторизован	Добавить/удалить из избранного
GET	/api/orders/car-posts/my_favorites/	Авторизован	Избранные работы
WebSocket

URL	Описание
ws://localhost:8000/ws/orders/{order_id}/	Real-time обновление статуса заказа
ws://localhost:8000/ws/notifications/	Персональные уведомления пользователя
Формат сообщения о статусе:

json
{
  "type": "status_update",
  "order_id": 5,
  "old_status": "Новая",
  "new_status": "В работе",
  "updated_at": "08.06.2026 15:30"
}
10. Функциональность

Неавторизованный пользователь

Просмотр главной страницы с каруселью
Просмотр каталога услуг с фильтрацией и поиском
Просмотр портфолио работ
Регистрация и вход в систему
Авторизованный пользователь (Клиент)

Все возможности неавторизованного пользователя
Запись на услуги (создание заказа)
Просмотр и отслеживание своих заказов
Отмена заказа (в статусе «Новая»)
Добавление отзывов к выполненным заказам
Добавление работ в избранное
Редактирование профиля
Real-time уведомления об изменении статуса заказа
Мастер

Просмотр назначенных заказов
Изменение статуса заказа (Подтверждена → В работе → Выполнена)
Real-time уведомления о новых заказах
Администратор

Управление услугами и категориями
Управление заказами всех клиентов
Управление портфолио
Управление пользователями
Полный доступ к Django Admin
11. Механика заказов

Правило	Описание
Создание	Только авторизованные клиенты
Статусы	Новая → Подтверждена → В работе → Выполнена / Отменена
Отмена	Доступна только в статусе «Новая»
Real-time	При смене статуса уведомление через WebSocket
Отзывы	Можно оставить только после выполнения заказа
Просмотры	Автоматически увеличиваются при открытии детальной страницы портфолио
Фильтрация	По категориям через параметр category
Поиск	По полям title и description
Пагинация	10 услуг на страницу
Избранное	Сохраняется в профиле пользователя
12. Администрирование

Django Admin доступен по адресу /admin/.

Модели в админке

Модель	Поля	Особенности
User	username, email, role, phone, avatar, bio	Расширенная модель с ролями (client/master/admin)
ServiceCategory	title, description, sort_order	Сортировка
Service	category, title, description, price, duration_minutes, image	CRUD услуг
Order	client, service, car_model, scheduled_date, status, master	Фильтр по статусу, editable статус
CarPost	client, title, content, before_photo, after_photo, views	Портфолио работ
Comment	order, author, text, rating	Отзывы клиентов
13. Тестирование

bash
# Backend — запуск всех тестов
cd backend
python manage.py test

# Тесты конкретного приложения
python manage.py test users
python manage.py test services
python manage.py test orders
Тесты покрывают:

Регистрацию и аутентификацию (JWT)
CRUD операции с заказами
Права доступа (IsAuthorOrReadOnly, IsMasterOrAdmin)
Создание и получение отзывов
Фильтрацию и поиск
WebSocket подключения и уведомления
Автор
