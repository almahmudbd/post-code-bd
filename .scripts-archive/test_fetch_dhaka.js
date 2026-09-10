fetch('https://bdpost.gov.bd/pages/static-pages/6922dc7d933eb65569e10a5f', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}).then(r => r.text()).then(html => {
  console.log('Fetched length:', html.length);
  const match = html.match(/<rt-renderer\s+encoded-content="([^"]+)"/);
  if (match) {
    const decoded = Buffer.from(match[1], 'base64').toString('utf8');
    console.log('Decoded length:', decoded.length);
    // Find 'Ati'
    const atiIdx = decoded.indexOf('Ati');
    if (atiIdx !== -1) {
      console.log('Context around Ati:\n', decoded.slice(Math.max(0, atiIdx - 200), atiIdx + 400));
    }
    // Also check first table rows
    const firstRows = decoded.match(/<tr[\s\S]*?<\/tr>/gi);
    if (firstRows) {
      console.log('\nTotal rows found:', firstRows.length);
      console.log('Header/first 5 rows:');
      firstRows.slice(0, 5).forEach((r, i) => console.log(`Row ${i}: ${r}`));
    }
  } else {
    console.log('No rt-renderer found. Head:', html.slice(0, 300));
  }
}).catch(err => console.error('Fetch error:', err.message));
