# DetailingStudio - Веб-приложение для детейлинг-студии

# Описание
Веб-приложение для автоматизации работы детейлинг-студии. Клиенты могут записываться на услуги, отслеживать статус заказа в реальном времени через WebSocket. Мастера и администраторы управляют заказами и портфолио.

# Функционал
- Регистрация и JWT-аутентификация
- Каталог услуг с фильтрацией и поиском
- Запись на услуги (CRUD)
- Real-time уведомления об изменении статуса (WebSocket)
- Портфолио работ с фото до/после
- Личный кабинет с профилем
- Роли: клиент, мастер, администратор

# Технологии
# Backend
- Django 5.0.6
- Django REST Framework
- JWT аутентификация
- Django Channels (WebSocket)
- SQLite / PostgreSQL

# Frontend
- React 18
- React Router
- React Query (кэширование)
- Bootstrap 5
- Axios

# Установка и запуск

# Требования
- Python 3.11+
- Node.js 18+

# Backend
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
daphne -b 0.0.0.0 -p 8000 config.asgi:application
\`\`\`

# Frontend
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

# Автор
LUGOVENKO V.M. PIZH-B-O-24-1
