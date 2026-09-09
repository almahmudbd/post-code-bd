# PostCode-BD 🇧🇩

A fast, lightweight, and modern web application to search and discover Bangladesh postal codes across all 64 districts and 1,389+ post offices.

🌐 **Live Demo:** [postcodebd.vercel.app](https://postcodebd.vercel.app/)
- also [postcode-bd.vercel.app](https://postcode-bd.vercel.app/)
- project linked to [sukkarshop tools](https://tools.sukkarshop.com/)

---

## ✨ Features

- **⚡ Instant Bilingual Search:** Search across districts, thanas, post offices, or 4-digit codes using either English or Bengali (with automatic digit conversion: `1200` ⇄ `১২০০`).
- **📍 Complete Coverage:** 8 divisions, 64 districts, 1,389+ post offices plus optional branch offices (+858 EDBO).
- **🎨 District Card Export:** Generate and download high-resolution PNG summary cards for any district or copy formatted lists with one click.
- **📱 Responsive & Accessible:** Clean vanilla CSS design, light/dark mode, keyboard shortcut (`/` to focus search), and mobile-friendly layouts (grid & list views).
- **🚀 Zero Dependencies:** Pure HTML5, Vanilla JavaScript, and CSS. No build steps required.

---

## 📊 Data Sources

The postal code database in this project is compiled and verified from:

1. **Bengali Wikipedia:** [বাংলাদেশের পোস্ট কোডের তালিকা](https://bn.wikipedia.org/wiki/বাংলাদেশের_পোস্ট_কোডের_তালিকা)
2. **Khulna Postmaster's Website:** [Postal Code Directory](https://pmgkhulna.bdpost.gov.bd/pages/static-pages/6922dc0b933eb65569e0e1e5)

---

## 🛠️ Quick Start

Clone the repository and open `index.html` directly in your browser:

```bash
git clone https://github.com/almahmudbd/post-code-bd.git
cd post-code-bd
```

Simply open `index.html` in any modern web browser or serve it locally with any static server:

```bash
# Using Python
python -m http.server 3000

# Or using Node.js npx
npx serve .
```

---

## 📄 License

[MIT License](LICENSE)
