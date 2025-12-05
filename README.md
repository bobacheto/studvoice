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

## 🔗 GitHub Setup

To connect this repository to your GitHub account:

### 1. Create a Repository on GitHub
- Go to https://github.com/new
- Create a new repository named `studvoice`
- Choose whether to make it public or private
- **Do NOT** initialize with README (you already have one)

### 2. Connect Local Repository to GitHub

Open your terminal in the workspace folder and run:

```bash
# Set your email and name (if not already set globally)
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/studvoice.git

# Rename branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

### 3. Authentication Methods

#### Option A: HTTPS with Personal Access Token (Recommended for Beginners)
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token
5. When Git prompts for password, paste the token

#### Option B: SSH (More Secure)
1. Generate SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```
2. Add the public key to GitHub: https://github.com/settings/ssh/new
3. Update remote to use SSH:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/studvoice.git
   ```

### 4. Verify Connection
```bash
git remote -v
# Should output:
# origin  https://github.com/YOUR_USERNAME/studvoice.git (fetch)
# origin  https://github.com/YOUR_USERNAME/studvoice.git (push)
```

### 5. Make Future Commits and Push
```bash
# Make changes to your code...
git add .
git commit -m "Your commit message"
git push origin main
```

## 📝 Common Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Create a new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Push a branch to GitHub
git push origin feature/new-feature

# Create a Pull Request on GitHub for your branch
# (You can do this from GitHub web interface)
```

## 🚀 Deployment

For production deployment, see the `.env` example and update:
- `JWT_SECRET` - Change to a strong secret key
- `NODE_ENV` - Set to `production`
- Database path configuration

## 📄 License

MIT License - Feel free to use this project for your school community!

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

**Happy voting! 🗳️**
