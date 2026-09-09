const fs = require('fs');

const html = fs.readFileSync('C:/Users/almahmud/.gemini/antigravity-ide/brain/7d4f65a6-bdf3-4e12-a29d-277a2a639052/.system_generated/steps/11/content.md', 'utf8');

const tableRegex = /<table class="wikitable"[\s\S]*?<\/table>/g;
const firstTable = tableRegex.exec(html)[0];
console.log('First Table Snippet:');
console.log(firstTable.slice(0, 1000));
