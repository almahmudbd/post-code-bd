const fs = require('fs');

const postcodesContent = fs.readFileSync('src/data/postcodes-data.js', 'utf8');
const mainData = JSON.parse(postcodesContent.replace(/^[\s\S]*?window\.BD_POSTCODE_DATA\s*=\s*/, '').replace(/;\s*$/, ''));
const branchContent = fs.readFileSync('src/data/branch-offices-data.js', 'utf8');
const branchData = JSON.parse(branchContent.replace(/^[\s\S]*?window\.BD_BRANCH_OFFICES_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

const mainList = [];
mainData.districts.forEach(d => {
  d.postOffices.forEach(po => {
    mainList.push({
      ...po,
      districtEn: d.districtEn,
      districtBn: d.districtBn
    });
  });
});

// Dictionary of known mappings between English branch office name and Bengali main office name
// We will test and expand this dictionary with all matches across all 15 districts
const manualMatches = [
  // Dhaka
  { branchEn: 'Ati', mainBn: 'আটি', district: 'Dhaka' },
  { branchEn: 'Agla', mainBn: 'আগলা', district: 'Dhaka' },
  { branchEn: 'Khalpar', mainBn: 'খালপাড়', district: 'Dhaka' },
  { branchEn: 'Narisha', mainBn: 'নারিশা', district: 'Dhaka' },
  { branchEn: 'Amin Bazar', mainBn: 'আমিন বাজার', district: 'Dhaka' },
  { branchEn: 'Rajfulbariya', mainBn: 'রাজফুলবাড়ীয়া', district: 'Dhaka' },
  { branchEn: 'Kalampur', mainBn: 'কমলপুর', district: 'Dhaka' },
  { branchEn: 'Matuail SO', mainBn: 'মাতুয়াইল', district: 'Dhaka' },

  // Narayanganj
  { branchEn: 'Nabiganj', mainBn: 'নবীগঞ্জ', district: 'Narayanganj' },
  { branchEn: 'Baronagar', mainBn: 'বারো নগর', district: 'Narayanganj' },
  { branchEn: 'Bardi', mainBn: 'বারোদি', district: 'Narayanganj' },
  { branchEn: 'Dhuptara', mainBn: 'দুপ্তারা', district: 'Narayanganj' },
  { branchEn: 'Vulta', mainBn: 'ভুলতা', district: 'Narayanganj' },

  // Munshiganj
  { branchEn: 'Katakhali', mainBn: 'কাঠাখালি', district: 'Munshiganj' },
  { branchEn: 'Rasulpur', mainBn: 'রসুলপুর', district: 'Munshiganj' },
  { branchEn: 'Hosendi', mainBn: 'হোসেন্দি', district: 'Munshiganj' },
  { branchEn: 'Baligaon', mainBn: 'বালিগাও', district: 'Munshiganj' },
  { branchEn: 'Hasail', mainBn: 'হাসাইল', district: 'Munshiganj' },
  { branchEn: 'Pura', mainBn: 'পুরা', district: 'Munshiganj' },
  { branchEn: 'Gawraganj', mainBn: 'গৌড়গঞ্জ', district: 'Munshiganj' },
  { branchEn: 'Haridia', mainBn: 'হারিদিয়া', district: 'Munshiganj' },
  { branchEn: 'Korhati', mainBn: 'করহাতি', district: 'Munshiganj' },
  { branchEn: 'Medinimondol', mainBn: 'মেদিনী মণ্ডল', district: 'Munshiganj' },
  { branchEn: 'Komarvogh', mainBn: 'কুমারভগ', district: 'Munshiganj' },
  { branchEn: 'Kolapara', mainBn: 'কলাপাড়া', district: 'Munshiganj' },
  { branchEn: 'Baghra', mainBn: 'বাঘড়া', district: 'Munshiganj' },
  { branchEn: 'Maijpara', mainBn: 'মাজপাড়া', district: 'Munshiganj' },
  { branchEn: 'Rarikhal', mainBn: 'বারিখাল', district: 'Munshiganj' },
  { branchEn: 'Baroikhali', mainBn: 'বারিখাল', district: 'Munshiganj' },

  // Narsingdi
  { branchEn: 'Karimpur', mainBn: 'করিমপুর', district: 'Narsingdi' },
  { branchEn: 'Charsindhur', mainBn: 'চরসিন্ধুর', district: 'Narsingdi' },
  { branchEn: 'Bailab', mainBn: 'বেলাব', district: 'Narsingdi' },
  { branchEn: 'Radhaganj', mainBn: 'রাধাগঞ্জ বাজার', district: 'Narsingdi' },
  { branchEn: 'Bazar Hasnabad', mainBn: 'বাজার হাসনাবাদ', district: 'Narsingdi' },

  // Gazipur
  { branchEn: 'Pubail', mainBn: 'পুবাইল', district: 'Gazipur' },
  { branchEn: 'Chandona', mainBn: 'চান্দনা', district: 'Gazipur' },
  { branchEn: 'Rajendropur Bazar', mainBn: 'রাজেন্দ্রপুর', district: 'Gazipur' },
  { branchEn: 'Satkhamair', mainBn: 'সাতখামার', district: 'Gazipur' },
  { branchEn: 'Safipur Bazar', mainBn: 'সফিপুর', district: 'Gazipur' },

  // Manikganj
  { branchEn: 'Gorpara', mainBn: 'গড়পাড়া', district: 'Manikganj' },
  { branchEn: 'Borong Gail', mainBn: 'বরংগাইল', district: 'Manikganj' },
  { branchEn: 'Mohadebpur', mainBn: 'মহাদেবপুর', district: 'Manikganj' },
  { branchEn: 'Manikgonj Bazar', mainBn: 'মানিকগঞ্জ বাজার', district: 'Manikganj' },
  { branchEn: 'Teota', mainBn: 'তেওতা', district: 'Manikganj' },
  { branchEn: 'Uthuli', mainBn: 'উঠলি', district: 'Manikganj' },
  { branchEn: 'Bayra', mainBn: 'বায়রা', district: 'Manikganj' },

  // Tangail
  { branchEn: 'Hinganagar', mainBn: 'হিংগা নগর', district: 'Tangail' },
  { branchEn: 'Pathrail', mainBn: 'পাঠারাইল', district: 'Tangail' },
  { branchEn: 'Lauhati', mainBn: 'লউহাটি', district: 'Tangail' },
  { branchEn: 'Kochua', mainBn: 'কচুয়া', district: 'Tangail' },
  { branchEn: 'Nagbari', mainBn: 'নাগবাড়ি', district: 'Tangail' },
  { branchEn: 'Jahidganj', mainBn: 'জাহিদগঞ্জ', district: 'Tangail' },
  { branchEn: 'D Pakutiya', mainBn: 'ডি পাকুটিয়া', district: 'Tangail' },
  { branchEn: 'Rajafoir', mainBn: 'রাজাফাইর', district: 'Tangail' },

  // Kishoreganj
  { branchEn: 'Nilganj', mainBn: 'নীলগঞ্জ', district: 'Kishoreganj' },
  { branchEn: 'Maijhati EDSO', mainBn: 'মাইজহাটি', district: 'Kishoreganj' },
  { branchEn: 'Gachhi Hata SO', mainBn: 'গচিহাটা', district: 'Kishoreganj' },

  // Netrokona
  { branchEn: 'Shaldigha', mainBn: 'শালদিঘা', district: 'Netrokona' }
];

console.log('Total identified so far in manual list:', manualMatches.length);
