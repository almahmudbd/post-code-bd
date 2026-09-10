const fs = require('fs');

const pmg = JSON.parse(fs.readFileSync('.scripts-archive/bdpost_pmgkhulna_all.json', 'utf8'));
const noCode = pmg.records.filter(r => !r.postCodeEn);

console.log('Total without code:', noCode.length);
// Group by district
const byDist = {};
noCode.forEach(r => {
  byDist[r.district] = (byDist[r.district] || 0) + 1;
});
console.log('Districts of rows without postCodeEn:', byDist);

// Let's inspect some of these rows and check what their rawPostCode, postOfficeEn, postOfficeBn were:
console.log('\nSample rows without postCodeEn:');
noCode.slice(0, 20).forEach(r => {
  console.log(`District: ${r.district} | Upazila: ${r.upazila} | PO_En: "${r.postOfficeEn}" | PO_Bn: "${r.postOfficeBn}" | rawCode: "${r.rawPostCode}"`);
});
