# AI Notes 🧠✨

A premium, cinematic, AI-augmented workspace for note-taking, intellectual organization, and real-time document reasoning. Powered by **Google Gemini API**, it provides live context analysis, auto-categorization, title suggestions, and structural insights.

---

## 🚀 Live Environment

- **Frontend Interface:** [Vercel Deployment](https://ai-notes-seven-iota.vercel.app/)
- **Backend API Gateway:** [Render Gateway](https://ai-notes-h9au.onrender.com)

---

## 🏛️ System Architecture

The project is structured as a decoupled monorepo comprising a Next.js client application and an Express.js backend server.

```mermaid
graph TD
    User([User Browser]) <--> |HTTP/HTTPS| FE[Next.js Client - Vercel]
    FE <--> |Axios Auth Headers| BE[Express.js Server - Render]
    BE <--> |Mongoose ODM| DB[(MongoDB Atlas)]
    BE <--> |SDK Calls| Gemini[Google Gemini 3.1 LLM]
```

### 1. Frontend Core Layout (`client/`)
- **Routing Engine:** Built on **Next.js App Router** with nested dynamic groups (`(dashboard)`, `(auth)`).
- **Global State & Caching:** Powered by **TanStack Query (React Query)** to handle data fetching, stale-time caching, and optimistic UI invalidation.
- **Dynamic Interceptor Network:** An Axios-based request interceptor binds standard **Stateless JWT Authorization Headers** (`Authorization: Bearer <token>`) to outgoing API requests to guarantee protection against cross-site browser cookie policies.
- **Aesthetic DNA:** Designed in dark orange, white, and deep obsidian tones, utilizing HSL glowing layers, custom animated inputs, glassmorphic panels, and Lucide icons.

### 2. Backend Gateway (`server/`)
- **API Engine:** Written in **Node.js** & **Express** adopting a structured Model-Service-Controller MVC design pattern.
- **Object Modeling:** Managed with **Mongoose ODM** mapping onto a MongoDB Atlas database.
- **Authentication:** Token-based authentication using **jsonwebtoken** and cryptographic hashing (`bcryptjs`).
- **AI Processing Pipeline:** Communicates with `gemini-3.1-flash-lite` via `@google/generative-ai`.
- **Response Caching:** Built-in in-memory caching system (`Map` based with TTL and LRU expiration) to minimize LLM token usage and prevent API rate-limits on redundant requests.

---

## ⚙️ Local Development Setup

Follow these steps to spin up the entire application on your system:

### 📋 Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MongoDB** (Local instance or free Atlas cluster URI)
- **Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

---

### 1. Backend Server Setup
Navigate to the `server/` directory and configure the engine:

```bash
cd server
npm install
```

#### Environment Configuration
Create a `.env` file in the `server/` directory (you can copy the provided `.env.example` as a starting point):

```bash
# Copy template
cp .env.example .env
```

Define the variables in your `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_random_cryptographic_string_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:3000
```

#### Start Server
```bash
npm run dev
```
The server will boot up locally at **`http://localhost:5000`**.

---

### 2. Frontend Client Setup
Navigate to the `client/` directory and spin up the user interface:

```bash
cd ../client
npm install
```

#### Environment Configuration
Create a `.env.local` file inside the `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Start Client
```bash
npm run dev
```
The interface will compile and run at **`http://localhost:3000`**.

---

## 🧠 Core Features Walkthrough

### 🔍 Advanced Search & Tag/Category Filtering
- **Fuzzy Search:** Type titles or key sentences to filter notes instantaneously using debounced API triggers.
- **AI-Categorized Dropdowns:** Filter thoughts based on **Tags** or **AI-generated Categories** (`Technology`, `Finance`, `Creative`, etc.) dynamically extracted by the AI Engine.
- **One-Click Reset:** Quickly reset selected filters using an elegant interface control.

### ⚡ Smart AI Sidepanel Tools
- **Suggest Title:** Scans note content and offers 6-word title proposals that update automatically in the editor and database.
- **Summarize & Tasks:** Compiles bulleted key insights or parses items into interactive checklists.
- **Insights Tool:** Determines the note's reading time, sentiment score, complexity, and primary category.
- **Auto Tags:** Inspects contents and attaches relevant metadata keywords.

### 📝 Auto-Save Architecture
- Changes to note title, content, or tags are debounced and automatically patched to the database behind the scenes, featuring save status indicators ("Saving...", "Saved", "Error").

---

## 4. Sample Outputs

To aid in understanding the data flows, integrations, and database architecture, the following live samples demonstrate the exact format of the system inputs, AI responses, and database entries.

### 📝 Database Schema

The core MongoDB documents are defined as follows:

#### User Collection Document
```json
{
  "_id": "60d5ec49c9e37c1d3c8e4e9f",
  "name": "sahil",
  "email": "sk@gmail.com",
  "createdAt": "2026-05-15T02:21:47.000Z",
  "updatedAt": "2026-05-15T02:21:47.000Z",
  "__v": 0
}
```

#### Note Collection Document
```json
{
  "_id": "60d5ec49c9e37c1d3c8e4ea0",
  "userId": "60d5ec49c9e37c1d3c8e4e9f",
  "title": "Artificial Intelligence in the Fourth Industrial Revolution (4IR)",
  "content": "Artificial Intelligence is widely regarded as the core driving force of the Fourth Industrial Revolution (4IR). By synthesizing vast oceans of data into actionable insights, AI is fundamentally altering the landscape of global production, logistics, and innovation...",
  "tags": ["artificial-intelligence", "4ir", "innovation"],
  "category": "Technology",
  "archived": false,
  "isPublic": true,
  "shareId": "1b9f6e3c0a2b4c6d8e0f2a4b6c8d0e2f",
  "aiSummary": "Artificial Intelligence is the core catalyst of the Fourth Industrial Revolution (4IR), revolutionizing global production, logistics, and enterprise operations.",
  "aiActionItems": [
    "Synthesize production and logistics data to drive insights.",
    "Formulate strategic guidelines for safe technology adoption.",
    "Establish robust ethical governance frameworks."
  ],
  "createdAt": "2026-05-16T14:17:21.000Z",
  "updatedAt": "2026-05-17T04:02:13.000Z",
  "__v": 0
}
```

---

### 📡 Example API Responses

#### 1. Authentication Login Response (`POST /api/auth/login`)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDFlYzQ5YzllMzdjMWQzYzhlNGU5ZiIsImlhdCI6MTc3ODk5MDQ5OSwiZXhwIjoxNzgxNTgyNDk5fQ...",
  "user": {
    "_id": "60d5ec49c9e37c1d3c8e4e9f",
    "name": "sahil",
    "email": "sk@gmail.com"
  }
}
```

#### 2. Process AI Action Response (`POST /api/notes/:id/ai`)

Depending on the prompt actions, the server responds with dynamic structured outputs:

##### Action: `summary`
```json
{
  "success": true,
  "data": {
    "summary": "AI is the core catalyst of the Fourth Industrial Revolution (4IR), reshaping production, supply chains, and operational workflows globally."
  },
  "note": {
    "_id": "60d5ec49c9e37c1d3c8e4ea0",
    "userId": "60d5ec49c9e37c1d3c8e4e9f",
    "title": "Artificial Intelligence in the Fourth Industrial Revolution (4IR)",
    "content": "...",
    "aiSummary": "AI is the core catalyst of the Fourth Industrial Revolution (4IR), reshaping production, supply chains, and operational workflows globally."
  }
}
```

##### Action: `action_items`
```json
{
  "success": true,
  "data": {
    "actionItems": [
      "Synthesize production and logistics data to drive insights.",
      "Formulate strategic guidelines for safe technology adoption.",
      "Establish robust ethical governance frameworks."
    ]
  }
}
```

##### Action: `insights`
```json
{
  "success": true,
  "data": {
    "readingTime": "2 min read",
    "category": "Technology",
    "sentiment": "Positive",
    "complexity": "Intermediate"
  }
}
```

##### Action: `title` / `auto_title`
```json
{
  "success": true,
  "data": {
    "suggestedTitle": "AI: The Engine of 4IR"
  }
}
```

---

### ✨ AI-Generated Summaries Example

When processing unstructured notes (e.g. brainstorming sessions or raw meeting transcripts), the Gemini-powered pipeline produces high-quality, highly synthesized context:

* **Unstructured Input Note:**
  > "We need to focus on migrating all state tracking variables to standard bearer tokens. Right now we are getting constant 401 response errors on Safari and Brave browsers due to cookies getting rejected in cross-site redirects. Let's write an Axios request interceptor. Let's make sure Vercel environment base URL is robust and always appends /api."
* **AI-Generated Summary Output:**
  > "Migration of client-side authentication from standard session cookies to Stateless JWT Bearer tokens to resolve Safari/Brave cross-domain blocking issues, including interceptor development and Base URL config fortification."
* **AI-Generated Action Items Checklist:**
  * [x] Implement JWT token storage in browser `localStorage`.
  * [ ] Build Axios Request Interceptor to dynamic attach Bearer authorization headers.
  * [ ] Validate and append `/api` routing paths to Vercel environment configurations.