const fs = require('fs');

const data = JSON.parse(fs.readFileSync('.scripts-archive/district_comparison_full.json', 'utf8'));

// Let's create an interactive verifier that checks each district
// and prints any branch office whose name shares 3 or more letters with any main office in the same district.
const candidatesByDistrict = {};

for (const [dist, d] of Object.entries(data)) {
  const bList = d.branchOffices;
  const mList = d.mainOffices;

  candidatesByDistrict[dist] = [];

  bList.forEach(b => {
    // compare with each m in mList
    mList.forEach(m => {
      // let's compare
      candidatesByDistrict[dist].push({
        branchId: b.id,
        branchEn: b.officeEn,
        branchThana: b.thana,
        mainId: m.id,
        mainBn: m.office,
        mainThana: m.thana,
        postCode: m.code
      });
    });
  });
}
