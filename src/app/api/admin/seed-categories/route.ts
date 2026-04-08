import { NextRequest, NextResponse } from 'next/server'
import { adminSanityClient } from '@/lib/admin-sanity'

const CATEGORIES = [
  { name: 'Wedding', description: 'Gifts and essentials for weddings' },
  { name: 'Baby Shower', description: 'Sweet celebrations for new arrivals' },
  { name: 'Bridal Shower', description: 'Everything for the bride-to-be' },
  { name: 'Birthdays', description: 'Custom birthday gifts and favors' },
  { name: 'Corporate Events', description: 'Professional gifts for businesses' },
  { name: 'Custom Gifts', description: 'Tailor-made gifts for any occasion' }
]

export async function POST() {
  try {
    const results = []
    for (const cat of CATEGORIES) {
      const slug = cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      
      // Check if exists
      const existing = await adminSanityClient.fetch(`*[_type == "category" && name == $name][0]`, { name: cat.name })
      
      if (!existing) {
        const doc = await adminSanityClient.create({
          _type: 'category',
          name: cat.name,
          slug: { _type: 'slug', current: slug },
          description: cat.description,
        })
        results.push({ name: cat.name, status: 'created', id: doc._id })
      } else {
        results.push({ name: cat.name, status: 'already-exists', id: existing._id })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (err: any) {
    console.error('Seed error:', err)
    return NextResponse.json({ 
      error: 'Failed to seed categories', 
      details: err.message || 'Unknown error',
      tokenPresent: !!process.env.SANITY_API_WRITE_TOKEN,
      tokenLength: process.env.SANITY_API_WRITE_TOKEN?.length
    }, { status: 500 })
  }
}
