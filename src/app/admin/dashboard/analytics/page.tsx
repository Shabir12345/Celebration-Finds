'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'

interface OrderData {
  total_amount: number
  status: string
  created_at: string
}

interface TopProduct {
  product_name: string
  total: number
  revenue: number
}

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="bar-chart">
      {data.map(d => (
        <div key={d.label} className="bar-item">
          <div className="bar-label">{d.label}</div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <div className="bar-value">${d.value.toFixed(0)}</div>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  let cumulativePercent = 0

  const slices = data.map(d => {
    const percent = total ? (d.value / total) * 100 : 0
    const slice = { ...d, percent, startPercent: cumulativePercent }
    cumulativePercent += percent
    return slice
  })

  function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
    const s = polarToCartesian(cx, cy, r, startDeg)
    const e = polarToCartesian(cx, cy, r, endDeg)
    const large = endDeg - startDeg > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
  }

  return (
    <div className="donut-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140" className="donut-svg">
        {total === 0 ? (
          <circle cx="70" cy="70" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18" />
        ) : (
          slices.map((s, i) => {
            if (s.percent === 0) return null
            const startDeg = (s.startPercent / 100) * 360
            const endDeg = ((s.startPercent + s.percent) / 100) * 360
            return (
              <path
                key={i}
                d={describeArc(70, 70, 50, startDeg, endDeg)}
                fill="none"
                stroke={s.color}
                strokeWidth="18"
                strokeLinecap="butt"
              />
            )
          })
        )}
        <text x="70" y="67" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">{total}</text>
        <text x="70" y="82" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">Orders</text>
      </svg>

      <div className="donut-legend">
        {data.map(d => (
          <div key={d.label} className="legend-item">
            <span className="legend-dot" style={{ background: d.color }} />
            <span className="legend-label">{d.label}</span>
            <span className="legend-val">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: orderData } = await supabase
        .from('orders')
        .select('total_amount, status, created_at')
        .order('created_at', { ascending: true })

      // Top products via order_items
      const { data: itemData } = await supabase
        .from('order_items')
        .select('product_name, quantity, unit_price')

      if (orderData) setOrders(orderData)

      if (itemData) {
        const productMap: Record<string, TopProduct> = {}
        for (const item of itemData) {
          if (!productMap[item.product_name]) {
            productMap[item.product_name] = { product_name: item.product_name, total: 0, revenue: 0 }
          }
          productMap[item.product_name].total += item.quantity
          productMap[item.product_name].revenue += item.quantity * Number(item.unit_price)
        }
        setTopProducts(Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5))
      }

      setLoading(false)
    }
    fetchData()
  }, [])

  // Revenue by month (last 6 months)
  const monthlyRevenue = (() => {
    const now = new Date()
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const label = d.toLocaleDateString('en', { month: 'short' })
      const value = orders
        .filter(o => {
          const od = new Date(o.created_at)
          return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth() && o.status !== 'cancelled'
        })
        .reduce((s, o) => s + Number(o.total_amount), 0)
      return { label, value }
    })
  })()

  const statusCounts = [
    { label: 'Pending',    value: orders.filter(o => o.status === 'pending').length,    color: '#fbbf24' },
    { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: '#818cf8' },
    { label: 'Shipped',    value: orders.filter(o => o.status === 'shipped').length,    color: '#38bdf8' },
    { label: 'Delivered',  value: orders.filter(o => o.status === 'delivered').length,  color: '#4ade80' },
    { label: 'Cancelled',  value: orders.filter(o => o.status === 'cancelled').length,  color: '#f87171' },
  ]

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total_amount), 0)

  const avgOrder = orders.length ? totalRevenue / orders.filter(o => o.status !== 'cancelled').length : 0

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h2 className="page-h2">Analytics</h2>
        <p className="page-sub">Revenue and order insights</p>
      </div>

      {/* KPI row */}
      <div className="kpi-row">
        {[
          { label: 'Total Revenue',   value: `$${totalRevenue.toFixed(2)}`, icon: '◈', color: '#4ade80' },
          { label: 'Total Orders',    value: orders.length.toString(),      icon: '◎', color: '#818cf8' },
          { label: 'Avg. Order Value',value: `$${avgOrder.toFixed(2)}`,     icon: '⟨⟩',color: '#38bdf8' },
          { label: 'Delivered',       value: statusCounts[3].value.toString(), icon: '✓', color: '#fbbf24' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <span className="kpi-icon" style={{ color: k.color }}>{k.icon}</span>
            <div>
              <div className="kpi-value" style={{ color: k.color }}>{loading ? '–' : k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="charts-row">
        <div className="chart-card wide">
          <h3 className="chart-title">Revenue (Last 6 Months)</h3>
          {loading ? <div className="chart-skeleton" /> : <BarChart data={monthlyRevenue} />}
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Orders by Status</h3>
          {loading ? <div className="chart-skeleton" /> : <DonutChart data={statusCounts} />}
        </div>
      </div>

      {/* Top products */}
      <div className="section-card">
        <h3 className="chart-title">Top Products by Revenue</h3>
        {loading ? (
          <div className="load-rows">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton-row" />)}
          </div>
        ) : topProducts.length === 0 ? (
          <p className="empty-text">No order item data yet.</p>
        ) : (
          <table className="admin-table" style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={p.product_name}>
                  <td>
                    <span className="rank">#{i + 1}</span>
                    <span className="prod-name">{p.product_name}</span>
                  </td>
                  <td className="cell-qty">{p.total}</td>
                  <td className="cell-amount">${p.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .analytics-page { display: flex; flex-direction: column; gap: 1.5rem; }
        .page-header { margin-bottom: 0.25rem; }
        .page-h2 { font-size: 1.375rem; font-weight: 700; color: white; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
        .page-sub { font-size: 0.8125rem; color: rgba(255,255,255,0.4); margin: 0; }

        .kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
        .kpi-card {
          display: flex; align-items: center; gap: 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 1.25rem;
        }
        .kpi-icon { font-size: 1.375rem; }
        .kpi-value { font-size: 1.375rem; font-weight: 700; letter-spacing: -0.02em; }
        .kpi-label { font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.1rem; }

        .charts-row { display: grid; grid-template-columns: 1fr 340px; gap: 1rem; }
        @media (max-width: 900px) { .charts-row { grid-template-columns: 1fr; } }

        .chart-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 1.5rem;
        }
        .chart-title { font-size: 0.875rem; font-weight: 600; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 1.25rem; }

        /* Bar Chart */
        .bar-chart { display: flex; flex-direction: column; gap: 0.875rem; }
        .bar-item { display: flex; align-items: center; gap: 0.75rem; }
        .bar-label { width: 36px; font-size: 0.75rem; color: rgba(255,255,255,0.4); text-align: right; flex-shrink: 0; }
        .bar-track { flex: 1; height: 8px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden; }
        .bar-fill {
          height: 100%;
          background: linear-gradient(to right, #a855f7, #6366f1);
          border-radius: 100px;
          transition: width 0.6s ease;
        }
        .bar-value { width: 56px; font-size: 0.75rem; color: rgba(255,255,255,0.5); text-align: right; flex-shrink: 0; }

        /* Donut */
        .donut-wrap { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
        .donut-svg { flex-shrink: 0; }
        .donut-legend { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
        .legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; }
        .legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .legend-label { flex: 1; color: rgba(255,255,255,0.55); }
        .legend-val { color: white; font-weight: 600; }

        /* Section card */
        .section-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 1.5rem;
        }

        /* Table */
        .admin-table { width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; overflow: hidden; }
        .admin-table thead th {
          padding: 0.75rem 1rem; text-align: left; font-size: 0.6875rem; font-weight: 600;
          color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.08em;
          background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .admin-table tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
        .admin-table tbody tr:last-child { border-bottom: none; }
        .admin-table tbody tr:hover { background: rgba(255,255,255,0.025); }
        .admin-table tbody td { padding: 0.75rem 1rem; font-size: 0.875rem; color: rgba(255,255,255,0.75); vertical-align: middle; }

        .rank { display: inline-block; width: 20px; font-size: 0.75rem; color: rgba(255,255,255,0.3); font-weight: 700; margin-right: 0.5rem; }
        .prod-name { font-weight: 600; color: white; }
        .cell-qty { color: rgba(255,255,255,0.5); }
        .cell-amount { font-weight: 600; color: #a3e635; }

        /* Skeleton */
        .chart-skeleton {
          height: 160px;
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px;
        }
        .load-rows { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
        .skeleton-row {
          height: 48px;
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px;
        }
        @keyframes shimmer { to { background-position: -200% 0; } }
        .empty-text { font-size: 0.875rem; color: rgba(255,255,255,0.3); margin: 0.75rem 0 0; }
      `}</style>
    </div>
  )
}
