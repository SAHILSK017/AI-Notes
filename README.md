# Full-Stack AI Notes Workspace

A production-ready full-stack notes application featuring AI summarization, automatic saving, and secure authentication.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, shadcn/ui, React Query, Zustand/Context
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **AI**: Google Gemini API

## Setup Instructions

### 1. Database & AI Key
- Get a MongoDB connection string (e.g., from MongoDB Atlas)
- Get a Google Gemini API Key from Google AI Studio

### 2. Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env with your MONGO_URI and GEMINI_API_KEY
npm install
npm start
```

### 3. Frontend Setup
```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```

## Features
- AI Note Summarization & Title Generation
- AI Action Item Extraction
- Debounced Auto-Save
- Notes Archiving & Tagging
- Public Note Sharing
- Dashboard Analytics
- Dark Mode
