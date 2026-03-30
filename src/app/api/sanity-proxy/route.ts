import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 })

    const data = await client.fetch(query)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Sanity Proxy Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
