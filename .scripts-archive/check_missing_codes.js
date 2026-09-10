const fs = require('fs');

const pmg = JSON.parse(fs.readFileSync('.scripts-archive/bdpost_pmgkhulna_all.json', 'utf8'));
const main = JSON.parse(fs.readFileSync('.scripts-archive/postcodes.json', 'utf8'));

// In postcodes.json (which is 1389 main offices):
const mainOffices = [];
main.districts.forEach(d => {
  d.postOffices.forEach(po => {
    mainOffices.push({ ...po, districtBn: d.districtBn, districtEn: d.districtEn });
  });
});

console.log('Main offices count in postcodes.json:', mainOffices.length);

// In PMG records:
// Let's see how many records had postCodeEn vs empty
const pmgWithCode = pmg.records.filter(r => r.postCodeEn);
const pmgNoCode = pmg.records.filter(r => !r.postCodeEn);
console.log('PMG with code:', pmgWithCode.length);
console.log('PMG without code:', pmgNoCode.length);

// Let's check how many PMG records with code match postcodes.json
const pmgCodeMap = new Map();
pmgWithCode.forEach(r => {
  pmgCodeMap.set(r.postCodeEn, r);
});

let matchedCodes = 0;
let unmatchedCodes = 0;
mainOffices.forEach(m => {
  if (pmgCodeMap.has(m.postCodeEn)) {
    matchedCodes++;
  } else {
    unmatchedCodes++;
  }
});
console.log('Main offices whose post code exists in PMG with code:', matchedCodes);
console.log('Main offices whose post code is NOT in PMG with code:', unmatchedCodes);

// Now: For the main offices that are NOT in PMG with code:
// ARE THEY in PMG WITHOUT code (i.e. in branch offices)?
console.log('\nLet us check if main offices missing in PMG-with-code match PMG-without-code!');
const missingFromPmgWithCode = mainOffices.filter(m => !pmgCodeMap.has(m.postCodeEn));
console.log('Count of main offices missing from PMG-with-code:', missingFromPmgWithCode.length);

console.log('Sample of main offices missing from PMG-with-code:');
missingFromPmgWithCode.slice(0, 20).forEach(m => {
  console.log(`- [${m.districtEn}] ${m.postOfficeBn} (${m.thanaBn}) - Code: ${m.postCodeEn}`);
});
