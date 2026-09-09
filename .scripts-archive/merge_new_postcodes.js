const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const postcodesJsonPath = path.join(dataDir, 'postcodes.json');
const postcodesJsPath = path.join(dataDir, 'postcodes-data.js');

const localData = JSON.parse(fs.readFileSync(postcodesJsonPath, 'utf8'));

// The 32 post office records from Bangladesh Post Office (BD Post) to merge
const newPostOffices = [
  {
    districtBn: 'মুন্সীগঞ্জ',
    districtEn: 'Munshiganj',
    divisionBn: 'ঢাকা',
    divisionEn: 'Dhaka',
    thanaBn: 'লৌহজং',
    postOfficeBn: 'মেদিনী মণ্ডল',
    postOfficeEn: 'Medini Mandal EDSO',
    postCodeEn: '1535',
    postCodeBn: '১৫৩৫'
  },
  {
    districtBn: 'গাজীপুর',
    districtEn: 'Gazipur',
    divisionBn: 'ঢাকা',
    divisionEn: 'Dhaka',
    thanaBn: 'গাজীপুর সদর',
    postOfficeBn: 'ইপশা (BSMRAU)',
    postOfficeEn: 'Ipsha SO',
    postCodeEn: '1706',
    postCodeBn: '১৭০৬'
  },
  {
    districtBn: 'টাঙ্গাইল',
    districtEn: 'Tangail',
    divisionBn: 'ঢাকা',
    divisionEn: 'Dhaka',
    thanaBn: 'খাস কাওলিয়া',
    postOfficeBn: 'খাস কাওলিয়া',
    postOfficeEn: 'Khas Kaolia UPO',
    postCodeEn: '1921',
    postCodeBn: '১৯২১'
  },
  {
    districtBn: 'সিলেট',
    districtEn: 'Sylhet',
    divisionBn: 'সিলেট',
    divisionEn: 'Sylhet',
    thanaBn: 'ফেঞ্চুগঞ্জ',
    postOfficeBn: 'ভাটেরা',
    postOfficeEn: 'Vatera SO',
    postCodeEn: '3118',
    postCodeBn: '৩১১৮'
  },
  {
    districtBn: 'মৌলভীবাজার',
    districtEn: 'Moulvibazar',
    divisionBn: 'সিলেট',
    divisionEn: 'Sylhet',
    thanaBn: 'কুলাউড়া',
    postOfficeBn: 'বরমচাল',
    postOfficeEn: 'Baramchal SO',
    postCodeEn: '3236',
    postCodeBn: '৩২৩৬'
  },
  {
    districtBn: 'ব্রাহ্মণবাড়িয়া',
    districtEn: 'Brahmanbaria',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'নবীনগর',
    postOfficeBn: 'জীবনগঞ্জ বাজার',
    postOfficeEn: 'Jibongonj Bazar EDSO',
    postCodeEn: '3416',
    postCodeBn: '৩৪১৬'
  },
  {
    districtBn: 'কুমিল্লা',
    districtEn: 'Cumilla',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'কুমিল্লা সদর',
    postOfficeBn: 'শিবপুর',
    postOfficeEn: 'Shibpur SO',
    postCodeEn: '3505',
    postCodeBn: '৩৫০৫'
  },
  {
    districtBn: 'কুমিল্লা',
    districtEn: 'Cumilla',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'মেঘনা',
    postOfficeBn: 'মেঘনা',
    postOfficeEn: 'Meghna SO',
    postCodeEn: '3512',
    postCodeBn: '৩৫১২'
  },
  {
    districtBn: 'কুমিল্লা',
    districtEn: 'Cumilla',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'হোমনা',
    postOfficeBn: 'তারাকান্দি',
    postOfficeEn: 'Tarakandi SO',
    postCodeEn: '3547',
    postCodeBn: '৩৫৪৭'
  },
  {
    districtBn: 'কুমিল্লা',
    districtEn: 'Cumilla',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'লাকসাম',
    postOfficeBn: 'ছোট শরীফপুর',
    postOfficeEn: 'Choto Sharifpur SO',
    postCodeEn: '3573',
    postCodeBn: '৩৫৭৩'
  },
  {
    districtBn: 'চাঁদপুর',
    districtEn: 'Chandpur',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'মতলব উত্তর',
    postOfficeBn: 'ছেঙ্গারচর',
    postOfficeEn: 'Changerchar SO',
    postCodeEn: '3643',
    postCodeBn: '৩৬৪৩'
  },
  {
    districtBn: 'লক্ষ্মীপুর',
    districtEn: 'Lakshmipur',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'রামগঞ্জ',
    postOfficeBn: 'ভাটরা',
    postOfficeEn: 'Vatra SO',
    postCodeEn: '3726',
    postCodeBn: '৩৭২৬'
  },
  {
    districtBn: 'লক্ষ্মীপুর',
    districtEn: 'Lakshmipur',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'রামগঞ্জ',
    postOfficeBn: 'সোনাপুর বাজার',
    postOfficeEn: 'Sonapur Bazar SO',
    postCodeEn: '3727',
    postCodeBn: '৩৭২৭'
  },
  {
    districtBn: 'নোয়াখালী',
    districtEn: 'Noakhali',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'নোয়াখালী সদর',
    postOfficeBn: 'বান্ধের হাট',
    postOfficeEn: 'Bander Hat EDSO',
    postCodeEn: '3805',
    postCodeBn: '৩৮০৫'
  },
  {
    districtBn: 'নোয়াখালী',
    districtEn: 'Noakhali',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'সুবর্ণচর',
    postOfficeBn: 'চরবাটা',
    postOfficeEn: 'Charbata SO',
    postCodeEn: '3813',
    postCodeBn: '৩৮১৩'
  },
  {
    districtBn: 'নোয়াখালী',
    districtEn: 'Noakhali',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'বেগমগঞ্জ',
    postOfficeBn: 'দুর্গাপুর',
    postOfficeEn: 'Durgapur EDSO',
    postCodeEn: '3826',
    postCodeBn: '৩৮২৬'
  },
  {
    districtBn: 'নোয়াখালী',
    districtEn: 'Noakhali',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'বেগমগঞ্জ',
    postOfficeBn: 'আমিশাপাড়া',
    postOfficeEn: 'Amishapara SO',
    postCodeEn: '3836',
    postCodeBn: '৩৮৩৬'
  },
  {
    districtBn: 'নোয়াখালী',
    districtEn: 'Noakhali',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'চাটখিল',
    postOfficeBn: 'সিং বাহুড়া',
    postOfficeEn: 'Sing Bahura EDSO',
    postCodeEn: '3876',
    postCodeBn: '৩৮৭৬'
  },
  {
    districtBn: 'চট্টগ্রাম',
    districtEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'সীতাকুণ্ড',
    postOfficeBn: 'আইআইইউসি (IIUC)',
    postOfficeEn: 'IIUC SO',
    postCodeEn: '4318',
    postCodeBn: '৪৩১৮'
  },
  {
    districtBn: 'চট্টগ্রাম',
    districtEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'মীরসরাই',
    postOfficeBn: 'মহাজনহাট',
    postOfficeEn: 'Mahajanhat SO',
    postCodeEn: '4326',
    postCodeBn: '৪৩২৬'
  },
  {
    districtBn: 'বান্দরবান',
    districtEn: 'Bandarban',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    thanaBn: 'লামা',
    postOfficeBn: 'লামা সদর',
    postOfficeEn: 'Lama SO',
    postCodeEn: '4640',
    postCodeBn: '৪৬৪০'
  },
  {
    districtBn: 'রাজশাহী',
    districtEn: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    divisionEn: 'Rajshahi',
    thanaBn: 'বোয়ালিয়া',
    postOfficeBn: 'পদ্মা আবাসিক',
    postOfficeEn: 'Padma Residence TSO',
    postCodeEn: '6207',
    postCodeBn: '৬২০৭'
  },
  {
    districtBn: 'রাজশাহী',
    districtEn: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    divisionEn: 'Rajshahi',
    thanaBn: 'পবা',
    postOfficeBn: 'নওহাটা বাজার',
    postOfficeEn: 'Naohata Bazar SO',
    postCodeEn: '6213',
    postCodeBn: '৬২১৩'
  },
  {
    districtBn: 'নাটোর',
    districtEn: 'Natore',
    divisionBn: 'রাজশাহী',
    divisionEn: 'Rajshahi',
    thanaBn: 'বড়াইগ্রাম',
    postOfficeBn: 'আহমেদপুর বাজার',
    postOfficeEn: 'Ahmedpur Bazar SO',
    postCodeEn: '6433',
    postCodeBn: '৬৪৩৩'
  },
  {
    districtBn: 'নওগাঁ',
    districtEn: 'Naogaon',
    divisionBn: 'রাজশাহী',
    divisionEn: 'Rajshahi',
    thanaBn: 'নওগাঁ সদর',
    postOfficeBn: 'নওগাঁ পোস্ট',
    postOfficeEn: 'Naogaon Post TSO',
    postCodeEn: '6501',
    postCodeBn: '৬৫০১'
  },
  {
    districtBn: 'সিরাজগঞ্জ',
    districtEn: 'Sirajganj',
    divisionBn: 'রাজশাহী',
    divisionEn: 'Rajshahi',
    thanaBn: 'বেলকুচি',
    postOfficeBn: 'এনায়েতপুর',
    postOfficeEn: 'Enayetpur EDSO',
    postCodeEn: '6743',
    postCodeBn: '৬৭৪৩'
  },
  {
    districtBn: 'সিরাজগঞ্জ',
    districtEn: 'Sirajganj',
    divisionBn: 'রাজশাহী',
    divisionEn: 'Rajshahi',
    thanaBn: 'বেলকুচি',
    postOfficeBn: 'স্থল',
    postOfficeEn: 'Sthal SO',
    postCodeEn: '6744',
    postCodeBn: '৬৭৪৪'
  },
  {
    districtBn: 'সিরাজগঞ্জ',
    districtEn: 'Sirajganj',
    divisionBn: 'রাজশাহী',
    divisionEn: 'Rajshahi',
    thanaBn: 'উল্লাপাড়া',
    postOfficeBn: 'উল্লাপাড়া সদর',
    postOfficeEn: 'Ullahpara UPO',
    postCodeEn: '6750',
    postCodeBn: '৬৭৫০'
  },
  {
    districtBn: 'সিরাজগঞ্জ',
    districtEn: 'Sirajganj',
    divisionBn: 'রাজশাহী',
    divisionEn: 'Rajshahi',
    thanaBn: 'উল্লাপাড়া',
    postOfficeBn: 'সলপ',
    postOfficeEn: 'Salap EDSO',
    postCodeEn: '6753',
    postCodeBn: '৬৭৫৩'
  },
  {
    districtBn: 'বরিশাল',
    districtEn: 'Barishal',
    divisionBn: 'বরিশাল',
    divisionEn: 'Barishal',
    thanaBn: 'বরিশাল সদর',
    postOfficeBn: 'রূপাতলী হাউজিং এস্টেট',
    postOfficeEn: 'Rupatoli Housing Estate SO',
    postCodeEn: '8207',
    postCodeBn: '৮২০৭'
  },
  {
    districtBn: 'বরিশাল',
    districtEn: 'Barishal',
    divisionBn: 'বরিশাল',
    divisionEn: 'Barishal',
    thanaBn: 'বাবুগঞ্জ',
    postOfficeBn: 'বাবুগঞ্জ বন্দর',
    postOfficeEn: 'Babugonj Bandar SO',
    postCodeEn: '8217',
    postCodeBn: '৮২১৭'
  },
  {
    districtBn: 'পটুয়াখালী',
    districtEn: 'Patuakhali',
    divisionBn: 'বরিশাল',
    divisionEn: 'Barishal',
    thanaBn: 'মির্জাগঞ্জ',
    postOfficeBn: 'কাঠালতলী বাজার',
    postOfficeEn: 'Khataltali Bazar SO',
    postCodeEn: '8611',
    postCodeBn: '৮৬১১'
  }
];

// Find current max id
let maxId = 0;
localData.districts.forEach(d => {
  d.postOffices.forEach(p => {
    if (p.id > maxId) maxId = p.id;
  });
});

console.log(`Starting merge. Previous total offices: ${maxId}`);

let addedCount = 0;
for (const item of newPostOffices) {
  // Find matching district
  const district = localData.districts.find(d => 
    d.districtBn === item.districtBn || 
    d.districtEn.toLowerCase() === item.districtEn.toLowerCase()
  );

  if (!district) {
    console.error(`District not found for: ${item.districtBn} (${item.districtEn})`);
    continue;
  }

  // Check if post code already exists in this district
  const exists = district.postOffices.some(p => p.postCodeEn === item.postCodeEn);
  if (exists) {
    console.log(`Post code ${item.postCodeEn} already exists in ${district.districtEn}`);
    continue;
  }

  maxId++;
  const newRecord = {
    id: maxId,
    divisionEn: district.divisionEn,
    divisionBn: district.divisionBn,
    districtEn: district.districtEn,
    districtBn: district.districtBn,
    thanaBn: item.thanaBn,
    postOfficeBn: item.postOfficeBn,
    postCodeEn: item.postCodeEn,
    postCodeBn: item.postCodeBn
  };

  district.postOffices.push(newRecord);
  addedCount++;
}

// Update total count
let finalTotal = 0;
localData.districts.forEach(d => {
  finalTotal += d.postOffices.length;
});

localData.metadata.totalPostOffices = finalTotal;
localData.metadata.source = 'Bengali Wikipedia & Bangladesh Post Office (বাংলাদেশ ডাক অধিদপ্তর)';
localData.metadata.generatedAt = new Date().toISOString();

// Write back to JSON
fs.writeFileSync(postcodesJsonPath, JSON.stringify(localData, null, 2), 'utf8');

// Write back to JS
const jsContent = `/* Auto-generated Bangladesh Postal Codes Data */\nwindow.BD_POSTCODE_DATA = ${JSON.stringify(localData)};\n`;
fs.writeFileSync(postcodesJsPath, jsContent, 'utf8');

console.log(`Merge complete! Added ${addedCount} new post offices.`);
console.log(`New total post offices: ${finalTotal}`);
