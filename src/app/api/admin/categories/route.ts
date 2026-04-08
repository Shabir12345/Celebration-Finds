import { NextRequest, NextResponse } from 'next/server'
import { adminSanityClient } from '@/lib/admin-sanity'

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json()
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const doc = await adminSanityClient.create({
      _type: 'category',
      name,
      slug: { _type: 'slug', current: slug },
      description: description || '',
    })

    return NextResponse.json({ success: true, id: doc._id })
  } catch (err: any) {
    console.error('Category create error:', err)
    return NextResponse.json({ error: 'Failed to create category', details: err.message || 'Unknown error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, name, description } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const patch: Record<string, unknown> = {}
    if (name !== undefined) {
      patch.name = name
      patch.slug = { _type: 'slug', current: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
    }
    if (description !== undefined) patch.description = description

    await adminSanityClient.patch(id).set(patch).commit()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Category update error:', err)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await adminSanityClient.delete(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Category delete error:', err)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
