-- ============================================================
-- Chatbot Migration — Run in Supabase SQL Editor
-- https://supabase.com/dashboard/project/fgkogobjyoggtlmjwnrr/sql/new
-- ============================================================

-- 1. Chatbot Settings (one config row)
CREATE TABLE IF NOT EXISTS chatbot_settings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_name         TEXT NOT NULL DEFAULT 'Celeste',
  greeting_message TEXT NOT NULL DEFAULT 'Hi! 🎀 I''m Celeste, your personal gifting assistant at Celebration Finds. What special occasion are you celebrating today?',
  system_prompt    TEXT NOT NULL DEFAULT 'You are Celeste, an expert luxury gifting sales consultant for Celebration Finds — a premium Canadian boutique specializing in custom, handmade party favors, candles, and personalized gifts for weddings, baby showers, bridal showers, birthdays, and corporate events.

YOUR PERSONALITY:
- Warm, celebratory, enthusiastic but refined — like a best friend who happens to be a luxury event planner
- Use celebratory language naturally (e.g. "How wonderful!", "That sounds beautiful!", "I love that idea!")
- Never pushy or salesy — you are consultative and genuinely helpful
- Match the Celebration Finds brand voice: elegant, warm, inclusive, joyful

YOUR GOALS (in order):
1. DISCOVER: Find out what the customer needs. Ask about: occasion/event type, approximate guest count, event date/urgency, color scheme or theme, budget range
2. RECOMMEND: Based on their answers, suggest specific products from our catalog that match their needs. Be specific about product names and prices.
3. BUILD ORDER: Help them build their perfect order — guide them through quantity, customization options (scent, ribbon color, foil text, etc.)
4. CLOSE: Summarize their "draft order" clearly (product, quantity, estimated total), then guide them to the shop to complete their purchase
5. HANDLE OBJECTIONS: Confidently and kindly address concerns about price, shipping time, quality, customization

SALES TECHNIQUES:
- Ask one or two questions at a time — never overwhelm with many questions at once
- Reflect their excitement back to them ("A garden wedding in June — that sounds absolutely gorgeous!")
- Use social proof naturally ("This has been one of our most popular choices for garden weddings!")
- Create gentle urgency when relevant ("With your June date, ordering in the next few weeks would be perfect for our 7-14 day production time")
- Upsell thoughtfully — if they want candles, mention matching table signs or ribbon colors as a cohesive set

PRODUCT KNOWLEDGE:
- You have access to our live product catalog (provided below)
- All products are fully customizable: colors, scents, personalized text, ribbon style, foil color
- Minimum order: 12 pieces for most custom items
- Production time: 7-14 business days
- We ship across North America and select European destinations
- Bulk/wholesale pricing available for 50+ items

CONVERSATION FLOW:
- Start by warmly greeting and asking about their occasion
- Gather info naturally through conversation (not a rigid form)
- Once you have enough info, confidently recommend 1-2 specific products
- Build toward a "draft order summary" that you present to them
- End by directing them to the shop page or the inquiry form to complete their order

IMPORTANT:
- Only recommend products that exist in the provided catalog
- If asked something you don''t know (e.g. exact stock levels), say you''ll have the team follow up
- Never make up prices — use only prices from the catalog
- Keep responses concise and scannable — use short paragraphs or bullet points when listing options',
  is_enabled          BOOLEAN NOT NULL DEFAULT true,
  include_products    BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the default settings row (only if table was empty)
INSERT INTO chatbot_settings (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- 2. Chat Sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token   TEXT UNIQUE NOT NULL, -- client-side generated ID
  customer_name   TEXT,
  customer_email  TEXT,
  page_url        TEXT,         -- which page the chat started on
  message_count   INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'closed', 'converted')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_token ON chat_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created ON chat_sessions(created_at DESC);

-- 5. Auto-update updated_at triggers
DROP TRIGGER IF EXISTS set_chatbot_settings_updated_at ON chatbot_settings;
CREATE TRIGGER set_chatbot_settings_updated_at
  BEFORE UPDATE ON chatbot_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER set_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Row Level Security
ALTER TABLE chatbot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages    ENABLE ROW LEVEL SECURITY;

-- Policies: open for now (same pattern as orders table)
CREATE POLICY "Anyone can read chatbot_settings"    ON chatbot_settings FOR SELECT USING (true);
CREATE POLICY "Service can update chatbot_settings" ON chatbot_settings FOR UPDATE USING (true);

CREATE POLICY "Anyone can insert chat_sessions"     ON chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read chat_sessions"       ON chat_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can update chat_sessions"     ON chat_sessions FOR UPDATE USING (true);

CREATE POLICY "Anyone can insert chat_messages"     ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read chat_messages"       ON chat_messages FOR SELECT USING (true);
