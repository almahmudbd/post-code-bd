process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');

async function testAllUrls() {
  const content = fs.readFileSync('scripts/decoded_content.html', 'utf8');
  const regex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const list = [];
  while ((match = regex.exec(content)) !== null) {
    const href = match[1].trim();
    const name = match[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s*পোস্ট\s*কোড\s*/g, '').trim();
    if (name) {
      list.push({ href, name });
    }
  }

  // Deduplicate
  const unique = [];
  const seen = new Set();
  for (const item of list) {
    if (!seen.has(item.href)) {
      seen.add(item.href);
      unique.push(item);
    }
  }

  console.log(`Checking ${unique.length} URLs...`);
  const broken = [];
  const ok = [];

  for (let i = 0; i < unique.length; i++) {
    const item = unique[i];
    try {
      const res = await fetch(item.href, {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (res.ok) {
        ok.push({ ...item, status: res.status });
      } else {
        broken.push({ ...item, status: res.status });
        console.log(`[BROKEN] ${item.name}: ${item.href} -> ${res.status}`);
      }
    } catch (e) {
      broken.push({ ...item, error: e.message });
      console.log(`[ERR] ${item.name}: ${item.href} -> ${e.message}`);
    }
    // Small delay
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`OK: ${ok.length}, Broken: ${broken.length}`);
  fs.writeFileSync('scripts/url_check_result.json', JSON.stringify({ ok, broken }, null, 2));
}

testAllUrls();
