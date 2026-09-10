const fs = require('fs');

// Check that postcodes-data.js parses correctly
const postcodesDataRaw = fs.readFileSync('src/data/postcodes-data.js', 'utf8');
const BD_POSTCODE_DATA = JSON.parse(postcodesDataRaw.replace(/^[\s\S]*?window\.BD_POSTCODE_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

// Check that branch-offices-data.js parses correctly
const branchDataRaw = fs.readFileSync('src/data/branch-offices-data.js', 'utf8');
const BD_BRANCH_OFFICES_DATA = JSON.parse(branchDataRaw.replace(/^[\s\S]*?window\.BD_BRANCH_OFFICES_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

console.log('✅ BD_POSTCODE_DATA loaded successfully.');
console.log(`   - Divisions: ${BD_POSTCODE_DATA.divisions.length}`);
console.log(`   - Districts: ${BD_POSTCODE_DATA.districts.length}`);
console.log(`   - Post Offices: ${BD_POSTCODE_DATA.metadata.totalPostOffices}`);

console.log('✅ BD_BRANCH_OFFICES_DATA loaded successfully.');
console.log(`   - Branch Offices: ${BD_BRANCH_OFFICES_DATA.branchOffices.length}`);
console.log(`   - Districts: ${BD_BRANCH_OFFICES_DATA.districts.length}`);

// Test search simulation
function searchOffices(query, showBranchOffices = true) {
  const cleanQ = query.trim().toLowerCase();
  const results = [];

  BD_POSTCODE_DATA.districts.forEach(d => {
    d.postOffices.forEach(po => {
      const matchBn = (po.postOfficeBn || '').toLowerCase().includes(cleanQ);
      const matchCode = (po.postCodeEn || '').includes(cleanQ) || (po.postCodeBn || '').includes(cleanQ);
      const matchThana = (po.thanaBn || '').toLowerCase().includes(cleanQ);
      if (matchBn || matchCode || matchThana) {
        results.push({ ...po, isBranch: false });
      }
    });
  });

  if (showBranchOffices && BD_BRANCH_OFFICES_DATA && BD_BRANCH_OFFICES_DATA.branchOffices) {
    BD_BRANCH_OFFICES_DATA.branchOffices.forEach(b => {
      const matchBn = (b.postOfficeBn || '').toLowerCase().includes(cleanQ);
      const matchEn = (b.postOfficeEn || '').toLowerCase().includes(cleanQ);
      const matchThana = (b.thanaBn || '').toLowerCase().includes(cleanQ) || (b.thanaEn || '').toLowerCase().includes(cleanQ);
      if (matchBn || matchEn || matchThana) {
        results.push({ ...b, isBranch: true });
      }
    });
  }

  return results;
}

// Test previously duplicated names:
const testQueries = ['আটি', 'আমিন বাজার', 'পুবাইল', 'মাতুয়াইল', 'খালপাড়', 'আগলা'];

console.log('\n--- VERIFYING SEARCH FOR PREVIOUS DUPLICATES ---');
testQueries.forEach(q => {
  const matches = searchOffices(q, true);
  console.log(`\nQuery: "${q}" (Found: ${matches.length})`);
  matches.forEach(m => {
    if (m.isBranch) {
      console.log(`  [BRANCH] ${m.postOfficeBn} / ${m.postOfficeEn} (${m.thanaBn}, ${m.districtBn}) [NO CODE]`);
    } else {
      console.log(`  [MAIN]   ${m.postOfficeBn} (${m.thanaBn}, ${m.districtBn}) [Code: ${m.postCodeEn} / ${m.postCodeBn}]`);
    }
  });
});

// Test legitimate branch offices
console.log('\n--- VERIFYING GENUINE BRANCH OFFICES ---');
['আশরাফাবাদ', 'হেমায়েতপুর', 'আশুলিয়া', 'জিরাবো'].forEach(q => {
  const matches = searchOffices(q, true);
  console.log(`\nQuery: "${q}" (Found: ${matches.length})`);
  matches.forEach(m => {
    if (m.isBranch) {
      console.log(`  [BRANCH] ${m.postOfficeBn} / ${m.postOfficeEn} (${m.thanaBn}, ${m.districtBn}) [EDBO]`);
    } else {
      console.log(`  [MAIN]   ${m.postOfficeBn} (${m.thanaBn}, ${m.districtBn}) [Code: ${m.postCodeEn}]`);
    }
  });
});
