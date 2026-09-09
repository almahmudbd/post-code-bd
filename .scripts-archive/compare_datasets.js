const fs = require('fs');
const path = require('path');

function runComparison() {
  const pmgPath = path.resolve('src/data/bdpost_pmgkhulna_all.json');
  if (!fs.existsSync(pmgPath)) {
    console.error('PMG Khulna data file does not exist yet.');
    return;
  }

  const pmgData = JSON.parse(fs.readFileSync(pmgPath, 'utf8'));
  const localData = JSON.parse(fs.readFileSync(path.resolve('src/data/postcodes.json'), 'utf8'));

  // Flatten local post offices
  const localPostOffices = [];
  localData.districts.forEach(d => {
    d.postOffices.forEach(p => {
      localPostOffices.push({
        ...p,
        cleanPostCode: String(p.postCodeEn).trim()
      });
    });
  });

  const pmgRecords = pmgData.records.map(r => ({
    ...r,
    cleanPostCode: String(r.postCodeEn).trim()
  }));

  console.log('================ DATASET OVERVIEW ================');
  console.log(`BD Post (PMG Khulna) total rows: ${pmgRecords.length}`);
  console.log(`Local (Current Project) total rows: ${localPostOffices.length}`);

  // Unique post codes
  const pmgCodesSet = new Set(pmgRecords.filter(r => r.cleanPostCode).map(r => r.cleanPostCode));
  const localCodesSet = new Set(localPostOffices.filter(r => r.cleanPostCode).map(r => r.cleanPostCode));

  console.log(`BD Post unique post codes: ${pmgCodesSet.size}`);
  console.log(`Local unique post codes: ${localCodesSet.size}`);

  // Missing in Local (Present in BD Post, but NOT in Local)
  const missingInLocalCodes = [...pmgCodesSet].filter(code => !localCodesSet.has(code));
  const missingInLocalRecords = pmgRecords.filter(r => missingInLocalCodes.includes(r.cleanPostCode));

  // Missing in BD Post (Present in Local, but NOT in BD Post)
  const missingInPmgCodes = [...localCodesSet].filter(code => !pmgCodesSet.has(code));
  const missingInPmgRecords = localPostOffices.filter(r => missingInPmgCodes.includes(r.cleanPostCode));

  // Rows in BD Post without post code
  const pmgWithoutCode = pmgRecords.filter(r => !r.cleanPostCode);

  console.log('\n================ COMPARISON RESULTS ================');
  console.log(`Post codes in BD Post but MISSING from Local: ${missingInLocalCodes.length} codes (${missingInLocalRecords.length} entries)`);
  console.log(`Post codes in Local but MISSING from BD Post: ${missingInPmgCodes.length} codes (${missingInPmgRecords.length} entries)`);
  console.log(`Entries in BD Post without post code: ${pmgWithoutCode.length}`);

  // Output detailed comparison file
  const report = {
    summary: {
      bdPostTotalRows: pmgRecords.length,
      localTotalRows: localPostOffices.length,
      bdPostUniqueCodes: pmgCodesSet.size,
      localUniqueCodes: localCodesSet.size,
      missingInLocalCount: missingInLocalCodes.length,
      missingInPmgCount: missingInPmgCodes.length,
      bdPostEntriesWithoutCodeCount: pmgWithoutCode.length
    },
    missingInLocal: missingInLocalRecords,
    missingInPmg: missingInPmgRecords,
    bdPostEntriesWithoutCode: pmgWithoutCode
  };

  const reportPath = path.resolve('src/data/comparison_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`Detailed comparison report saved to: ${reportPath}`);

  // Print top missing in local
  console.log('\n--- Sample Post Codes MISSING in Local (first 20) ---');
  missingInLocalRecords.slice(0, 20).forEach((r, idx) => {
    console.log(`${idx + 1}. [Code: ${r.cleanPostCode}] District: ${r.district}, Upazila: ${r.upazila}, Office: ${r.postOfficeEn || r.postOfficeBn}`);
  });

  // Print top missing in BD Post
  console.log('\n--- Sample Post Codes MISSING in BD Post (first 20) ---');
  missingInPmgRecords.slice(0, 20).forEach((r, idx) => {
    console.log(`${idx + 1}. [Code: ${r.cleanPostCode}] District: ${r.districtBn} (${r.districtEn}), Thana: ${r.thanaBn}, Office: ${r.postOfficeBn}`);
  });
}

runComparison();
