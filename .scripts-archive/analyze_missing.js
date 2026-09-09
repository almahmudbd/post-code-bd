const fs = require('fs');
const report = JSON.parse(fs.readFileSync('src/data/comparison_report.json', 'utf8'));

// Group missingInPmg by district
const distMap = {};
report.missingInPmg.forEach(r => {
  const d = r.districtBn;
  distMap[d] = (distMap[d] || 0) + 1;
});

console.log('Breakdown of codes in Local but NOT in BD Post tables:');
Object.entries(distMap).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
  console.log(`- ${k}: ${v}`);
});

console.log('\nBreakdown of 32 new codes in BD Post that are MISSING in Local:');
const newMap = {};
report.missingInLocal.forEach(r => {
  const d = r.district;
  newMap[d] = (newMap[d] || 0) + 1;
});
Object.entries(newMap).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
  console.log(`- ${k}: ${v}`);
});
