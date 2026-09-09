process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');

async function checkBdPostHome() {
  const res = await fetch('https://bdpost.gov.bd/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  console.log('Home HTML length:', html.length);
  
  // Find all links containing static-pages or "পোস্ট কোড"
  const links = [...html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const postCodeLinks = links.filter(l => l[2].includes('পোস্ট') || l[2].includes('কোড') || l[1].includes('static-pages'));
  console.log('Found links count:', postCodeLinks.length);
  postCodeLinks.forEach(l => {
    const text = l[2].replace(/<[^>]+>/g, '').trim();
    if (text.includes('পোস্ট') || text.includes('কোড') || text.includes('ময়মনসিংহ')) {
      console.log(`${text} -> ${l[1]}`);
    }
  });
}

checkBdPostHome();
