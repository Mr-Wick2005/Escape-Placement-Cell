# 🚀 Production Deployment Guide - Escape Room Placement Cell Game

This guide covers deploying the **Escape Room Placement Cell Game** using **GitHub**, **Vercel / Netlify** (Frontend), and **Supabase** (Backend, Database, Auth & Edge Functions).

---

## 🏗️ Architecture Overview

- **Frontend**: React 19 + Three.js / React Three Fiber + Tailwind CSS (Hosted on Vercel or Netlify via GitHub).
- **Backend & Database**: Supabase (PostgreSQL Database, Authentication, Row Level Security, and Serverless Edge Functions in Deno / TypeScript).

---

## 📋 Prerequisites

1. **GitHub Account**: Code hosted at [https://github.com/Mr-Wick2005/escaperoomveda.git](https://github.com/Mr-Wick2005/escaperoomveda.git)
2. **Supabase Account**: [https://supabase.com](https://supabase.com) (Free tier)
3. **Vercel Account**: [https://vercel.com](https://vercel.com) or **Netlify**: [https://netlify.com](https://netlify.com)

---

## 🗄️ Step 1: Set Up Supabase (Backend & Database)

### 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com/dashboard).
2. Click **"New Project"**.
3. Name your project (e.g., `escape-room-game`), choose a secure database password, and select your closest region.

### 2. Run Database Migrations
1. In your Supabase project dashboard, navigate to **SQL Editor** (left sidebar).
2. Open the file `supabase/migrations/20260819120000_create_escape_room_schema.sql` from this repository.
3. Paste the entire SQL script into the Supabase SQL Editor and click **Run**.
4. This will set up:
   - `profiles` table & auto-creation trigger on signup
   - `game_sessions` table
   - `aptitude_attempts`, `coding_attempts`, and `interview_attempts` tables
   - `leaderboard` view
   - Row Level Security (RLS) policies

### 3. Deploy Supabase Edge Functions (Optional if using Supabase CLI)
If deploying edge functions via Supabase CLI:
```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase functions deploy
```

### 4. Copy Your API Credentials
Go to **Project Settings** → **API** in the Supabase dashboard:
- **Project URL**: `https://<your-project-id>.supabase.co`
- **Anon / Public Key**: `eyJhbGciOi...`

---

## 🌐 Step 2: Deploy Frontend via GitHub

### Option A: Deploy on Vercel (Recommended)

1. Go to [Vercel](https://vercel.com) and click **"Add New..."** → **"Project"**.
2. Connect your GitHub account and import `Mr-Wick2005/escaperoomveda`.
3. Configure the Project:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend` *(or leave default root, as `vercel.json` handles monorepos)*
   - **Build Command**: `yarn build` or `npm run build`
   - **Output Directory**: `build`
4. Add **Environment Variables**:
   | Key | Value |
   |---|---|
   | `REACT_APP_SUPABASE_URL` | `https://<your-project-id>.supabase.co` |
   | `REACT_APP_SUPABASE_ANON_KEY` | `<your-supabase-anon-key>` |
5. Click **"Deploy"**.
6. Every time you push new commits to your GitHub branch (`main` / `master`), Vercel will automatically build and deploy the latest version!

---

### Option B: Deploy on Netlify

1. Go to [Netlify](https://app.netlify.com) and click **"Add new site"** → **"Import an existing project"**.
2. Choose **GitHub** and select `Mr-Wick2005/escaperoomveda`.
3. Netlify will automatically detect `netlify.toml`:
   - **Base directory**: `frontend`
   - **Build command**: `yarn build`
   - **Publish directory**: `frontend/build`
4. Add **Environment Variables** under Site configuration → Environment variables:
   - `REACT_APP_SUPABASE_URL`: `https://<your-project-id>.supabase.co`
   - `REACT_APP_SUPABASE_ANON_KEY`: `<your-supabase-anon-key>`
5. Click **"Deploy site"**.

---

## 🧪 Step 3: Test Production Deployment

1. Open your assigned URL (e.g., `https://escaperoomveda.vercel.app`).
2. Register a new user account or log in.
3. Play through:
   - **Round 1 (Classroom)**: Aptitude Test
   - **Round 2 (Coding Lab)**: Multi-language Coding Challenge
   - **Round 3 (Interview Room)**: Voice/Text HR Interview & AI analysis
4. Check the Leaderboard and performance reports.

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/Mr-Wick2005/escaperoomveda.git
cd escaperoomveda/frontend

# Install dependencies
yarn install

# Start local development server
yarn start
# Runs at http://localhost:3000
```
