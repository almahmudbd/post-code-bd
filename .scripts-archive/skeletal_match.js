const fs = require('fs');

// Improve Bengali to English transliteration
function banglaToLatin(str) {
  if (!str) return '';
  const consonants = {
    'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
    'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
    'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
    'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
    'প': 'p', 'ফ': 'f', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
    'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's', 'হ': 'h',
    'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y', 'ৎ': 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': ''
  };
  const vowels = {
    'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u', 'ঋ': 'ri',
    'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou'
  };
  const kar = {
    'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ৃ': 'ri',
    'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou'
  };

  let res = '';
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    const next = str[i + 1];
    if (vowels[c]) {
      res += vowels[c];
    } else if (kar[c]) {
      res += kar[c];
    } else if (consonants[c]) {
      res += consonants[c];
      // if next is not a kar, hasant or vowel, insert 'a' or 'o'
      if (next && consonants[next]) {
        res += 'a';
      }
    } else if (c === '্') {
      // hasant removes inherent vowel
    } else if (/\s/.test(c)) {
      res += ' ';
    }
  }
  return res.toLowerCase();
}

function normalizeKey(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/\s*(edbo|b\.o|sub office|branch office|tso|ho|so|টিএসও|এইচও|মডেল টাউন)\s*/gi, '')
    .replace(/ph/g, 'f').replace(/v/g, 'b').replace(/w/g, 'u')
    .replace(/oo/g, 'u').replace(/ee/g, 'i').replace(/y/g, 'i')
    .replace(/sh/g, 's').replace(/ch/g, 'c').replace(/kh/g, 'k')
    .replace(/gh/g, 'g').replace(/th/g, 't').replace(/dh/g, 'd')
    .replace(/bh/g, 'b').replace(/rh/g, 'r').replace(/z/g, 'j')
    .replace(/q/g, 'k').replace(/c/g, 'k')
    .replace(/[aeiou]/g, '') // remove vowels for consonant skeletal matching!
    .replace(/[^a-z0-9]/g, '');
}

// Test with Dhaka
const postcodesContent = fs.readFileSync('src/data/postcodes-data.js', 'utf8');
const mainData = JSON.parse(postcodesContent.replace(/^[\s\S]*?window\.BD_POSTCODE_DATA\s*=\s*/, '').replace(/;\s*$/, ''));
const branchContent = fs.readFileSync('src/data/branch-offices-data.js', 'utf8');
const branchData = JSON.parse(branchContent.replace(/^[\s\S]*?window\.BD_BRANCH_OFFICES_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

const mainList = [];
mainData.districts.forEach(d => {
  d.postOffices.forEach(po => {
    const lat = banglaToLatin(po.postOfficeBn);
    mainList.push({
      ...po,
      districtEn: d.districtEn,
      districtBn: d.districtBn,
      latin: lat,
      key: normalizeKey(lat)
    });
  });
});

console.log('Sample skeletal keys for main:');
mainList.filter(m => m.districtEn === 'Dhaka').slice(0, 15).forEach(m => {
  console.log(`${m.postOfficeBn} -> latin: ${m.latin} -> key: ${m.key}`);
});

let matches = [];
branchData.branchOffices.forEach(b => {
  const bEn = b.postOfficeEn;
  const bKey = normalizeKey(bEn);
  if (!bKey || bKey.length < 2) return;

  const districtMains = mainList.filter(m => m.districtEn.toLowerCase() === b.districtEn.toLowerCase());
  for (const m of districtMains) {
    if (m.key === bKey) {
      matches.push({
        district: b.districtEn,
        branchId: b.id,
        branchEn: b.postOfficeEn,
        branchThanaBn: b.thanaBn,
        branchThanaEn: b.thanaEn,
        mainBn: m.postOfficeBn,
        mainThana: m.thanaBn,
        postCode: m.postCodeEn,
        matchType: 'skeletal_exact'
      });
      break;
    }
  }
});

console.log(`Total skeletal exact matches: ${matches.length}`);
console.log('Sample skeletal matches:');
matches.slice(0, 30).forEach((m, idx) => {
  console.log(`${idx + 1}. [${m.district}] Branch: "${m.branchEn}" (${m.branchThanaEn}) <=> Main: "${m.mainBn}" (${m.mainThana}) [${m.postCode}]`);
});
