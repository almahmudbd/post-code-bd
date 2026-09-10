const fs = require('fs');

const report = JSON.parse(fs.readFileSync('.scripts-archive/comparison_report.json', 'utf8'));
console.log('Summary in comparison report:', report.summary);

// Let's check bdPostEntriesWithoutCode in comparison_report.json
console.log('Total bdPostEntriesWithoutCode:', report.bdPostEntriesWithoutCode.length);

// Check sample missing in PMG
console.log('\nMissing in PMG count:', report.missingInPmg.length);
console.log('Sample missing in PMG (first 10):');
report.missingInPmg.slice(0, 10).forEach(m => {
  console.log(`- [${m.districtBn}] ${m.postOfficeBn} (${m.thanaBn}) - Code: ${m.cleanPostCode}`);
});
