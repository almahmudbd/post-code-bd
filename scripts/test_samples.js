process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');

async function checkDistricts() {
  const listScript = fs.readFileSync('scripts/decoded_content.html', 'utf8');
  const regex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const links = [];
  while ((match = regex.exec(listScript)) !== null) {
    const href = match[1].trim();
    const text = match[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (text) {
      links.push({ href, text });
    }
  }

  // Deduplicate by href
  const uniqueLinks = [];
  const seen = new Set();
  for (const l of links) {
    if (!seen.has(l.href)) {
      seen.add(l.href);
      uniqueLinks.push(l);
    }
  }
  console.log('Total unique district URLs:', uniqueLinks.length);

  // Sample 5 districts: 0, 10, 25, 45, 60
  const sampleIndices = [0, 10, 25, 45, 60];
  for (const idx of sampleIndices) {
    const item = uniqueLinks[idx];
    console.log(`\n--- Fetching [${item.text}] ${item.href} ---`);
    try {
      const res = await fetch(item.href, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const html = await res.text();
      const rtMatch = html.match(/<rt-renderer\s+encoded-content="([^"]+)"/);
      if (rtMatch) {
        const decoded = Buffer.from(rtMatch[1], 'base64').toString('utf8');
        // Check table headers
        const trMatches = [...decoded.matchAll(/<tr[\s\S]*?<\/tr>/gi)];
        console.log(`Found ${trMatches.length} rows`);
        if (trMatches.length > 0) {
          console.log('Header row:', trMatches[0][0].replace(/<[^>]+>/g, ' | ').replace(/\s+/g, ' '));
        }
        if (trMatches.length > 1) {
          console.log('First data row:', trMatches[1][0].replace(/<[^>]+>/g, ' | ').replace(/\s+/g, ' '));
        }
      } else {
        console.log('No rt-renderer found!');
      }
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
}

checkDistricts();
