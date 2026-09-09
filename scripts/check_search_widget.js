process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function fetchSearchWidget() {
  const res = await fetch('https://bdpost.gov.bd/widget-assets/js/GlobalSearchWidget');
  const text = await res.text();
  console.log('Length:', text.length);
  console.log(text.substring(0, 1500));
}

fetchSearchWidget();
