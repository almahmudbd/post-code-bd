const fs = require('fs');
const content = fs.readFileSync('scripts/decoded_content.html', 'utf8');
const regex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
let m;
while ((m = regex.exec(content)) !== null) {
  if (m[2].includes('ময়মনসিংহ')) {
    console.log('Match:', m[1], m[2]);
  }
}
