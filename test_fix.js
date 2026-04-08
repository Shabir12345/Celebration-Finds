const projectId = 'vae4tg27';
const dataset = 'production';
const originalToken = 'skskFvmTTYq0e9kDpUaswODiol9vT53MmXXZPGrJC79CWf3eHEeH2CDd46oCoIIGBZkua7oCd8Y7NZdocjXOTFQX8YqBmL3LeS7lJNcQz5yMek5oMDULjnCccgM2snVtFZvEr8Ta6g0lxvCCuoGd1p0MFKrIq9VPYNGlzx1BTB9yub6rOoliH5';

async function test(token) {
  const mutations = [{
    create: {
      _type: 'category',
      name: 'Test-' + Date.now(),
      slug: { _type: 'slug', current: 'test-' + Date.now() }
    }
  }];

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
    console.log(`Token ${token.slice(0, 10)}... Result:`, data.statusCode || 'OK');
    return data.statusCode === undefined; // OK
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function run() {
  console.log('Original Token:', await test(originalToken));
  
  if (originalToken.startsWith('sksk')) {
    console.log('Stripped sk Token:', await test(originalToken.slice(2)));
  }
}

run();
