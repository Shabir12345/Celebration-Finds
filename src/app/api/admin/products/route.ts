import { NextRequest, NextResponse } from 'next/server'
import { adminSanityClient } from '@/lib/admin-sanity'

export async function POST(req: NextRequest) {
  try {
    const { name, description, categoryId, priceBase, minQuantity, isFeatured, isActive } = await req.json()

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const doc = await adminSanityClient.create({
      _type: 'product',
      name,
      slug: { _type: 'slug', current: slug },
      description: description || '',
      category: { _type: 'reference', _ref: categoryId },
      priceBase: Number(priceBase),
      minQuantity: Number(minQuantity) || 25,
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== false,
      images: [],
    })

    return NextResponse.json({ success: true, id: doc._id })
  } catch (err) {
    console.error('Product create error:', err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    // Build patch operations
    const patchSet: Record<string, unknown> = {}
    if (updates.name !== undefined)        patchSet.name = updates.name
    if (updates.description !== undefined) patchSet.description = updates.description
    if (updates.priceBase !== undefined)   patchSet.priceBase = Number(updates.priceBase)
    if (updates.minQuantity !== undefined) patchSet.minQuantity = Number(updates.minQuantity)
    if (updates.isFeatured !== undefined)  patchSet.isFeatured = Boolean(updates.isFeatured)
    if (updates.isActive !== undefined)    patchSet.isActive = Boolean(updates.isActive)
    if (updates.categoryId !== undefined)  {
      patchSet.category = { _type: 'reference', _ref: updates.categoryId }
    }

    await adminSanityClient.patch(id).set(patchSet).commit()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Product update error:', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
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
    console.error('Product delete error:', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
