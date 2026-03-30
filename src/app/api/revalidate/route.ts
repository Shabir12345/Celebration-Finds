import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * This API is called by Sanity when content changes.
 * It clears the Next.js cache so the frontend updates instantly.
 * 
 * You need to add this URL in Sanity Manage:
 * https://your-domain.com/api/revalidate?secret=YOUR_REVALIDATE_TOKEN
 */

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')

    // Optional: add a secret token to .env to prevent spam
    // if (secret !== process.env.REVALIDATE_SECRET) {
    //   return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    // }

    const body = await req.json()
    const type = body._type
    const slug = body.slug?.current

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath('/shop/all')
    if (slug) revalidatePath(`/shop/${slug}`)
    if (type === 'portfolioEntry') revalidatePath('/portfolio')

    console.log(`Successfully revalidated cache for: ${type} ${slug || ''}`)
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err: any) {
    console.error('Revalidation error:', err)
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
