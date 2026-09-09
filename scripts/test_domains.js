process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function checkDomains() {
  const domains = [
    'pmgkhulna.bdpost.gov.bd',
    'pmgdhaka.bdpost.gov.bd',
    'pmgcentral.bdpost.gov.bd',
    'pmgctg.bdpost.gov.bd',
    'pmgraj.bdpost.gov.bd',
    'pmgnorthern.bdpost.gov.bd',
    'pmgsouthern.bdpost.gov.bd',
    'pmgmetro.bdpost.gov.bd'
  ];

  for (const d of domains) {
    try {
      const res = await fetch(`https://${d}/pages/static-pages/6922dd2d933eb65569e13d1e`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      console.log(d, res.status);
    } catch (e) {
      // ignore
    }
  }
}

checkDomains();
