const fs = require('fs');
const path = require('path');

const postcodesData = JSON.parse(fs.readFileSync('src/data/postcodes.json', 'utf8'));

const BN_TO_EN_DIGITS = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };

function cleanBengaliText(str) {
  if (!str) return '';
  return str
    .normalize('NFC')
    .replace(/\u09AF\u09BC/g, '\u09DF') // য + ় (nukta) -> য়
    .replace(/\u09A1\u09BC/g, '\u09DC') // ড + ় (nukta) -> ড়
    .replace(/\u09A2\u09BC/g, '\u09DD') // ঢ + ় (nukta) -> ঢ়
    .replace(/\u09A4\u09CD\u200D/g, 'ৎ') // ত + হসন্ত + ZWJ -> ৎ
    .replace(/য\./g, 'য়')               // য. -> য়
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .toLowerCase()
    .trim();
}

function normalizeSearchText(str) {
  if (!str) return { original: '', cleanBn: '', withEnDigits: '' };
  const cleaned = cleanBengaliText(str);
  const withEnDigits = cleaned.replace(/[০-৯]/g, d => BN_TO_EN_DIGITS[d] || d);
  return {
    original: cleaned,
    cleanBn: cleaned,
    withEnDigits: withEnDigits
  };
}

function testSearch(query) {
  const queryInfo = normalizeSearchText(query);
  const searchToken = queryInfo.withEnDigits;
  let matches = 0;

  postcodesData.districts.forEach(d => {
    const dEn = d.districtEn.toLowerCase();
    const dBn = cleanBengaliText(d.districtBn);
    const divEn = d.divisionEn.toLowerCase();
    const divBn = cleanBengaliText(d.divisionBn);

    const districtMatchesSearch = searchToken && (
      dEn.includes(searchToken) ||
      dBn.includes(queryInfo.cleanBn) ||
      divEn.includes(searchToken) ||
      divBn.includes(queryInfo.cleanBn)
    );

    const matchingOffices = d.postOffices.filter(po => {
      if (districtMatchesSearch) return true;
      const codeEn = po.postCodeEn || '';
      const codeBn = po.postCodeBn || '';
      const thana = cleanBengaliText(po.thanaBn);
      const thanaEn = (po.thanaEn || '').toLowerCase();
      const poName = cleanBengaliText(po.postOfficeBn);
      const poNameEn = (po.postOfficeEn || '').toLowerCase();

      return (
        (codeEn && codeEn.includes(searchToken)) ||
        (codeBn && codeBn.includes(queryInfo.cleanBn)) ||
        thana.includes(queryInfo.cleanBn) ||
        thana.includes(searchToken) ||
        thanaEn.includes(searchToken) ||
        poName.includes(queryInfo.cleanBn) ||
        poName.includes(searchToken) ||
        poNameEn.includes(searchToken)
      );
    });

    matches += matchingOffices.length;
  });

  return matches;
}

console.log('Test 1 - Standard য় (ময়মনসিংহ):', testSearch('ময়মনসিংহ'));
console.log('Test 2 - Decomposed য+nukta (ম\\u09AF\\u09BCমনসিংহ):', testSearch('ম\u09AF\u09BCমনসিংহ'));
console.log('Test 3 - Literal য. (ময.মনসিংহ):', testSearch('ময.মনসিংহ'));

console.log('Test 4 - Standard ড় (বগুড়া):', testSearch('বগুড়া'));
console.log('Test 5 - Decomposed ড+nukta (বগু\\u09A1\\u09BCা):', testSearch('বগু\u09A1\u09BCা'));

console.log('Test 6 - Standard য় (জয়পুরহাট):', testSearch('জয়পুরহাট'));
console.log('Test 7 - Decomposed য+nukta (জ\\u09AF\\u09BCপুরহাট):', testSearch('জ\u09AF\u09BCপুরহাট'));
console.log('Test 8 - Literal য. (জয.পুরহাট):', testSearch('জয.পুরহাট'));
