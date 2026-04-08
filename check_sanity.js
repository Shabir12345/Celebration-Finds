async function check() {
  const projectId = 'vae4tg27';
  const dataset = 'production';
  const query = encodeURIComponent('*[_type == "category"]');
  const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/query/${dataset}?query=${query}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
check();
