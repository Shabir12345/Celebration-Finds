-- Run this in your Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/fgkogobjyoggtlmjwnrr/sql/new

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_payment_intent_id TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  shipping_address JSONB,
  notes TEXT,
  order_source TEXT DEFAULT 'website', -- 'website', 'facebook', 'referral', 'other'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  customizations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on orders
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_orders_updated_at ON orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies (open read/write for now — tighten post-launch)
CREATE POLICY "Anyone can insert orders"       ON orders      FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert order_items"  ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can read orders"        ON orders      FOR SELECT USING (true);
CREATE POLICY "Service can read order_items"   ON order_items FOR SELECT USING (true);
CREATE POLICY "Service can update orders"      ON orders      FOR UPDATE USING (true);
