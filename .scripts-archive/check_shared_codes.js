const fs = require('fs');

const pmg = JSON.parse(fs.readFileSync('src/data/bdpost_pmgkhulna_all.json', 'utf8'));
const local = JSON.parse(fs.readFileSync('src/data/postcodes.json', 'utf8'));

// Build map of existing codes and office names in local
const localCodeMap = new Map();
local.districts.forEach(d => {
  d.postOffices.forEach(p => {
    if (!localCodeMap.has(p.postCodeEn)) {
      localCodeMap.set(p.postCodeEn, []);
    }
    localCodeMap.get(p.postCodeEn).push(p);
  });
});

console.log('Unique codes in local:', localCodeMap.size);

// Check BD Post rows with post code
const pmgWithCode = pmg.records.filter(r => r.postCodeEn);
console.log('BD Post rows with code:', pmgWithCode.length);

let newCodeCount = 0;
let existingCodeDifferentOffice = [];

pmgWithCode.forEach(r => {
  const code = r.postCodeEn;
  if (!localCodeMap.has(code)) {
    newCodeCount++;
  } else {
    const existing = localCodeMap.get(code);
    // Check if office name matches
    const enName = r.postOfficeEn.toLowerCase().replace(/\s*(so|edso|ho|gpo|tso|upo|edbo)\s*/gi, '').trim();
    // Compare
    // console.log(`Code ${code} exists in local (${existing.map(e => e.postOfficeBn).join(', ')}), BD Post says: ${r.postOfficeEn}`);
  }
});

console.log('New codes not in local:', newCodeCount);
