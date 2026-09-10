const fs = require('fs');

// Transliterate Bengali to Latin simplified phonetics
function bnToLatin(str) {
  if (!str) return '';
  
  // Basic character replacements
  const map = {
    'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u', 'ঋ': 'ri',
    'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
    'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ৃ': 'ri',
    'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
    'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
    'চ': 'ch', 'ছ': 'ch', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
    'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
    'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
    'প': 'p', 'ফ': 'f', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
    'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's', 'হ': 'h',
    'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y', 'ৎ': 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': '',
    '্': ''
  };

  let out = '';
  for (const ch of str) {
    out += map[ch] !== undefined ? map[ch] : ch;
  }
  return out.toLowerCase();
}

function normalizePhonetic(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/ph/g, 'f')
    .replace(/v/g, 'b')
    .replace(/w/g, 'u')
    .replace(/oo/g, 'u')
    .replace(/ee/g, 'i')
    .replace(/y/g, 'i')
    .replace(/sh/g, 's')
    .replace(/ch/g, 'c')
    .replace(/kh/g, 'k')
    .replace(/gh/g, 'g')
    .replace(/th/g, 't')
    .replace(/dh/g, 'd')
    .replace(/bh/g, 'b')
    .replace(/rh/g, 'r')
    .replace(/z/g, 'j')
    .replace(/q/g, 'k')
    .replace(/c/g, 'k')
    .replace(/x/g, 'ks')
    .replace(/(.)\1+/g, '$1') // remove double consonants
    .replace(/[^a-z0-9]/g, '');
}

// Load datasets
const postcodesContent = fs.readFileSync('src/data/postcodes-data.js', 'utf8');
const mainData = JSON.parse(postcodesContent.replace(/^[\s\S]*?window\.BD_POSTCODE_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

const branchContent = fs.readFileSync('src/data/branch-offices-data.js', 'utf8');
const branchData = JSON.parse(branchContent.replace(/^[\s\S]*?window\.BD_BRANCH_OFFICES_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

const mainList = [];
mainData.districts.forEach(d => {
  d.postOffices.forEach(po => {
    mainList.push({
      ...po,
      districtEn: d.districtEn,
      districtBn: d.districtBn,
      latinName: bnToLatin(po.postOfficeBn),
      phonetic: normalizePhonetic(bnToLatin(po.postOfficeBn))
    });
  });
});

console.log('Sample main latin/phonetic:');
mainList.slice(0, 10).forEach(m => {
  console.log(`${m.postOfficeBn} -> latin: "${m.latinName}", phonetic: "${m.phonetic}"`);
});

// Now match branch offices
const confidentMatches = [];
const possibleMatches = [];
const nonMatches = [];

branchData.branchOffices.forEach(b => {
  const bEn = b.postOfficeEn.replace(/\s*(edbo|b\.o|sub office|branch office|tso|ho|so)\s*/gi, '').trim();
  const bPhonetic = normalizePhonetic(bEn);
  
  // Find in same district
  const districtMains = mainList.filter(m => m.districtEn.toLowerCase() === b.districtEn.toLowerCase());
  
  let match = null;
  let matchType = '';
  
  for (const m of districtMains) {
    const mPhonetic = m.phonetic;
    
    // Check exact phonetic match
    if (bPhonetic === mPhonetic && bPhonetic.length >= 3) {
      match = m;
      matchType = 'exact_phonetic';
      break;
    }
    
    // Check if one contains the other
    if (bPhonetic.length >= 4 && mPhonetic.length >= 4) {
      if (bPhonetic.includes(mPhonetic) || mPhonetic.includes(bPhonetic)) {
        // Check if thana also matches
        if (m.thanaBn === b.thanaBn || (b.thanaEn && m.thanaBn && normalizePhonetic(b.thanaEn) === normalizePhonetic(bnToLatin(m.thanaBn)))) {
          match = m;
          matchType = 'substring_phonetic_same_thana';
          break;
        }
      }
    }
  }
  
  if (match) {
    confidentMatches.push({
      branchId: b.id,
      branchEn: b.postOfficeEn,
      branchThana: b.thanaBn + ' (' + b.thanaEn + ')',
      district: b.districtEn,
      matchedMainBn: match.postOfficeBn,
      matchedMainThana: match.thanaBn,
      postCode: match.postCodeEn,
      matchType
    });
  } else {
    nonMatches.push(b);
  }
});

console.log(`\nResults:`);
console.log(`- Confident duplicates found: ${confidentMatches.length}`);
console.log(`- Remaining non-matches: ${nonMatches.length}`);

console.log('\nSample confident duplicates (first 25):');
confidentMatches.slice(0, 25).forEach((m, idx) => {
  console.log(`${idx + 1}. [${m.district}] Branch: "${m.branchEn}" (${m.branchThana}) <==> Main: "${m.matchedMainBn}" (${m.matchedMainThana}) [Code: ${m.postCode}]`);
});

fs.writeFileSync('.scripts-archive/confident_duplicates.json', JSON.stringify(confidentMatches, null, 2), 'utf8');
