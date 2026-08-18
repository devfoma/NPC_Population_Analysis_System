-- Supabase Database Schema Setup for NPC Population Analysis Portal
-- Copy and paste this script into your Supabase SQL Editor to configure the database.

-- 1. Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    nin text PRIMARY KEY,
    name text NOT NULL,
    type text NOT NULL CHECK (type IN ('Birth', 'Death')),
    date text NOT NULL,
    location text NOT NULL,
    status text NOT NULL DEFAULT 'Verified',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 2. Configure RLS Policies
-- Allow read access to all users
CREATE POLICY "Allow public read access" 
ON public.registrations 
FOR SELECT 
USING (true);

-- Allow insert access to all users (allows offline-first registration sync)
CREATE POLICY "Allow public insert access" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);
