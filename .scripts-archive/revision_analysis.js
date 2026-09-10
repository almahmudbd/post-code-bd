const fs = require('fs');
const path = require('path');

// Extract postcodes data
const postcodesDataContent = fs.readFileSync('src/data/postcodes-data.js', 'utf8');
const postcodesJsonStr = postcodesDataContent.replace(/^[\s\S]*?window\.BD_POSTCODE_DATA\s*=\s*/, '').replace(/;\s*$/, '');
const mainData = JSON.parse(postcodesJsonStr);

// Extract branch offices data
const branchDataContent = fs.readFileSync('src/data/branch-offices-data.js', 'utf8');
const branchJsonStr = branchDataContent.replace(/^[\s\S]*?window\.BD_BRANCH_OFFICES_DATA\s*=\s*/, '').replace(/;\s*$/, '');
const branchData = JSON.parse(branchJsonStr);

console.log('Main districts:', mainData.districts.length);
let mainOffices = [];
mainData.districts.forEach(d => {
  d.postOffices.forEach(po => {
    mainOffices.push({ ...po, districtBn: d.districtBn, districtEn: d.districtEn });
  });
});
console.log('Total main post offices:', mainOffices.length);

const branchOffices = branchData.branchOffices || [];
console.log('Total branch offices in branch-offices-data.js:', branchOffices.length);

// Also let's check .scripts-archive/bdpost_pmgkhulna_all.json
let pmg = null;
if (fs.existsSync('.scripts-archive/bdpost_pmgkhulna_all.json')) {
  pmg = JSON.parse(fs.readFileSync('.scripts-archive/bdpost_pmgkhulna_all.json', 'utf8'));
  console.log('Total PMG records:', pmg.records.length);
}

// Let's inspect what pmg records look like, especially those with and without postCodeEn
if (pmg) {
  const withCode = pmg.records.filter(r => r.postCodeEn);
  const withoutCode = pmg.records.filter(r => !r.postCodeEn);
  console.log('PMG with code:', withCode.length, 'without code:', withoutCode.length);
  console.log('Sample PMG without code:', JSON.stringify(withoutCode.slice(0, 5), null, 2));
}

// Check sample main offices
console.log('Sample main offices:', JSON.stringify(mainOffices.slice(0, 5), null, 2));

// Check sample branch offices
console.log('Sample branch offices:', JSON.stringify(branchOffices.slice(0, 5), null, 2));
