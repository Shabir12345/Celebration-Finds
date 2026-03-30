'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Set a cookie for the proxy to read
      document.cookie = `sb-access-token=${data.session?.access_token}; path=/; max-age=3600; SameSite=Lax; Secure`
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="admin-login-page">
      {/* Background */}
      <div className="login-bg" />

      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 className="login-brand">Celebration Finds</h1>
            <p className="login-sub">Admin Portal</p>
          </div>
        </div>

        <h2 className="login-title">Sign in to your dashboard</h2>
        <p className="login-desc">Manage products, orders, and analytics</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@celebrationfinds.com"
              className="form-input"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="login-btn-loading">
                <span className="spinner" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="login-footer-note">
          Authorized personnel only. All activity is logged.
        </p>
      </div>

      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          position: relative;
          padding: 2rem;
          font-family: var(--font-inter, sans-serif);
        }

        .login-bg {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(168,85,247,0.12) 0%, transparent 70%),
                      radial-gradient(ellipse 60% 50% at 80% 100%, rgba(99,102,241,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.5rem;
          backdrop-filter: blur(20px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .login-logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .login-brand {
          font-size: 1rem;
          font-weight: 700;
          color: white;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .login-sub {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          margin: 0;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .login-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }

        .login-desc {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.45);
          margin: 0 0 2rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.8125rem;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.01em;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: white;
          font-size: 0.9375rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: rgba(255,255,255,0.25);
        }

        .form-input:focus {
          border-color: rgba(168,85,247,0.6);
          background: rgba(168,85,247,0.06);
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          color: #fca5a5;
          font-size: 0.875rem;
        }

        .login-btn {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          letter-spacing: 0.01em;
          margin-top: 0.25rem;
        }

        .login-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer-note {
          text-align: center;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.2);
          margin-top: 1.5rem;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  )
}
