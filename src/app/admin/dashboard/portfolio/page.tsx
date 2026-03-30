'use client'

import { useEffect, useState } from 'react'
import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'

interface PortfolioEntry {
  _id: string
  title: string
  slug: { current: string }
  eventDate: string
  location: string
  images: any[]
  isFeatured: boolean
}

export default function PortfolioAdminPage() {
  const [entries, setEntries] = useState<PortfolioEntry[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchEntries() {
    setLoading(true)
    try {
      const query = groq`*[_type == "portfolioEntry"] {
        _id, title, slug, eventDate, location, images, isFeatured
      } | order(eventDate desc)`;
      const res = await fetch('/api/sanity-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setEntries(data)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEntries() }, [])

  return (
    <div className="portfolio-admin">
      <div className="page-header">
        <div>
          <h2 className="page-h2">Lookbook Management</h2>
          <p className="page-sub">Manage your event portfolio and featured lookbook entries.</p>
        </div>
        <a href="/admin/studio" target="_blank" className="btn-primary">＋ New Entry (Studio)</a>
      </div>

      {loading ? (
        <div className="grid-loading">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="empty-state">
           <div className="empty-icon">✦</div>
           <p className="empty-text">No portfolio entries yet.</p>
        </div>
      ) : (
        <div className="entry-grid">
          {entries.map(entry => (
            <div key={entry._id} className="entry-card">
              <div className="entry-img-wrap">
                {entry.images?.[0] ? (
                  <Image 
                    src={urlFor(entry.images[0]).width(400).height(250).url()} 
                    alt={entry.title}
                    fill
                    className="entry-img"
                  />
                ) : (
                  <div className="img-placeholder">No Image</div>
                )}
                {entry.isFeatured && <span className="featured-badge">Featured</span>}
              </div>
              <div className="entry-content">
                <h3 className="entry-title">{entry.title}</h3>
                <p className="entry-meta">{entry.location} • {entry.eventDate}</p>
                <div className="entry-actions">
                  <a href={`/admin/studio/desk/portfolioEntry;${entry._id}`} target="_blank" className="action-btn action-edit">Edit in Studio</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .portfolio-admin { display: flex; flex-direction: column; gap: 1.5rem; }
        .page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; }
        .page-h2 { font-size: 1.375rem; font-weight: 700; color: white; margin: 0 0 0.25rem; }
        .page-sub { font-size: 0.8125rem; color: rgba(255,255,255,0.4); margin: 0; }

        .btn-primary { 
          padding: 0.625rem 1.25rem; background: linear-gradient(135deg,#a855f7,#6366f1); 
          border: none; border-radius: 9px; color: white; font-size: 0.875rem; 
          font-weight: 600; text-decoration: none; display: inline-block;
        }

        .entry-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .entry-card { 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); 
          border-radius: 14px; overflow: hidden; transition: transform 0.2s;
        }
        .entry-card:hover { transform: translateY(-4px); border-color: rgba(168,85,247,0.3); }

        .entry-img-wrap { position: relative; width: 100%; aspect-ratio: 16/10; background: #000; }
        .entry-img { object-fit: cover; }
        .img-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; color: rgba(255,255,255,0.1); }
        
        .featured-badge {
          position: absolute; top: 0.75rem; right: 0.75rem; 
          background: rgba(168,85,247,0.9); color: white; 
          padding: 0.2rem 0.6rem; border-radius: 100px; font-size: 0.65rem; font-weight: 700;
        }

        .entry-content { padding: 1.25rem; }
        .entry-title { font-size: 1rem; font-weight: 700; color: white; margin: 0 0 0.25rem; }
        .entry-meta { font-size: 0.75rem; color: rgba(255,255,255,0.4); margin: 0 0 1rem; }

        .action-btn { 
          display: inline-block; padding: 0.4rem 0.8rem; background: rgba(168,85,247,0.1); 
          color: #c084fc; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-decoration: none;
        }

        .grid-loading { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .skeleton-card { height: 280px; background: rgba(255,255,255,0.05); border-radius: 14px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 0.8; } 100% { opacity: 0.5; } }
      `}</style>
    </div>
  )
}
