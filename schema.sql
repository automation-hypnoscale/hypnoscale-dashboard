-- Hypnoscale E-commerce Dashboard - Supabase schema
-- Run this in the Supabase SQL Editor to create the required tables.

-- 1. Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id text PRIMARY KEY,
  date timestamptz,
  total_amount numeric,
  status text
);

-- 2. Marketing spend table
CREATE TABLE IF NOT EXISTS marketing_spend (
  date date PRIMARY KEY,
  ad_spend numeric,
  platform text
);

-- 3. AI insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  date date PRIMARY KEY,
  insight_text text
);
