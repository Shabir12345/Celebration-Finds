'use client'

import { useState, useEffect } from 'react'
import { client, urlFor } from '@/lib/sanity'
import { groq } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Tag, BookOpen, ChevronRight, Search } from 'lucide-react'
import { deleteBlogPost, deleteBlogCategory } from '@/lib/actions/blog'

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  mainImage: any
  publishedAt: string
  categories: { title: string }[]
}

interface BlogCategory {
  _id: string
  title: string
  slug: { current: string }
  description: string
  postCount: number
}

export default function BlogAdminPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  async function fetchData() {
    setLoading(true)
    try {
      const postsQuery = groq`*[_type == "blogPost"] {
        _id, title, slug, mainImage, publishedAt,
        "categories": categories[]->{title}
      } | order(publishedAt desc)`
      
      const categoriesQuery = groq`*[_type == "blogCategory"] {
        _id, title, slug, description,
        "postCount": count(*[_type == "blogPost" && references(^._id)])
      } | order(title asc)`

      const [postsData, categoriesData] = await Promise.all([
        client.fetch(postsQuery),
        client.fetch(categoriesQuery)
      ])

      setPosts(postsData)
      setCategories(categoriesData)
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const res = await deleteBlogPost(id)
      if (res.success) fetchData()
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? This might affect posts assigned to it.')) {
      const res = await deleteBlogCategory(id)
      if (res.success) fetchData()
    }
  }

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCategories = categories.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="blog-admin text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1">Blog Management</h2>
          <p className="text-white/40 text-sm">Create and manage your articles and categories.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500/50 w-full md:w-64"
            />
          </div>
          <Link 
            href={activeTab === 'posts' ? '/admin/dashboard/blog/new' : '/admin/dashboard/blog/categories/new'} 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New {activeTab === 'posts' ? 'Post' : 'Category'}
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button 
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'posts' ? 'text-purple-400' : 'text-white/40 hover:text-white/60'}`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Posts ({posts.length})
          </div>
          {activeTab === 'posts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'categories' ? 'text-purple-400' : 'text-white/40 hover:text-white/60'}`}
        >
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Categories ({categories.length})
          </div>
          {activeTab === 'categories' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-white/5 animate-pulse rounded-xl border border-white/10" />
          ))}
        </div>
      ) : activeTab === 'posts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <div key={post._id} className="group bg-white/3 border border-white/7 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all flex flex-col">
              <div className="relative aspect-video bg-black">
                {post.mainImage ? (
                  <Image 
                    src={urlFor(post.mainImage).width(600).height(400).url()} 
                    alt={post.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/10 italic">No image</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex flex-wrap gap-1">
                    {post.categories?.map((cat, i) => (
                      <span key={i} className="text-[10px] uppercase tracking-wider font-bold bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                        {cat.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-1 line-clamp-2">{post.title}</h3>
                <p className="text-white/30 text-xs mb-4">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                  <Link 
                    href={`/admin/dashboard/blog/edit/${post._id}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transform transition-transform active:scale-95"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Post
                  </Link>
                  <button 
                    onClick={() => handleDeletePost(post._id)}
                    className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredPosts.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
              <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/40">No posts found.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(cat => (
            <div key={cat._id} className="bg-white/3 border border-white/7 rounded-xl p-5 hover:border-indigo-500/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
                  <Tag className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="block text-lg font-bold">{cat.postCount}</span>
                  <span className="block text-[10px] text-white/30 uppercase font-bold tracking-wider">Articles</span>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">{cat.title}</h3>
              <p className="text-white/40 text-sm mb-6 line-clamp-2">{cat.description || 'No description provided.'}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <Link 
                  href={`/admin/dashboard/blog/categories/edit/${cat._id}`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Category
                </Link>
                <button 
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
              <Tag className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/40">No categories found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
