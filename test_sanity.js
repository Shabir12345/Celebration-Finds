const projectId = 'vae4tg27';
const dataset = 'production';
const token = 'skskFvmTTYq0e9kDpUaswODiol9vT53MmXXZPGrJC79CWf3eHEeH2CDd46oCoIIGBZkua7oCd8Y7NZdocjXOTFQX8YqBmL3LeS7lJNcQz5yMek5oMDULjnCccgM2snVtFZvEr8Ta6g0lxvCCuoGd1p0MFKrIq9VPYNGlzx1BTB9yub6rOoliH5';

const CATEGORIES = [
  { name: 'Wedding', description: 'Gifts and essentials for weddings' },
  { name: 'Baby Shower', description: 'Sweet celebrations for new arrivals' },
  { name: 'Bridal Shower', description: 'Everything for the bride-to-be' },
  { name: 'Birthdays', description: 'Custom birthday gifts and favors' }
];

async function seed() {
  const mutations = CATEGORIES.map(cat => ({
    create: {
      _type: 'category',
      name: cat.name,
      slug: { _type: 'slug', current: cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
      description: cat.description
    }
  }));

  try {
    const res = await fetch(`https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mutations })
    });

    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

seed();
