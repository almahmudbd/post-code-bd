const fs = require('fs');

const data = JSON.parse(fs.readFileSync('.scripts-archive/district_comparison_full.json', 'utf8'));

// List of all main offices in the 15 districts
const mainOfficesIn15 = [];
for (const [dist, d] of Object.entries(data)) {
  d.mainOffices.forEach(m => {
    mainOfficesIn15.push({ ...m, district: dist });
  });
}

console.log('Total main offices across the 15 districts:', mainOfficesIn15.length);

// Let's write out every main office alongside any branch offices in the same district that have similar name or thana
const findings = [];

// Check our verified duplicates list
const duplicates = [
  // Dhaka
  { branchId: 'branch_5', branchEn: 'Ati', mainId: 15, mainBn: 'আটি', code: '1312', district: 'Dhaka' },
  { branchId: 'branch_24', branchEn: 'Khalpar', mainId: 31, mainBn: 'খালপাড়', code: '1324', district: 'Dhaka' },
  { branchId: 'branch_25', branchEn: 'Agla', mainId: 27, mainBn: 'আগলা', code: '1323', district: 'Dhaka' },
  { branchId: 'branch_52', branchEn: 'Narisha', mainId: 13, mainBn: 'নারিশা', code: '1332', district: 'Dhaka' },
  { branchId: 'branch_60', branchEn: 'Amin Bazar', mainId: 37, mainBn: 'আমিন বাজার', code: '1348', district: 'Dhaka' },
  { branchId: 'branch_61', branchEn: 'Rajfulbariya', mainId: 42, mainBn: 'রাজফুলবাড়ীয়া', code: '1347', district: 'Dhaka' },
  { branchId: 'branch_81', branchEn: 'Kalampur', mainId: 7, mainBn: 'কমলপুর', code: '1351', district: 'Dhaka' },
  { branchId: 'branch_107', branchEn: 'Matuail SO', mainId: 2, mainBn: 'মাতুয়াইল', code: '1362', district: 'Dhaka' },

  // Narayanganj
  { branchId: 'branch_119', branchEn: 'Nabiganj', mainId: 209, mainBn: 'নবীগঞ্জ', code: '1412', district: 'Narayanganj' },
  { branchId: 'branch_131', branchEn: 'Baronagar', mainId: 202, mainBn: 'বারো নগর', code: '1441', district: 'Narayanganj' },
  { branchId: 'branch_132', branchEn: 'Bardi', mainId: 203, mainBn: 'বারোদি', code: '1442', district: 'Narayanganj' },
  { branchId: 'branch_148', branchEn: 'Dhuptara', mainId: 200, mainBn: 'দুপ্তারা', code: '1460', district: 'Narayanganj' },
  { branchId: 'branch_156', branchEn: 'Vulta', mainId: 213, mainBn: 'ভুলতা', code: '1462', district: 'Narayanganj' },

  // Munshiganj
  { branchId: 'branch_165', branchEn: 'Katakhali', mainId: 173, mainBn: 'কাঠাখালি', code: '1503', district: 'Munshiganj' },
  { branchId: 'branch_185', branchEn: 'Rasulpur', mainId: 165, mainBn: 'রসুলপুর', code: '1512', district: 'Munshiganj' },
  { branchId: 'branch_186', branchEn: 'Hosendi', mainId: 164, mainBn: 'হোসেন্দি', code: '1511', district: 'Munshiganj' },
  { branchId: 'branch_198', branchEn: 'Baligaon', mainId: 192, mainBn: 'বালিগাও', code: '1522', district: 'Munshiganj' },
  { branchId: 'branch_199', branchEn: 'Hasail', mainId: 195, mainBn: 'হাসাইল', code: '1524', district: 'Munshiganj' },
  { branchId: 'branch_200', branchEn: 'Pura', mainId: 196, mainBn: 'পুরা', code: '1527', district: 'Munshiganj' },
  { branchId: 'branch_221', branchEn: 'Gawraganj', mainId: 166, mainBn: 'গৌড়গঞ্জ', code: '1534', district: 'Munshiganj' },
  { branchId: 'branch_222', branchEn: 'Haridia', mainId: 168, mainBn: 'হারিদিয়া', code: '1333', district: 'Munshiganj' },
  { branchId: 'branch_223', branchEn: 'Korhati', mainId: 170, mainBn: 'করহাতি', code: '1531', district: 'Munshiganj' },
  { branchId: 'branch_224', branchEn: 'Medinimondol', mainId: 172, mainBn: 'মেদিনী মণ্ডল', code: '1335', district: 'Munshiganj' },
  { branchId: 'branch_235', branchEn: 'Komarvogh', mainId: 187, mainBn: 'কুমারভগ', code: '1555', district: 'Munshiganj' },
  { branchId: 'branch_267', branchEn: 'Kolapara', mainId: 186, mainBn: 'কলাপাড়া', code: '1554', district: 'Munshiganj' },
  { branchId: 'branch_268', branchEn: 'Baghra', mainId: 182, mainBn: 'বাঘড়া', code: '1557', district: 'Munshiganj' },
  { branchId: 'branch_269', branchEn: 'Maijpara', mainId: 188, mainBn: 'মাজপাড়া', code: '1552', district: 'Munshiganj' },
  { branchId: 'branch_270', branchEn: 'Rarikhal', mainId: 183, mainBn: 'বারিখাল', code: '1551', district: 'Munshiganj' },
  { branchId: 'branch_283', branchEn: 'Baroikhali', mainId: 183, mainBn: 'বারিখাল', code: '1551', district: 'Munshiganj' },

  // Narsingdi
  { branchId: 'branch_287', branchEn: 'Karimpur', mainId: 225, mainBn: 'করিমপুর', code: '1605', district: 'Narsingdi' },
  { branchId: 'branch_308', branchEn: 'Charsindhur', mainId: 231, mainBn: 'চরসিন্ধুর', code: '1612', district: 'Narsingdi' },
  { branchId: 'branch_333', branchEn: 'Bailab', mainId: 221, mainBn: 'বেলাব', code: '1640', district: 'Narsingdi' },
  { branchId: 'branch_350', branchEn: 'Radhaganj', mainId: 236, mainBn: 'রাধাগঞ্জ বাজার', code: '1632', district: 'Narsingdi' },
  { branchId: 'branch_351', branchEn: 'Bazar Hasnabad', mainId: 235, mainBn: 'বাজার হাসনাবাদ', code: '1631', district: 'Narsingdi' },

  // Gazipur
  { branchId: 'branch_434', branchEn: 'Pubail', mainId: 78, mainBn: 'পুবাইল', code: '1721', district: 'Gazipur' },
  { branchId: 'branch_435', branchEn: 'Chandona', mainId: 72, mainBn: 'চান্দনা', code: '1702', district: 'Gazipur' },
  { branchId: 'branch_521', branchEn: 'Rajendropur Bazar', mainId: 91, mainBn: 'রাজেন্দ্রপুর', code: '1741', district: 'Gazipur' },
  { branchId: 'branch_522', branchEn: 'Satkhamair', mainId: 89, mainBn: 'সাতখামার', code: '1744', district: 'Gazipur' },
  { branchId: 'branch_561', branchEn: 'Safipur Bazar', mainId: 76, mainBn: 'সফিপুর', code: '1751', district: 'Gazipur' },

  // Manikganj
  { branchId: 'branch_565', branchEn: 'Gorpara', mainId: 150, mainBn: 'গড়পাড়া', code: '1802', district: 'Manikganj' },
  { branchId: 'branch_566', branchEn: 'Borong Gail', mainId: 149, mainBn: 'বরংগাইল', code: '1804', district: 'Manikganj' },
  { branchId: 'branch_567', branchEn: 'Mohadebpur', mainId: 151, mainBn: 'মহাদেবপুর', code: '1803', district: 'Manikganj' },
  { branchId: 'branch_568', branchEn: 'Manikgonj Bazar', mainId: 152, mainBn: 'মানিকগঞ্জ বাজার', code: '1801', district: 'Manikganj' },
  { branchId: 'branch_569', branchEn: 'Teota', mainId: 158, mainBn: 'তেওতা', code: '1852', district: 'Manikganj' },
  { branchId: 'branch_570', branchEn: 'Uthuli', mainId: 159, mainBn: 'উঠলি', code: '1853', district: 'Manikganj' },
  { branchId: 'branch_610', branchEn: 'Bayra', mainId: 160, mainBn: 'বায়রা', code: '1821', district: 'Manikganj' },

  // Tangail
  { branchId: 'branch_638', branchEn: 'Hinganagar', mainId: 264, mainBn: 'হিংগা নগর', code: '1914', district: 'Tangail' },
  { branchId: 'branch_639', branchEn: 'Pathrail', mainId: 267, mainBn: 'পাঠারাইল', code: '1912', district: 'Tangail' },
  { branchId: 'branch_641', branchEn: 'Lauhati', mainId: 266, mainBn: 'লউহাটি', code: '1915', district: 'Tangail' },
  { branchId: 'branch_649', branchEn: 'Mirzapur Cadet College', mainId: 290, mainBn: 'এম.সি. কলেজ', code: '1942', district: 'Tangail' },
  { branchId: 'branch_650', branchEn: 'Kochua', mainId: 297, mainBn: 'কচুয়া', code: '1951', district: 'Tangail' },
  { branchId: 'branch_659', branchEn: 'Nagbari', mainId: 282, mainBn: 'নাগবাড়ি', code: '1972', district: 'Tangail' },
  { branchId: 'branch_666', branchEn: 'Jahidganj', mainId: 272, mainBn: 'জাহিদগঞ্জ', code: '1981', district: 'Tangail' },
  { branchId: 'branch_667', branchEn: 'D Pakutiya', mainId: 268, mainBn: 'ডি পাকুটিয়া', code: '1982', district: 'Tangail' },
  { branchId: 'branch_670', branchEn: 'Rajafoir', mainId: 284, mainBn: 'রাজাফাইর', code: '1971', district: 'Tangail' },

  // Kishoreganj
  { branchId: 'branch_680', branchEn: 'Nilganj', mainId: 122, mainBn: 'নীলগঞ্জ', code: '2303', district: 'Kishoreganj' },
  { branchId: 'branch_730', branchEn: 'Maijhati EDSO', mainId: 121, mainBn: 'মাইজহাটি', code: '2302', district: 'Kishoreganj' },
  { branchId: 'branch_744', branchEn: 'Gachhi Hata SO', mainId: 117, mainBn: 'গচিহাটা', code: '2331', district: 'Kishoreganj' },

  // Netrokona
  { branchId: 'branch_784', branchEn: 'Shaldigha', mainId: 365, mainBn: 'শালদিঘা', code: '2462', district: 'Netrokona' }
];

console.log('Confirmed duplicates count:', duplicates.length);

// Let's check remaining main offices to see if any others match any branch office
const duplicateBranchIds = new Set(duplicates.map(d => d.branchId));
const duplicateMainIds = new Set(duplicates.map(d => d.mainId));

console.log('Unique duplicate branch IDs:', duplicateBranchIds.size);
console.log('Unique duplicate main IDs:', duplicateMainIds.size);
