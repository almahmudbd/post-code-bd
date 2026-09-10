const fs = require('fs');
const vm = require('vm');

const sandbox = { window: {} };
vm.createContext(sandbox);

const postcodesCode = fs.readFileSync('src/data/postcodes-data.js', 'utf8');
vm.runInContext(postcodesCode, sandbox);

const branchCode = fs.readFileSync('src/data/branch-offices-data.js', 'utf8');
vm.runInContext(branchCode, sandbox);

const mainData = sandbox.window.BD_POSTCODE_DATA;
const branchData = sandbox.window.BD_BRANCH_OFFICES_DATA;

console.log('Main districts:', mainData.districts.length);
console.log('Branch districts:', branchData.districts.length);

let foundSourceUrl = 0;
branchData.districts.forEach(d => {
  d.branchOffices.forEach(b => {
    if (b.sourceUrl) foundSourceUrl++;
  });
});
console.log('Branch offices with sourceUrl:', foundSourceUrl, '(Must be 0)');

let missingPoEn = 0;
let missingThanaEn = 0;
let totalMain = 0;
mainData.districts.forEach(d => {
  d.postOffices.forEach(po => {
    totalMain++;
    if (!po.postOfficeEn) missingPoEn++;
    if (!po.thanaEn) missingThanaEn++;
  });
});
console.log('Total main:', totalMain, 'Missing poEn:', missingPoEn, 'Missing thanaEn:', missingThanaEn);

const allOffices = [];
mainData.districts.forEach(d => {
  d.postOffices.forEach(po => allOffices.push({ ...po, districtBn: d.districtBn, districtEn: d.districtEn }));
});
branchData.districts.forEach(d => {
  d.branchOffices.forEach(b => allOffices.push({ ...b, districtBn: d.districtBn, districtEn: d.districtEn }));
});

const queries = ['Mohammadpur', 'Dhanmondi', 'Gulshan', 'Demra', 'Jigatola', 'Bajitpur', 'Hemayetpur', 'Ashrafabad'];
queries.forEach(q => {
  const token = q.toLowerCase();
  const matches = allOffices.filter(po => {
    const codeEn = po.postCodeEn || '';
    const thanaEn = (po.thanaEn || '').toLowerCase();
    const poNameEn = (po.postOfficeEn || '').toLowerCase();
    return (
      (codeEn && codeEn.includes(token)) ||
      thanaEn.includes(token) ||
      poNameEn.includes(token)
    );
  });
  console.log(`Query "${q}" matched: ${matches.length} offices. First match: ${matches[0].postOfficeBn} (thana: ${matches[0].thanaBn}, hidden EN: ${matches[0].postOfficeEn})`);
});
