const fs = require('fs');

const html = fs.readFileSync('C:/Users/almahmud/.gemini/antigravity-ide/brain/7d4f65a6-bdf3-4e12-a29d-277a2a639052/.system_generated/steps/11/content.md', 'utf8');

// Match sections: mw-heading2, mw-heading3, wikitable
const regex = /(<div class="mw-heading mw-heading[23]"[^>]*>[\s\S]*?<\/div>|<table class="wikitable"[\s\S]*?<\/table>)/g;

let currentDivision = '';
let currentDistrict = '';
const districtsData = [];
let match;
let tableIndex = 0;

function cleanText(str) {
  return str ? str.replace(/<[^>]+>/g, '').replace(/&#160;/g, ' ').replace(/&nbsp;/g, ' ').trim() : '';
}

function bnToEnDigits(str) {
  const bnDigits = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'};
  return str.replace(/[০-৯]/g, d => bnDigits[d]);
}

while ((match = regex.exec(html)) !== null) {
  const block = match[0];
  if (block.includes('mw-heading2')) {
    const text = cleanText(block);
    if (text.includes('বিভাগ')) {
      currentDivision = text.replace('বিভাগ', '').trim();
    }
  } else if (block.includes('mw-heading3')) {
    const text = cleanText(block);
    if (text.includes('জেলা')) {
      currentDistrict = text.replace('জেলা', '').trim();
    }
  } else if (block.startsWith('<table class="wikitable"')) {
    tableIndex++;
    // parse rows
    const rows = block.match(/<tr[\s\S]*?<\/tr>/g) || [];
    if (rows.length === 0) continue;

    // header row
    const headers = (rows[0].match(/<th[\s\S]*?<\/th>/g) || []).map(cleanText);
    const districtItems = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const cells = (row.match(/<td[\s\S]*?<\/td>/g) || []).map(cleanText);
      if (cells.length === 0) continue;

      let thana = '', postOffice = '', postCode = '';
      if (cells.length === 4) {
        // [জেলা, থানা, উপকার্যালয়, পোস্ট কোড]
        thana = cells[1];
        postOffice = cells[2];
        postCode = cells[3];
      } else if (cells.length === 3) {
        // [থানা/উপজেলা, উপকার্যালয়/ডাকঘর, পোস্ট কোড]
        thana = cells[0];
        postOffice = cells[1];
        postCode = cells[2];
      } else if (cells.length === 2) {
        thana = cells[0];
        postCode = cells[1];
        postOffice = thana;
      } else if (cells.length >= 5) {
        thana = cells[1];
        postOffice = cells[2];
        postCode = cells[3];
      }

      const postCodeEn = bnToEnDigits(postCode);
      districtItems.push({
        thana,
        postOffice,
        postCodeBn: postCode,
        postCodeEn: postCodeEn
      });
    }

    districtsData.push({
      divisionBn: currentDivision,
      districtBn: currentDistrict,
      tableIndex,
      headers,
      count: districtItems.length,
      items: districtItems
    });
  }
}

console.log('Total districts parsed:', districtsData.length);
console.log('Total post offices parsed:', districtsData.reduce((acc, d) => acc + d.count, 0));
console.log('Districts list:', districtsData.map(d => `${d.districtBn} (${d.divisionBn}) - ${d.count}`));
