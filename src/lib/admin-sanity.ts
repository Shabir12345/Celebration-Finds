import { createClient } from 'next-sanity'

// Server-only client with write token — never expose this on the client
export const adminSanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vae4tg27',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-24',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})
