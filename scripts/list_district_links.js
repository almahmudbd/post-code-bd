const fs = require('fs');

const decoded = fs.readFileSync('scripts/decoded_content.html', 'utf8');

const regex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
let match;
const links = [];

while ((match = regex.exec(decoded)) !== null) {
  const href = match[1].trim();
  const text = match[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  links.push({ href, text });
}

console.log('Found district links:', links.length);
links.forEach((l, i) => {
  console.log(`${i + 1}. [${l.text}] -> ${l.href}`);
});
