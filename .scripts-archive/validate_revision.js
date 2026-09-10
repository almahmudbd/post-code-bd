const fs = require('fs');

// Load postcodes-data.js
const postcodesContent = fs.readFileSync('src/data/postcodes-data.js', 'utf8');
const mainData = JSON.parse(postcodesContent.replace(/^[\s\S]*?window\.BD_POSTCODE_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

// Load revised branch-offices-data.js
const branchContent = fs.readFileSync('src/data/branch-offices-data.js', 'utf8');
const branchData = JSON.parse(branchContent.replace(/^[\s\S]*?window\.BD_BRANCH_OFFICES_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

console.log('--- DATASET VALIDATION ---');
console.log('Main data post offices:', mainData.metadata.totalPostOffices);
console.log('Revised branch offices:', branchData.branchOffices.length);
console.log('Branch metadata count:', branchData.metadata.totalBranchOffices);
console.log('Branch districts count:', branchData.districts.length);

// 1. Check Bengali text coverage in branch offices
let hasBengali = 0;
let missingBengali = [];
branchData.branchOffices.forEach(b => {
  if (/[\u0980-\u09FF]/.test(b.postOfficeBn)) {
    hasBengali++;
  } else {
    missingBengali.push(b.postOfficeEn);
  }
});
console.log(`Branch offices with valid Bengali names: ${hasBengali} / ${branchData.branchOffices.length}`);
if (missingBengali.length > 0) {
  console.log('Branch offices without Bengali script:', missingBengali);
}

// 2. Check if any of the 59 duplicates are still present
const forbiddenKeys = ['ati', 'amin bazar', 'rajfulbariya', 'kalampur', 'matuail', 'agla', 'khalpar', 'narisha', 'nabiganj', 'vulta', 'dhuptara', 'katakhali', 'baligaon', 'hasail', 'pura', 'karimpur', 'charsindhur', 'bailab', 'pubail', 'chandona', 'gorpara', 'borong gail', 'teota', 'uthuli', 'bayra', 'hinganagar', 'pathrail', 'lauhati', 'nagbari', 'nilganj', 'maijhati', 'shaldigha'];

const leaked = [];
branchData.branchOffices.forEach(b => {
  const low = b.postOfficeEn.toLowerCase();
  for (const f of forbiddenKeys) {
    if (low === f) {
      // Check district
      leaked.push({ id: b.id, name: b.postOfficeEn, thana: b.thanaBn, dist: b.districtEn });
    }
  }
});

console.log('Leaked duplicate check (must be 0):', leaked.length);
if (leaked.length > 0) {
  console.log('Leaked items:', leaked);
}

// 3. Check sample entries in Dhaka, Gazipur, Manikganj
console.log('\nSample revised branch offices in Dhaka:');
branchData.branchOffices.filter(b => b.districtEn === 'Dhaka').slice(0, 10).forEach(b => {
  console.log(`- ${b.id}: "${b.postOfficeEn}" (${b.postOfficeBn}) | Thana: ${b.thanaBn}`);
});

console.log('\nSample revised branch offices in Manikganj:');
branchData.branchOffices.filter(b => b.districtEn === 'Manikganj').slice(0, 10).forEach(b => {
  console.log(`- ${b.id}: "${b.postOfficeEn}" (${b.postOfficeBn}) | Thana: ${b.thanaBn}`);
});
