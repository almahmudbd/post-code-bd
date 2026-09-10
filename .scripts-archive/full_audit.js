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

// Comprehensive Bengali phonetic dictionary
const banglaPhonetics = {
  // vowels
  'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u', 'ঋ': 'ri',
  'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
  'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ৃ': 'ri',
  'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
  // consonants
  'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
  'চ': 'ch', 'ছ': 'ch', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
  'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
  'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
  'প': 'p', 'ফ': 'f', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
  'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's', 'হ': 'h',
  'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y', 'ৎ': 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': ''
};

function transliterateBn(str) {
  if (!str) return '';
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (banglaPhonetics[c]) {
      out += banglaPhonetics[c];
    } else if (c === '্') {
      // hasant
    } else if (/\s/.test(c)) {
      out += ' ';
    }
  }
  return out.toLowerCase();
}

function cleanStr(s) {
  if (!s) return '';
  return s.toLowerCase()
    .replace(/\s*(edbo|edso|so|tso|ho|b\.o|sub office|branch office|টিএসও|এইচও|এসও|টি\.এস\.ও|মডেল টাউন)\s*/gi, '')
    .replace(/[^a-z0-9]/g, '');
}

// Map each main office to a clean search key
mainList.forEach(m => {
  m.translit = transliterateBn(m.postOfficeBn);
  m.cleanKey = cleanStr(m.translit);
});

// Let's audit all 858 branch offices
const matched = [];
const unmatched = [];

branchData.branchOffices.forEach(b => {
  const bClean = cleanStr(b.postOfficeEn);
  const distMains = mainList.filter(m => m.districtEn.toLowerCase() === b.districtEn.toLowerCase());
  
  let match = null;
  let matchReason = '';

  // Direct clean key match
  for (const m of distMains) {
    if (m.cleanKey === bClean && bClean.length >= 3) {
      match = m;
      matchReason = 'exact_key';
      break;
    }
  }

  // If not found, check known name mappings or substring
  if (!match) {
    for (const m of distMains) {
      // Check if one contains the other and thana matches
      if (bClean.length >= 4 && m.cleanKey.length >= 4) {
        if (bClean.includes(m.cleanKey) || m.cleanKey.includes(bClean)) {
          match = m;
          matchReason = 'substring_match';
          break;
        }
      }
    }
  }

  if (match) {
    matched.push({
      branchId: b.id,
      branchEn: b.postOfficeEn,
      branchThanaBn: b.thanaBn,
      branchThanaEn: b.thanaEn,
      district: b.districtEn,
      mainId: match.id,
      mainBn: match.postOfficeBn,
      mainThanaBn: match.thanaBn,
      postCode: match.postCodeEn,
      matchReason
    });
  } else {
    unmatched.push(b);
  }
});

console.log('Automated matched:', matched.length);
console.log('Unmatched:', unmatched.length);

fs.writeFileSync('.scripts-archive/audit_automated_matches.json', JSON.stringify(matched, null, 2), 'utf8');
