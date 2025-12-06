# StudVoice - Quick Reference Guide

## 📁 Project Structure Overview

```
StudVoice_workspace/
├── server/                          # Backend (Node.js + Express)
│   └── src/
│       ├── routes/                  # Express route definitions (7 files)
│       ├── controllers/             # HTTP request handlers (7 files)
│       ├── services/                # Business logic layer (7 files)
│       ├── repositories/            # Prisma database queries (7 files)
│       ├── middlewares/             # Auth, validation, role checks (3 files)
│       ├── prisma/                  # Database schema (1 file)
│       ├── utils/                   # JWT, errors, hashing (3 files)
│       ├── app.ts                   # Express app setup
│       └── server.ts                # Server startup
│
└── client/                          # Frontend (React + Vite + TypeScript)
    └── src/
        ├── pages/                   # Page components (8 files)
        ├── components/              # Reusable UI components (6 files)
        ├── api/                     # API client functions (6 files)
        ├── context/                 # Global state (AuthContext)
        ├── hooks/                   # Custom hooks (useAuth)
        ├── styles/                  # Global CSS with Tailwind
        ├── App.tsx                  # Main app with routing
        └── main.tsx                 # Entry point
```

---

## 🏗️ Layered Architecture

### Request Flow (Backend)
```
HTTP Request
    ↓
Routes (route definition)
    ↓
Middlewares (auth, validation, role check)
    ↓
Controllers (extract data, call service)
    ↓
Services (business logic)
    ↓
Repositories (Prisma queries)
    ↓
Database
```

### Key Rule: Controllers NEVER call Prisma directly!
- Controllers → call Services
- Services → call Repositories
- Repositories → use Prisma

---

## 🔐 Authentication & Roles

### JWT Payload Structure
```json
{
  "userId": "string",
  "anonymousId": "string", 
  "role": "STUDENT | MODERATOR | STUDENT_COUNCIL | TEACHER | DIRECTOR | ADMIN",
  "schoolId": "string",
  "iat": timestamp,
  "exp": timestamp
}
```

### Role Matrix
| Role | Can Create Posts | Can Create Polls | Moderation Access | View Analytics |
|------|------------------|------------------|-------------------|----------------|
| STUDENT | ✓ (anonymous) | ✗ | ✗ | ✗ |
| MODERATOR | ✗ | ✗ | ✓ | ✗ |
| STUDENT_COUNCIL | ✓ (anonymous) | ✓ | ✗ | ✗ |
| TEACHER | ✗ | ✗ | ✗ | ✗ |
| DIRECTOR | ✗ | ✗ | ✗ | ✓ |
| ADMIN | ✓ | ✓ | ✓ | ✓ |

---

## 📝 API Endpoints Summary

### Auth
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login student

### Posts
- `GET /api/posts` - Get all posts (paginated)
- `POST /api/posts` - Create anonymous post
- `POST /api/posts/:id/react` - Add reaction to post
- `POST /api/posts/:id/report` - Report post

### Comments
- `POST /api/comments` - Create anonymous comment

### Polls
- `GET /api/polls` - Get all polls
- `POST /api/polls` - Create poll (STUDENT_COUNCIL only)
- `POST /api/polls/:id/vote` - Vote on poll

### AMA
- `GET /api/ama` - Get AMA sessions
- `POST /api/ama` - Create AMA session (STUDENT_COUNCIL only)
- `POST /api/ama/:id/question` - Submit question (anonymous)

### Moderation
- `POST /api/moderation/mute` - Mute user (MODERATOR only)
- `POST /api/moderation/warn` - Warn user (MODERATOR only)
- `POST /api/moderation/ban` - Ban user (MODERATOR only)
- `POST /api/moderation/review` - Review report (MODERATOR only)

### Analytics
- `GET /api/analytics/school` - Get school analytics (DIRECTOR only)

---

## 🛡️ Anonymity Rules

✓ **Always Anonymous:**
- Posts created by students
- Comments on posts
- AMA questions
- Poll votes
- Reactions/emojis

✓ **Identified (Non-Anonymous):**
- Teacher responses
- Staff communications
- Admin actions
- Moderator actions (logged for audit)

✓ **Analytics (No Identity):**
- Director dashboard shows: emotional index, top topics, trends, accepted ideas
- Director CANNOT see: student names, email addresses, user mapping

---

## 🗂️ File Organization Rules

### Backend Files
- **Routes**: Only route definitions with middleware
- **Controllers**: Extract request data, call service, return response
- **Services**: Business logic, validations, no Prisma
- **Repositories**: All Prisma queries, database-specific logic
- **Middlewares**: JWT validation, role checks, request validation
- **Utils**: Reusable functions (hashing, JWT, error classes)

### Frontend Files
- **Pages**: Full page components (use Layout wrapper)
- **Components**: Reusable UI components (use Tailwind)
- **API**: Axios calls to backend (structured for React Query)
- **Context**: Global state (AuthContext)
- **Hooks**: Custom React hooks (useAuth)

---

## 🚀 Quick Start Development

### Backend Implementation Order
1. Set up `server/src/prisma/schema.prisma` with all models
2. Implement `server/src/utils/jwt.ts` - JWT generation/verification
3. Implement `server/src/utils/hash.ts` - Password hashing
4. Implement `server/src/middlewares/auth.middleware.ts` - JWT validation
5. Implement `server/src/repositories/user.repository.ts` - User database queries
6. Implement `server/src/services/auth.service.ts` - Auth logic
7. Implement `server/src/controllers/auth.controller.ts` - Auth endpoints
8. Repeat for other modules (posts, polls, ama, etc.)

### Frontend Implementation Order
1. Set up environment variables (.env.local)
2. Implement `client/src/context/AuthContext.tsx` - Auth state
3. Implement `client/src/api/auth.ts` - Login/Register API calls
4. Implement `client/src/pages/Login.tsx` and `Register.tsx`
5. Implement `client/src/components/Layout.tsx` and `NavBar.tsx`
6. Implement other pages and components
7. Set up React Query for API calls

---

## 📦 Dependencies Checklist

### Backend (server/package.json)
```
dependencies:
- express
- prisma @prisma/client
- jsonwebtoken
- bcrypt
- zod (or joi)
- dotenv
- axios (optional, for external APIs)

devDependencies:
- @types/node
- @types/express
- typescript
- ts-node
- nodemon
- jest
- supertest @types/jest
```

### Frontend (client/package.json)
```
dependencies:
- react react-dom
- react-router-dom
- vite
- axios
- @tanstack/react-query
- tailwindcss

devDependencies:
- @types/react @types/react-dom
- @vite/plugin-react
- typescript
- vitest
- @testing-library/react @testing-library/jest-dom
```

---

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/studvoice
JWT_SECRET=your-super-secret-key-here
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ Pre-Implementation Checklist

- [ ] All 62 files created ✓
- [ ] Folder structure established ✓
- [ ] TypeScript configured ✓
- [ ] Imports/exports ready ✓
- [ ] TODO comments throughout ✓
- [ ] Empty function signatures ✓
- [ ] Database schema template ✓
- [ ] Layered architecture pattern ✓
- [ ] Security patterns (JWT, bcrypt, roles) ✓
- [ ] Anonymity structure ✓

---

## 🎯 Next Steps

1. **Initialize npm packages**: Run `npm init` in both server/ and client/
2. **Install dependencies**: Use package.json template above
3. **Create database**: Set up PostgreSQL or SQLite
4. **Fill TODO sections**: Follow TODO comments in each file
5. **Test endpoints**: Use Postman/Insomnia to test API
6. **Deploy**: Follow deployment guide for Vercel/Netlify (frontend) and Render/Railway (backend)

---

## 📞 Support

All code follows the StudVoice README specifications:
- Layered architecture enforced
- No direct Prisma calls in controllers ✓
- Anonymous posts via anonymousId ✓
- Role-based access control ✓
- TypeScript throughout ✓
- TODO comments for all business logic ✓

Happy coding! 🚀
