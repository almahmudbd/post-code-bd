const fs = require('fs');
const path = require('path');

function normalizeBengali(str) {
  if (typeof str !== 'string') return str;
  return str
    .normalize('NFC')
    .replace(/\u09AF\u09BC/g, '\u09DF') // য + ় -> য়
    .replace(/\u09A1\u09BC/g, '\u09DC') // ড + ় -> ড়
    .replace(/\u09A2\u09BC/g, '\u09DD') // ঢ + ় -> ঢ়
    .replace(/\u09A4\u09CD\u200D/g, 'ৎ') // ত + ্ + ZWJ -> ৎ
    .replace(/য\./g, 'য়');               // য followed by literal dot
}

function deepNormalize(obj) {
  if (typeof obj === 'string') {
    return normalizeBengali(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(deepNormalize);
  }
  if (obj !== null && typeof obj === 'object') {
    const res = {};
    for (const key of Object.keys(obj)) {
      res[key] = deepNormalize(obj[key]);
    }
    return res;
  }
  return obj;
}

// 1. Fix postcodes.json
const postcodesPath = path.resolve('src/data/postcodes.json');
const postcodesData = JSON.parse(fs.readFileSync(postcodesPath, 'utf8'));
const normalizedPostcodes = deepNormalize(postcodesData);
fs.writeFileSync(postcodesPath, JSON.stringify(normalizedPostcodes, null, 2), 'utf8');

// 2. Fix postcodes-data.js
const postcodesJsPath = path.resolve('src/data/postcodes-data.js');
const postcodesJsContent = `/* Auto-generated Bangladesh Postal Codes Data */\nwindow.BD_POSTCODE_DATA = ${JSON.stringify(normalizedPostcodes)};\n`;
fs.writeFileSync(postcodesJsPath, postcodesJsContent, 'utf8');

// 3. Fix branch_offices_no_postcode.json
const branchPath = path.resolve('src/data/branch_offices_no_postcode.json');
const branchData = JSON.parse(fs.readFileSync(branchPath, 'utf8'));
const normalizedBranch = deepNormalize(branchData);
fs.writeFileSync(branchPath, JSON.stringify(normalizedBranch, null, 2), 'utf8');

// 4. Fix branch-offices-data.js
const branchJsPath = path.resolve('src/data/branch-offices-data.js');
const branchJsContent = `/* Auto-generated Bangladesh Post Office - Branch Offices without Post Code */\nwindow.BD_BRANCH_OFFICES_DATA = ${JSON.stringify(normalizedBranch)};\n`;
fs.writeFileSync(branchJsPath, branchJsContent, 'utf8');

console.log('Successfully normalized all data files!');

// Verification check
const verifyPostcodes = fs.readFileSync(postcodesPath, 'utf8');
console.log('Remaining \\u09AF\\u09BC in postcodes.json:', (verifyPostcodes.match(/\u09AF\u09BC/g) || []).length);
console.log('Remaining \\u09A1\\u09BC in postcodes.json:', (verifyPostcodes.match(/\u09A1\u09BC/g) || []).length);
console.log('Standard য় (\\u09DF) count in postcodes.json:', (verifyPostcodes.match(/\u09DF/g) || []).length);
console.log('Standard ড় (\\u09DC) count in postcodes.json:', (verifyPostcodes.match(/\u09DC/g) || []).length);
