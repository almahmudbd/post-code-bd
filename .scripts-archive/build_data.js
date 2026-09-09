const fs = require('fs');
const path = require('path');

const districtEnglishMap = {
  // Dhaka Division
  'ঢাকা': 'Dhaka',
  'ফরিদপুর': 'Faridpur',
  'গাজীপুর': 'Gazipur',
  'গোপালগঞ্জ': 'Gopalganj',
  'কিশোরগঞ্জ': 'Kishoreganj',
  'মাদারীপুর': 'Madaripur',
  'মানিকগঞ্জ': 'Manikganj',
  'মুন্সীগঞ্জ': 'Munshiganj',
  'নারায়ণগঞ্জ': 'Narayanganj',
  'নরসিংদী': 'Narsingdi',
  'রাজবাড়ী': 'Rajbari',
  'শরীয়তপুর': 'Shariatpur',
  'টাঙ্গাইল': 'Tangail',

  // Mymensingh Division
  'জামালপুর': 'Jamalpur',
  'ময়মনসিংহ': 'Mymensingh',
  'নেত্রকোণা': 'Netrokona',
  'শেরপুর': 'Sherpur',

  // Chattogram Division
  'বান্দরবান': 'Bandarban',
  'ব্রাহ্মণবাড়িয়া': 'Brahmanbaria',
  'কুমিল্লা': 'Cumilla',
  'চাঁদপুর': 'Chandpur',
  'চট্টগ্রাম': 'Chattogram',
  'কক্সবাজার': "Cox's Bazar",
  'ফেনী': 'Feni',
  'খাগড়াছড়ি': 'Khagrachhari',
  'লক্ষ্মীপুর': 'Lakshmipur',
  'নোয়াখালী': 'Noakhali',
  'রাঙ্গামাটি': 'Rangamati',

  // Khulna Division
  'বাগেরহাট': 'Bagerhat',
  'চুয়াডাঙ্গা': 'Chuadanga',
  'যশোর': 'Jashore',
  'ঝিনাইদহ': 'Jhenaidah',
  'খুলনা': 'Khulna',
  'কুষ্টিয়া': 'Kushtia',
  'মাগুরা': 'Magura',
  'মেহেরপুর': 'Meherpur',
  'নড়াইল': 'Narail',
  'সাতক্ষীরা': 'Satkhira',

  // Sylhet Division
  'হবিগঞ্জ': 'Habiganj',
  'মৌলভীবাজার': 'Moulvibazar',
  'সুনামগঞ্জ': 'Sunamganj',
  'সিলেট': 'Sylhet',

  // Barishal Division
  'বরিশাল': 'Barishal',
  'ভোলা': 'Bhola',
  'ঝালকাঠি': 'Jhalokati',
  'পিরোজপুর': 'Pirojpur',
  'পটুয়াখালী': 'Patuakhali',
  'বরগুনা': 'Barguna',

  // Rajshahi Division
  'বগুড়া': 'Bogura',
  'চাঁপাইনবাবগঞ্জ': 'Chapainawabganj',
  'জয়পুরহাট': 'Joypurhat',
  'নওগাঁ': 'Naogaon',
  'নাটোর': 'Natore',
  'পাবনা': 'Pabna',
  'রাজশাহী': 'Rajshahi',
  'সিরাজগঞ্জ': 'Sirajganj',

  // Rangpur Division
  'দিনাজপুর': 'Dinajpur',
  'গাইবান্ধা': 'Gaibandha',
  'কুড়িগ্রাম': 'Kurigram',
  'লালমনিরহাট': 'Lalmonirhat',
  'নীলফামারী': 'Nilphamari',
  'পঞ্চগড়': 'Panchagarh',
  'রংপুর': 'Rangpur',
  'ঠাকুরগাঁও': 'Thakurgaon'
};

const divisionEnglishMap = {
  'ঢাকা': 'Dhaka',
  'ময়মনসিংহ': 'Mymensingh',
  'চট্টগ্রাম': 'Chattogram',
  'খুলনা': 'Khulna',
  'সিলেট': 'Sylhet',
  'বরিশাল': 'Barishal',
  'রাজশাহী': 'Rajshahi',
  'রংপুর': 'Rangpur'
};

function cleanText(str) {
  return str ? str.replace(/<[^>]+>/g, '').replace(/&#160;/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

function bnToEnDigits(str) {
  const bnDigits = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'};
  return str.replace(/[০-৯]/g, d => bnDigits[d]);
}

function enToBnDigits(str) {
  const enDigits = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
  return String(str).replace(/[0-9]/g, d => enDigits[d]);
}

const dumpPath = 'C:/Users/almahmud/.gemini/antigravity-ide/brain/7d4f65a6-bdf3-4e12-a29d-277a2a639052/.system_generated/steps/11/content.md';
const html = fs.readFileSync(dumpPath, 'utf8');

const regex = /(<div class="mw-heading mw-heading[23]"[^>]*>[\s\S]*?<\/div>|<table class="wikitable"[\s\S]*?<\/table>)/g;

let currentDivisionBn = '';
let currentDistrictBn = '';
const districts = [];
const allItems = [];
let match;
let idCounter = 1;

while ((match = regex.exec(html)) !== null) {
  const block = match[0];
  if (block.includes('mw-heading2')) {
    const text = cleanText(block);
    if (text.includes('বিভাগ')) {
      currentDivisionBn = text.replace('বিভাগ', '').trim();
    }
  } else if (block.includes('mw-heading3')) {
    const text = cleanText(block);
    if (text.includes('জেলা')) {
      currentDistrictBn = text.replace('জেলা', '').trim();
    }
  } else if (block.startsWith('<table class="wikitable"')) {
    const rows = block.match(/<tr[\s\S]*?<\/tr>/g) || [];
    if (rows.length === 0) continue;

    const districtEn = districtEnglishMap[currentDistrictBn] || currentDistrictBn;
    const divisionEn = divisionEnglishMap[currentDivisionBn] || currentDivisionBn;

    const districtItem = {
      districtBn: currentDistrictBn,
      districtEn: districtEn,
      divisionBn: currentDivisionBn,
      divisionEn: divisionEn,
      postOffices: []
    };

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const cells = (row.match(/<td[\s\S]*?<\/td>/g) || []).map(cleanText);
      if (cells.length === 0) continue;

      let thana = '', postOffice = '', rawCode = '';
      if (cells.length === 4) {
        thana = cells[1];
        postOffice = cells[2];
        rawCode = cells[3];
      } else if (cells.length === 3) {
        thana = cells[0];
        postOffice = cells[1];
        rawCode = cells[2];
      } else if (cells.length === 2) {
        thana = cells[0];
        postOffice = thana;
        rawCode = cells[1];
      } else if (cells.length >= 5) {
        thana = cells[1];
        postOffice = cells[2];
        rawCode = cells[3];
      }

      const codeEn = bnToEnDigits(rawCode).replace(/\D/g, '');
      const codeBn = enToBnDigits(codeEn);

      const record = {
        id: idCounter++,
        divisionEn,
        divisionBn: currentDivisionBn,
        districtEn,
        districtBn: currentDistrictBn,
        thanaBn: thana,
        postOfficeBn: postOffice,
        postCodeEn: codeEn,
        postCodeBn: codeBn
      };

      districtItem.postOffices.push(record);
      allItems.push(record);
    }

    districts.push(districtItem);
  }
}

console.log(`Successfully parsed ${districts.length} districts and ${allItems.length} total post offices.`);

// Ensure output directories exist
const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write postcodes.json
const outputData = {
  metadata: {
    title: 'Bangladesh Postal Codes',
    source: 'Bengali Wikipedia (বাংলাদেশের পোস্ট কোডের তালিকা)',
    totalDivisions: 8,
    totalDistricts: districts.length,
    totalPostOffices: allItems.length,
    generatedAt: new Date().toISOString()
  },
  divisions: [
    { en: 'Dhaka', bn: 'ঢাকা' },
    { en: 'Chattogram', bn: 'চট্টগ্রাম' },
    { en: 'Rajshahi', bn: 'রাজশাহী' },
    { en: 'Khulna', bn: 'খুলনা' },
    { en: 'Barishal', bn: 'বরিশাল' },
    { en: 'Sylhet', bn: 'সিলেট' },
    { en: 'Rangpur', bn: 'রংপুর' },
    { en: 'Mymensingh', bn: 'ময়মনসিংহ' }
  ],
  districts: districts
};

fs.writeFileSync(path.join(dataDir, 'postcodes.json'), JSON.stringify(outputData, null, 2), 'utf8');

// Also write as window.BD_POSTCODE_DATA to allow running locally without needing a local web server if opened via file://
const jsContent = `/* Auto-generated Bangladesh Postal Codes Data */\nwindow.BD_POSTCODE_DATA = ${JSON.stringify(outputData)};\n`;
fs.writeFileSync(path.join(dataDir, 'postcodes-data.js'), jsContent, 'utf8');

console.log('Saved to src/data/postcodes.json and src/data/postcodes-data.js');
