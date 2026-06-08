# DetailingStudio — Веб-приложение для детейлинг-студии

Курсовой проект по дисциплине «Технология разработки программного обеспечения»  
Траектория В: Django REST + React SPA + AJAX + JWT + WebSocket

---

## 1. О проекте

DetailingStudio — веб-приложение для автоматизации работы детейлинг-студии.

Основные возможности:
- Просмотр услуг с фильтрацией по категориям и поиском
- Запись на услуги с выбором даты и времени
- Просмотр и отслеживание статуса заказов
- Портфолио работ с фото до/после
- Система избранного
- Real-time уведомления об изменении статуса заказа через WebSocket
- JWT аутентификация
- Роли: клиент, мастер, администратор

---

## 2. Технологический стек

Backend:
- Python 3.11
- Django 5.0
- Django REST Framework
- JWT (djangorestframework-simplejwt)
- Django Channels 4.1 (WebSocket)
- Daphne 4.1 (ASGI сервер)
- SQLite / PostgreSQL

Frontend:
- React 18
- React Router 6
- Axios
- React Query (кэширование)
- Bootstrap 5
- CSS

---

## 3. Структура репозитория

detailing-studio/
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── asgi.py
│   ├── apps/
│   │   ├── users/
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   └── urls.py
│   │   ├── services/
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   └── urls.py
│   │   └── orders/
│   │       ├── models.py
│   │       ├── views.py
│   │       ├── serializers.py
│   │       ├── consumers.py
│   │       ├── routing.py
│   │       ├── signals.py
│   │       └── urls.py
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ServicesPage.js
│   │   │   ├── OrdersPage.js
│   │   │   ├── OrderDetailPage.js
│   │   │   ├── CreateOrderPage.js
│   │   │   ├── PortfolioPage.js
│   │   │   ├── PortfolioDetailPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── ProfilePage.js
│   │   │   └── AdminPanel.js
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── WebSocketContext.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md

---

## 4. Требования к окружению

- Python >= 3.11
- Node.js >= 18.0
- npm >= 9.0
- Git

---

## 5. Установка и запуск

### Backend

cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
daphne -p 8000 config.asgi:application

### Frontend

cd frontend
npm install
cp .env.example .env
npm start

Приложение будет доступно:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Admin панель: http://localhost:8000/admin

---

## 6. Переменные окружения

### backend/.env

SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

### frontend/.env

REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000

---

## 7. API Эндпоинты

Аутентификация (/api/auth/):
- POST /api/auth/register/ - регистрация
- POST /api/auth/login/ - вход (JWT)
- POST /api/auth/token/refresh/ - обновление токена
- GET /api/auth/profile/ - профиль

Услуги (/api/services/):
- GET /api/services/ - список услуг
- GET /api/services/categories/ - список категорий
- GET /api/services/{id}/ - детали услуги

Заказы (/api/orders/orders/):
- GET /api/orders/orders/ - список заказов
- POST /api/orders/orders/ - создание заказа
- GET /api/orders/orders/{id}/ - детали заказа
- POST /api/orders/orders/{id}/cancel/ - отмена
- POST /api/orders/orders/{id}/add_comment/ - добавить отзыв

Портфолио (/api/orders/car-posts/):
- GET /api/orders/car-posts/ - список работ
- GET /api/orders/car-posts/{id}/ - детали работы
- POST /api/orders/car-posts/{id}/toggle_favorite/ - избранное
- GET /api/orders/car-posts/my_favorites/ - избранные работы

---

## 8. WebSocket

Подключение:
- ws://localhost:8000/ws/orders/{order_id}/

Формат сообщения при изменении статуса:
{
  "type": "status_update",
  "order_id": 5,
  "old_status": "Новая",
  "new_status": "В работе"
}

---

## 9. Функциональность

Неавторизованный пользователь:
- Просмотр главной страницы с каруселью
- Просмотр услуг с фильтрацией и поиском
- Просмотр портфолио
- Регистрация и вход

Клиент:
- Все функции неавторизованного
- Запись на услуги
- Управление заказами
- Отмена заказа
- Добавление отзывов
- Редактирование профиля
- Real-time уведомления

Мастер:
- Просмотр назначенных заказов
- Изменение статуса заказа

Администратор:
- Полное управление через Django Admin

---

## 10. Роли пользователей

| Роль | Права |
|------|-------|
| client | Создание заказов, просмотр своих заказов, избранное |
| master | Просмотр и изменение статуса назначенных заказов |
| admin | Полный доступ к Django Admin, управление всеми данными |

---


## 11. Автор

**Студент:** Луговенко Владислав Максимович 
**Группа:** ПИЖ-б-о-24-1 
