'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '◈', exact: true },
  { href: '/admin/dashboard/products', label: 'Products', icon: '⬡' },
  { href: '/admin/dashboard/orders', label: 'Orders', icon: '◎' },
  { href: '/admin/dashboard/portfolio', label: 'Lookbook', icon: '✦' },
  { href: '/admin/dashboard/blog', label: 'Blog', icon: '✎' },
  { href: '/admin/dashboard/categories', label: 'Categories', icon: '⬢' },
  { href: '/admin/dashboard/analytics', label: 'Analytics', icon: '◉' },
  { href: '/admin/dashboard/chatbot', label: 'Chat Bot', icon: '◌' },
  { href: '/admin/studio', label: 'Sanity Studio', icon: '⌬', newTab: true },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
    } else {
      setUser(session.user)
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">✦</div>
            {sidebarOpen && (
              <div className="sidebar-logo-text">
                <span className="sidebar-brand">CF Admin</span>
                <span className="sidebar-tagline">Celebration Finds</span>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(v => !v)}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              target={item.newTab ? '_blank' : undefined}
              className={`sidebar-link ${isActive(item.href, item.exact) ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
              {sidebarOpen && item.newTab && <span className="ext-icon">↗</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user && sidebarOpen && (
            <div className="user-pill">
              <div className="user-avatar">
                {user.email?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="user-info">
                <span className="user-email">{user.email}</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          )}
          <button onClick={signOut} className={`signout-btn ${sidebarOpen ? '' : 'icon-only'}`}>
            <span>⏻</span>
            {sidebarOpen && ' Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1 className="page-title">
              {NAV.find(n => isActive(n.href, n.exact))?.label ?? 'Dashboard'}
            </h1>
          </div>
          <div className="topbar-right">
            <a href="/" target="_blank" className="topbar-site-link">
              View Site ↗
            </a>
            <div className="topbar-time">
              {new Date().toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </div>

      <style>{`
        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: #080810;
          font-family: var(--font-inter, system-ui, sans-serif);
        }

        /* ── Sidebar ── */
        .admin-sidebar {
          display: flex;
          flex-direction: column;
          background: #0e0e1a;
          border-right: 1px solid rgba(255,255,255,0.06);
          transition: width 0.25s ease;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }
        .admin-sidebar.open  { width: 240px; }
        .admin-sidebar.closed { width: 64px; }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          gap: 0.5rem;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          overflow: hidden;
        }

        .sidebar-logo-icon {
          width: 36px;
          height: 36px;
          min-width: 36px;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: white;
        }

        .sidebar-logo-text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sidebar-brand {
          font-size: 0.9375rem;
          font-weight: 700;
          color: white;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .sidebar-tagline {
          font-size: 0.6875rem;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .sidebar-toggle {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          color: rgba(255,255,255,0.5);
          width: 28px;
          height: 28px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .sidebar-toggle:hover { background: rgba(255,255,255,0.09); }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: 8px;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.15s;
          white-space: nowrap;
          overflow: hidden;
        }
        .sidebar-link:hover {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.8);
        }
        .sidebar-link.active {
          background: rgba(168,85,247,0.12);
          color: #c084fc;
        }

        .sidebar-icon {
          font-size: 1rem;
          flex-shrink: 0;
          width: 20px;
          text-align: center;
        }

        .sidebar-label { flex: 1; }

        .ext-icon {
          font-size: 0.65rem;
          opacity: 0.5;
        }

        .sidebar-footer {
          padding: 0.75rem 0.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .user-pill {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.5rem 0.75rem;
          background: rgba(255,255,255,0.04);
          border-radius: 8px;
          overflow: hidden;
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          min-width: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6875rem;
          font-weight: 700;
          color: white;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-email {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 0.625rem;
          color: rgba(168,85,247,0.8);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .signout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: transparent;
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          color: rgba(239,68,68,0.7);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          width: 100%;
        }
        .signout-btn:hover {
          background: rgba(239,68,68,0.08);
          color: #f87171;
        }
        .signout-btn.icon-only { padding: 0.5rem; }

        /* ── Main ── */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow-x: hidden;
        }

        .admin-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: rgba(8,8,16,0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .topbar-left { display: flex; align-items: center; gap: 1rem; }

        .page-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .topbar-site-link {
          font-size: 0.8125rem;
          color: rgba(168,85,247,0.8);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }
        .topbar-site-link:hover { color: #a855f7; }

        .topbar-time {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.3);
        }

        .admin-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }
      `}</style>
    </div>
  )
}
