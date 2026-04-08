'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'
import { createBlogCategory, updateBlogCategory } from '@/lib/actions/blog'
import { slugify } from '@/lib/utils'
import { ChevronLeft, Save, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface CategoryFormProps {
  params: Promise<{ id?: string }>
}

export default function CategoryFormPage({ params }: CategoryFormProps) {
  const { id } = use(params)
  const router = useRouter()
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: ''
  })

  useEffect(() => {
    if (isEdit) {
      async function fetchCategory() {
        try {
          const query = groq`*[_type == "blogCategory" && _id == $id][0]`
          const data = await client.fetch(query, { id })
          if (data) {
            setFormData({
              title: data.title || '',
              slug: data.slug?.current || '',
              description: data.description || ''
            })
          }
        } catch (err) {
          setError('Failed to fetch category details.')
        } finally {
          setLoading(false)
        }
      }
      fetchCategory()
    }
  }, [id, isEdit])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : slugify(title)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = isEdit 
        ? await updateBlogCategory(id!, formData)
        : await createBlogCategory(formData)

      if (res.success) {
        router.push('/admin/dashboard/blog')
        router.refresh()
      } else {
        setError(res.error || 'Something went wrong.')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center p-20 text-white/40">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto text-white">
      <Link 
        href="/admin/dashboard/blog" 
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Blog Dashboard
      </Link>

      <div className="bg-white/3 border border-white/7 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
        <h2 className="text-2xl font-bold mb-8">
          {isEdit ? 'Edit Category' : 'New Category'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 mb-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white/60">Category Title</label>
            <input 
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. Wedding Inspiration"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white/60">Slug (URL Segment)</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-purple-500/50 transition-colors">
              <span className="px-4 text-white/20 select-none text-sm">/blog/category/</span>
              <input 
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: slugify(e.target.value) }))}
                className="flex-1 bg-transparent border-none py-3 pr-4 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white/60">Description (Optional)</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this category for SEO and display."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full py-4 mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isEdit ? 'Update Category' : 'Create Category'}
          </button>
        </form>
      </div>
    </div>
  )
}
