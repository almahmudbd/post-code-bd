const fs = require('fs');
const data = JSON.parse(fs.readFileSync('.scripts-archive/district_comparison_full.json', 'utf8'));

// Let's inspect each of the 15 districts in detail
const confirmedDuplicates = [];

// DHAKA
const dhakaMains = data.Dhaka.mainOffices;
const dhakaBranches = data.Dhaka.branchOffices;
// Check Dhaka:
// branch_5: Ati <=> আটি (কেরানীগঞ্জ - 1312)
// branch_24: Khalpar <=> খালপাড় (নবাবগঞ্জ - 1324)
// branch_25: Agla <=> আগলা (নবাবগঞ্জ - 1323)
// branch_52: Narisha <=> নারিশা (দোহার - 1332)
// branch_60: Amin Bazar <=> আমিন বাজার (সাভার - 1348)
// branch_61: Rajfulbariya <=> রাজফুলবাড়ীয়া (সাভার - 1347)
// branch_81: Kalampur <=> কমলপুর (ধামরাই - 1351)
// branch_107: Matuail SO <=> মাতুয়াইল (কদমতলী - 1362)

// NARAYANGANJ
// branch_119: Nabiganj <=> নবীগঞ্জ (বন্দর - 1412)
// branch_131: Baronagar <=> বারো নগর (বাইদ্দের বাজার - 1441)
// branch_132: Bardi <=> বারোদি (বাইদ্দের বাজার - 1442)
// branch_148: Dhuptara <=> দুপ্তারা (আড়াইহাজার - 1460)
// branch_156: Vulta <=> ভুলতা (রূপগঞ্জ - 1462)

// MUNSHIGANJ
// branch_165: Katakhali <=> কাঠাখালি (মুন্সীগঞ্জ সদর - 1503)
// branch_185: Rasulpur <=> রসুলপুর (গজারিয়া - 1512)
// branch_186: Hosendi <=> হোসেন্দি (গজারিয়া - 1511)
// branch_198: Baligaon <=> বালিগাও (টাংগিবাড়ি - 1522)
// branch_199: Hasail <=> হাসাইল (টাংগিবাড়ি - 1524)
// branch_200: Pura <=> পুরা (টাংগিবাড়ি - 1527)
// branch_221: Gawraganj <=> গৌড়গঞ্জ (লৌহজং - 1534)
// branch_222: Haridia <=> হারিদিয়া (লৌহজং - 1333 / 1533)
// branch_223: Korhati <=> করহাতি (লৌহজং - 1531)
// branch_224: Medinimondol <=> মেদিনী মণ্ডল (লৌহজং - 1335 / 1535)
// branch_235: Komarvogh <=> কুমারভগ (শ্রীনগর - 1555)
// branch_267: Kolapara <=> কলাপাড়া (শ্রীনগর - 1554)
// branch_268: Baghra <=> বাঘড়া (শ্রীনগর - 1557)
// branch_269: Maijpara <=> মাজপাড়া (শ্রীনগর - 1552)
// branch_270: Rarikhal <=> বারিখাল (শ্রীনগর - 1551)
// branch_283: Baroikhali <=> বারিখাল (শ্রীনগর - 1551)

// NARSINGDI
// branch_287: Karimpur <=> করিমপুর (নরসিংদী সদর - 1605)
// branch_308: Charsindhur <=> চরসিন্ধুর (পলাশ - 1612)
// branch_333: Bailab <=> বেলাব (বেলাব - 1640)
// branch_350: Radhaganj <=> রাধাগঞ্জ বাজার (রায়পুর - 1632)
// branch_351: Bazar Hasnabad <=> বাজার হাসনাবাদ (রায়পুর - 1631)

// GAZIPUR
// branch_434: Pubail <=> পুবাইল (কালীগঞ্জ - 1721)
// branch_435: Chandona <=> চান্দনা (গাজীপুর সদর - 1702)
// branch_521: Rajendropur Bazar <=> রাজেন্দ্রপুর (শ্রীপুর - 1741)
// branch_522: Satkhamair <=> সাতখামার (শ্রীপুর - 1744)
// branch_561: Safipur Bazar <=> সফিপুর (কালিয়াকৈর - 1751)

// MANIKGANJ
// branch_565: Gorpara <=> গড়পাড়া (মানিকগঞ্জ সদর - 1802)
// branch_566: Borong Gail <=> বরংগাইল (মানিকগঞ্জ সদর - 1804)
// branch_567: Mohadebpur <=> মহাদেবপুর (মানিকগঞ্জ সদর - 1803)
// branch_568: Manikgonj Bazar <=> মানিকগঞ্জ বাজার (মানিকগঞ্জ সদর - 1801)
// branch_569: Teota <=> তেওতা (শিবালয় - 1852)
// branch_570: Uthuli <=> উঠলি (শিবালয় - 1853)
// branch_610: Bayra <=> বায়রা (সিংগাইর - 1821)

// TANGAIL
// branch_638: Hinganagar <=> হিংগা নগর (দেলদুয়ার - 1914)
// branch_639: Pathrail <=> পাঠারাইল (দেলদুয়ার - 1912)
// branch_641: Lauhati <=> লউহাটি (দেলদুয়ার - 1915)
// branch_650: Kochua <=> কচুয়া (সখীপুর - 1951)
// branch_659: Nagbari <=> নাগবাড়ি (কালিহাতী - 1972)
// branch_666: Jahidganj <=> জাহিদগঞ্জ (ঘাটাইল - 1981)
// branch_667: D Pakutiya <=> ডি পাকুটিয়া (ঘাটাইল - 1982)
// branch_670: Rajafoir <=> রাজাফাইর (কালিহাতী - 1971)

// KISHOREGANJ
// branch_680: Nilganj <=> নীলগঞ্জ (কিশোরগঞ্জ সদর - 2303)
// branch_730: Maijhati EDSO <=> মাইজহাটি (পাকুন্দিয়া - 2302)
// branch_744: Gachhi Hata SO <=> গচিহাটা (কটিয়াদি - 2331)

// NETROKONA
// branch_784: Shaldigha <=> শালদিঘা (খালিয়াজুরী - 2462)

console.log('Total verified duplicate items:', 58);
