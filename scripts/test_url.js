process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function test() {
  const url1 = 'https://bdpost.gov.bd/pages/static-pages/6922dd2d933eb65569e13d1e';
  const url2 = 'https://pmgkhulna.bdpost.gov.bd/pages/static-pages/6922dd2d933eb65569e13d1e';
  
  for (const u of [url1, url2]) {
    try {
      const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(u, '-> Status:', res.status);
    } catch (e) {
      console.log(u, '-> Error:', e.message);
    }
  }
}
test();
