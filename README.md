# StudVoice - Student Voting & Ideas Platform

A modern, community-driven platform for students to participate in school votes and share ideas. Built with React, Express, SQLite, and styled with TailwindCSS.

## 🚀 Features

- **User Authentication**: Register and login with email, username, and password
- **Voting System**: Participate in yes/no polls with real-time vote counting
- **Ideas Submission**: Share ideas for school improvements with community upvotes
- **Persistent State**: All votes and upvotes are saved to localStorage
- **Toast Notifications**: Real-time feedback with auto-dismissing alerts
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Anonymous Submissions**: Show "Анонимен" on frontend while tracking internally
- **Bulgarian Language UI**: Full Bulgarian interface

## 📋 Project Structure

```
StudVoice_workspace/
├── server/                 # Express backend
│   ├── src/
│   │   ├── server.js       # Main server, SQLite init
│   │   └── routes/
│   │       ├── auth.js     # Authentication endpoints
│   │       ├── votes.js    # Voting endpoints
│   │       └── ideas.js    # Ideas endpoints
│   └── package.json
│
└── client/                 # React frontend
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx    # Landing page
    │   │   ├── Login.jsx   # Login form
    │   │   ├── Register.jsx # Registration form
    │   │   ├── Votes.jsx   # Voting interface
    │   │   └── Ideas.jsx   # Ideas interface
    │   ├── components/
    │   │   └── Alert.jsx   # Toast alerts
    │   ├── utils/
    │   │   └── api.js      # API client
    │   ├── App.jsx         # Router
    │   └── index.css       # Tailwind setup
    ├── public/
    │   └── index.html
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express 4.18, SQLite3, JWT
- **Frontend**: React 18.2, React Router 6.20, TailwindCSS 3.3
- **Authentication**: JWT tokens (stored in localStorage)
- **Database**: SQLite with 5 tables

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm

### Backend Setup
```bash
cd server
npm install
npm start  # Runs on http://localhost:5000
```

### Frontend Setup
```bash
cd client
npm install
npm start  # Runs on http://localhost:3000
```

## 🔑 Key Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login (returns JWT)

### Votes
- `GET /votes` - Get all approved votes
- `POST /votes/create` - Create new vote poll
- `POST /votes/:id/vote` - Cast vote (yes/no)

### Ideas
- `GET /ideas` - Get all ideas
- `POST /ideas/create` - Submit new idea
- `POST /ideas/:id/upvote` - Upvote idea

## 📱 Database Schema

### Users Table
- `id` (INTEGER PRIMARY KEY)
- `email` (TEXT UNIQUE NOT NULL)
- `username` (TEXT UNIQUE NOT NULL)
- `password` (TEXT NOT NULL)
- `school_code` (TEXT)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

### Votes Table
- `id`, `question`, `optionYes`, `optionNo`, `countYes`, `countNo`, `userId`, `status`, `created_at`

### Ideas Table
- `id`, `title`, `description`, `userId`, `author`, `status`, `upvotes`, `created_at`


