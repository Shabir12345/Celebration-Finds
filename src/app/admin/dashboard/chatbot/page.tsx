'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatbotSettings {
  id: string
  bot_name: string
  greeting_message: string
  system_prompt: string
  is_enabled: boolean
  include_products: boolean
  updated_at: string
}

interface ChatSession {
  id: string
  session_token: string
  customer_name: string | null
  customer_email: string | null
  page_url: string | null
  message_count: number
  status: 'active' | 'closed' | 'converted'
  created_at: string
  updated_at: string
  last_message: string | null
  last_message_role: string | null
}

interface ChatMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'cb-badge-active',
    closed: 'cb-badge-closed',
    converted: 'cb-badge-converted',
  }
  return <span className={`cb-badge ${map[status] || ''}`}>{status}</span>
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  const [settings, setSettings] = useState<ChatbotSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/chatbot-settings')
      .then(r => r.json())
      .then(d => { setSettings(d); setLoading(false) })
      .catch(() => { setError('Failed to load settings'); setLoading(false) })
  }, [])

  async function handleSave() {
    if (!settings) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/chatbot-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_name: settings.bot_name,
          greeting_message: settings.greeting_message,
          system_prompt: settings.system_prompt,
          is_enabled: settings.is_enabled,
          include_products: settings.include_products,
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      const updated = await res.json()
      setSettings(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function update(key: keyof ChatbotSettings, value: string | boolean) {
    setSettings(prev => prev ? { ...prev, [key]: value } : prev)
  }

  if (loading) return <div className="cb-loading"><div className="cb-spinner" /></div>

  return (
    <div className="cb-settings">
      {error && <div className="cb-error">{error}</div>}

      {/* Status toggles */}
      <div className="cb-card">
        <h3 className="cb-card-title">Bot Status</h3>
        <div className="cb-toggles">
          <label className="cb-toggle-row">
            <div className="cb-toggle-info">
              <span className="cb-toggle-label">Chat Bot Enabled</span>
              <span className="cb-toggle-desc">When off, the chat widget shows an offline message</span>
            </div>
            <button
              id="toggle-enabled"
              className={`cb-toggle ${settings?.is_enabled ? 'on' : 'off'}`}
              onClick={() => update('is_enabled', !settings?.is_enabled)}
              role="switch"
              aria-checked={settings?.is_enabled}
            >
              <span className="cb-toggle-thumb" />
            </button>
          </label>

          <label className="cb-toggle-row">
            <div className="cb-toggle-info">
              <span className="cb-toggle-label">Include Product Catalog</span>
              <span className="cb-toggle-desc">Inject live Sanity product data into every AI response</span>
            </div>
            <button
              id="toggle-products"
              className={`cb-toggle ${settings?.include_products ? 'on' : 'off'}`}
              onClick={() => update('include_products', !settings?.include_products)}
              role="switch"
              aria-checked={settings?.include_products}
            >
              <span className="cb-toggle-thumb" />
            </button>
          </label>
        </div>
      </div>

      {/* Identity */}
      <div className="cb-card">
        <h3 className="cb-card-title">Bot Identity</h3>
        <div className="cb-fields">
          <div className="cb-field">
            <label className="cb-label" htmlFor="bot-name">Bot Name</label>
            <input
              id="bot-name"
              className="cb-input"
              value={settings?.bot_name || ''}
              onChange={e => update('bot_name', e.target.value)}
              placeholder="e.g. Celeste"
            />
          </div>
          <div className="cb-field">
            <label className="cb-label" htmlFor="greeting-msg">Greeting Message</label>
            <textarea
              id="greeting-msg"
              className="cb-textarea"
              rows={3}
              value={settings?.greeting_message || ''}
              onChange={e => update('greeting_message', e.target.value)}
              placeholder="The first message the bot sends when chat opens..."
            />
          </div>
        </div>
      </div>

      {/* System Prompt */}
      <div className="cb-card">
        <div className="cb-card-header">
          <h3 className="cb-card-title">System Prompt</h3>
          <span className="cb-card-badge">Core AI Instructions</span>
        </div>
        <p className="cb-card-desc">
          This is the master instruction set for the AI. Changes here immediately affect how the bot responds, its personality, sales approach, and what topics it covers. Be specific and detailed—the bot follows these instructions on every conversation.
        </p>
        <div className="cb-field">
          <textarea
            id="system-prompt"
            className="cb-textarea cb-textarea-code"
            rows={22}
            value={settings?.system_prompt || ''}
            onChange={e => update('system_prompt', e.target.value)}
            placeholder="Enter the system prompt..."
          />
          <div className="cb-char-count">{(settings?.system_prompt || '').length.toLocaleString()} characters</div>
        </div>
      </div>

      {/* Save */}
      <div className="cb-actions">
        {settings?.updated_at && (
          <span className="cb-last-saved">
            Last saved: {new Date(settings.updated_at).toLocaleString()}
          </span>
        )}
        <button
          id="save-settings-btn"
          className={`cb-save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

// ─── Conversations Tab ────────────────────────────────────────────────────────

function ConversationsTab() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/admin/chat-sessions')
      .then(r => r.json())
      .then(d => { setSessions(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const loadMessages = useCallback(async (session: ChatSession) => {
    setSelectedSession(session)
    setMessagesLoading(true)
    try {
      const res = await fetch(`/api/admin/chat-sessions?sessionId=${session.id}`)
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch {
      setMessages([])
    } finally {
      setMessagesLoading(false)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [messages])

  function exportCSV() {
    if (!selectedSession || messages.length === 0) return
    const rows = [
      ['Timestamp', 'Role', 'Message'],
      ...messages.map(m => [
        new Date(m.created_at).toLocaleString(),
        m.role,
        `"${m.content.replace(/"/g, '""')}"`,
      ])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${selectedSession.id.substring(0, 8)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function updateStatus(sessionId: string, status: string) {
    await fetch('/api/admin/chat-sessions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, status }),
    })
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: status as ChatSession['status'] } : s))
    if (selectedSession?.id === sessionId) {
      setSelectedSession(prev => prev ? { ...prev, status: status as ChatSession['status'] } : prev)
    }
  }

  return (
    <div className="cb-convos">
      {/* Session List */}
      <div className="cb-session-list">
        <div className="cb-session-list-header">
          <h3 className="cb-card-title">All Conversations</h3>
          <span className="cb-count">{sessions.length}</span>
        </div>

        {loading ? (
          <div className="cb-loading"><div className="cb-spinner" /></div>
        ) : sessions.length === 0 ? (
          <div className="cb-empty">
            <div className="cb-empty-icon">💬</div>
            <p>No conversations yet. Once customers start chatting, they'll appear here.</p>
          </div>
        ) : (
          <div className="cb-session-items">
            {sessions.map(session => (
              <button
                key={session.id}
                className={`cb-session-item ${selectedSession?.id === session.id ? 'active' : ''}`}
                onClick={() => loadMessages(session)}
              >
                <div className="cb-session-top">
                  <span className="cb-session-id">Session {session.id.substring(0, 8)}…</span>
                  <StatusBadge status={session.status} />
                </div>
                <div className="cb-session-meta">
                  <span>{session.message_count} messages</span>
                  <span>·</span>
                  <span>{new Date(session.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {session.last_message && (
                  <p className="cb-session-preview">
                    {session.last_message_role === 'user' ? '👤' : '✦'} {session.last_message}…
                  </p>
                )}
                {session.page_url && (
                  <span className="cb-session-page">{session.page_url}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Transcript Panel */}
      <div className="cb-transcript">
        {!selectedSession ? (
          <div className="cb-transcript-empty">
            <div className="cb-empty-icon">← </div>
            <p>Select a conversation to view the full transcript</p>
          </div>
        ) : (
          <>
            <div className="cb-transcript-header">
              <div>
                <h3 className="cb-transcript-title">
                  Session {selectedSession.id.substring(0, 8)}…
                </h3>
                <span className="cb-transcript-meta">
                  {new Date(selectedSession.created_at).toLocaleString()} · {selectedSession.page_url || 'Unknown page'}
                </span>
              </div>
              <div className="cb-transcript-actions">
                <select
                  className="cb-status-select"
                  value={selectedSession.status}
                  onChange={e => updateStatus(selectedSession.id, e.target.value)}
                  aria-label="Update session status"
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="converted">Converted</option>
                </select>
                <button id="export-csv-btn" className="cb-export-btn" onClick={exportCSV} disabled={messages.length === 0}>
                  Export CSV
                </button>
              </div>
            </div>

            <div className="cb-messages-view">
              {messagesLoading ? (
                <div className="cb-loading"><div className="cb-spinner" /></div>
              ) : messages.length === 0 ? (
                <div className="cb-empty"><p>No messages in this session</p></div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`cb-msg-row ${msg.role}`}>
                    <div className={`cb-msg-bubble ${msg.role}`}>
                      <div className="cb-msg-role">{msg.role === 'assistant' ? '✦ Celeste' : '👤 Customer'}</div>
                      <div className="cb-msg-content">
                        {msg.content.split('\n').map((line, i) => (
                          <span key={i}>{line}{i < msg.content.split('\n').length - 1 && <br />}</span>
                        ))}
                      </div>
                      <div className="cb-msg-time">{new Date(msg.created_at).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ChatbotPage() {
  const [tab, setTab] = useState<'settings' | 'conversations'>('settings')

  return (
    <div className="cb-page">
      <div className="cb-page-header">
        <div>
          <h2 className="cb-page-title">AI Chat Bot</h2>
          <p className="cb-page-subtitle">Configure your sales AI and view all customer conversations</p>
        </div>
        <div className="cb-tab-bar">
          <button
            id="tab-settings"
            className={`cb-tab ${tab === 'settings' ? 'active' : ''}`}
            onClick={() => setTab('settings')}
          >
            ⚙ Settings
          </button>
          <button
            id="tab-conversations"
            className={`cb-tab ${tab === 'conversations' ? 'active' : ''}`}
            onClick={() => setTab('conversations')}
          >
            💬 Conversations
          </button>
        </div>
      </div>

      {tab === 'settings' ? <SettingsTab /> : <ConversationsTab />}

      <style>{`
        .cb-page { display: flex; flex-direction: column; gap: 1.5rem; }

        .cb-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .cb-page-title { font-size: 1.375rem; font-weight: 700; color: white; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
        .cb-page-subtitle { font-size: 0.875rem; color: rgba(255,255,255,0.4); margin: 0; }

        .cb-tab-bar {
          display: flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 3px;
          gap: 2px;
        }
        .cb-tab {
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.45);
          transition: all 0.15s;
          font-family: inherit;
        }
        .cb-tab:hover { color: rgba(255,255,255,0.75); }
        .cb-tab.active {
          background: rgba(168,85,247,0.15);
          color: #c084fc;
          border: 1px solid rgba(168,85,247,0.2);
        }

        /* ── Cards ── */
        .cb-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.5rem;
        }
        .cb-card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
        .cb-card-title { font-size: 0.9375rem; font-weight: 700; color: white; margin: 0 0 1rem; }
        .cb-card-header .cb-card-title { margin: 0; }
        .cb-card-badge {
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #a855f7;
          background: rgba(168,85,247,0.12);
          border: 1px solid rgba(168,85,247,0.2);
          padding: 0.2rem 0.5rem;
          border-radius: 100px;
        }
        .cb-card-desc { font-size: 0.8125rem; color: rgba(255,255,255,0.45); line-height: 1.6; margin: 0 0 1.25rem; }

        /* ── Toggles ── */
        .cb-toggles { display: flex; flex-direction: column; gap: 0; }
        .cb-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
        }
        .cb-toggle-row:last-child { border-bottom: none; padding-bottom: 0; }
        .cb-toggle-info { display: flex; flex-direction: column; gap: 0.25rem; }
        .cb-toggle-label { font-size: 0.875rem; font-weight: 600; color: white; }
        .cb-toggle-desc { font-size: 0.75rem; color: rgba(255,255,255,0.4); }

        .cb-toggle {
          width: 44px; height: 24px; min-width: 44px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
          padding: 0;
        }
        .cb-toggle.on { background: linear-gradient(135deg, #a855f7, #6366f1); }
        .cb-toggle.off { background: rgba(255,255,255,0.12); }
        .cb-toggle-thumb {
          position: absolute;
          top: 2px;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          transition: left 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cb-toggle.on .cb-toggle-thumb { left: 22px; }
        .cb-toggle.off .cb-toggle-thumb { left: 2px; }

        /* ── Fields ── */
        .cb-settings { display: flex; flex-direction: column; gap: 1.25rem; }
        .cb-fields { display: flex; flex-direction: column; gap: 1rem; }
        .cb-field { display: flex; flex-direction: column; gap: 0.375rem; }
        .cb-label { font-size: 0.8125rem; font-weight: 600; color: rgba(255,255,255,0.7); }

        .cb-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
          font-family: inherit;
          transition: border-color 0.15s;
          width: 100%;
          box-sizing: border-box;
        }
        .cb-input:focus { border-color: rgba(168,85,247,0.5); }

        .cb-textarea {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          padding: 0.75rem 0.875rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.15s;
          width: 100%;
          box-sizing: border-box;
          line-height: 1.6;
        }
        .cb-textarea:focus { border-color: rgba(168,85,247,0.5); }
        .cb-textarea-code {
          font-family: 'Courier New', 'Consolas', monospace;
          font-size: 0.8125rem;
          line-height: 1.7;
          background: rgba(0,0,0,0.3);
        }

        .cb-char-count { font-size: 0.6875rem; color: rgba(255,255,255,0.25); text-align: right; margin-top: 0.25rem; }

        /* ── Actions ── */
        .cb-actions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.5rem 0; }
        .cb-last-saved { font-size: 0.75rem; color: rgba(255,255,255,0.3); }

        .cb-save-btn {
          padding: 0.625rem 1.75rem;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          border: none;
          border-radius: 9px;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          font-family: inherit;
        }
        .cb-save-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .cb-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .cb-save-btn.saved { background: linear-gradient(135deg, #4ade80, #22c55e); }

        /* ── Conversations ── */
        .cb-convos {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 1.25rem;
          min-height: 600px;
        }
        @media (max-width: 900px) { .cb-convos { grid-template-columns: 1fr; } }

        .cb-session-list {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .cb-session-list-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .cb-session-list-header .cb-card-title { margin: 0; }
        .cb-count {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #a855f7;
          background: rgba(168,85,247,0.12);
          padding: 0.2rem 0.5rem;
          border-radius: 100px;
        }

        .cb-session-items { overflow-y: auto; flex: 1; }
        .cb-session-item {
          width: 100%;
          padding: 0.875rem 1.25rem;
          border: none;
          background: transparent;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          text-align: left;
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .cb-session-item:hover { background: rgba(255,255,255,0.03); }
        .cb-session-item.active { background: rgba(168,85,247,0.08); border-left: 2px solid #a855f7; }

        .cb-session-top { display: flex; align-items: center; justify-content: space-between; }
        .cb-session-id { font-size: 0.8125rem; font-weight: 600; color: white; }
        .cb-session-meta { font-size: 0.6875rem; color: rgba(255,255,255,0.35); display: flex; gap: 0.375rem; }
        .cb-session-preview { font-size: 0.75rem; color: rgba(255,255,255,0.45); margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 280px; }
        .cb-session-page { font-size: 0.625rem; color: rgba(168,85,247,0.6); }

        /* ── Transcript ── */
        .cb-transcript {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .cb-transcript-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: rgba(255,255,255,0.3);
          font-size: 0.875rem;
          padding: 2rem;
          text-align: center;
        }

        .cb-transcript-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          flex-shrink: 0;
        }
        .cb-transcript-title { font-size: 0.9375rem; font-weight: 700; color: white; margin: 0; }
        .cb-transcript-meta { font-size: 0.6875rem; color: rgba(255,255,255,0.35); }
        .cb-transcript-actions { display: flex; gap: 0.5rem; align-items: center; }

        .cb-status-select {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px;
          color: white;
          font-size: 0.75rem;
          padding: 0.375rem 0.5rem;
          cursor: pointer;
          font-family: inherit;
          outline: none;
        }

        .cb-export-btn {
          padding: 0.375rem 0.875rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px;
          color: rgba(255,255,255,0.7);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .cb-export-btn:hover:not(:disabled) { background: rgba(255,255,255,0.1); color: white; }
        .cb-export-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .cb-messages-view {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          scroll-behavior: smooth;
        }
        .cb-messages-view::-webkit-scrollbar { width: 4px; }
        .cb-messages-view::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

        .cb-msg-row { display: flex; }
        .cb-msg-row.user { justify-content: flex-end; }
        .cb-msg-row.assistant { justify-content: flex-start; }

        .cb-msg-bubble {
          max-width: 75%;
          padding: 0.75rem 1rem;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .cb-msg-bubble.assistant {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          border-bottom-left-radius: 4px;
        }
        .cb-msg-bubble.user {
          background: linear-gradient(135deg, rgba(168,85,247,0.25), rgba(99,102,241,0.2));
          border: 1px solid rgba(168,85,247,0.2);
          border-bottom-right-radius: 4px;
        }

        .cb-msg-role { font-size: 0.6875rem; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.06em; }
        .cb-msg-content { font-size: 0.8125rem; color: rgba(255,255,255,0.85); line-height: 1.55; }
        .cb-msg-time { font-size: 0.625rem; color: rgba(255,255,255,0.25); }

        /* ── Status Badges ── */
        .cb-badge {
          font-size: 0.5625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.2rem 0.5rem;
          border-radius: 100px;
        }
        .cb-badge-active    { background: rgba(34,197,94,0.15);   color: #4ade80; }
        .cb-badge-closed    { background: rgba(255,255,255,0.08);  color: rgba(255,255,255,0.4); }
        .cb-badge-converted { background: rgba(168,85,247,0.15);   color: #c084fc; }

        /* ── Shared ── */
        .cb-loading { display: flex; justify-content: center; padding: 3rem; }
        .cb-spinner {
          width: 28px; height: 28px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.08);
          border-top-color: #a855f7;
          animation: cb-spin 0.7s linear infinite;
        }
        @keyframes cb-spin { to { transform: rotate(360deg); } }

        .cb-empty {
          display: flex; flex-direction: column; align-items: center;
          padding: 3rem 2rem; gap: 0.75rem;
          color: rgba(255,255,255,0.3); font-size: 0.875rem; text-align: center;
        }
        .cb-empty-icon { font-size: 2rem; }
        .cb-empty p { margin: 0; }

        .cb-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.8125rem;
          color: #f87171;
        }
      `}</style>
    </div>
  )
}
