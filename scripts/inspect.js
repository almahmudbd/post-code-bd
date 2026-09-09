const fs = require('fs');

const html = fs.readFileSync('C:/Users/almahmud/.gemini/antigravity-ide/brain/7d4f65a6-bdf3-4e12-a29d-277a2a639052/.system_generated/steps/11/content.md', 'utf8');

// Match sections or h2 / h3 / tables
const divisionRegex = /<h2[^>]*><span[^>]*class="mw-headline"[^>]*id="([^"]*)"[^>]*>(.*?)<\/span><\/h2>|<div class="mw-heading mw-heading2"><h2[^>]*>(.*?)<\/h2>/g;

// Let's inspect HTML structure around tables
const regex = /(<h[23][^>]*>[\s\S]*?<\/h[23]>|<div class="mw-heading mw-heading[23]">[\s\S]*?<\/div>|<table class="wikitable"[\s\S]*?<\/table>)/g;

let match;
let count = 0;
let currentDivision = '';
let currentDistrict = '';
const results = [];

while ((match = regex.exec(html)) !== null && count < 20) {
  const snippet = match[0];
  if (snippet.startsWith('<div class="mw-heading') || snippet.startsWith('<h2') || snippet.startsWith('<h3')) {
    const text = snippet.replace(/<[^>]+>/g, '').trim();
    console.log('Heading:', text);
  } else if (snippet.startsWith('<table')) {
    count++;
    console.log('Table found #', count);
  }
}
