process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testSearchViews() {
  const url = 'https://bdpost.gov.bd/views/search?search=' + encodeURIComponent('ময়মনসিংহ পোস্ট কোড');
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('Length:', html.length);
  
  // Find search results or links
  const links = [...html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  console.log('Links found in search:', links.length);
  links.forEach(l => {
    const text = l[2].replace(/<[^>]+>/g, '').trim();
    if (l[1].includes('static-pages') || text.includes('ময়মনসিংহ') || text.includes('পোস্ট')) {
      console.log(`${text} -> ${l[1]}`);
    }
  });
}

testSearchViews();
