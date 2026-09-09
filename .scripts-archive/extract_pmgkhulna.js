const fs = require('fs');

const contentPath = 'C:\\Users\\almahmud\\.gemini\\antigravity-ide\\brain\\7183e0aa-8dd1-44cc-bf60-7686e1668459\\.system_generated\\steps\\13\\content.md';
const content = fs.readFileSync(contentPath, 'utf8');

const match = content.match(/<rt-renderer\s+encoded-content="([^"]+)"/);
if (match) {
  const decoded = Buffer.from(match[1], 'base64').toString('utf8');
  console.log('Decoded content length:', decoded.length);
  fs.writeFileSync('scripts/decoded_content.html', decoded, 'utf8');
  console.log('Saved decoded content to scripts/decoded_content.html');
  console.log('Snippet:\n', decoded.substring(0, 2000));
} else {
  console.log('No rt-renderer found');
}
