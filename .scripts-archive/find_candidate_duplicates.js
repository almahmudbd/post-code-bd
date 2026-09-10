const fs = require('fs');

// Load postcodes-data.js
const postcodesContent = fs.readFileSync('src/data/postcodes-data.js', 'utf8');
const mainData = JSON.parse(postcodesContent.replace(/^[\s\S]*?window\.BD_POSTCODE_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

// Load branch-offices-data.js
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

const branchOffices = branchData.branchOffices;

// Mapping of common Bengali to English phonetic sounds to help match
// Also let's build a transliteration function or phonetic mapping
function enToBnApprox(en) {
  // Common place name sound mappings
  let s = en.toLowerCase().trim();
  // strip prefixes/suffixes
  s = s.replace(/\s*(edbo|b\.o|sub office|branch office|tso|ho|so)\s*/gi, '').trim();
  return s;
}

// Check by district & upazila
// For each branch office, let's see which main offices exist in the same district & thana/upazila
const matches = [];
const nonMatches = [];

// Transliteration / sound mapping table or known matches
// Let's first inspect all branch offices grouped by district and upazila
const districtMap = {};
branchOffices.forEach(b => {
  const dKey = b.districtEn.toLowerCase();
  if (!districtMap[dKey]) districtMap[dKey] = [];
  districtMap[dKey].push(b);
});

console.log('Districts in branch offices:');
Object.keys(districtMap).forEach(d => {
  console.log(`- ${d}: ${districtMap[d].length} branch offices`);
});

// Let's create an in-depth comparator
// In each district and thana, let's print all branch offices and all main offices
let potentialOverlapCount = 0;
const detailedList = [];

for (const [distKey, branches] of Object.entries(districtMap)) {
  const mainsInDist = mainList.filter(m => m.districtEn.toLowerCase() === distKey);
  
  branches.forEach(b => {
    // Find candidates in same district
    const cand = mainsInDist.filter(m => {
      // Check if thana matches
      const sameThana = (m.thanaBn && b.thanaBn && (m.thanaBn === b.thanaBn || m.thanaBn.includes(b.thanaBn) || b.thanaBn.includes(m.thanaBn)));
      return sameThana;
    });

    detailedList.push({
      branch: b,
      candidatesInThana: cand
    });
  });
}

console.log(`Total analyzed: ${detailedList.length}`);
fs.writeFileSync('.scripts-archive/branch_vs_main_candidates.json', JSON.stringify(detailedList, null, 2), 'utf8');
