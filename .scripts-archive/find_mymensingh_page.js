process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function searchMymensingh() {
  const url = 'https://bdpost.gov.bd/views/search?search=' + encodeURIComponent('ময়মনসিংহ');
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  
  // Find all links
  const links = [...html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const staticPages = links.filter(l => l[1].includes('static-pages'));
  console.log('Static pages found in search for ময়মনসিংহ:');
  staticPages.forEach(l => {
    const text = l[2].replace(/<[^>]+>/g, '').trim();
    console.log(`${text} -> ${l[1]}`);
  });
}

searchMymensingh();
