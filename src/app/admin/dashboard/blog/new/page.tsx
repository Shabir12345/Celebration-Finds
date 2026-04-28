'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { client, urlFor } from '@/lib/sanity'
import { groq } from 'next-sanity'
import Image from 'next/image'
import { createBlogPost, updateBlogPost, uploadBlogImage } from '@/lib/actions/blog'
import { slugify } from '@/lib/utils'
import { ChevronLeft, Save, Loader2, AlertCircle, Upload, X, Eye, Type, FileText, Search as SearchIcon } from 'lucide-react'
import Link from 'next/link'

interface PostFormProps {
  params: Promise<{ id?: string }>
}

interface Category {
  _id: string
  title: string
}

export default function PostFormPage({ params }: PostFormProps) {
  const { id } = use(params)
  const router = useRouter()
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    mainImage: null,
    categories: [],
    publishedAt: new Date().toISOString().split('T')[0],
    excerpt: '',
    body: '',
    metaTitle: '',
    metaDescription: ''
  })
  
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const catQuery = groq`*[_type == "blogCategory"] { _id, title } | order(title asc)`
        const cats = await client.fetch(catQuery)
        setCategories(cats)

        if (isEdit) {
          const postQuery = groq`*[_type == "blogPost" && _id == $id][0]`
          const post = await client.fetch(postQuery, { id })
          if (post) {
            setFormData({
              title: post.title || '',
              slug: post.slug?.current || '',
              mainImage: post.mainImage,
              categories: post.categories?.map((c: any) => c._ref) || [],
              publishedAt: post.publishedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
              excerpt: post.excerpt || '',
              body: post.body ? post.body.map((b: any) => b.children?.[0]?.text).join('\n\n') : '',
              metaTitle: post.metaTitle || '',
              metaDescription: post.metaDescription || ''
            })
            if (post.mainImage) {
              setImagePreview(urlFor(post.mainImage).width(400).url())
            }
          }
        }
      } catch (err) {
        setError('Failed to fetch data.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, isEdit])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev: any) => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : slugify(title)
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const preview = URL.createObjectURL(file)
    setImagePreview(preview)

    const uploadData = new FormData()
    uploadData.append('file', file)

    const res = await uploadBlogImage(uploadData)
    if (res.success && res.asset) {
      setFormData((prev: any) => ({
        ...prev,
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: res.asset._id }
        }
      }))
    } else {
      setError('Image upload failed.')
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    // Convert body string to Portable Text blocks
    const bodyBlocks = formData.body.split('\n\n').filter((p: string) => p.trim()).map((para: string) => ({
      _type: 'block',
      _key: Math.random().toString(36).substr(2, 9),
      style: 'normal',
      children: [{
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text: para,
        marks: []
      }]
    }))

    try {
      const dataToSave = {
        ...formData,
        body: bodyBlocks
      }

      const res = isEdit 
        ? await updateBlogPost(id!, dataToSave)
        : await createBlogPost(dataToSave)

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

  const toggleCategory = (catId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter((id: string) => id !== catId)
        : [...prev.categories, catId]
    }))
  }

  if (loading) return (
    <div className="flex items-center justify-center p-20 text-white/40">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto text-white pb-20">
      <Link 
        href="/admin/dashboard/blog" 
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Blog Dashboard
      </Link>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/3 border border-white/7 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-400" />
              {isEdit ? 'Edit Article' : 'New Article'}
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 mb-8">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/60">Article Title</label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Enter a compelling title..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/60">Article Content</label>
                <textarea 
                  required
                  rows={20}
                  value={formData.body}
                  onChange={(e) => setFormData((prev:any) => ({ ...prev, body: e.target.value }))}
                  placeholder="Tell your story. Hint: Use double newlines to separate paragraphs."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors resize-none font-mono text-sm leading-relaxed"
                />
                <p className="text-[10px] text-white/20 italic">Content is automatically converted to Sanity Blocks for the best rendering on the frontend.</p>
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-white/3 border border-white/7 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              <SearchIcon className="w-5 h-5 text-indigo-400" />
              Search Engine Optimization (SEO)
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/60">Meta Title</label>
                <input 
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData((prev:any) => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="If empty, title will be used"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/60">Meta Description</label>
                <textarea 
                  rows={3}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData((prev:any) => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Short summary for Google results..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Action Card */}
          <div className="bg-white/3 border border-white/7 rounded-2xl p-6 backdrop-blur-sm sticky top-24">
            <button 
              type="submit" 
              disabled={saving || uploading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none mb-4 shadow-lg shadow-purple-500/20"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isEdit ? 'Update Article' : 'Publish Article'}
            </button>
            <p className="text-[10px] text-center text-white/30 uppercase tracking-widest font-bold">Autosave is not enabled yet</p>
          </div>

          {/* Settings Section */}
          <div className="bg-white/3 border border-white/7 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-5 border-b border-white/7 bg-white/2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white/70">Article Settings</h4>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40">Featured Image</label>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10 group">
                  {imagePreview ? (
                    <>
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                          <Upload className="w-5 h-5" />
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                        <button 
                          type="button"
                          onClick={() => { setImagePreview(null); setFormData((prev:any) => ({ ...prev, mainImage: null })) }}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg ml-2 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                      {uploading ? <Loader2 className="w-8 h-8 animate-spin text-purple-400" /> : <Upload className="w-8 h-8 text-white/10" />}
                      <span className="text-[10px] mt-2 font-bold uppercase tracking-widest text-white/20">Click to upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40">Custom URL Slug</label>
                <input 
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev:any) => ({ ...prev, slug: slugify(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 focus:outline-none"
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40">Publish Date</label>
                <input 
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData((prev:any) => ({ ...prev, publishedAt: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 focus:outline-none"
                />
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40">Categories</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {categories.map(cat => (
                    <button 
                      key={cat._id}
                      type="button"
                      onClick={() => toggleCategory(cat._id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${formData.categories.includes(cat._id) ? 'bg-purple-500/10 border-purple-500/40 text-purple-300' : 'bg-white/3 border-white/5 text-white/40 hover:border-white/20'}`}
                    >
                      <span className="text-xs font-semibold">{cat.title}</span>
                      {formData.categories.includes(cat._id) && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full shadow-sm shadow-purple-500/50" />}
                    </button>
                  ))}
                  {categories.length === 0 && <p className="text-[10px] italic text-white/20">No categories created yet.</p>}
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40">Brief Excerpt</label>
                <textarea 
                  rows={4}
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev:any) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Sum it up in a sentence or two..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white/60 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  )
}
