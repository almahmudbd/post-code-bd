process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testSearch() {
  // Let's test search endpoint
  const urls = [
    'https://bdpost.gov.bd/api/search?q=ময়মনসিংহ',
    'https://bdpost.gov.bd/pages/search?key=ময়মনসিংহ',
    'https://bdpost.gov.bd/search?key=ময়মনসিংহ',
    'https://pmgkhulna.bdpost.gov.bd/search?key=ময়মনসিংহ'
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(u, res.status);
      if (res.ok) {
        const text = await res.text();
        console.log('Response length:', text.length);
        console.log(text.substring(0, 500));
      }
    } catch (e) {
      console.log(u, 'error:', e.message);
    }
  }
}

testSearch();
