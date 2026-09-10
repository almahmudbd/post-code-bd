const fs = require('fs');
const data = JSON.parse(fs.readFileSync('.scripts-archive/district_comparison_full.json', 'utf8'));

['Sherpur', 'Sunamganj', 'Habiganj', 'Sirajganj', 'Kurigram'].forEach(dist => {
  console.log(`\n=== ${dist} ===`);
  const d = data[dist];
  console.log('Main Offices:');
  d.mainOffices.forEach(m => console.log(`  - [${m.id}] ${m.office} (${m.thana}) : ${m.code}`));
  console.log('Branch Offices:');
  d.branchOffices.forEach(b => console.log(`  - [${b.id}] ${b.officeEn} / ${b.officeBn} (${b.thana})`));
});
