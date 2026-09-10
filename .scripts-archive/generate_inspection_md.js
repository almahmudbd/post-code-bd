const fs = require('fs');
const data = JSON.parse(fs.readFileSync('.scripts-archive/district_comparison_full.json', 'utf8'));

// We want to generate an inspection report for each district
const report = [];

const districts = ['Dhaka', 'Narayanganj', 'Munshiganj', 'Narsingdi', 'Gazipur', 'Manikganj', 'Tangail', 'Kishoreganj', 'Netrokona'];

districts.forEach(dist => {
  const d = data[dist];
  const bList = d.branchOffices;
  const mList = d.mainOffices;

  report.push(`\n# =========================================================`);
  report.push(`# DISTRICT: ${dist} (Branches: ${bList.length}, Main: ${mList.length})`);
  report.push(`# =========================================================`);
  
  report.push(`\n## Main Offices in ${dist}:`);
  mList.forEach(m => {
    report.push(`- [ID: ${m.id}] ${m.office} | Thana: ${m.thana} | Code: ${m.code}`);
  });

  report.push(`\n## Branch Offices in ${dist}:`);
  bList.forEach(b => {
    report.push(`- [ID: ${b.id}] ${b.officeEn} | Thana: ${b.thana}`);
  });
});

fs.writeFileSync('.scripts-archive/remaining_districts_inspection.md', report.join('\n'), 'utf8');
console.log('Written to .scripts-archive/remaining_districts_inspection.md');
