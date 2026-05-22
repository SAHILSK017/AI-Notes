# NeuralDesk Frontend Client (Next.js) 🌐

This is the client-side interface for **NeuralDesk (AI Notes)**, built using Next.js. It features a cinematic visual workspace, a highly interactive vintage desk lamp, dynamic glow themes, and AI sidepanel tools.

## 🚀 Key Technologies
- **Core:** Next.js (App Router), React, JavaScript
- **Styling:** TailwindCSS, Custom HSL color tokens, Glassmorphic cards
- **State Management & Caching:** TanStack Query (React Query)
- **Animations:** GSAP (GreenSock Animation Platform) for physics-based physical pull-chain animations
- **Audio:** Web Audio API (native browser sound synthesis for switches)
- **Icons:** Lucide React

## ⚙️ Development Setup

First, ensure you have installed dependencies:

```bash
npm install
```

### Environment Configuration
Create a `.env.local` file inside this directory to connect to your local backend gateway API:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Run Server

Run the local next development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📦 Production Build

To compile a highly optimized production bundle:

```bash
npm run build
```

Then run the production server locally:

```bash
npm run start
```
