process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const path = require('path');

// Helper to convert Bengali digits to English
function bnToEnDigits(str) {
  if (!str) return '';
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(str).replace(/[০-৯]/g, d => bn.indexOf(d));
}

function enToBnDigits(str) {
  if (!str) return '';
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(str).replace(/[0-9]/g, d => bn[parseInt(d, 10)]);
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (res.ok) {
        return { ok: true, status: res.status, html: await res.text() };
      }
      if (res.status === 404) {
        return { ok: false, status: 404, error: 'HTTP 404 Not Found' };
      }
      console.warn(`[Retry ${i + 1}/${retries}] HTTP ${res.status} for ${url}`);
    } catch (err) {
      console.warn(`[Retry ${i + 1}/${retries}] Fetch failed for ${url}: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 1000 * (i + 1)));
  }
  return { ok: false, status: 500, error: `Failed after ${retries} attempts` };
}

async function crawlAll() {
  const listHtml = fs.readFileSync('scripts/decoded_content.html', 'utf8');
  const regex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const rawLinks = [];
  while ((match = regex.exec(listHtml)) !== null) {
    const href = match[1].trim();
    const text = cleanText(match[2]);
    if (text) {
      rawLinks.push({ href, text });
    }
  }

  // Deduplicate by href
  const uniqueLinks = [];
  const seenUrls = new Set();
  for (const l of rawLinks) {
    if (!seenUrls.has(l.href)) {
      seenUrls.add(l.href);
      uniqueLinks.push(l);
    }
  }

  console.log(`Starting crawl of ${uniqueLinks.length} district pages...`);

  const crawledDistricts = [];
  const failedDistricts = [];
  let totalRowsExtracted = 0;
  let skippedRows = 0;

  for (let idx = 0; idx < uniqueLinks.length; idx++) {
    const item = uniqueLinks[idx];
    const districtName = item.text.replace(/\s*পোস্ট\s*কোড\s*/g, '').trim();
    console.log(`[${idx + 1}/${uniqueLinks.length}] Crawling: ${districtName} (${item.href})`);

    const res = await fetchWithRetry(item.href);
    if (!res.ok) {
      console.warn(`   -> FAILED: ${res.error} (Status: ${res.status})`);
      failedDistricts.push({
        district: districtName,
        url: item.href,
        status: res.status,
        error: res.error
      });
      continue;
    }

    const rtMatch = res.html.match(/<rt-renderer\s+encoded-content="([^"]+)"/);
    if (!rtMatch) {
      console.warn(`   -> FAILED: No rt-renderer found in page`);
      failedDistricts.push({
        district: districtName,
        url: item.href,
        status: res.status,
        error: 'No rt-renderer encoded content'
      });
      continue;
    }

    const decoded = Buffer.from(rtMatch[1], 'base64').toString('utf8');

    // Extract district title from decoded HTML if present
    const pTitleMatch = decoded.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const districtTitleInContent = pTitleMatch ? cleanText(pTitleMatch[1]) : '';

    // Extract table rows
    const trMatches = [...decoded.matchAll(/<tr[\s\S]*?<\/tr>/gi)];
    if (trMatches.length === 0) {
      console.warn(`   -> No <tr> rows found for ${districtName}`);
      continue;
    }

    const rows = [];
    let colIndexMap = {
      sl: -1,
      upazila: -1,
      postOfficeEn: -1,
      postOfficeBn: -1,
      postCode: -1
    };

    // Find header row first
    for (let rIdx = 0; rIdx < Math.min(5, trMatches.length); rIdx++) {
      const tr = trMatches[rIdx][0];
      const cells = [...tr.matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map(c => cleanText(c[1]));
      const joined = cells.join(' ').toLowerCase();

      if (joined.includes('upazila') || joined.includes('post office') || joined.includes('পোস্ট কোড') || joined.includes('sl')) {
        cells.forEach((col, cIdx) => {
          const lower = col.toLowerCase();
          if (lower.includes('sl') || lower.includes('ক্রমিক')) colIndexMap.sl = cIdx;
          else if (lower.includes('upazila') || lower.includes('উপজেলা') || lower.includes('থানা')) colIndexMap.upazila = cIdx;
          else if (lower.includes('english') || (lower.includes('post office') && !lower.includes('বাংলা'))) colIndexMap.postOfficeEn = cIdx;
          else if (lower.includes('বাংলা') || lower.includes('post office (বাংলা)')) colIndexMap.postOfficeBn = cIdx;
          else if (lower.includes('code') || lower.includes('কোড')) colIndexMap.postCode = cIdx;
        });
        break;
      }
    }

    // Default fallback if headers were not detected
    if (colIndexMap.upazila === -1) colIndexMap.upazila = 1;
    if (colIndexMap.postOfficeEn === -1) colIndexMap.postOfficeEn = 2;
    if (colIndexMap.postOfficeBn === -1) colIndexMap.postOfficeBn = 3;
    if (colIndexMap.postCode === -1) colIndexMap.postCode = 4;

    for (let rIdx = 0; rIdx < trMatches.length; rIdx++) {
      const tr = trMatches[rIdx][0];
      const cells = [...tr.matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map(c => cleanText(c[1]));

      if (cells.length === 0) continue;

      // Skip header row
      const joined = cells.join(' ').toLowerCase();
      if (joined.includes('upazila') || joined.includes('post office') || joined.includes('পোস্ট কোড') || joined.includes('sl. no')) {
        continue;
      }

      const slNo = colIndexMap.sl !== -1 ? (cells[colIndexMap.sl] || '') : '';
      const upazila = cells[colIndexMap.upazila] || '';
      const postOfficeEn = cells[colIndexMap.postOfficeEn] || '';
      const postOfficeBn = cells[colIndexMap.postOfficeBn] || '';
      const rawPostCode = cells[colIndexMap.postCode] || '';
      const digitsOnly = bnToEnDigits(rawPostCode).replace(/[^0-9]/g, '');

      // If everything empty, skip
      if (!upazila && !postOfficeEn && !postOfficeBn && !digitsOnly) {
        skippedRows++;
        continue;
      }

      rows.push({
        district: districtName,
        districtTitleInContent,
        slNo,
        upazila,
        postOfficeEn,
        postOfficeBn,
        rawPostCode,
        postCodeEn: digitsOnly,
        postCodeBn: digitsOnly ? enToBnDigits(digitsOnly) : '',
        sourceUrl: item.href
      });
      totalRowsExtracted++;
    }

    crawledDistricts.push({
      district: districtName,
      url: item.href,
      rowCount: rows.length,
      rows
    });

    console.log(`   -> Extracted ${rows.length} rows`);
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n================ CRAWL COMPLETE ================`);
  console.log(`Successfully crawled districts: ${crawledDistricts.length}`);
  console.log(`Failed districts: ${failedDistricts.length}`);
  if (failedDistricts.length > 0) {
    console.log(`Failed list:`, failedDistricts);
  }
  console.log(`Total post office rows extracted: ${totalRowsExtracted}`);
  console.log(`Skipped empty rows: ${skippedRows}`);

  // Flatten all rows
  const allRecords = crawledDistricts.flatMap(d => d.rows);

  // Save to src/data/bdpost_pmgkhulna_all.json
  const outPath = path.resolve('src/data/bdpost_pmgkhulna_all.json');
  fs.writeFileSync(outPath, JSON.stringify({
    metadata: {
      sourceUrl: 'https://pmgkhulna.bdpost.gov.bd/pages/static-pages/6922dc0b933eb65569e0e1e5',
      crawledAt: new Date().toISOString(),
      totalDistrictLinksCrawled: crawledDistricts.length,
      failedDistricts,
      totalPostOfficesExtracted: allRecords.length
    },
    districts: crawledDistricts,
    records: allRecords
  }, null, 2), 'utf8');

  console.log(`Successfully saved data to: ${outPath}`);
}

crawlAll().catch(err => {
  console.error('Crawler failed:', err);
  process.exit(1);
});
