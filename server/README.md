# NeuralDesk Backend Server (Express.js) ⚡

This is the API server for **NeuralDesk (AI Notes)**, built using Node.js, Express.js, and MongoDB. It handles authentication, note lifecycle operations, and orchestrates the AI processing pipeline using Google Gemini API.

## 🚀 Key Technologies
- **Runtime:** Node.js, Express.js
- **Database:** MongoDB Atlas via Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **AI Processing:** `@google/generative-ai` SDK (`gemini-3.1-flash-lite` model)
- **Response Caching:** Custom memory cache with Time-To-Live (TTL) expiration to prevent redundant API usage

## ⚙️ Development Setup

First, install backend dependencies:

```bash
npm install
```

### Environment Configuration
Create a `.env` file in this directory (refer to `.env.example` as a template):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
```

### Start Server

Run the development API server (reloads automatically using nodemon):

```bash
npm run dev
```

The server will be available at [http://localhost:5000](http://localhost:5000).

## 📦 Production Deployment

1. Set `NODE_ENV=production`.
2. Start the server using:
   ```bash
   npm start
   ```
