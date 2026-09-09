const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\almahmud\\.gemini\\antigravity-ide\\brain\\7183e0aa-8dd1-44cc-bf60-7686e1668459\\.system_generated\\steps\\13\\content.md', 'utf8');

const scriptTags = [...content.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
scriptTags.forEach((s, idx) => {
  if (s[1].trim()) {
    console.log(`--- SCRIPT ${idx} ---`);
    console.log(s[1].trim().substring(0, 500));
  }
});
