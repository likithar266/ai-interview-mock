# AIcruit — AI Interview Practice Platform

**AIcruit** is a full-stack, proctored AI technical interview platform designed to help candidates prepare for real-world job screenings. Powered by **Google Gemini 2.5 Flash**, **TensorFlow.js computer vision**, and browser-native speech intelligence, AIcruit conducts structured mock interviews, monitors camera and tab focus in real-time, and provides constructive scorecards.

---

## Features

- **Tailored 4-Stage Interviews**: Dynamically creates practical, role-specific questions across four sequential phases:
  1. *Introduction & Background*
  2. *Project Architecture & Experience*
  3. *Core Technical Fundamentals*
  4. *Scenario-Based Problem Solving*
- **Live Camera Proctoring (TensorFlow.js BlazeFace)**:
  - Uses a client-side computer vision neural network running locally on your browser's WebGL.
  - Detects face presence in real time, alerting if the candidate leaves the frame or if multiple people enter.
  - Automatically flags window blur or tab-switching violations.
  - **100% Free**: Zero external computer vision API subscriptions or token costs.
- **Dual-Mode Answer Capture (Voice + Text)**:
  - Transcribes your spoken answers live into an editable text box using browser-native Web Speech recognition.
  - Edit typos, elaborate on points, or type answers directly if preferred.
- **AI Voice Question Readout**:
  - Automatically speaks interview questions aloud using the Web Speech Synthesis API.
- **Instant Evaluation Scorecard**:
  - Delivers an overall score (1–10), performance summary, and question-by-question comparative analysis showing your answer against ideal benchmark solutions.
- **Ultra-Low Token Footprint**:
  - Compact JSON prompt architecture configured for **Gemini 2.5 Flash**, cutting token consumption by ~60% and staying well within Google AI Studio's 100% free tier.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack) & [React 18](https://react.dev/)
- **AI Model**: [Google Gemini 2.5 Flash](https://aistudio.google.com/) via `@google/generative-ai`
- **Vision & AI Monitoring**: `@tensorflow/tfjs` & `@tensorflow-models/blazeface` (Client-side WebGL)
- **Database & ORM**: PostgreSQL ([Neon Serverless](https://neon.tech/)) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Clerk](https://clerk.com/) (`@clerk/nextjs`)
- **Speech Engine**: Browser Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Styling & UI**: Tailwind CSS, Radix UI Primitives, Lucide React, and Sonner

---

## Quick Start Guide

### 1. Prerequisites
Ensure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/likithar266/ai-interview-mock.git
cd ai-interview-mock
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory by copying `.env.example`:
```bash
cp .env.example .env.local
```

Fill in your configuration:
```env
# Neon PostgreSQL database URL
NEXT_PUBLIC_DRIZZLE_DB_URL=postgresql://username:password@host/database?sslmode=require

# Google Gemini API Key (Get a free key at https://aistudio.google.com/app/apikey)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GEMINI_MODEL=gemini-2.5-flash

# Interview Settings
NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT=4
NEXT_PUBLIC_INFORMATION=Keep your camera on and speak your answers clearly into the microphone.

# Clerk Authentication (https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. Push Database Schema
Sync your PostgreSQL tables using Drizzle Kit:
```bash
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Project Architecture

```
ai-interview-mock/
├── app/
│   ├── (auth)/                  # Clerk Sign-in and Sign-up routes
│   ├── dashboard/
│   │   ├── _components/         # AddNewInterview, Header, InterviewList, ItemCard
│   │   ├── interview/[id]/      # Pre-interview hardware setup & camera check
│   │   │   ├── start/           # Active interview room (Webcam + Voice + Questions)
│   │   │   └── feedback/        # Detailed evaluation scorecard & breakdown
│   │   └── page.jsx             # Main candidate dashboard
│   ├── layout.js                # Root layout with Clerk and Sonner toast provider
│   └── page.js                  # Landing page
├── components/ui/               # Reusable UI primitives (Button, Dialog, Textarea, etc.)
├── utils/
│   ├── db.js                    # Neon database connection
│   ├── schema.js                # Drizzle ORM schema (MockInterview, UserAnswer)
│   └── GeminiAIModel.js         # Token-optimized Gemini 2.5 Flash client
└── public/
    └── webcam.png               # Default fallback asset
```

---

## License

This project is licensed under the MIT License.
