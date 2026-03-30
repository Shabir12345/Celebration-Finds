'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  customizations: any
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  order_source: string
  created_at: string
  order_items: OrderItem[]
}

const SOURCE_LABELS: Record<string, string> = {
  website: '🌐 Site',
  facebook: '👥 Facebook',
  referral: '👋 Referral',
  other: '📎 Other',
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showManualForm, setShowManualForm] = useState(false)
  const [saving, setSaving] = useState(false)

  async function fetchOrders() {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (!error) {
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: status as any })
      }
      fetchOrders()
    }
  }

  async function handleManualSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    
    try {
      const resp = await fetch('/api/admin/orders/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: fd.get('name'),
          customer_email: fd.get('email'),
          total_amount: Number(fd.get('amount')),
          order_source: fd.get('source'),
          items: [{
            product_name: fd.get('product'),
            quantity: 1,
            unit_price: Number(fd.get('amount')),
          }]
        })
      })
      if (!resp.ok) throw new Error()
      setShowManualForm(false)
      fetchOrders()
    } catch (err) {
      alert('Failed to save manual order')
    } finally {
      setSaving(false)
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const steps = ['pending', 'processing', 'shipped', 'delivered']
  const getStepIndex = (s: string) => steps.indexOf(s)

  return (
    <div className="orders-page">
      <div className="page-header">
        <div>
          <h2 className="page-h2">Order Management</h2>
          <p className="page-sub">{orders.length} orders total</p>
        </div>
        <button onClick={() => setShowManualForm(true)} className="btn-primary">
          ✚ Log Manual Order
        </button>
      </div>

      <div className="filter-bar">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="orders-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Source</th>
              <th>Total</th>
              <th>Status</th>
              <th style={{ width: '100px' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="td-empty">Loading orders...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="td-empty">No orders found.</td></tr>
            ) : filtered.map(order => (
              <tr key={order.id} onClick={() => setSelectedOrder(order)} className="cursor-pointer hover-accent">
                <td className="cell-date">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="cell-customer">
                  <div className="cust-name">{order.customer_name || 'Anonymous'}</div>
                  <div className="cust-email">{order.customer_email}</div>
                </td>
                <td>
                  <span className={`source-tag tag-${order.order_source || 'website'}`}>
                      {SOURCE_LABELS[order.order_source || 'website']}
                  </span>
                </td>
                <td className="cell-total">${Number(order.total_amount).toFixed(2)}</td>
                <td>
                   <span className={`status-pill pill-${order.status}`}>
                     {order.status}
                   </span>
                </td>
                <td className="text-right">
                  <button className="btn-view">View →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Order Modal */}
      {showManualForm && (
        <div className="modal-overlay" onClick={() => setShowManualForm(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Create CRM Order</h3>
              <button onClick={() => setShowManualForm(false)}>✕</button>
            </div>
            <form onSubmit={handleManualSubmit} className="order-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Customer Name</label>
                  <input name="name" required placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label>Email / Phone Reference</label>
                  <input name="email" required placeholder="fb:john-id-123" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Order Source</label>
                  <select name="source" defaultValue="facebook">
                    <option value="facebook">Facebook Marketplace</option>
                    <option value="referral">Personal Referral</option>
                    <option value="other">Other / Walk-in</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Total Amount ($)</label>
                  <input name="amount" type="number" step="0.01" required placeholder="45.00" />
                </div>
              </div>
              <div className="form-group">
                <label>Main Product / service</label>
                <input name="product" required placeholder="e.g. 25x Custom Candles" />
              </div>
              <div className="form-foot">
                <button type="button" onClick={() => setShowManualForm(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Create Order'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Side Drawer for Order Details */}
      {selectedOrder && (
        <div className="drawer-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="side-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-title">
                <h3>Order #{selectedOrder.id.slice(0, 8)}</h3>
                <span className={`source-tag tag-${selectedOrder.order_source || 'website'}`}>
                   {SOURCE_LABELS[selectedOrder.order_source || 'website']}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="close-btn">✕</button>
            </div>

            <div className="drawer-body">
              {/* Status Timeline */}
              <div className="status-timeline">
                {steps.map((s, idx) => {
                  const active = getStepIndex(selectedOrder.status) >= idx
                  const current = selectedOrder.status === s
                  return (
                    <div key={s} className={`timeline-step ${active ? 'active' : ''} ${current ? 'current' : ''}`}>
                      <div className="step-circle">{active ? '✓' : idx + 1}</div>
                      <span className="step-label">{s}</span>
                    </div>
                  )
                })}
              </div>

              <div className="status-selector-row">
                 <label>Update Status:</label>
                 <select 
                    value={selectedOrder.status}
                    onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                    className="drawer-select"
                 >
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                      <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                 </select>
              </div>

              <div className="drawer-section">
                <h4 className="section-h">Customer Info</h4>
                <div className="info-card">
                  <div className="info-item">
                     <span className="info-label">Name</span>
                     <span className="info-val">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="info-item">
                     <span className="info-label">Email</span>
                     <span className="info-val">{selectedOrder.customer_email}</span>
                  </div>
                  <div className="info-item">
                     <span className="info-label">Date</span>
                     <span className="info-val">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="drawer-section">
                <h4 className="section-h">Line Items</h4>
                <div className="item-list">
                  {selectedOrder.order_items?.map((item, i) => (
                    <div key={i} className="line-item">
                       <div className="li-desc">
                         <span className="li-name">{item.product_name}</span>
                         <span className="li-qty">Qty: {item.quantity}</span>
                       </div>
                       <span className="li-total">${(item.quantity * item.unit_price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total-row">
                   <span>Grand Total</span>
                   <span className="final-price">${Number(selectedOrder.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .orders-page { display: flex; flex-direction: column; gap: 1.5rem; position: relative; min-height: 80vh; }
        .page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; }
        .page-h2 { font-size: 1.375rem; font-weight: 700; color: white; margin: 0; }
        .page-sub { font-size: 0.8125rem; color: rgba(255,255,255,0.4); margin: 0; }
        
        .btn-primary { 
          padding: 0.625rem 1.25rem; background: linear-gradient(135deg,#a855f7,#6366f1); 
          border: none; border-radius: 9px; color: white; font-size: 0.875rem; 
          font-weight: 600; cursor: pointer; transition: transform 0.2s;
        }
        .btn-primary:active { transform: scale(0.98); }
        .btn-ghost { padding: 0.625rem 1.25rem; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; color: rgba(255,255,255,0.6); }

        .filter-bar { display: flex; gap: 0.5rem; background: rgba(255,255,255,0.03); padding: 0.4rem; border-radius: 12px; width: fit-content; }
        .filter-btn { padding: 0.4rem 0.9rem; border-radius: 8px; border: none; background: transparent; color: rgba(255,255,255,0.4); font-size: 0.8125rem; cursor: pointer; transition: all 0.2s; }
        .filter-btn.active { background: rgba(168,85,247,0.15); color: #c084fc; font-weight: 600; }

        .orders-table-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 1rem; font-size: 0.75rem; text-transform: uppercase; color: rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .admin-table td { padding: 1.1rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.875rem; color: rgba(255,255,255,0.7); }
        .hover-accent:hover { background: rgba(168,85,247,0.04); }
        .cursor-pointer { cursor: pointer; }

        .cell-date { font-family: monospace; color: rgba(255,255,255,0.4); font-size: 0.75rem; }
        .cust-name { font-weight: 600; color: white; }
        .cust-email { font-size: 0.75rem; color: rgba(255,255,255,0.3); }

        .source-tag { font-size: 0.65rem; padding: 0.15rem 0.5rem; border-radius: 100px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .tag-website { background: rgba(56,189,248,0.1); color: #38bdf8; }
        .tag-facebook { background: rgba(129,140,248,0.1); color: #818cf8; }
        .tag-referral { background: rgba(168,85,247,0.1); color: #c084fc; }
        
        .status-pill { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 0.25rem 0.6rem; border-radius: 6px; }
        .pill-pending { background: rgba(250,204,21,0.1); color: #facc15; }
        .pill-processing { background: rgba(56,189,248,0.1); color: #38bdf8; }
        .pill-shipped { background: rgba(168,85,247,0.1); color: #c084fc; }
        .pill-delivered { background: rgba(74,222,128,0.1); color: #4ade80; }
        .pill-cancelled { background: rgba(248,113,113,0.1); color: #f87171; }

        .btn-view { background: rgba(255,255,255,0.05); border: none; color: white; padding: 0.4rem 0.8rem; border-radius: 9px; font-size: 0.75rem; font-weight: 600; }
        .text-right { text-align: right; }

        /* Create Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-card { background: #12121e; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; width: 100%; max-width: 550px; animation: bounceIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
        @keyframes bounceIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .modal-head { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .modal-head h3 { margin: 0; font-size: 1.125rem; }
        .modal-head button { background: transparent; border: none; font-size: 1.2rem; color: rgba(255,255,255,0.4); cursor: pointer; }
        .order-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.75rem; color: rgba(255,255,255,0.4); font-weight: 600; text-transform: uppercase; }
        .form-group input, .form-group select { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem; border-radius: 10px; color: white; outline: none; }
        .form-group input:focus { border-color: rgba(168,85,247,0.5); }
        .form-foot { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }

        /* Lateral Side Drawer */
        .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 2000; overflow: hidden; }
        .side-drawer { 
          position: absolute; top: 0; right: 0; height: 100%; width: 100%; max-width: 500px; 
          background: #0f0f18; border-left: 1px solid rgba(255,255,255,0.1); 
          box-shadow: -20px 0 60px rgba(0,0,0,0.5);
          animation: slideLeft 0.3s ease-out;
          display: flex; flex-direction: column;
        }
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }

        .drawer-header { padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: flex-start; }
        .drawer-title h3 { margin: 0 0 0.5rem; font-size: 1.25rem; font-weight: 800; }
        .close-btn { background: rgba(255,255,255,0.05); border: none; width: 32px; height: 32px; border-radius: 50%; color: white; cursor: pointer; }
        
        .drawer-body { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 2rem; }

        /* Status Timeline */
        .status-timeline { display: flex; justify-content: space-between; position: relative; padding: 1rem 0 2rem; }
        .status-timeline::before { content: ''; position: absolute; top: 32px; left: 10%; right: 10%; height: 2px; background: rgba(255,255,255,0.05); z-index: 1; }
        .timeline-step { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; flex: 1; }
        .step-circle { 
          width: 32px; height: 32px; border-radius: 50%; background: #1a1a2e; border: 2px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: rgba(255,255,255,0.3);
          transition: all 0.3s;
        }
        .timeline-step.active .step-circle { background: #6366f1; border-color: #818cf8; color: white; box-shadow: 0 0 15px rgba(99,102,241,0.4); }
        .timeline-step.current .step-circle { animation: pulseStep 2s infinite; }
        @keyframes pulseStep { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99,102,241,0.7); } 70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(99,102,241,0); } 100% { transform: scale(1); } }
        .step-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.25); }
        .timeline-step.active .step-label { color: white; }

        .status-selector-row { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px; }
        .drawer-select { flex: 1; background: transparent; border: none; color: #818cf8; font-weight: 800; font-size: 0.875rem; outline: none; }

        .drawer-section { display: flex; flex-direction: column; gap: 1rem; }
        .section-h { margin: 0; font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; }
        .info-card { background: rgba(255,255,255,0.03); border-radius: 14px; padding: 1rem; }
        .info-item { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .info-item:last-child { border-bottom: none; }
        .info-label { font-size: 0.8125rem; color: rgba(255,255,255,0.3); }
        .info-val { font-size: 0.8125rem; color: white; font-weight: 600; }

        .item-list { display: flex; flex-direction: column; border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; overflow: hidden; }
        .line-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .line-item:last-child { border-bottom: none; }
        .li-desc { display: flex; flex-direction: column; gap: 0.25rem; }
        .li-name { color: white; font-weight: 600; font-size: 0.9rem; }
        .li-qty { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
        .li-total { color: #4ade80; font-weight: 800; }
        .order-total-row { display: flex; justify-content: space-between; padding: 1rem; font-weight: 800; color: white; font-size: 1.125rem; border-top: 1px solid rgba(255,255,255,0.1); }
        .final-price { color: #4ade80; text-shadow: 0 0 10px rgba(74,222,128,0.2); }
      `}</style>
    </div>
  )
}
