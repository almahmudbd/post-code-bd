const fs = require('fs');

const data = JSON.parse(fs.readFileSync('.scripts-archive/district_comparison_full.json', 'utf8'));

// Common Bengali phonetics and variations
// Let's create a robust normalization function for both Bengali and English
function norm(s) {
  if (!s) return '';
  return s.toLowerCase()
    .replace(/\s*(edbo|b\.o|sub office|branch office|tso|ho|so|টিএসও|এইচও|এসও|টি\.এস\.ও|এইচ\.ও|মডেল টাউন)\s*/gi, '')
    .replace(/[^a-z0-9\u0980-\u09FF]/gi, '');
}

// Let's write a comprehensive transliteration table for Bengali to English
const bn2enMap = {
  'আটি': 'ati',
  'খালপাড়': 'khalpar',
  'আগলা': 'agla',
  'নারিশা': 'narisha',
  'আমিন বাজার': 'amin bazar',
  'রাজফুলবাড়ীয়া': 'rajfulbariya',
  'কমলপুর': 'kalampur',
  'মাতুয়াইল': 'matuail',
  'চুরাইন': 'churain',
  'দাউদপুর': 'daudpur',
  'হাসনাবাদ': 'hasnabad',
  'পালামগঞ্জ': 'palamganj',
  'জয়পাড়া': 'joypara',
  'ধামরাই': 'dhamrai',
  'কেরানীগঞ্জ': 'keranigonj',
  'কালাটিয়া': 'kalatia',
  'শিমুলিয়া': 'shimulia',
  'দনিয়া': 'dania',
  'সারুলিয়া': 'sarulia',
  'ডেমরা': 'demra',
  'বাসাবো': 'bashabo',
  'পোস্তা': 'posta',
  'তেজগাঁও': 'tejgaon',
  'মিরপুর': 'mirpur',
  'মোহাম্মদপুর': 'mohammadpur',
  'গুলশান': 'gulshan',
  'বনানী': 'banani',
  'উত্তরা': 'uttara',
  'খিলগাঁও': 'khilgaon',
  'খিলক্ষেত': 'khilkhet'
};

// Let's check district by district
let totalDuplicateCount = 0;
const resultsByDistrict = {};

for (const [dist, dData] of Object.entries(data)) {
  const branches = dData.branchOffices;
  const mains = dData.mainOffices;
  
  console.log(`\n================ ${dist} (Branches: ${branches.length}, Mains: ${mains.length}) ================`);
  
  const matches = [];
  branches.forEach(b => {
    // Check if b matches any main office
    mains.forEach(m => {
      // Direct bn2en check or substring
      // We will also print candidates if they share syllables
    });
  });
}
