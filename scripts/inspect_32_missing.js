const fs = require('fs');

const report = JSON.parse(fs.readFileSync('src/data/comparison_report.json', 'utf8'));
const local = JSON.parse(fs.readFileSync('src/data/postcodes.json', 'utf8'));

console.log('Total missing in local:', report.missingInLocal.length);
report.missingInLocal.forEach((r, idx) => {
  console.log(`${idx + 1}. Code: ${r.cleanPostCode} | District: ${r.district} | Upazila: ${r.upazila} | En: "${r.postOfficeEn}" | Bn: "${r.postOfficeBn}"`);
});
