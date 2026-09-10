const fs = require('fs');

const pmg = JSON.parse(fs.readFileSync('.scripts-archive/bdpost_pmgkhulna_all.json', 'utf8'));
const dhakaRows = pmg.records.filter(r => r.district === 'ঢাকা');

console.log('Total Dhaka rows in PMG crawl:', dhakaRows.length);
const withCode = dhakaRows.filter(r => r.postCodeEn);
const withoutCode = dhakaRows.filter(r => !r.postCodeEn);
console.log('Dhaka with code:', withCode.length, 'without code:', withoutCode.length);

console.log('\nDhaka rows WITH code (sample 15):');
withCode.slice(0, 15).forEach(r => {
  console.log(`Upazila: ${r.upazila} | En: ${r.postOfficeEn} | Bn: ${r.postOfficeBn} | Code: ${r.postCodeEn}`);
});

console.log('\nDhaka rows WITHOUT code (sample 15):');
withoutCode.slice(0, 15).forEach(r => {
  console.log(`Upazila: ${r.upazila} | En: ${r.postOfficeEn} | Bn: ${r.postOfficeBn} | Code: ${r.postCodeEn}`);
});
