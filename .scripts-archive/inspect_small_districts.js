const fs = require('fs');
const data = JSON.parse(fs.readFileSync('.scripts-archive/district_comparison_full.json', 'utf8'));

['Sherpur', 'Sunamganj', 'Habiganj', 'Sirajganj', 'Kurigram', 'Chattogram'].forEach(dist => {
  console.log(`\n=== ${dist} ===`);
  const d = data[dist];
  console.log('Main Offices:', d.mainOffices);
  console.log('Branch Offices:', d.branchOffices);
});
