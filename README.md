# NPC Population Analysis System (National Data Command Portal)

A modern, high-fidelity demographic command center and vital registry dashboard for the **National Population Commission (NPC)**. Built with React, Next.js App Router, Tailwind CSS, Leaflet Maps, and Supabase database synchronization.

---

## 🚀 Key Features

* **Multi-Page Routing (Next.js App Router):** Modular page separation for the Dashboard, vital Registrations, Migration records, mathematical Growth Projections, and System Settings.
* **Supabase Authentication:** Secure operator nodes sign-up and sign-in gates. Allows operators to customize their profile metadata (display name and base64-encoded profile picture).
* **Offline-First Synchronization:** Local state buffers queue new birth and death records during internet connection drops, automatically batching and syncing them to primary Supabase cloud nodes once connection returns.
* **Geocoded Live Map Widget:** An interactive Leaflet map of Nigeria featuring glowing neon location pin markers that scale in radius and count dynamically based on database registry submissions.
* **Dynamic LGA Breakdowns:** State Details audit views compiling live statistics aggregated and calculated dynamically by Local Government Areas (LGAs) for all 36 states and Abuja FCT.
* **Mathematical Projection Engine:** Run exponential growth path simulations using base/target year models and custom assumed growth rates.

---

## 🛠️ Tech Stack

* **Frontend Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS (Custom Glassmorphism themes & glow animations)
* **Icons:** Lucide React
* **Database & Auth:** Supabase Client SDK
* **Mapping:** Leaflet & React Leaflet
* **Charts:** Chart.js & React-Chartjs-2

---

## ⚙️ Project Configuration & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Install Dependencies
Clone the repository, navigate to the folder, and run:
```bash
npm install
```

### 3. Set Up Supabase Database Schema
Log in to your **Supabase Dashboard**, open your project, go to the **SQL Editor**, and execute the script inside **[schema.sql](schema.sql)**.
*This creates the `registrations` table and configures Row Level Security (RLS) policies allowing public select and inserts.*

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 💻 Local Development

Run the Next.js development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to inspect and run the portal locally.

To test the production build:
```bash
npm run build
npm run start
```
