const fs = require('fs');

const postcodesContent = fs.readFileSync('src/data/postcodes-data.js', 'utf8');
const mainData = JSON.parse(postcodesContent.replace(/^[\s\S]*?window\.BD_POSTCODE_DATA\s*=\s*/, '').replace(/;\s*$/, ''));
const branchContent = fs.readFileSync('src/data/branch-offices-data.js', 'utf8');
const branchData = JSON.parse(branchContent.replace(/^[\s\S]*?window\.BD_BRANCH_OFFICES_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

const mainList = [];
mainData.districts.forEach(d => {
  d.postOffices.forEach(po => {
    mainList.push({
      ...po,
      districtEn: d.districtEn,
      districtBn: d.districtBn
    });
  });
});

// Let's print for each of the 15 districts in branch offices:
// All branch offices and all main post offices in that district
const branchDistricts = [...new Set(branchData.branchOffices.map(b => b.districtEn))];
console.log('Districts with branch offices:', branchDistricts);

const districtDumps = {};
branchDistricts.forEach(dist => {
  const branches = branchData.branchOffices.filter(b => b.districtEn === dist);
  const mains = mainList.filter(m => m.districtEn.toLowerCase() === dist.toLowerCase());
  
  districtDumps[dist] = {
    totalBranches: branches.length,
    totalMains: mains.length,
    mainOffices: mains.map(m => ({ id: m.id, thana: m.thanaBn, office: m.postOfficeBn, code: m.postCodeEn })),
    branchOffices: branches.map(b => ({ id: b.id, thana: b.thanaBn, officeEn: b.postOfficeEn, officeBn: b.postOfficeBn }))
  };
});

fs.writeFileSync('.scripts-archive/district_comparison_full.json', JSON.stringify(districtDumps, null, 2), 'utf8');
console.log('Saved full district comparison to .scripts-archive/district_comparison_full.json');
