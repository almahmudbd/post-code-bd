const fs = require('fs');

// Load postcodes-data.js
const postcodesContent = fs.readFileSync('src/data/postcodes-data.js', 'utf8');
const mainData = JSON.parse(postcodesContent.replace(/^[\s\S]*?window\.BD_POSTCODE_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

// Load branch-offices-data.js
const branchContent = fs.readFileSync('src/data/branch-offices-data.js', 'utf8');
const branchData = JSON.parse(branchContent.replace(/^[\s\S]*?window\.BD_BRANCH_OFFICES_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

console.log('Main data post offices count:', mainData.metadata.totalPostOffices);
console.log('Branch offices count:', branchData.branchOffices.length);

// Let's create a lookup of all main post offices
// Structure of main office:
// { id, divisionEn, divisionBn, districtEn, districtBn, thanaBn, postOfficeBn, postCodeEn, postCodeBn }
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

// Let's write phonetic / transliteration / normalization matcher
// English to Bangla approximate phonetic map or transliteration
function cleanEn(s) {
  if (!s) return '';
  return s.toLowerCase()
    .replace(/\s*(tso|ho|so|edbo|b\.o|sub office|branch office)\s*/gi, '')
    .replace(/[^a-z0-9]/g, '');
}

function cleanBn(s) {
  if (!s) return '';
  return s.replace(/\s*(টিএসও|এইচও|এসও|টি\.এস\.ও|এইচ\.ও)\s*/g, '')
    .replace(/[^\u0980-\u09FF0-9]/g, '');
}

console.log('Sample branch offices in Dhaka:');
branchData.branchOffices.filter(b => b.districtEn.toLowerCase() === 'dhaka').slice(0, 30).forEach(b => {
  console.log(`Branch: "${b.postOfficeEn}" | Thana: "${b.thanaBn}" / "${b.thanaEn}"`);
});

console.log('\nMain offices in Dhaka Keranigonj, Nawabganj, Savar, Dohar:');
mainList.filter(m => m.districtEn.toLowerCase() === 'dhaka' && ['কেরানীগঞ্জ', 'নবাবগঞ্জ', 'সাভার', 'দোহার', 'ধামরাই'].includes(m.thanaBn)).forEach(m => {
  console.log(`Main: "${m.postOfficeBn}" | Thana: "${m.thanaBn}" | Code: ${m.postCodeEn}`);
});
