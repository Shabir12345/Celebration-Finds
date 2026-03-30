'use client'

import { useEffect, useState, useRef } from 'react'
import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'

interface Product {
  _id: string
  name: string
  slug: string
  category: string
  priceBase: number
  minQuantity: number
  isFeatured: boolean
  isActive: boolean
  images: Array<{ asset: { _ref: string } }>
}

interface Category {
  _id: string
  name: string
}

const STATUS_BADGE: Record<string, string> = {
  true:  'badge-active',
  false: 'badge-inactive',
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function fetchAll() {
    setLoading(true)
    try {
      const qProduct = groq`*[_type == "product"] {
        _id, name, "slug": slug.current,
        "category": category->name,
        priceBase, minQuantity, isFeatured, isActive,
        images
      } | order(_createdAt desc)`;
      const qCategory = groq`*[_type == "category"] { _id, name } | order(name asc)`;

      const [resProd, resCat] = await Promise.all([
        fetch('/api/sanity-proxy', { 
           method: 'POST', 
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ query: qProduct }) 
        }),
        fetch('/api/sanity-proxy', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: qCategory }) 
       })
      ]);

      const [prods, cats] = await Promise.all([resProd.json(), resCat.json()]);
      
      setProducts(prods ?? [])
      setCategories(cats ?? [])
    } catch (err) {
      console.error('Failed to fetch:', err);
      showToast('Could not load data. Check console.', 'error');
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  function openAdd() { setEditProduct(null); setShowForm(true) }
  function openEdit(p: Product) { setEditProduct(p); setShowForm(true) }
  function closeForm() { setShowForm(false); setEditProduct(null) }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/admin/products', {
        method: editProduct ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editProduct?._id,
          name: fd.get('name'),
          description: fd.get('description'),
          categoryId: fd.get('categoryId'),
          priceBase: parseFloat(fd.get('priceBase') as string),
          minQuantity: parseInt(fd.get('minQuantity') as string),
          isFeatured: fd.get('isFeatured') === 'on',
          isActive: fd.get('isActive') !== 'off',
        }),
      })

      if (!res.ok) throw new Error('Failed to save')
      showToast(editProduct ? 'Product updated!' : 'Product created!')
      closeForm()
      fetchAll()
    } catch {
      showToast('Failed to save product', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(p: Product) {
    try {
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p._id, isActive: !p.isActive }),
      })
      showToast(`Product ${!p.isActive ? 'activated' : 'deactivated'}`)
      fetchAll()
    } catch {
      showToast('Failed to update', 'error')
    }
  }

  async function deleteProduct(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    try {
      await fetch(`/api/admin/products?id=${p._id}`, { method: 'DELETE' })
      showToast('Product deleted')
      fetchAll()
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="products-page">
      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-h2">Products</h2>
          <p className="page-sub">{products.length} products total</p>
        </div>
        <div className="header-actions">
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={openAdd} className="btn-primary">＋ Add Product</button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="table-loading">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton-row" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⬡</div>
          <p className="empty-text">
            {search ? 'No products match your search.' : 'No products yet. Add your first product!'}
          </p>
          {!search && <button onClick={openAdd} className="btn-primary">Add Product</button>}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Min Qty</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-thumb">
                        {p.images?.[0] ? (
                          <Image
                            src={urlFor(p.images[0]).width(48).height(48).url()}
                            alt={p.name}
                            width={40}
                            height={40}
                            className="thumb-img"
                          />
                        ) : (
                          <span className="thumb-placeholder">⬡</span>
                        )}
                      </div>
                      <span className="product-name">{p.name}</span>
                    </div>
                  </td>
                  <td className="cell-cat">{p.category}</td>
                  <td className="cell-price">${p.priceBase?.toFixed(2)}</td>
                  <td className="cell-qty">{p.minQuantity}</td>
                  <td>
                    {p.isFeatured ? (
                      <span className="badge-featured">★ Featured</span>
                    ) : (
                      <span className="cell-dim">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${STATUS_BADGE[String(p.isActive)]}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button onClick={() => openEdit(p)} className="action-btn action-edit">Edit</button>
                      <button onClick={() => toggleActive(p)} className="action-btn action-toggle">
                        {p.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => deleteProduct(p)} className="action-btn action-delete">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-over Form */}
      {showForm && (
        <div className="overlay" onClick={closeForm}>
          <div className="slideover" onClick={e => e.stopPropagation()}>
            <div className="slideover-header">
              <h3 className="slideover-title">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={closeForm} className="close-btn">✕</button>
            </div>

            <form ref={formRef} onSubmit={handleSave} className="product-form">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  name="name"
                  required
                  defaultValue={editProduct?.name}
                  placeholder="e.g. Custom Candle Set"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Describe this product…"
                  className="form-input form-textarea"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="categoryId" required className="form-input form-select">
                    <option value="">Select category…</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Base Price ($) *</label>
                  <input
                    name="priceBase"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    defaultValue={editProduct?.priceBase}
                    placeholder="0.00"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Min Order Quantity</label>
                  <input
                    name="minQuantity"
                    type="number"
                    min="1"
                    defaultValue={editProduct?.minQuantity ?? 25}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-toggles">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    defaultChecked={editProduct?.isFeatured}
                    className="toggle-cb"
                  />
                  <span className="toggle-text">⭐ Featured Product</span>
                </label>
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editProduct?.isActive ?? true}
                    className="toggle-cb"
                  />
                  <span className="toggle-text">✓ Active (visible on store)</span>
                </label>
              </div>

              <p className="form-note">
                💡 To upload images, use{' '}
                <a href="/admin/studio" target="_blank" className="form-link">Sanity Studio</a>{' '}
                after saving this product.
              </p>

              <div className="form-footer">
                <button type="button" onClick={closeForm} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .products-page { display: flex; flex-direction: column; gap: 1.5rem; position: relative; }

        .page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .page-h2 { font-size: 1.375rem; font-weight: 700; color: white; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
        .page-sub { font-size: 0.8125rem; color: rgba(255,255,255,0.4); margin: 0; }

        .header-actions { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }

        .search-input {
          padding: 0.625rem 1rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          color: white;
          font-size: 0.875rem;
          outline: none;
          width: 220px;
          transition: border-color 0.2s;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.25); }
        .search-input:focus { border-color: rgba(168,85,247,0.5); }

        .btn-primary {
          padding: 0.625rem 1.25rem;
          background: linear-gradient(135deg,#a855f7,#6366f1);
          border: none;
          border-radius: 9px;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-ghost {
          padding: 0.625rem 1.25rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 9px;
          color: rgba(255,255,255,0.6);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.05); color: white; }

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

        .product-cell { display: flex; align-items: center; gap: 0.75rem; }
        .product-thumb {
          width: 40px; height: 40px; border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
        }
        .thumb-img { object-fit: cover; border-radius: 7px; }
        .thumb-placeholder { font-size: 1rem; color: rgba(255,255,255,0.2); }
        .product-name { font-weight: 600; color: white; }

        .cell-cat { color: rgba(255,255,255,0.5); font-size: 0.8125rem; }
        .cell-price { font-weight: 600; color: #a3e635; }
        .cell-qty { color: rgba(255,255,255,0.5); }
        .cell-dim { color: rgba(255,255,255,0.2); }

        .badge-featured {
          display: inline-block;
          padding: 0.2rem 0.55rem;
          background: rgba(251,191,36,0.12);
          color: #fbbf24;
          border-radius: 100px;
          font-size: 0.6875rem;
          font-weight: 600;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.625rem;
          border-radius: 100px;
          font-size: 0.6875rem;
          font-weight: 600;
        }
        .badge-active   { background: rgba(34,197,94,0.12); color: #4ade80; }
        .badge-inactive { background: rgba(239,68,68,0.12); color: #f87171; }

        .row-actions { display: flex; gap: 0.375rem; }
        .action-btn {
          padding: 0.3rem 0.625rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.15s;
        }
        .action-edit   { background: rgba(99,102,241,0.15); color: #818cf8; }
        .action-edit:hover { background: rgba(99,102,241,0.25); }
        .action-toggle { background: rgba(245,158,11,0.12); color: #fbbf24; }
        .action-toggle:hover { background: rgba(245,158,11,0.2); }
        .action-delete { background: rgba(239,68,68,0.12); color: #f87171; }
        .action-delete:hover { background: rgba(239,68,68,0.2); }

        /* Slide-over */
        .overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 50;
          display: flex; justify-content: flex-end;
        }
        .slideover {
          width: 100%; max-width: 500px;
          background: #12121e;
          border-left: 1px solid rgba(255,255,255,0.08);
          height: 100%;
          overflow-y: auto;
          display: flex; flex-direction: column;
          animation: slideIn 0.2s ease;
        }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

        .slideover-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: sticky; top: 0;
          background: #12121e;
          z-index: 1;
        }
        .slideover-title { font-size: 1.125rem; font-weight: 700; color: white; margin: 0; }
        .close-btn {
          background: rgba(255,255,255,0.06); border: none;
          border-radius: 7px; width: 32px; height: 32px;
          color: rgba(255,255,255,0.5); cursor: pointer; font-size: 0.875rem;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.1); color: white; }

        .product-form {
          display: flex; flex-direction: column; gap: 1.25rem;
          padding: 1.5rem;
          flex: 1;
        }

        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-label { font-size: 0.8125rem; font-weight: 500; color: rgba(255,255,255,0.55); }

        .form-input {
          padding: 0.625rem 0.875rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          color: white;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .form-input:focus { border-color: rgba(168,85,247,0.5); background: rgba(168,85,247,0.05); }
        .form-textarea { resize: vertical; }
        .form-select { appearance: none; cursor: pointer; }
        .form-select option { background: #12121e; }

        .form-toggles { display: flex; flex-direction: column; gap: 0.625rem; }
        .toggle-label { display: flex; align-items: center; gap: 0.625rem; cursor: pointer; }
        .toggle-cb { accent-color: #a855f7; width: 16px; height: 16px; }
        .toggle-text { font-size: 0.875rem; color: rgba(255,255,255,0.65); }

        .form-note {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 0.75rem;
          margin: 0;
        }
        .form-link { color: #a78bfa; }

        .form-footer {
          display: flex; gap: 0.75rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin-top: auto;
        }

        /* Toast */
        .toast {
          position: fixed; top: 1.5rem; right: 1.5rem; z-index: 100;
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          font-size: 0.875rem; font-weight: 600;
          animation: fadeSlideIn 0.2s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .toast-success { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.25); color: #4ade80; }
        .toast-error   { background: rgba(239,68,68,0.15);  border: 1px solid rgba(239,68,68,0.25);  color: #f87171; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        /* Loading */
        .table-loading { display: flex; flex-direction: column; gap: 0.5rem; }
        .skeleton-row {
          height: 60px;
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer { to { background-position: -200% 0; } }

        .empty-state {
          display: flex; flex-direction: column; align-items: center;
          padding: 3rem;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; gap: 0.75rem;
        }
        .empty-icon { font-size: 2rem; color: rgba(255,255,255,0.12); }
        .empty-text { font-size: 0.875rem; color: rgba(255,255,255,0.35); margin: 0; text-align: center; }
      `}</style>
    </div>
  )
}
