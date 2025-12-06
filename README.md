# README.md — StudVoice
StudVoice — Анонимна ученическа платформа за мнения, идеи и гласувания

StudVoice е уеб платформа, която позволява на учениците да споделят идеи, да гласуват, да участват в AMA сесии, анкети и предизвикателства — напълно анонимно.
Ръководството на училището получава само агрегирани данни и тенденции, без достъп до лична информация.

## ⚙️ Технологии
### Frontend

- React (Vite)
- React Router
- TailwindCSS
- TanStack Query (React Query)
- Axios

### Backend

- Node.js + Express
- Prisma ORM
- PostgreSQL (или SQLite за локално)
- JSON Web Tokens (JWT)
- bcrypt за хеширане на пароли

### Deployment

- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Database: PostgreSQL (Supabase / Render / Railway)

## 📐 Архитектура

Проектът следва слойна архитектура:

```
server/
  src/
    routes/         → Express route definitions
    controllers/    → HTTP controllers
    services/       → Business logic
    repositories/   → Prisma DB queries
    middlewares/    → Auth, role checks, validation
    prisma/         → Schema + migrations
client/
  src/
    pages/          → Основни React страници
    components/     → UI компоненти
    api/            → API hooks (React Query)
    context/        → User/Auth контекст
```

**Важно:**
Контролерите не комуникират директно с Prisma — това минава през services и repositories.

## 🔐 Аутентикация и роли

Учениците се логват с:

- email
- password
- schoolCode

След логин бекендът връща JWT с:

- userId
- anonymousId
- role
- schoolId

Роли в системата:

- STUDENT
- MODERATOR
- STUDENT_COUNCIL
- TEACHER
- DIRECTOR
- ADMIN

**Анонимност:**
Постове и коментари се свързват с anonymousId, а не с userId или email.

## 🧱 Основни функционалности (MVP)
### Ученици

- Анонимен постинг на идеи и проблеми
- Гласуване и реакции
- Коментари
- AMA сесии
- Анкети
- Предизвикателства
- Седмичен дайджест
- Опция да покажат името си (по избор)

### Модератори

- Получаване на доклади
- Издаване на мютове/предупреждения/банове
- Преглед на обжалвания
- Преглед на репортиран контент

### Ученически съвет

- Отговаря на идеи
- Прави анкети, AMA, предизвикателства
- Обновява статуси на идеи (Under Review, Accepted, Completed)

### Учители

- Могат да отговарят на идеи неанонимно

### Директор

- Вижда аналитики: емоционален индекс, топ теми, тенденции, приети идеи
- Няма достъп до самоличността на ученици

## 🗂️ API структури (накратко)

Примерни групи:

```
POST /auth/register
POST /auth/login

GET /posts
POST /posts
POST /posts/:id/react
POST /posts/:id/report

POST /comments

GET /polls
POST /polls
POST /polls/:id/vote

GET /ama
POST /ama
POST /ama/:id/question

POST /moderation/mute
POST /moderation/warn
POST /moderation/ban
POST /moderation/review

GET /analytics/school
```

Пълният API договор ще се изгради постепенно.

## ⚠️ Правила за Copilot / Стил на код

За да е последователен кодът:

### Backend

- Route → Controller → Service → Repository → Database
- Без Prisma заявки в контролери
- Всички входове се валидират със Zod или Joi
- Използвай async/await, не callbacks
- JWT винаги се валидират през middleware
- Всички защитени маршрути изискват authMiddleware
- Използвай roleMiddleware за роли (MODERATOR/STUDENT_COUNCIL/DIRECTOR)

### Frontend

- Всички API заявки минават през React Query hooks
- Компоненти трябва да бъдат малки и чисти
- Tailwind за стилове, без Inline CSS
- Създай общ Layout за Dashboard
- Създай protected routes за логнати потребители

## 🧪 Тестване

### За backend:

- Jest / Supertest
- Тестове за auth, posts, polls, moderation

### За frontend:

- Vitest + React Testing Library

## 🏗️ Roadmap
### MVP Release

- Auth + roles
- Posts + comments
- Reactions
- Reporting
- Moderation system
- Polls
- AMA
- Challenges
- Director analytics dashboard
- Student council answering

### V2

- Категории по идеи
- Нотификации
- Direct messages (само council → students)
- Heatmap аналитики
- Mobile app версия

## 📄 Лиценз

За момента: Private, Proprietary (не е open-source).

## 📬 Контакти

За въпроси, предложения или работа по проекта:
StudVoice Development Team
