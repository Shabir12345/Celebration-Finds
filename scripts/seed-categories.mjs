import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vae4tg27',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-24',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

console.log('Token length:', process.env.SANITY_API_WRITE_TOKEN?.length)

const categories = [
  { name: 'Wedding', description: 'Gifts and favors for the perfect wedding celebration.' },
  { name: 'Baby Shower', description: 'Sweet and thoughtful gifts for new arrivals.' },
  { name: 'Bridal Shower', description: 'Elegant gifts for the bride-to-be.' },
  { name: 'Birthdays', description: 'Make every birthday special with personalized finds.' },
  { name: 'Corporate Events', description: 'Professional gifts for clients and team members.' },
  { name: 'Anniversaries', description: 'Celebrate milestones and lasting love.' },
]

async function seed() {
  console.log('🌱 Seeding categories...')
  
  for (const cat of categories) {
    const slug = cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    try {
      const doc = {
        _type: 'category',
        name: cat.name,
        slug: { _type: 'slug', current: slug },
        description: cat.description,
      }
      
      const created = await client.create(doc)
      console.log(`✅ Created category: ${created.name}`)
    } catch (err) {
      console.error(`❌ Failed to create ${cat.name}:`, err.message)
    }
  }
  
  console.log('✨ Seeding complete!')
}

seed()
