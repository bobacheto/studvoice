# StudVoice Frontend Quick Start Guide

## 🚀 Get Started in 3 Commands

```bash
# 1. Install dependencies
cd client
npm install react react-dom react-router-dom @tanstack/react-query axios

# 2. Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# 3. Start dev server
npm run dev
```

## 📁 Project Structure
```
client/src/
├── api/                    # Backend communication
│   ├── axios.ts           # Auto-refresh interceptor
│   ├── auth.ts            # Login, register, logout
│   ├── posts.ts           # Posts, comments, reactions
│   ├── polls.ts           # Polls, voting
│   ├── ama.ts             # AMA sessions, questions
│   ├── challenges.ts      # Challenges, submissions
│   └── analytics.ts       # Weekly digest, analytics
├── context/
│   └── AuthContext.tsx    # Global auth state
├── components/
│   ├── Layout.tsx         # Page wrapper with navbar
│   ├── NavBar.tsx         # Navigation with role badge
│   ├── ProtectedRoute.tsx # Auth guard
│   └── PostCard.tsx       # Post display component
├── pages/
│   ├── Login.tsx          # Login form
│   ├── Register.tsx       # Registration form
│   ├── Dashboard.tsx      # Main hub (5 sections)
│   ├── Posts.tsx          # Posts list + modals
│   ├── Polls.tsx          # Polls list
│   ├── AMA.tsx            # AMA sessions
│   └── Challenges.tsx     # Challenges grid
└── App.tsx                # Routes + providers
```

## 🔑 Key Components

### App.tsx Routes
```tsx
/login           → Login (public)
/register        → Register (public)
/dashboard       → Dashboard (protected)
/posts           → Posts (protected)
/polls           → Polls (protected)
/ama             → AMA (protected)
/challenges      → Challenges (protected)
/                → Redirect to /dashboard
```

### AuthContext
```tsx
const { user, login, register, logout, isLoading } = useAuth();
```

### React Query
```tsx
const { data, isLoading } = useQuery({
  queryKey: ['posts'],
  queryFn: () => postsAPI.getPosts()
});
```

## 🎨 UI Patterns

### Status Badges
```tsx
PENDING      → Gray
UNDER_REVIEW → Yellow
ACCEPTED     → Green
COMPLETED    → Blue
REJECTED     → Red
```

### Role Badges
```tsx
ADMIN           → Purple
DIRECTOR        → Red
TEACHER         → Blue
STUDENT_COUNCIL → Green
MODERATOR       → Yellow
STUDENT         → Gray
```

### Reactions
```tsx
LIKE      → 👍
SUPPORT   → 💪
GREAT     → 🎉
THINKING  → 🤔
```

## 🔧 Environment Variables

### client/.env
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Dashboard Sections

1. **🔥 Trending Posts** - Top 5 posts with reactions
2. **📊 Active Polls** - 3 active polls
3. **💬 Active AMA** - 3 active sessions
4. **🎯 Current Challenges** - 3 active challenges
5. **📈 Weekly Digest** - Total posts, comments, reactions

## 🔐 Protected Features

### Create Post
- **Allowed**: ADMIN, DIRECTOR, TEACHER, MODERATOR
- **Blocked**: STUDENT, STUDENT_COUNCIL

### Create Poll
- **Allowed**: STUDENT_COUNCIL, ADMIN, DIRECTOR

### Create AMA
- **Allowed**: ADMIN, DIRECTOR, TEACHER

### Create Challenge
- **Allowed**: MODERATOR, ADMIN, DIRECTOR

## 🧪 Test Credentials
After backend setup, create test users:

```bash
# In server directory
npx ts-node src/scripts/seedTestData.ts
```

Then login with:
- Email: admin@school.com
- Password: password123
- School Code: SCHOOL001

## 🐛 Troubleshooting

### Error: "Cannot find module 'react'"
```bash
cd client
npm install
```

### Error: "Network Error"
- Check backend is running on port 5000
- Verify VITE_API_URL in .env

### Error: "Unauthorized"
- Clear localStorage: `localStorage.clear()`
- Re-login with valid credentials

### Error: "School code not found"
- Create school in database first
- Use correct school code in registration

## 🎯 Next Features to Implement

1. **Poll Voting** - Add mutation to vote on polls
2. **AMA Questions** - Add question submission form
3. **Challenge Submissions** - Add file upload for challenges
4. **Toast Notifications** - Replace alerts with react-hot-toast
5. **Infinite Scroll** - Add pagination to posts
6. **Director Analytics** - Create analytics dashboard
7. **Moderation UI** - Add admin controls for posts

## 📚 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Styling (dark mode support)
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Axios** - HTTP client with interceptors

## 🏗️ Architecture

```
User Action → Component → React Query → API Module → Axios → Backend
                ↓
           AuthContext (global state)
                ↓
           LocalStorage (persistence)
```

## ✅ Checklist Before First Run

- [ ] Backend server running on port 5000
- [ ] Database migrations applied
- [ ] At least one school created
- [ ] Frontend dependencies installed
- [ ] .env file created with VITE_API_URL
- [ ] Vite dev server started

## 🎉 Success!
Navigate to http://localhost:5173 and start testing!
