process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testFetch() {
  const url = 'https://bdpost.gov.bd/pages/static-pages/6922dc7d933eb65569e10a5f';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('HTML length:', html.length);
    
    // Check rt-renderer
    const match = html.match(/<rt-renderer\s+encoded-content="([^"]+)"/);
    if (match) {
      const decoded = Buffer.from(match[1], 'base64').toString('utf8');
      console.log('Decoded length:', decoded.length);
      console.log('Decoded snippet:\n', decoded.substring(0, 1500));
    } else {
      console.log('No rt-renderer found. Checking tables in HTML...');
      const tableMatch = html.match(/<table[\s\S]*?<\/table>/i);
      console.log('Table found?', !!tableMatch);
    }
  } catch (err) {
    console.error('Fetch error:', err.message, err.cause);
  }
}

testFetch();
