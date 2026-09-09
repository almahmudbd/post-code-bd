const fs = require('fs');
const report = JSON.parse(fs.readFileSync('src/data/comparison_report.json', 'utf8'));

console.log('Sample BD Post entries without post code:');
report.bdPostEntriesWithoutCode.slice(0, 15).forEach((r, i) => {
  console.log(`${i + 1}. District: ${r.district} | Upazila: ${r.upazila} | OfficeEn: ${r.postOfficeEn} | OfficeBn: ${r.postOfficeBn} | RawCode: "${r.rawPostCode}"`);
});
