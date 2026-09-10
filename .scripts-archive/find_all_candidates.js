const fs = require('fs');

const data = JSON.parse(fs.readFileSync('.scripts-archive/district_comparison_full.json', 'utf8'));

// Levenshtein distance
function lev(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function clean(str) {
  return str.toLowerCase()
    .replace(/\s*(edbo|edso|so|tso|ho|b\.o|sub office|branch office|টিএসও|এইচও|এসও)\s*/gi, '')
    .replace(/[^a-z0-9]/gi, '');
}

// Check each district
const candidates = [];

for (const [dist, d] of Object.entries(data)) {
  const mains = d.mainOffices;
  const branches = d.branchOffices;

  branches.forEach(b => {
    const bClean = clean(b.officeEn);
    mains.forEach(m => {
      // If we have an english phonetic approximation
      // We can also check if thanas match
    });
  });
}
