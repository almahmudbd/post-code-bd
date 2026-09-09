# BD Post Codes (বাংলাদেশের পোস্ট কোড ডিরেক্টরি)

A fast, modern, and mobile-friendly web application for searching and sharing Bangladesh Postal Codes. Data is sourced from the Bengali Wikipedia ([বাংলাদেশের পোস্ট কোডের তালিকা](https://bn.wikipedia.org/wiki/%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6%E0%A7%87%E0%A6%B0_%E0%A6%AA%E0%A7%8B%E0%A6%B8%E0%A7%8D%E0%A6%9F_%E0%A6%95%E0%A7%8B%E0%A6%A1%E0%A7%87%E0%A6%B0_%E0%A6%A4%E0%A6%BE%E0%A6%B2%E0%A6%BF%E0%A6%95%E0%A6%BE)), enriched with official English district & division names, instant bilingual search, and district list sharing (as formatted text and downloadable graphic cards).

## 🚀 Key Features

- **Complete Dataset**:
  - All **8 Divisions** (ঢাকা, চট্টগ্রাম, রাজশাহী, খুলনা, বরিশাল, সিলেট, রংপুর, ময়মনসিংহ)
  - All **64 Districts** with bilingual English & Bengali headings
  - **1,357 Post Offices & Sub-offices** across Bangladesh
- **Instant Real-time Search**:
  - Search by District in English or Bengali (e.g. `Kishoreganj` or `কিশোরগঞ্জ`)
  - Search by Thana or Post Office (e.g. `মিরপুর`, `ধানমন্ডি`, `সদর`)
  - Search by 4-digit code using English digits (`1200`) or Bengali digits (`১২০০`)
- **Export & Share**:
  - **Share as Text**: Formatted clean text list of any district's postal codes ready to copy or send via native Web Share API
  - **Save as Image (PNG)**: Client-side high-resolution graphic card generator that creates shareable visual cards for any district
  - **One-click Copy**: Click any post code to copy it instantly with toast feedback
- **Modern UI & Aesthetics**:
  - English interface with bilingual content
  - Google Sans + Noto Sans Bengali typography for clear glyph and digit rendering without clipping
  - Dark Mode & Light Mode switcher with local storage persistence
  - Favorites / Star feature to bookmark frequently used postcodes
  - Fully mobile-responsive layout and touch-friendly controls

## 📁 Project Structure

```text
post-code-bd/
├── index.html                  # Main application markup
├── src/
│   ├── css/
│   │   └── style.css           # Vanilla CSS modern design system
│   ├── js/
│   │   ├── app.js              # Core application logic & search
│   │   └── image-generator.js  # Canvas-based high-res district image generator
│   └── data/
│       ├── postcodes.json      # Structured JSON dataset
│       └── postcodes-data.js   # Offline-ready window data fallback
├── scripts/
│   ├── build_data.js           # Wikipedia dump parser and data enrichment
│   └── server.js               # Lightweight local development server
└── README.md
```

## 🛠️ Running Locally

Run directly with Node.js:
```bash
node scripts/server.js
```
Then open [http://localhost:3456](http://localhost:3456) in your browser.

Or open `index.html` directly in any web browser (no build steps or external dependencies required).

## 📄 License
MIT
