import { NextRequest, NextResponse } from 'next/server'
import { adminSanityClient } from '@/lib/admin-sanity'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Upload image to Sanity
    const asset = await adminSanityClient.assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type
    })

    return NextResponse.json({ success: true, asset })
  } catch (err) {
    console.error('File upload error:', err)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
