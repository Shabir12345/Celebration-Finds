'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Stats {
  totalOrders: number
  revenue: number
  pendingOrders: number
  recentOrders: Order[]
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  status: string
  total_amount: number
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  pending:    'status-pending',
  processing: 'status-processing',
  shipped:    'status-shipped',
  delivered:  'status-delivered',
  cancelled:  'status-cancelled',
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
    recentOrders: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (orders) {
        const revenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0)
        const pending = orders.filter(o => o.status === 'pending').length

        setStats({
          totalOrders: orders.length,
          revenue,
          pendingOrders: pending,
          recentOrders: orders.slice(0, 8),
        })
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      label: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: '◎',
      gradient: 'from-violet-500 to-purple-600',
      href: '/admin/dashboard/orders',
    },
    {
      label: 'Revenue',
      value: `$${Number(stats.revenue || 0).toFixed(2)}`,
      icon: '◈',
      gradient: 'from-emerald-500 to-teal-600',
      href: '/admin/dashboard/analytics',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      icon: '⏳',
      gradient: 'from-amber-500 to-orange-500',
      href: '/admin/dashboard/orders',
    },
    {
      label: 'Quick Action',
      value: 'Add Product',
      icon: '＋',
      gradient: 'from-pink-500 to-rose-500',
      href: '/admin/dashboard/products',
      isAction: true,
    },
  ]

  return (
    <div className="db-page">
      <div className="db-welcome">
        <div>
          <h2 className="db-heading">Welcome back 👋</h2>
          <p className="db-subheading">Here's what's happening with your store today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="stat-card">
            <div className={`stat-icon-wrap bg-gradient-${card.gradient}`}>
              <span className="stat-icon">{card.icon}</span>
            </div>
            <div className="stat-info">
              <span className="stat-label">{card.label}</span>
              <span className={`stat-value ${card.isAction ? 'stat-action' : ''}`}>
                {loading && !card.isAction ? '–' : card.value}
              </span>
            </div>
            <span className="stat-arrow">→</span>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Recent Orders</h3>
          <Link href="/admin/dashboard/orders" className="section-link">View all →</Link>
        </div>

        {loading ? (
          <div className="table-loading">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-row" />
            ))}
          </div>
        ) : stats.recentOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <p className="empty-text">No orders yet. Share your shop link to get started!</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <div className="cell-name">{order.customer_name || 'Unknown'}</div>
                      <div className="cell-sub">{order.customer_email}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${STATUS_COLORS[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="cell-amount">${Number(order.total_amount).toFixed(2)}</td>
                    <td className="cell-date">
                      {new Date(order.created_at).toLocaleDateString('en-CA', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    <td>
                      <Link href="/admin/dashboard/orders" className="table-action">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .db-page { display: flex; flex-direction: column; gap: 2rem; }

        .db-welcome { margin-bottom: 0.5rem; }
        .db-heading {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.25rem;
          letter-spacing: -0.02em;
        }
        .db-subheading { font-size: 0.9rem; color: rgba(255,255,255,0.4); margin: 0; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }
        .stat-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(168,85,247,0.25);
          transform: translateY(-1px);
        }

        .stat-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .bg-gradient-from-violet-500 { background: linear-gradient(135deg,#8b5cf6,#7c3aed); }
        .bg-gradient-from-emerald-500 { background: linear-gradient(135deg,#10b981,#0d9488); }
        .bg-gradient-from-amber-500 { background: linear-gradient(135deg,#f59e0b,#ea580c); }
        .bg-gradient-from-pink-500 { background: linear-gradient(135deg,#ec4899,#f43f5e); }

        .stat-icon { font-size: 1.125rem; color: white; }

        .stat-info { flex: 1; display: flex; flex-direction: column; }
        .stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.06em; }
        .stat-value { font-size: 1.25rem; font-weight: 700; color: white; letter-spacing: -0.02em; }
        .stat-action { font-size: 0.9375rem; color: #c084fc; }

        .stat-arrow { color: rgba(255,255,255,0.2); font-size: 0.875rem; }

        /* Section */
        .section { display: flex; flex-direction: column; gap: 1rem; }
        .section-header { display: flex; align-items: center; justify-content: space-between; }
        .section-title { font-size: 1rem; font-weight: 700; color: white; margin: 0; }
        .section-link { font-size: 0.8125rem; color: #a78bfa; text-decoration: none; font-weight: 500; }
        .section-link:hover { color: #c084fc; }

        /* Table */
        .table-wrap { overflow-x: auto; }
        .admin-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          overflow: hidden;
        }
        .admin-table thead th {
          padding: 0.875rem 1.25rem;
          text-align: left;
          font-size: 0.6875rem;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .admin-table tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .admin-table tbody tr:last-child { border-bottom: none; }
        .admin-table tbody tr:hover { background: rgba(255,255,255,0.03); }
        .admin-table tbody td {
          padding: 0.875rem 1.25rem;
          vertical-align: middle;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.75);
        }

        .cell-name { font-weight: 600; color: white; }
        .cell-sub { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
        .cell-amount { font-weight: 600; color: #a3e635; }
        .cell-date { color: rgba(255,255,255,0.4); font-size: 0.8125rem; }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.625rem;
          border-radius: 100px;
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: capitalize;
          letter-spacing: 0.03em;
        }
        .status-pending    { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .status-processing { background: rgba(99,102,241,0.15); color: #818cf8; }
        .status-shipped    { background: rgba(14,165,233,0.15); color: #38bdf8; }
        .status-delivered  { background: rgba(34,197,94,0.15);  color: #4ade80; }
        .status-cancelled  { background: rgba(239,68,68,0.15);  color: #f87171; }

        .table-action {
          font-size: 0.75rem;
          color: #a78bfa;
          text-decoration: none;
          font-weight: 600;
        }
        .table-action:hover { color: #c084fc; }

        .table-loading { display: flex; flex-direction: column; gap: 0.5rem; }
        .skeleton-row {
          height: 52px;
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer { to { background-position: -200% 0; } }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          gap: 0.75rem;
        }
        .empty-icon { font-size: 2rem; color: rgba(255,255,255,0.15); }
        .empty-text { font-size: 0.875rem; color: rgba(255,255,255,0.35); margin: 0; text-align: center; }
      `}</style>
    </div>
  )
}
