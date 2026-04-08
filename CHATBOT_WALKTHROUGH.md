# 🎀 Your New AI Sales Assistant: Celeste

I have successfully built and integrated a full AI Sales Chatbot system for Celebration Finds. Your customers can now receive personalized gifting advice, and you have complete control over the bot's "brain" and personality from your admin portal.

---

## 🚀 Key Features

### 1. The Public Chat Widget
- **Floating Premium UI**: A beautiful, non-intrusive chat bubble with a pulsing online status.
- **"Celeste" Personality**: Trained as a luxury gifting expert who helps customers select wedding favors, baby shower gifts, and more.
- **Smart Suggestions**: Quick-start buttons to help customers start a conversation (e.g., "I'm planning a wedding").
- **Live Product Context**: Every time a customer chats, the bot fetches your current product catalog from Sanity so it can recommend real items with accurate prices.

### 2. The Admin Chatbot Portal (`/admin/dashboard/chatbot`)
- **⚙️ Settings Tab**:
    - **Bot Identity**: Change the bot's name (default: Celeste) and greeting.
    - **Sales System Prompt**: This is the "Master Instruction" set. You can rewrite exactly how the bot should sell, what questions to ask, and how to handle objections.
    - **Toggles**: Instantly enable/disable the bot or its access to your product catalog.
- **💬 Conversations Tab**:
    - **Live Monitoring**: See every single conversation in real-time.
    - **Full Transcripts**: Read exactly what your customers are asking and how the bot is responding.
    - **Status Management**: Mark sessions as "Active", "Closed", or "Converted" (won sales).
    - **Export**: Download any conversation as a CSV for reporting or training.

---

## 🛠️ How It Works (The Tech)

| Feature | Technology |
|---|---|
| **AI Brain** | **Google Gemini Flash (Stable 2026)** — Fast, smart, and handles large product context easily. |
| **Product Data** | **Sanity CMS** — The API fetches live product names, descriptions, and prices directly. |
| **Storage** | **Supabase DB** — All sessions and messages are saved securely and linked for admin viewing. |
| **API** | **Next.js Edge Routes** — High performance, non-blocking response streaming. |

---

## 💎 Tips for the Admin

- **Refining the Sales Pitch**: If the bot is too pushy, simply edit the **System Prompt** in the admin settings and tell it to be "more consultative." If it's too quiet, tell it to "always end with a closing question."
- **Niche Knowledge**: You can add specific shipping rules or bulk discount details directly into the System Prompt so the bot always has the right answer.
- **Sales Conversion**: Check the Conversations tab daily to see what's trending and identify where customers might be dropping off.

---

## 🏁 Final Steps

1. **Test it out!** Go to your homepage, open the chat, and say: *"Hi, I'm planning a luxury wedding in June. What candles would you recommend?"*
2. **Visit the Admin**: Go to the **Chat Bot** menu in your sidebar to see your own conversation and tweak Celeste's personality.

Your sales assistant is officially online! ✦
