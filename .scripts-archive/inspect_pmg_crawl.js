const fs = require('fs');

const pmg = JSON.parse(fs.readFileSync('.scripts-archive/bdpost_pmgkhulna_all.json', 'utf8'));
console.log('Sample records with code:', pmg.records.filter(r => r.postCodeEn).slice(0, 5));
console.log('Sample records without code:', pmg.records.filter(r => !r.postCodeEn).slice(0, 5));

// Check why postCodeEn was empty in pmgkhulna crawl:
// Look at crawl_pmgkhulna.js to see how it was crawled
