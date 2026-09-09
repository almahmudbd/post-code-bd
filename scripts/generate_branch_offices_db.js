const fs = require('fs');
const path = require('path');

const pmgPath = path.resolve('src/data/bdpost_pmgkhulna_all.json');
const pmg = JSON.parse(fs.readFileSync(pmgPath, 'utf8'));

const localData = JSON.parse(fs.readFileSync(path.resolve('src/data/postcodes.json'), 'utf8'));

// Build mapping for upazilas from English to Bengali
const upazilaBnMap = {
  'Kamrangirchar': 'কামরাঙ্গীরচর',
  'Keranigonj': 'কেরানীগঞ্জ',
  'Nawabgonj': 'নবাবগঞ্জ',
  'Joypara (Dohar)': 'দোহার',
  'Savar': 'সাভার',
  'Dhamrai': 'ধামরাই',
  'Demra': 'ডেমরা',
  'Kodomtoli': 'কদমতলী',
  'Sadar': 'সদর',
  'Bandar': 'বন্দর',
  'Fatulla': 'ফতুল্লা',
  'Siddirgonj': 'সিদ্ধিরগঞ্জ',
  'Sonargaon': 'সোনারগাঁও',
  'Arhaihazar': 'আড়াইহাজার',
  'Rupgonj': 'রূপগঞ্জ',
  'Gazaria': 'গজারিয়া',
  'Tongibari': 'টঙ্গীবাড়ী',
  'Louhajong': 'লৌহজং',
  'Serajdi Khan': 'সিরাজদিখান',
  'Sreenagar': 'শ্রীনগর',
  'Palash': 'পলাশ',
  'Shibpur': 'শিবপুর',
  'Raipura': 'রায়পুরা',
  'Belabo': 'বেলাবো',
  'Monohardi': 'মনোহরদী',
  'Narandi': 'নরসিংদী সদর',
  'Gazipur': 'গাজীপুর সদর',
  'Kaligonj': 'কালীগঞ্জ',
  'Kapasia': 'কাপাসিয়া',
  'Sreepur': 'শ্রীপুর',
  'kaliakair': 'কালিয়াকৈর',
  'Saturia': 'সাটুরিয়া',
  'Singair': 'সিংগাইর',
  'Lesragonj (Harirampur)': 'হরিরামপুর',
  'Deldoar': 'দেলদুয়ার',
  'Basail': 'বাসাইল',
  'Nagarpur': 'নাগরপুর',
  'Mirzapur': 'মির্জাপুর',
  'Shakhipur': 'সখিপুর',
  'Bhuapur': 'ভূঞাপুর',
  'Kalihati': 'কালিহাতী',
  'Ghatail': 'ঘাটাইল',
  'Gopalpur': 'গোপালপুর',
  'Madhupur': 'মধুপুর',
  'Nalitabari': 'নালিতাবাড়ী',
  'Karimgonj': 'করিমগঞ্জ',
  'Tarail': 'তাড়াইল',
  'Hussainpur': 'হোসেনপুর',
  'Pakundi': 'পাকুন্দিয়া',
  'Kathiadi': 'কটিয়াদী',
  'Purbadhala': 'পূর্বধলা',
  'Dhobaura': 'ধোবাউড়া',
  'Susang': 'দুর্গাপুর (সুসং)',
  'Barhatta': 'বারহাট্টা',
  'Dharampasa': 'ধর্মপাশা',
  'Madhya Nagar': 'মধ্যনগর',
  'Khaliajuri': 'খালিয়াজুরী',
  'Atpara': 'আটপাড়া',
  'Kendua': 'কেন্দুয়া',
  'Tahirpur': 'তাহিরপুর',
  'Baniachong': 'বানিয়াচং',
  'Sitakundu': 'সীতাকুণ্ড',
  'Mireshwarai': 'মীরসরাই',
  'Ulipur': 'উলিপুর',
  'Chilmari': 'চিলমারী',
  'Roumari': 'রৌমারী',
  'Rajibpur': 'চর রাজিবপুর',
  'Kazipur': 'কাজীপুর'
};

// Map district names from BD Post to our standard format
const districtStandardMap = {
  'ঢাকা': { bn: 'ঢাকা', en: 'Dhaka', divBn: 'ঢাকা', divEn: 'Dhaka' },
  'নারায়নগঞ্জ': { bn: 'নারায়ণগঞ্জ', en: 'Narayanganj', divBn: 'ঢাকা', divEn: 'Dhaka' },
  'মুন্সিগঞ্জ': { bn: 'মুন্সীগঞ্জ', en: 'Munshiganj', divBn: 'ঢাকা', divEn: 'Dhaka' },
  'নরসিংদী': { bn: 'নরসিংদী', en: 'Narsingdi', divBn: 'ঢাকা', divEn: 'Dhaka' },
  'গাজীপুর': { bn: 'গাজীপুর', en: 'Gazipur', divBn: 'ঢাকা', divEn: 'Dhaka' },
  'মানিকগঞ্জ': { bn: 'মানিকগঞ্জ', en: 'Manikganj', divBn: 'ঢাকা', divEn: 'Dhaka' },
  'টাঙ্গাইল': { bn: 'টাঙ্গাইল', en: 'Tangail', divBn: 'ঢাকা', divEn: 'Dhaka' },
  'শেরপুর': { bn: 'শেরপুর', en: 'Sherpur', divBn: 'ময়মনসিংহ', divEn: 'Mymensingh' },
  'কিশোরগঞ্জ': { bn: 'কিশোরগঞ্জ', en: 'Kishoreganj', divBn: 'ঢাকা', divEn: 'Dhaka' },
  'নেত্রকোনা': { bn: 'নেত্রকোণা', en: 'Netrokona', divBn: 'ময়মনসিংহ', divEn: 'Mymensingh' },
  'সুনামগঞ্জ': { bn: 'সুনামগঞ্জ', en: 'Sunamganj', divBn: 'সিলেট', divEn: 'Sylhet' },
  'হবিগঞ্জ': { bn: 'হবিগঞ্জ', en: 'Habiganj', divBn: 'সিলেট', divEn: 'Sylhet' },
  'চট্টগ্রাম': { bn: 'চট্টগ্রাম', en: 'Chattogram', divBn: 'চট্টগ্রাম', divEn: 'Chattogram' },
  'কুড়িগ্রাম': { bn: 'কুড়িগ্রাম', en: 'Kurigram', divBn: 'রংপুর', divEn: 'Rangpur' },
  'সিরাজগঞ্জ': { bn: 'সিরাজগঞ্জ', en: 'Sirajganj', divBn: 'রাজশাহী', divEn: 'Rajshahi' }
};

const noCodeRecords = pmg.records.filter(r => !r.postCodeEn);
console.log('Total branch offices without post code:', noCodeRecords.length);

const branchOffices = [];
let idCounter = 1;

noCodeRecords.forEach(r => {
  const distInfo = districtStandardMap[r.district] || {
    bn: r.district,
    en: r.district,
    divBn: 'অন্যান্য',
    divEn: 'Other'
  };

  const thanaBn = upazilaBnMap[r.upazila] || r.upazila;
  const officeEn = r.postOfficeEn.trim();
  
  // Clean office name and detect if EDBO is mentioned
  const isEdbo = /edbo/i.test(officeEn);
  const cleanName = officeEn.replace(/\s*edbo\s*/gi, '').trim();

  branchOffices.push({
    id: `branch_${idCounter++}`,
    numericId: idCounter - 1,
    isBranchOffice: true,
    officeType: isEdbo ? 'EDBO' : 'Branch Office',
    divisionEn: distInfo.divEn,
    divisionBn: distInfo.divBn,
    districtEn: distInfo.en,
    districtBn: distInfo.bn,
    thanaBn: thanaBn,
    thanaEn: r.upazila,
    postOfficeEn: officeEn,
    postOfficeBn: cleanName, // English transliteration fallback or office name
    postCodeEn: '',
    postCodeBn: 'প্রযোজ্য নয়',
    rawPostCode: '',
    sourceUrl: r.sourceUrl
  });
});

// Group by district
const districtGroupMap = {};
branchOffices.forEach(b => {
  if (!districtGroupMap[b.districtEn]) {
    districtGroupMap[b.districtEn] = {
      districtBn: b.districtBn,
      districtEn: b.districtEn,
      divisionBn: b.divisionBn,
      divisionEn: b.divisionEn,
      branchOffices: []
    };
  }
  districtGroupMap[b.districtEn].branchOffices.push(b);
});

const outputData = {
  metadata: {
    title: 'Bangladesh Post Office - Branch Offices without Separate Post Code',
    titleBn: 'বাংলাদেশ ডাক বিভাগ - পোস্ট কোড বিহীন শাখা ডাকঘর তালিকা (EDBO/শাখা অফিস)',
    description: 'Extra Departmental Branch Offices (EDBO) listed under various upazilas that do not have their own unique post code and use their parent office postal delivery code.',
    source: 'Bangladesh Post Office (বাংলাদেশ ডাক অধিদপ্তর - PMG Khulna Portal)',
    sourceUrl: 'https://pmgkhulna.bdpost.gov.bd/pages/static-pages/6922dc0b933eb65569e0e1e5',
    totalBranchOffices: branchOffices.length,
    totalDistricts: Object.keys(districtGroupMap).length,
    generatedAt: new Date().toISOString()
  },
  districts: Object.values(districtGroupMap),
  branchOffices: branchOffices
};

const jsonPath = path.resolve('src/data/branch_offices_no_postcode.json');
fs.writeFileSync(jsonPath, JSON.stringify(outputData, null, 2), 'utf8');

const jsPath = path.resolve('src/data/branch-offices-data.js');
const jsContent = `/* Auto-generated Bangladesh Post Office - Branch Offices without Post Code */\nwindow.BD_BRANCH_OFFICES_DATA = ${JSON.stringify(outputData)};\n`;
fs.writeFileSync(jsPath, jsContent, 'utf8');

console.log(`Successfully generated:`);
console.log(`- ${jsonPath} (${branchOffices.length} branch offices across ${Object.keys(districtGroupMap).length} districts)`);
console.log(`- ${jsPath}`);
