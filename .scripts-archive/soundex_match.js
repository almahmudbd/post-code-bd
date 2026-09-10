const fs = require('fs');

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
      districtBn: d.districtBn
    });
  });
});

// Soundex-like consonant skeleton:
// Map similar sounding consonants together:
// b, v, p, f -> 1
// c, g, j, k, q, s, x, z -> 2
// d, t, th, dh -> 3
// l -> 4
// m, n -> 5
// r, rh, d_dot -> 6
function soundex(str) {
  if (!str) return '';
  let s = str.toLowerCase()
    .replace(/\s*(edbo|edso|so|tso|ho|b\.o|sub office|branch office|টিএসও|এইচও|মডেল টাউন)\s*/gi, '')
    .replace(/[^a-z0-9]/g, '');
  
  // replace vowels
  s = s.replace(/[aeiouwyh]/g, '');
  
  // map consonants
  const map = {
    'b': '1', 'p': '1', 'f': '1', 'v': '1',
    'c': '2', 'g': '2', 'j': '2', 'k': '2', 'q': '2', 's': '2', 'x': '2', 'z': '2',
    'd': '3', 't': '3',
    'l': '4',
    'm': '5', 'n': '5',
    'r': '6'
  };
  
  let code = '';
  for (const char of s) {
    code += map[char] || char;
  }
  // dedupe consecutive identical numbers
  return code.replace(/(.)\1+/g, '$1');
}

// Bengali soundex
function bnSoundex(str) {
  if (!str) return '';
  const map = {
    'প': '1', 'ফ': '1', 'ব': '1', 'ভ': '1',
    'ক': '2', 'খ': '2', 'গ': '2', 'ঘ': '2', 'চ': '2', 'ছ': '2', 'জ': '2', 'ঝ': '2', 'শ': '2', 'ষ': '2', 'স': '2',
    'ট': '3', 'ঠ': '3', 'ড': '3', 'ঢ': '3', 'ত': '3', 'থ': '3', 'দ': '3', 'ধ': '3', 'ৎ': '3',
    'ল': '4',
    'ম': '5', 'ন': '5', 'ণ': '5', 'ঙ': '5', 'ঞ': '5', 'ং': '5',
    'র': '6', 'ড়': '6', 'ঢ়': '6'
  };
  let code = '';
  for (const char of str) {
    if (map[char]) code += map[char];
  }
  return code.replace(/(.)\1+/g, '$1');
}

const allMatches = [];
branchData.branchOffices.forEach(b => {
  const bCode = soundex(b.postOfficeEn);
  if (!bCode || bCode.length < 2) return;

  const districtMains = mainList.filter(m => m.districtEn.toLowerCase() === b.districtEn.toLowerCase());
  for (const m of districtMains) {
    const mCode = bnSoundex(m.postOfficeBn);
    if (mCode === bCode) {
      allMatches.push({
        district: b.districtEn,
        branchId: b.id,
        branchEn: b.postOfficeEn,
        branchThana: b.thanaBn,
        mainBn: m.postOfficeBn,
        mainThana: m.thanaBn,
        postCode: m.postCodeEn,
        bCode,
        mCode
      });
      break;
    }
  }
});

console.log(`Soundex matches found: ${allMatches.length}`);
allMatches.forEach((m, idx) => {
  console.log(`${idx + 1}. [${m.district}] Branch: "${m.branchEn}" (${m.branchThana}) <=> Main: "${m.mainBn}" (${m.mainThana}) [${m.postCode}]`);
});

fs.writeFileSync('.scripts-archive/soundex_matches.json', JSON.stringify(allMatches, null, 2), 'utf8');
