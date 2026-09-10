const fs = require('fs');

const pmg = JSON.parse(fs.readFileSync('.scripts-archive/bdpost_pmgkhulna_all.json', 'utf8'));

// Build lookup tables from PMG
const pmgByDistCode = new Map();
const pmgByCode = new Map();

pmg.records.forEach(r => {
  if (r.postCodeEn && r.postOfficeEn) {
    const k = (r.district || '') + '_' + r.postCodeEn;
    if (!pmgByDistCode.has(k)) pmgByDistCode.set(k, []);
    pmgByDistCode.get(k).push(r);

    if (!pmgByCode.has(r.postCodeEn)) pmgByCode.set(r.postCodeEn, []);
    pmgByCode.get(r.postCodeEn).push(r);
  }
});

// Explicit overrides for the 130 records that lacked postal codes on PMG website
const manualOverrides = {
  // Gazipur
  "74": { postOfficeEn: "National University", thanaEn: "Gazipur Sadar" }, // জাতীয় বিশ্ববিদ্যালয়
  // Gopalganj
  "94": { postOfficeEn: "Chandradighinala", thanaEn: "Gopalganj Sadar" }, // চন্দ্রাদিঘীনালা
  // Kishoreganj
  "110": { postOfficeEn: "Bajitpur", thanaEn: "Bajitpur" },
  "111": { postOfficeEn: "Lakshmipur", thanaEn: "Bajitpur" },
  "112": { postOfficeEn: "Sararchar", thanaEn: "Bajitpur" },
  "113": { postOfficeEn: "Bhairab", thanaEn: "Bhairab" },
  "115": { postOfficeEn: "Itna", thanaEn: "Itna" },
  "117": { postOfficeEn: "Gachi Hata", thanaEn: "Katiadi" },
  "123": { postOfficeEn: "Chhoysuti", thanaEn: "Kuliarchar" },
  "124": { postOfficeEn: "Kuliarchar", thanaEn: "Kuliarchar" },
  "125": { postOfficeEn: "Abdullahpur", thanaEn: "Mithamain" },
  "126": { postOfficeEn: "Mithamain", thanaEn: "Mithamain" },
  "127": { postOfficeEn: "Nikli", thanaEn: "Nikli" },
  "128": { postOfficeEn: "Ashtagram", thanaEn: "Ashtagram" },
  "129": { postOfficeEn: "Bangalpara", thanaEn: "Ashtagram" },
  // Manikganj
  "145": { postOfficeEn: "Daulatpur", thanaEn: "Daulatpur" },
  "146": { postOfficeEn: "Ghior", thanaEn: "Ghior" },
  "147": { postOfficeEn: "Jhitka", thanaEn: "Lechhraganj" },
  "156": { postOfficeEn: "Aricha", thanaEn: "Shibalaya" },
  "157": { postOfficeEn: "Shibalaya", thanaEn: "Shibalaya" },
  "158": { postOfficeEn: "Teota", thanaEn: "Shibalaya" },
  "159": { postOfficeEn: "Uthali", thanaEn: "Shibalaya" },
  // Munshiganj
  "173": { postOfficeEn: "Haldia SO", thanaEn: "Louhajang" },
  "181": { postOfficeEn: "Barashur", thanaEn: "Sreenagar" },
  "188": { postOfficeEn: "Betka", thanaEn: "Tongibari" },
  // Tangail
  "223": { postOfficeEn: "Balla", thanaEn: "Kalihati" },
  "227": { postOfficeEn: "Kashkaolia", thanaEn: "Kashkaolia" },
  // Mymensingh
  "241": { postOfficeEn: "Bhaluka", thanaEn: "Bhaluka" },
  "242": { postOfficeEn: "Fulbaria", thanaEn: "Fulbaria" },
  "243": { postOfficeEn: "Gafargaon", thanaEn: "Gafargaon" },
  "244": { postOfficeEn: "Kandipara", thanaEn: "Gafargaon" },
  "245": { postOfficeEn: "Duttarbazar", thanaEn: "Gafargaon" },
  "246": { postOfficeEn: "Shibganj", thanaEn: "Gafargaon" },
  "247": { postOfficeEn: "Gouripur", thanaEn: "Gouripur" },
  "248": { postOfficeEn: "Ramgopalpur", thanaEn: "Gouripur" },
  "249": { postOfficeEn: "Haluaghat", thanaEn: "Haluaghat" },
  "250": { postOfficeEn: "Dhapunia", thanaEn: "Haluaghat" },
  "251": { postOfficeEn: "Atharabari", thanaEn: "Ishwarganj" },
  "252": { postOfficeEn: "Ishwarganj", thanaEn: "Ishwarganj" },
  "253": { postOfficeEn: "Sohagi", thanaEn: "Ishwarganj" },
  "254": { postOfficeEn: "Muktagachha", thanaEn: "Muktagachha" },
  "255": { postOfficeEn: "Agriculture University", thanaEn: "Mymensingh Sadar" },
  "256": { postOfficeEn: "Mymensingh Sadar", thanaEn: "Mymensingh Sadar" },
  "257": { postOfficeEn: "Kawatkhali", thanaEn: "Mymensingh Sadar" },
  "258": { postOfficeEn: "Shambhuganj", thanaEn: "Mymensingh Sadar" },
  "259": { postOfficeEn: "Ganginarpar", thanaEn: "Mymensingh Sadar" },
  "260": { postOfficeEn: "Baiddyerbazar", thanaEn: "Mymensingh Sadar" },
  "261": { postOfficeEn: "Mymensingh Cantt", thanaEn: "Mymensingh Sadar" },
  "262": { postOfficeEn: "Nandail", thanaEn: "Nandail" },
  "263": { postOfficeEn: "Gangail", thanaEn: "Nandail" },
  "264": { postOfficeEn: "Phulpur", thanaEn: "Phulpur" },
  "265": { postOfficeEn: "Tarakanda", thanaEn: "Phulpur" },
  "266": { postOfficeEn: "Balipara", thanaEn: "Trishal" },
  "267": { postOfficeEn: "Dhala", thanaEn: "Trishal" },
  "268": { postOfficeEn: "Ramritola", thanaEn: "Trishal" },
  "269": { postOfficeEn: "Trishal", thanaEn: "Trishal" },
  "270": { postOfficeEn: "Ahmadbad", thanaEn: "Trishal" },
  "271": { postOfficeEn: "Kazirshimla", thanaEn: "Trishal" },
  // Netrokona
  "290": { postOfficeEn: "Madan", thanaEn: "Madan" },
  // Brahmanbaria
  "335": { postOfficeEn: "Jianagar", thanaEn: "Nabinagar" },
  // Chandpur
  "394": { postOfficeEn: "Chitoshi", thanaEn: "Shahrasti" },
  // Chattogram
  "478": { postOfficeEn: "Anwara", thanaEn: "Anwara" },
  "479": { postOfficeEn: "Battali", thanaEn: "Anwara" },
  "480": { postOfficeEn: "Paroikora", thanaEn: "Anwara" },
  "481": { postOfficeEn: "Boalkhali", thanaEn: "Boalkhali" },
  "482": { postOfficeEn: "Charandwip", thanaEn: "Boalkhali" },
  "483": { postOfficeEn: "Iqbal Park", thanaEn: "Boalkhali" },
  "484": { postOfficeEn: "Kadurkkhil", thanaEn: "Boalkhali" },
  "485": { postOfficeEn: "Kanoongoopara", thanaEn: "Boalkhali" },
  "486": { postOfficeEn: "Sakpura", thanaEn: "Boalkhali" },
  "487": { postOfficeEn: "Dhalghat", thanaEn: "Boalkhali" },
  "488": { postOfficeEn: "Gomdandi", thanaEn: "Boalkhali" },
  "489": { postOfficeEn: "Patiya", thanaEn: "Boalkhali" },
  "490": { postOfficeEn: "Rampur", thanaEn: "Boalkhali" },
  "491": { postOfficeEn: "Sarowatoli", thanaEn: "Boalkhali" },
  "519": { postOfficeEn: "Barma", thanaEn: "Purba Joara" },
  "520": { postOfficeEn: "Dohazari", thanaEn: "Purba Joara" },
  "521": { postOfficeEn: "Purba Joara", thanaEn: "Purba Joara" },
  "522": { postOfficeEn: "Gachhbaria", thanaEn: "Purba Joara" },
  "523": { postOfficeEn: "Bhandar Sharif", thanaEn: "Fatikchhari" },
  "524": { postOfficeEn: "Fatikchhari", thanaEn: "Fatikchhari" },
  "525": { postOfficeEn: "Harualchhari", thanaEn: "Fatikchhari" },
  "526": { postOfficeEn: "Nazirhat", thanaEn: "Fatikchhari" },
  "527": { postOfficeEn: "Nanupur", thanaEn: "Fatikchhari" },
  "528": { postOfficeEn: "Narayanhat", thanaEn: "Fatikchhari" },
  "529": { postOfficeEn: "Chittagong University", thanaEn: "Hathazari" },
  "530": { postOfficeEn: "Fateyabad", thanaEn: "Hathazari" },
  "531": { postOfficeEn: "Garduara", thanaEn: "Hathazari" },
  "532": { postOfficeEn: "Hathazari", thanaEn: "Hathazari" },
  "533": { postOfficeEn: "Katirhat", thanaEn: "Hathazari" },
  "534": { postOfficeEn: "Madrasa", thanaEn: "Hathazari" },
  "535": { postOfficeEn: "Mirzapur", thanaEn: "Hathazari" },
  "536": { postOfficeEn: "Nuralibari", thanaEn: "Hathazari" },
  "537": { postOfficeEn: "Yunus Nagar", thanaEn: "Hathazari" },
  "538": { postOfficeEn: "Banigram", thanaEn: "Jaldi" },
  "539": { postOfficeEn: "Gunagari", thanaEn: "Jaldi" },
  "540": { postOfficeEn: "Jaldi", thanaEn: "Jaldi" },
  "541": { postOfficeEn: "Khan Bahadur", thanaEn: "Jaldi" },
  "542": { postOfficeEn: "Chunati", thanaEn: "Lohagara" },
  "543": { postOfficeEn: "Lohagara", thanaEn: "Lohagara" },
  "544": { postOfficeEn: "Padua", thanaEn: "Lohagara" },
  "552": { postOfficeEn: "Mahajanhat", thanaEn: "Mirsarai" },
  "553": { postOfficeEn: "Budhpura", thanaEn: "Patiya" },
  "554": { postOfficeEn: "Patiya Head Office", thanaEn: "Patiya" },
  "555": { postOfficeEn: "Dhamair", thanaEn: "Rangunia" },
  "556": { postOfficeEn: "Rangunia", thanaEn: "Rangunia" },
  "557": { postOfficeEn: "BIT Post Office", thanaEn: "Raozan" },
  "558": { postOfficeEn: "Binajuri", thanaEn: "Raozan" },
  "559": { postOfficeEn: "Dewanpur", thanaEn: "Raozan" },
  "560": { postOfficeEn: "Fatehpur", thanaEn: "Raozan" },
  "561": { postOfficeEn: "Gohira", thanaEn: "Raozan" },
  "562": { postOfficeEn: "Noapara", thanaEn: "Raozan" },
  "563": { postOfficeEn: "Jagannath Hat", thanaEn: "Raozan" },
  "564": { postOfficeEn: "Kundeshwari", thanaEn: "Raozan" },
  "565": { postOfficeEn: "Mohamoni", thanaEn: "Raozan" },
  "566": { postOfficeEn: "Raozan", thanaEn: "Raozan" },
  "568": { postOfficeEn: "Shiberhat", thanaEn: "Sandwip" },
  "569": { postOfficeEn: "Sandwip", thanaEn: "Sandwip" },
  "570": { postOfficeEn: "Baitul Izzat", thanaEn: "Satkania" },
  "571": { postOfficeEn: "Bajalia", thanaEn: "Satkania" },
  "572": { postOfficeEn: "Satkania", thanaEn: "Satkania" },
  // Noakhali
  "650": { postOfficeEn: "Amishapara", thanaEn: "Begumganj" },
  "657": { postOfficeEn: "Durgapur", thanaEn: "Begumganj" },
  "683": { postOfficeEn: "Singbahura", thanaEn: "Chatkhil" },
  // Khulna
  "794": { postOfficeEn: "Gazirhat", thanaEn: "Dighalia" },
  // Meherpur
  "849": { postOfficeEn: "Amjhupi", thanaEn: "Meherpur Sadar" },
  // Moulvibazar
  "918": { postOfficeEn: "Baramchal", thanaEn: "Kulaura" },
  // Barishal
  "1033": { postOfficeEn: "Shikarpur", thanaEn: "Wazirpur" },
  // Sirajganj
  "1252": { postOfficeEn: "Jamirta", thanaEn: "Shahjadpur" },
  "1253": { postOfficeEn: "Kaijuri", thanaEn: "Shahjadpur" },
  "1254": { postOfficeEn: "Porjana", thanaEn: "Shahjadpur" },
  "1259": { postOfficeEn: "Tarash", thanaEn: "Tarash" },
  // Dinajpur
  "1282": { postOfficeEn: "Setabganj", thanaEn: "Bochaganj" },
  // Panchagarh
  "1329": { postOfficeEn: "Mirzapur", thanaEn: "Atwari" }
};

const thanaBnToEn = {
  'ডেমরা': 'Demra', 'কদমতলী': 'Kadamtali', 'যাত্রাবাড়ী': 'Jatrabari', 'যাত্রাবাড়ি': 'Jatrabari',
  'ঢাকা সেনানিবাস': 'Dhaka Cantonment', 'ধামরাই': 'Dhamrai', 'ধানমন্ডি': 'Dhanmondi',
  'বনানী': 'Banani', 'গুলশান': 'Gulshan', 'দোহার': 'Dohar', 'কেরানীগঞ্জ': 'Keraniganj',
  'খিলগাঁও': 'Khilgaon', 'খিলক্ষেত': 'Khilkhet', 'লালবাগ': 'Lalbagh', 'মিরপুর': 'Mirpur',
  'মোহাম্মদপুর': 'Mohammadpur', 'শের এ বাংলা নগর': 'Sher-e-Bangla Nagar', 'মতিঝিল': 'Motijheel',
  'নবাবগঞ্জ': 'Nawabganj', 'নিউমার্কেট': 'New Market', 'পল্টন': 'Paltan', 'রমনা': 'Ramna',
  'সবুজবাগ': 'Sabujbagh', 'সাভার': 'Savar', 'সূত্রাপুর': 'Sutrapur', 'তেজগাঁও': 'Tejgaon',
  'তেজগাঁও শিল্প এলাকা': 'Tejgaon Industrial Area', 'উত্তরা': 'Uttara', 'কামরাঙ্গীরচর': 'Kamrangirchar',
  'কোতোয়ালী': 'Kotwali', 'চকবাজার': 'Chawkbazar', 'বংশাল': 'Bangshal', 'শাহবাগ': 'Shahbagh',
  'শাহ আলী': 'Shah Ali', 'দারুস সালাম': 'Darus Salam', 'কাফরুল': 'Kafrul', 'ভাষানটেক': 'Bhashantek',
  'রূপনগর': 'Rupnagar', 'তুরাগ': 'Turag', 'উত্তরখান': 'Uttarkhan', 'দক্ষিণখান': 'Dakhinkhan',
  'বিমানবন্দর': 'Airport', 'ভাটারা': 'Vatara', 'বাড্ডা': 'Badda', 'হাতিরঝিল': 'Hatirjheel',
  'মুগদা': 'Mugda', 'ওয়ারী': 'Wari', 'শ্যামপুর': 'Shyampur', 'গেণ্ডারিয়া': 'Gendaria'
};

function cleanOfficeName(name) {
  if (!name) return '';
  return name.trim()
    .replace(/\s+/g, ' ');
}

// Read main postcodes
const content = fs.readFileSync('src/data/postcodes-data.js', 'utf8');
const data = JSON.parse(content.match(/window\.BD_POSTCODE_DATA\s*=\s*(\{[\s\S]*\});?\s*$/)[1]);

let enrichedCount = 0;

data.districts.forEach(d => {
  d.postOffices.forEach(po => {
    const idStr = String(po.id);
    let poEn = '';
    let thEn = '';

    // Check manual override first
    if (manualOverrides[idStr]) {
      poEn = manualOverrides[idStr].postOfficeEn;
      thEn = manualOverrides[idStr].thanaEn;
    } else {
      // Look up PMG
      const dk = d.districtBn + '_' + po.postCodeEn;
      let pmgRec = null;
      if (pmgByDistCode.has(dk)) {
        pmgRec = pmgByDistCode.get(dk)[0];
      } else if (pmgByCode.has(po.postCodeEn)) {
        pmgRec = pmgByCode.get(po.postCodeEn)[0];
      }

      if (pmgRec) {
        poEn = cleanOfficeName(pmgRec.postOfficeEn);
        thEn = cleanOfficeName(pmgRec.upazila);
      }
    }

    // If thanaEn still empty or needs mapping
    if (!thEn && thanaBnToEn[po.thanaBn]) {
      thEn = thanaBnToEn[po.thanaBn];
    }
    if (!thEn) {
      thEn = po.thanaBn;
    }

    // If poEn still empty
    if (!poEn) {
      poEn = po.postOfficeBn;
    }

    po.thanaEn = thEn;
    po.postOfficeEn = poEn;
    enrichedCount++;
  });
});

console.log('Enriched offices:', enrichedCount);

// Save postcodes-data.js
const outJs = '/* Auto-generated Bangladesh Postal Codes Data */\nwindow.BD_POSTCODE_DATA = ' + JSON.stringify(data) + ';\n';
fs.writeFileSync('src/data/postcodes-data.js', outJs, 'utf8');
console.log('Saved src/data/postcodes-data.js');

// Also save .scripts-archive/postcodes.json
fs.writeFileSync('.scripts-archive/postcodes.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Saved .scripts-archive/postcodes.json');
