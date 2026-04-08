'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function generateSessionToken(): string {
  return `cf_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
}

function getOrCreateSessionToken(): string {
  if (typeof window === 'undefined') return ''
  const key = 'cf_chat_session'
  let token = sessionStorage.getItem(key)
  if (!token) {
    token = generateSessionToken()
    sessionStorage.setItem(key, token)
  }
  return token
}

function TypingDots() {
  return (
    <div className="cw-typing">
      <span /><span /><span />
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isBot = msg.role === 'assistant'
  return (
    <div className={`cw-msg-row ${isBot ? 'bot' : 'user'}`}>
      {isBot && (
        <div className="cw-bot-avatar" aria-hidden="true">✦</div>
      )}
      <div className={`cw-bubble ${isBot ? 'bot' : 'user'}`}>
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < msg.content.split('\n').length - 1 && <br />}
          </span>
        ))}
        <span className="cw-time">
          {msg.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionToken] = useState(getOrCreateSessionToken)
  const [hasGreeted, setHasGreeted] = useState(false)
  const [botName, setBotName] = useState('Celeste')
  const [greeting, setGreeting] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load bot settings on mount
  useEffect(() => {
    fetch('/api/admin/chatbot-settings')
      .then(r => r.json())
      .then(data => {
        if (data?.bot_name) setBotName(data.bot_name)
        if (data?.greeting_message) setGreeting(data.greeting_message)
        if (data?.is_enabled === false) return // Don't show if disabled
      })
      .catch(() => {})
  }, [])

  // Show greeting when chat opens for first time
  useEffect(() => {
    if (isOpen && !hasGreeted && greeting) {
      setHasGreeted(true)
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages([{
          role: 'assistant',
          content: greeting,
          timestamp: new Date(),
        }])
      }, 900)
    }
  }, [isOpen, hasGreeted, greeting])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [isOpen])

  // Track unread messages when closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const botMessages = messages.filter(m => m.role === 'assistant')
      setUnreadCount(botMessages.length)
    } else {
      setUnreadCount(0)
    }
  }, [isOpen, messages])

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return

    const userMsg: Message = { role: 'user', content: trimmed, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    const history = messages.map(m => ({ role: m.role, content: m.content }))

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 25000) // 25s client-side timeout

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history,
          sessionToken,
          pageUrl: window.location.pathname,
        }),
        signal: controller.signal
      })

      const data = await res.json()
      clearTimeout(timer)

      if (!res.ok) throw new Error(data.error || 'Failed')

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      }])
    } catch (err: any) {
      clearTimeout(timer)
      const errorMsg = err.name === 'AbortError' 
        ? "The connection timed out. Please check your internet and try again. 🌐"
        : "I'm sorry, something went wrong on my end. Our team is always here to help! 💛"
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date(),
      }])
    } finally {
      setIsTyping(false)
    }
  }, [input, isTyping, messages, sessionToken])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestedPrompts = [
    "I'm planning a wedding 🌸",
    "Baby shower gifts 🍼",
    "Corporate event favors 🎁",
    "What's your most popular item?",
  ]

  return (
    <>
      {/* Floating Button */}
      <button
        id="chat-widget-button"
        className={`cw-fab ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(v => !v)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        )}
        {!isOpen && unreadCount > 0 && (
          <span className="cw-badge">{unreadCount}</span>
        )}
        {!isOpen && (
          <span className="cw-online-dot" />
        )}
      </button>

      {/* Chat Panel */}
      <div className={`cw-panel ${isOpen ? 'open' : ''}`} role="dialog" aria-label={`Chat with ${botName}`}>
        {/* Header */}
        <div className="cw-header">
          <div className="cw-header-avatar">✦</div>
          <div className="cw-header-info">
            <span className="cw-header-name">{botName}</span>
            <span className="cw-header-status">
              <span className="cw-status-dot" />
              Online · Gifting Expert
            </span>
          </div>
          <button className="cw-close-btn" onClick={() => setIsOpen(false)} aria-label="Close">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="cw-messages" role="log" aria-live="polite">
          {messages.length === 0 && !isTyping && (
            <div className="cw-empty">
              <div className="cw-empty-icon">🎀</div>
              <p className="cw-empty-text">Your personal gifting assistant is ready to help you create something beautiful.</p>
              <div className="cw-suggestions">
                {suggestedPrompts.map(p => (
                  <button
                    key={p}
                    className="cw-suggestion"
                    onClick={async () => {
                      const userMsg: Message = { role: 'user', content: p, timestamp: new Date() }
                      setMessages([userMsg])
                      setIsTyping(true)
                      try {
                        const res = await fetch('/api/chat', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ message: p, history: [], sessionToken, pageUrl: window.location.pathname }),
                        })
                        const data = await res.json()
                        setMessages(prev => [...prev, { role: 'assistant', content: data.reply, timestamp: new Date() }])
                      } catch {
                        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, something went wrong. Please try again!", timestamp: new Date() }])
                      } finally {
                        setIsTyping(false)
                      }
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {isTyping && (
            <div className="cw-msg-row bot">
              <div className="cw-bot-avatar" aria-hidden="true">✦</div>
              <div className="cw-bubble bot">
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="cw-input-area">
          <div className="cw-input-wrap">
            <textarea
              ref={inputRef}
              id="chat-input"
              className="cw-input"
              placeholder="Ask about your event..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              maxLength={1000}
              disabled={isTyping}
              aria-label="Chat message"
            />
            <button
              id="chat-send-button"
              className="cw-send"
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <p className="cw-footer-note">Powered by Celebration Finds AI · Press Enter to send</p>
        </div>
      </div>

      <style>{`
        /* ── Fab Button ── */
        .cw-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9998;
          box-shadow: 0 4px 24px rgba(168,85,247,0.45), 0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cw-fab:hover { transform: scale(1.08); box-shadow: 0 6px 32px rgba(168,85,247,0.55), 0 4px 12px rgba(0,0,0,0.35); }
        .cw-fab.open { background: linear-gradient(135deg, #6366f1, #a855f7); }

        .cw-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #f43f5e;
          color: white;
          font-size: 0.625rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #0a0a14;
        }

        .cw-online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #4ade80;
          border: 2px solid #0a0a14;
          animation: cw-pulse 2s ease-in-out infinite;
        }
        @keyframes cw-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }

        /* ── Panel ── */
        .cw-panel {
          position: fixed;
          bottom: 92px;
          right: 24px;
          width: 380px;
          max-height: 580px;
          background: #0e0e1c;
          border: 1px solid rgba(168,85,247,0.2);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          z-index: 9997;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
          transform: translateY(16px) scale(0.96);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
          overflow: hidden;
          font-family: var(--font-inter, system-ui, sans-serif);
        }
        .cw-panel.open {
          transform: translateY(0) scale(1);
          opacity: 1;
          pointer-events: all;
        }

        @media (max-width: 440px) {
          .cw-panel {
            width: calc(100vw - 24px);
            right: 12px;
            bottom: 84px;
          }
          .cw-fab { right: 16px; bottom: 16px; }
        }

        /* ── Header ── */
        .cw-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.1));
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .cw-header-avatar {
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: white;
          box-shadow: 0 0 12px rgba(168,85,247,0.4);
        }

        .cw-header-info { flex: 1; display: flex; flex-direction: column; }
        .cw-header-name { font-size: 0.9375rem; font-weight: 700; color: white; letter-spacing: -0.01em; }
        .cw-header-status { font-size: 0.6875rem; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 0.375rem; margin-top: 1px; }

        .cw-status-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #4ade80; flex-shrink: 0;
          animation: cw-pulse 2s ease-in-out infinite;
        }

        .cw-close-btn {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: rgba(255,255,255,0.5);
          width: 30px; height: 30px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .cw-close-btn:hover { background: rgba(255,255,255,0.12); color: white; }

        /* ── Messages ── */
        .cw-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          scroll-behavior: smooth;
        }
        .cw-messages::-webkit-scrollbar { width: 4px; }
        .cw-messages::-webkit-scrollbar-track { background: transparent; }
        .cw-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        .cw-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1.5rem 1rem;
          gap: 0.75rem;
        }
        .cw-empty-icon { font-size: 2.5rem; }
        .cw-empty-text { font-size: 0.8125rem; color: rgba(255,255,255,0.45); line-height: 1.5; margin: 0; max-width: 260px; }

        .cw-suggestions { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-top: 0.25rem; }
        .cw-suggestion {
          padding: 0.375rem 0.75rem;
          background: rgba(168,85,247,0.1);
          border: 1px solid rgba(168,85,247,0.25);
          border-radius: 100px;
          font-size: 0.75rem;
          color: #c084fc;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .cw-suggestion:hover { background: rgba(168,85,247,0.2); border-color: rgba(168,85,247,0.45); }

        .cw-msg-row {
          display: flex;
          gap: 0.625rem;
          align-items: flex-end;
        }
        .cw-msg-row.user { justify-content: flex-end; }
        .cw-msg-row.bot  { justify-content: flex-start; }

        .cw-bot-avatar {
          width: 28px; height: 28px; min-width: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.625rem; color: white;
          flex-shrink: 0;
        }

        .cw-bubble {
          max-width: 78%;
          padding: 0.625rem 0.875rem;
          border-radius: 16px;
          font-size: 0.8125rem;
          line-height: 1.55;
          position: relative;
        }
        .cw-bubble.bot {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.88);
          border-bottom-left-radius: 4px;
        }
        .cw-bubble.user {
          background: linear-gradient(135deg, #a855f7, #7c3aed);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .cw-time {
          display: block;
          font-size: 0.5625rem;
          margin-top: 0.25rem;
          opacity: 0.45;
        }

        /* ── Typing dots ── */
        .cw-typing { display: flex; gap: 4px; align-items: center; padding: 2px 4px; }
        .cw-typing span {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.4);
          animation: cw-bounce 1.2s ease-in-out infinite;
        }
        .cw-typing span:nth-child(2) { animation-delay: 0.2s; }
        .cw-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes cw-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        /* ── Input ── */
        .cw-input-area {
          padding: 0.75rem 1rem 0.875rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
          background: rgba(0,0,0,0.2);
        }

        .cw-input-wrap {
          display: flex;
          gap: 0.5rem;
          align-items: flex-end;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 0.5rem 0.5rem 0.5rem 0.875rem;
          transition: border-color 0.15s;
        }
        .cw-input-wrap:focus-within { border-color: rgba(168,85,247,0.5); }

        .cw-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(255,255,255,0.88);
          font-size: 0.8125rem;
          line-height: 1.5;
          resize: none;
          font-family: inherit;
          max-height: 120px;
          overflow-y: auto;
        }
        .cw-input::placeholder { color: rgba(255,255,255,0.3); }
        .cw-input:disabled { opacity: 0.5; }

        .cw-send {
          width: 34px; height: 34px; min-width: 34px;
          border-radius: 9px;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          border: none;
          color: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.15s, transform 0.15s;
          flex-shrink: 0;
        }
        .cw-send:hover:not(:disabled) { transform: scale(1.05); }
        .cw-send:disabled { opacity: 0.35; cursor: not-allowed; }

        .cw-footer-note {
          font-size: 0.5625rem;
          color: rgba(255,255,255,0.2);
          text-align: center;
          margin: 0.5rem 0 0;
        }
      `}</style>
    </>
  )
}
