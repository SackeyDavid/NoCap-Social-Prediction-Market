# NoCap - Social Prediction Market 🧢

A social prediction market for African Gen-Z users, powered by AI trending topics.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL (Supabase/Neon) via Drizzle ORM
- **Auth**: Supabase Auth
- **AI**: Google Gemini (Free Tier) + Tavily Search

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` or `.env.local` file based on `.env.example`:
   ```
   # Database
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/nocap

   # AI Services
   # Get a free Gemini key here: https://aistudio.google.com/app/apikey
   GEMINI_API_KEY=AIza...
   
   # Get a Tavily key here: https://tavily.com/
   TAVILY_API_KEY=tvly-...

   # Supabase Auth
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...

   # Admin
   ADMIN_SECRET=dev-secret
   ```

3. **Database Setup**
   Push the schema to your database:
   ```bash
   npx drizzle-kit push
   ```
   Or generate migrations:
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## AI Trend Agent 🤖

The AI agent runs server-side to fetch fresh trending news (via Tavily) and generate valid prediction markets using **Google Gemini 1.5 Flash**. It includes filtering for outdated topics and ensures questions are future-oriented.

- **Trigger manually**:
  Visit `http://localhost:3000/api/admin/run-trend-agent?token=dev-secret`

- **Cron Job**:
  Set up a cron job (e.g., cron-job.org) to hit this endpoint daily to keep markets fresh.

## Deployment

1. Push to GitHub.
2. Import into Vercel.
3. Add Environment Variables in Vercel.
4. Deploy!

## Features

- **Markets**: Browse and bet on AI-generated or manual markets.
- **Wallet**: Demo wallet with fake top-up (transactions stored in DB).
- **Betting**: Simple Yes/No betting with fixed odds.
- **Profile**: Track your bets and balance.
