'use client'

import { useEffect, useState } from 'react'
import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState(false)

  async function fetchCategories() {
    setLoading(true)
    try {
      const query = groq`*[_type == "category"] { _id, name, "slug": slug.current, description } | order(name asc)`;
      const res = await fetch('/api/sanity-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setCategories(data ?? [])
    } catch (err) {
      console.error(err);
      showToast('Loading failed', 'error');
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/admin/categories', {
        method: editCat ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editCat?._id,
          name: fd.get('name'),
          description: fd.get('description'),
        }),
      })
      if (!res.ok) throw new Error()
      showToast(editCat ? 'Category updated!' : 'Category created!')
      setShowForm(false)
      setEditCat(null)
      fetchCategories()
    } catch {
      showToast('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function deleteCategory(cat: Category) {
    if (!confirm(`Delete category "${cat.name}"?`)) return
    try {
      await fetch(`/api/admin/categories?id=${cat._id}`, { method: 'DELETE' })
      showToast('Category deleted')
      fetchCategories()
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  return (
    <div className="cats-page">
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      <div className="page-header">
        <div>
          <h2 className="page-h2">Categories</h2>
          <p className="page-sub">{categories.length} categories</p>
        </div>
        <button onClick={() => { setEditCat(null); setShowForm(true) }} className="btn-primary">
          ＋ Add Category
        </button>
      </div>

      {loading ? (
        <div className="cat-grid-loading">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⬢</div>
          <p className="empty-text">No categories yet.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add Category</button>
        </div>
      ) : (
        <div className="cat-grid">
          {categories.map(cat => (
            <div key={cat._id} className="cat-card">
              <div className="cat-card-icon">⬢</div>
              <div className="cat-card-body">
                <h3 className="cat-name">{cat.name}</h3>
                <p className="cat-slug">/{cat.slug}</p>
                {cat.description && <p className="cat-desc">{cat.description}</p>}
              </div>
              <div className="cat-actions">
                <button onClick={() => { setEditCat(cat); setShowForm(true) }} className="action-btn action-edit">Edit</button>
                <button onClick={() => deleteCategory(cat)} className="action-btn action-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="overlay" onClick={() => { setShowForm(false); setEditCat(null) }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editCat ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => { setShowForm(false); setEditCat(null) }} className="close-btn">✕</button>
            </div>
            <form onSubmit={handleSave} className="cat-form">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input name="name" required defaultValue={editCat?.name} placeholder="e.g. Candles" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" rows={3} defaultValue={editCat?.description} placeholder="Short description…" className="form-input form-textarea" />
              </div>
              <div className="form-footer">
                <button type="button" onClick={() => { setShowForm(false); setEditCat(null) }} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editCat ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .cats-page { display: flex; flex-direction: column; gap: 1.5rem; position: relative; }
        .page-header { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .page-h2 { font-size: 1.375rem; font-weight: 700; color: white; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
        .page-sub { font-size: 0.8125rem; color: rgba(255,255,255,0.4); margin: 0; }

        .btn-primary {
          padding: 0.625rem 1.25rem;
          background: linear-gradient(135deg,#a855f7,#6366f1);
          border: none; border-radius: 9px; color: white;
          font-size: 0.875rem; font-weight: 600; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-ghost {
          padding: 0.625rem 1.25rem;
          background: transparent; border: 1px solid rgba(255,255,255,0.12);
          border-radius: 9px; color: rgba(255,255,255,0.6);
          font-size: 0.875rem; font-weight: 500; cursor: pointer;
          transition: all 0.15s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.05); color: white; }

        /* Grid */
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
        .cat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 1.25rem;
          display: flex; flex-direction: column; gap: 0.75rem;
          transition: border-color 0.2s, transform 0.2s;
        }
        .cat-card:hover { border-color: rgba(168,85,247,0.2); transform: translateY(-1px); }

        .cat-card-icon {
          font-size: 1.75rem; color: rgba(168,85,247,0.4);
          width: 44px; height: 44px;
          background: rgba(168,85,247,0.08);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .cat-card-body { flex: 1; }
        .cat-name { font-size: 1rem; font-weight: 700; color: white; margin: 0 0 0.25rem; }
        .cat-slug { font-size: 0.75rem; color: rgba(168,85,247,0.6); font-family: monospace; margin: 0 0 0.5rem; }
        .cat-desc { font-size: 0.8125rem; color: rgba(255,255,255,0.4); margin: 0; line-height: 1.5; }

        .cat-actions { display: flex; gap: 0.5rem; }
        .action-btn { padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; }
        .action-edit   { background: rgba(99,102,241,0.15); color: #818cf8; }
        .action-edit:hover { background: rgba(99,102,241,0.25); }
        .action-delete { background: rgba(239,68,68,0.12);  color: #f87171; }
        .action-delete:hover { background: rgba(239,68,68,0.2); }

        /* Skeleton */
        .cat-grid-loading { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
        .skeleton-card {
          height: 140px;
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 14px;
        }
        @keyframes shimmer { to { background-position: -200% 0; } }

        /* Empty */
        .empty-state {
          display: flex; flex-direction: column; align-items: center;
          padding: 3rem;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; gap: 0.75rem;
        }
        .empty-icon { font-size: 2rem; color: rgba(255,255,255,0.12); }
        .empty-text { font-size: 0.875rem; color: rgba(255,255,255,0.35); margin: 0; }

        /* Modal */
        .overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
          z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1.5rem;
        }
        .modal {
          width: 100%; max-width: 480px;
          background: #12121e; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; overflow: hidden;
          animation: fadeUp 0.2s ease;
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .modal-title { font-size: 1.0625rem; font-weight: 700; color: white; margin: 0; }
        .close-btn {
          background: rgba(255,255,255,0.06); border: none; border-radius: 7px;
          width: 30px; height: 30px; color: rgba(255,255,255,0.5); cursor: pointer;
          font-size: 0.8125rem; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.1); color: white; }

        .cat-form { display: flex; flex-direction: column; gap: 1.25rem; padding: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-label { font-size: 0.8125rem; font-weight: 500; color: rgba(255,255,255,0.55); }
        .form-input {
          padding: 0.625rem 0.875rem;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px; color: white; font-size: 0.9rem;
          outline: none; transition: border-color 0.2s; font-family: inherit;
        }
        .form-input:focus { border-color: rgba(168,85,247,0.5); background: rgba(168,85,247,0.05); }
        .form-textarea { resize: vertical; }
        .form-footer { display: flex; gap: 0.75rem; padding-top: 0.25rem; }

        /* Toast */
        .toast {
          position: fixed; top: 1.5rem; right: 1.5rem; z-index: 100;
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.25rem; border-radius: 10px;
          font-size: 0.875rem; font-weight: 600;
          animation: fadeSlideIn 0.2s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .toast-success { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.25); color: #4ade80; }
        .toast-error   { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.25); color: #f87171; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
