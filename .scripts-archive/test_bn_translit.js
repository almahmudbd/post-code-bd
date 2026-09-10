const fs = require('fs');

// Transliteration engine tailored specifically for Bangladeshi place names
function transliterateEnToBn(text) {
  if (!text) return '';
  
  // Clean prefixes/suffixes
  let cleanName = text
    .replace(/\s*EDBO\b/gi, '')
    .replace(/\s*EDSO\b/gi, '')
    .replace(/\s*SO\b/gi, '')
    .replace(/\s*TSO\b/gi, '')
    .replace(/\s*B\.?O\b/gi, '')
    .trim();

  // Common place name word dictionary
  const wordMap = {
    'uttar': 'উত্তর', 'uttor': 'উত্তর', 'dokkhin': 'দক্ষিণ', 'dakkhin': 'দক্ষিণ', 'south': 'দক্ষিণ', 'north': 'উত্তর',
    'purba': 'পূর্ব', 'purbo': 'পূর্ব', 'paschim': 'পশ্চিম', 'moddho': 'মধ্য', 'modda': 'মধ্য',
    'bazar': 'বাজার', 'hat': 'হাট', 'char': 'চর', 'nagar': 'নগর', 'pur': 'পুর', 'para': 'পাড়া',
    'gaon': 'গাঁও', 'gram': 'গ্রাম', 'kandi': 'কান্দি', 'tola': 'তোলা', 'toli': 'তলী', 'bari': 'বাড়ী',
    'bariya': 'বাড়িয়া', 'baria': 'বাড়িয়া', 'diya': 'দিয়া', 'dia': 'দিয়া', 'dighi': 'দিঘী', 'pukur': 'পুকুর',
    'chala': 'চালা', 'khola': 'খোলা', 'bagh': 'বাগ', 'bag': 'বাগ', 'ganj': 'গঞ্জ', 'gonj': 'গঞ্জ',
    'shohor': 'শহর', 'sadar': 'সদর', 'college': 'কলেজ', 'madrasa': 'মাদ্রাসা', 'mills': 'মিলস',
    'chawk': 'চক', 'chowk': 'চক', 'bondo': 'বন্দ', 'khal': 'খাল', 'par': 'পাড়', 'ghat': 'ঘাট',
    'teka': 'টেকা', 'tek': 'টেক', 'mor': 'মোড়', 'mora': 'মোড়া', 'konda': 'কোন্ডা',
    'ashrafabad': 'আশরাফাবাদ',
    'pangaon': 'পানগাঁও',
    'baktarchar': 'বক্তারচর',
    'talepur': 'তালেপুর',
    'beuta': 'বেউতা',
    'baghoir': 'বাঘৈর',
    'paschimdi': 'পশ্চিমদী',
    'rahitpur': 'রোহিতপুর',
    'brahammankirti': 'ব্রাহ্মণকীর্তি',
    'rajabari': 'রাজাবাড়ী',
    'shakta': 'শাক্তা',
    'shyamlapur': 'শ্যামলাপুর',
    'shuvadda': 'শুভাঢ্যা',
    'sonakanda': 'সোনাকান্দা',
    'doleshor': 'দলেশ্বর',
    'teghoria': 'তেঘরিয়া',
    'par gandaria': 'পার গেন্ডারিয়া',
    'abdullapur': 'আব্দুল্লাহপুর',
    'itavara': 'ইটাভাড়া',
    'taranagar': 'তারানগর',
    'kharakandi': 'খাড়াকান্দি',
    'kolakopa': 'কলাকোপা',
    'gobindopur': 'গোবিন্দপুর',
    'galimpur': 'গালিমপুর',
    'choto box nagar': 'ছোট বক্সনগর',
    'jalalchar': 'জালালচর',
    'paragram': 'পারাগ্রাম',
    'braha': 'ব্রাহা',
    'bardhanpara': 'বর্ধনপাড়া',
    'mohabbatpur': 'মহব্বতপুর',
    'mashail': 'মাশাইল',
    'sholla': 'শোল্লা',
    'kailail': 'কৈলাইল',
    'aona': 'আওনা',
    'patiljhap': 'পাতিলঝাপ',
    'meleng': 'মেলেন',
    'dakkhin balukhondo': 'দক্ষিণ বালুখণ্ড',
    'khanepur': 'খানেপুর',
    'dewtola': 'দেওতোলা',
    'kuthuri': 'কুঠুরি',
    'joykrishnapur': 'জয়কৃষ্ণপুর',
    'karpara': 'করপাড়া',
    'shikaripara': 'শিকারীপূরা',
    'hat baruakhali': 'হাট বারুয়াখালী',
    'tasulla banglabazar': 'তাসুল্লা বাংলাবাজার',
    'al-amin bazar': 'আল-আমিন বাজার',
    'harichandi': 'হরিচণ্ডী',
    'dohar': 'দোহার',
    'meghula': 'মেঘুলা',
    'aorangabad': 'আওরঙ্গবাদ',
    'kusumhati': 'কুসুমহাটি',
    'dokkhin braha': 'দক্ষিণ ব্রাহা',
    'jamalchar': 'জামালচর',
    'vakurta': 'ভাকুর্তা',
    'rajashon': 'রাজাশন',
    'hemayetpur': 'হেমায়েতপুর',
    'moshurikhola': 'মসুরীখোলা',
    'shobahanbagh': 'সোবহানবাগ',
    'nayarhat': 'নয়ারহাট',
    'biruliya': 'বিরুলিয়া',
    'nagarkonda': 'নগরকোন্ডা',
    'ashuliya': 'আশুলিয়া',
    'zirabo': 'জিরাবো',
    'crp chapain': 'সিআরপি চাপাইন',
    'mirzanagar': 'মির্জানগর',
    'senwaliya': 'সেনওয়ালিয়া',
    'noihati bazar': 'নৈহাটি বাজার',
    'uttor gazirchat': 'উত্তর গাজীchat',
    'dhamsona': 'ধামসোনা',
    'balia': 'বালিয়া',
    'amta': 'আমতা',
    'dimukha': 'দিমুখা',
    'barigaon': 'বাড়ীগাঁও',
    'toperbari': 'টোপেরবাড়ী',
    'suapur': 'সুয়াপুর',
    'deldha': 'দেলধা',
    'shoilain': 'শৈলান',
    'jadabpur': 'যাদবপুর',
    'berosh': 'বেরোশ',
    'bannal': 'বান্নাল',
    'mangalbari': 'মঙ্গলবাড়ী',
    'nannar': 'নান্নার',
    'jalsin': 'জালসিন',
    'rowail': 'রোয়াইল',
    'kathaliya nabogram': 'কাঠালিয়া নবগ্রাম',
    'sanora': 'সানোড়া',
    'nowga bazar': 'নওগাঁ বাজার',
    'gangutiya': 'গাঙ্গুটিয়া',
    'jalsha': 'জালশা',
    'sahabelishwar': 'সাহাবেলীশ্বর',
    'chowhatto': 'চৌহাট',
    'rajapur': 'রাজাপুর',
    'purbagram': 'পূর্বগ্রাম',
    'tarab': 'তারাব',
    'jatramura': 'যাত্রামুড়া',
    'paradgair': 'প্যারাদগাইর',
    'sanarpar': 'সানারপাড়',
    'tushardhara': 'তুষারধারা',
    'merajnagar': 'মেরাজনগর',
    'habibnagar': 'হাবিবনগর'
  };

  const lower = cleanName.toLowerCase().trim();
  if (wordMap[lower]) return wordMap[lower];

  // Tokenize words
  const words = cleanName.split(/\s+/);
  const bnWords = words.map(w => {
    const wLower = w.toLowerCase();
    if (wordMap[wLower]) return wordMap[wLower];
    return transliterateWord(w);
  });

  return bnWords.join(' ');
}

// Phonetic letter transliterator
function transliterateWord(w) {
  let s = w.toLowerCase();
  
  // common suffix patterns
  const suffixes = [
    { en: 'nagar', bn: 'নগর' },
    { en: 'pur', bn: 'পুর' },
    { en: 'para', bn: 'পাড়া' },
    { en: 'gaon', bn: 'গাঁও' },
    { en: 'gram', bn: 'গ্রাম' },
    { en: 'kandi', bn: 'কান্দি' },
    { en: 'bazar', bn: 'বাজার' },
    { en: 'char', bn: 'চর' },
    { en: 'hat', bn: 'হাট' },
    { en: 'bari', bn: 'বাড়ী' },
    { en: 'dighi', bn: 'দিঘী' },
    { en: 'toli', bn: 'তলী' },
    { en: 'tola', bn: 'তোলা' },
    { en: 'khali', bn: 'খালী' },
    { en: 'mari', bn: 'মারী' },
    { en: 'gachha', bn: 'গাছা' },
    { en: 'gacha', bn: 'গাছা' },
    { en: 'khola', bn: 'খোলা' },
    { en: 'hati', bn: 'হাটি' }
  ];

  for (const suf of suffixes) {
    if (s.length > suf.en.length + 2 && s.endsWith(suf.en)) {
      const stem = s.slice(0, -suf.en.length);
      return transliterateRaw(stem) + suf.bn;
    }
  }

  return transliterateRaw(s);
}

function transliterateRaw(str) {
  // Direct character mappings
  const patterns = [
    ['kkh', 'ক্ষ'], ['chh', 'ছ'], ['shw', 'শ্ব'], ['sh', 'শ'], ['ch', 'চ'],
    ['kh', 'খ'], ['gh', 'ঘ'], ['jh', 'ঝ'], ['th', 'থ'], ['dh', 'ধ'],
    ['ph', 'ফ'], ['bh', 'ভ'], ['rh', 'ঢ়'], ['ng', 'ঙ'],
    ['oo', 'ু'], ['ee', 'ী'], ['ai', 'াই'], ['oi', 'ৈ'], ['ou', 'ৌ'],
    ['aa', 'া'], ['au', 'ৌ'],
    ['k', 'ক'], ['g', 'গ'], ['j', 'জ'], ['t', 'ট'], ['d', 'ড'],
    ['n', 'ন'], ['p', 'প'], ['f', 'ফ'], ['b', 'ব'], ['m', 'ম'],
    ['y', 'য়'], ['r', 'র'], ['l', 'ল'], ['v', 'ভ'], ['w', 'ওয়'],
    ['s', 'স'], ['h', 'হ'], ['z', 'জ'],
    ['a', 'া'], ['e', 'ে'], ['i', 'ি'], ['o', 'ো'], ['u', 'ু']
  ];

  let res = str;
  // If starts with vowel
  if (/^[aeiou]/.test(res)) {
    const vowelInit = { 'a': 'আ', 'e': 'এ', 'i': 'ই', 'o': 'ও', 'u': 'উ' };
    const first = res[0];
    res = vowelInit[first] + res.slice(1);
  }

  patterns.forEach(([p, r]) => {
    res = res.replaceAll(p, r);
  });

  return res;
}

console.log('Sample translations:');
['Ashrafabad', 'Uttar Pangaon', 'Baktarchar', 'Talepur', 'Hemayetpur', 'Ashuliya', 'Zirabo', 'Balia'].forEach(name => {
  console.log(`${name} => ${transliterateEnToBn(name)}`);
});
