const { createClient } = require('@sanity/client');

const projectId = 'vae4tg27';
const dataset = 'production';
const token = 'skskFvmTTYq0e9kDpUaswODiol9vT53MmXXZPGrJC79CWf3eHEeH2CDd46oCoIIGBZkua7oCd8Y7NZdocjXOTFQX8YqBmL3LeS7lJNcQz5yMek5oMDULjnCccgM2snVtFZvEr8Ta6g0lxvCCuoGd1p0MFKrIq9VPYNGlzx1BTB9yub6rOoliH5';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-24',
  token,
  useCdn: false,
});

const CATEGORIES = [
  { name: 'Wedding', description: 'Gifts and essentials for weddings' },
  { name: 'Baby Shower', description: 'Sweet celebrations for new arrivals' },
  { name: 'Bridal Shower', description: 'Everything for the bride-to-be' },
  { name: 'Birthdays', description: 'Custom birthday gifts and favors' },
  { name: 'Corporate Events', description: 'Professional gifts for businesses' },
  { name: 'Custom Gifts', description: 'Tailor-made gifts for any occasion' }
];

async function seed() {
  for (const cat of CATEGORIES) {
    const slug = cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    try {
      const doc = await client.create({
        _type: 'category',
        name: cat.name,
        slug: { _type: 'slug', current: slug },
        description: cat.description,
      });
      console.log(`Created: ${cat.name} (${doc._id})`);
    } catch (err) {
      console.error(`Failed: ${cat.name}`, err.message);
    }
  }
}

seed();
