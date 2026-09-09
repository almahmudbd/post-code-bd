process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function probeIds() {
  const prefix = '6922dd2d933eb65569e13d';
  const hexChars = '0123456789abcdef';
  const valid = [];

  for (let i = 0; i < 256; i++) {
    const hex = i.toString(16).padStart(2, '0');
    const id = prefix + hex;
    const url = `https://bdpost.gov.bd/pages/static-pages/${id}`;
    
    // fetch with short timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    try {
      const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
      clearTimeout(timeout);
      if (res.status === 200) {
        const text = await res.text();
        const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : '';
        console.log(`FOUND 200: ${id} -> ${title}`);
        valid.push({ id, title });
      }
    } catch (e) {
      clearTimeout(timeout);
    }
  }
  console.log('Finished probing. Found:', valid.length);
}

probeIds();
