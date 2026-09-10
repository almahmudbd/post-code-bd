/**
 * Bangladesh Postal Code Web Application Logic
 * Fast, bilingual search, filtering, and sharing as text/image.
 */

(function () {
  'use strict';

  // Digit mappings for instant cross-language search
  const DIGIT_MAP = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9', '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };

  // Comprehensive Bengali Unicode normalization
  function cleanBengaliText(str) {
    if (!str) return '';
    return str
      .normalize('NFC')
      .replace(/\u09AF\u09BC/g, '\u09DF') // য + ় (nukta) -> য়
      .replace(/\u09A1\u09BC/g, '\u09DC') // ড + ় (nukta) -> ড়
      .replace(/\u09A2\u09BC/g, '\u09DD') // ঢ + ় (nukta) -> ঢ়
      .replace(/\u09A4\u09CD\u200D/g, 'ৎ') // ত + হসন্ত + ZWJ -> ৎ
      .replace(/য\./g, 'য়')               // য. -> য়
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width chars
      .toLowerCase()
      .trim();
  }

  function normalizeSearchText(str) {
    if (!str) return { original: '', cleanBn: '', withEnDigits: '' };
    const cleaned = cleanBengaliText(str);
    const withEnDigits = cleaned.replace(/[০-৯]/g, d => DIGIT_MAP[d] || d);
    return {
      original: cleaned,
      cleanBn: cleaned,
      withEnDigits: withEnDigits
    };
  }

  // App State
  const state = {
    data: null,
    branchData: null,
    divisions: [],
    districts: [],
    allPostOffices: [],
    showBranchOffices: localStorage.getItem('bd_postcode_show_branch') === 'true',
    activeDivision: 'all', // 'all' or English division name
    activeDistrict: 'all', // 'all' or English district name
    searchQuery: '',
    viewMode: 'all', // 'all' or 'favorites'
    layout: localStorage.getItem('bd_postcode_layout') || 'grid', // 'grid' is default, 'list' is optional
    sortBy: localStorage.getItem('bd_postcode_sort') || 'code', // 'code' (postcode default), 'name', 'thana'
    favoriteDistricts: new Set(JSON.parse(localStorage.getItem('bd_postcode_fav_districts') || '[]')),
    theme: localStorage.getItem('bd_postcode_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    activeModalDistrict: null
  };

  // DOM Elements
  const elements = {
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    favToggleBtn: document.getElementById('favToggleBtn'),
    favCountBadge: document.getElementById('favCountBadge'),
    pwaInstallBtn: document.getElementById('pwaInstallBtn'),
    offlineIndicator: document.getElementById('offlineIndicator'),
    viewListBtn: document.getElementById('viewListBtn'),
    viewGridBtn: document.getElementById('viewGridBtn'),
    branchToggle: document.getElementById('branchToggle'),
    searchInput: document.getElementById('searchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    divisionPillsContainer: document.getElementById('divisionPillsContainer'),
    sortSelect: document.getElementById('sortSelect'),
    districtSelect: document.getElementById('districtSelect'),
    resultsContainer: document.getElementById('resultsContainer'),
    statFilteredCount: document.getElementById('statFilteredCount'),
    statDistrictCount: document.getElementById('statDistrictCount'),

    // Image Modal
    imageModal: document.getElementById('imageModal'),
    imageModalClose: document.getElementById('imageModalClose'),
    imagePreview: document.getElementById('imagePreview'),
    imageDownloadBtn: document.getElementById('imageDownloadBtn'),
    imageShareBtn: document.getElementById('imageShareBtn'),
    imageModalTitle: document.getElementById('imageModalTitle'),

    // Text Share Modal
    textModal: document.getElementById('textModal'),
    textModalClose: document.getElementById('textModalClose'),
    shareTextarea: document.getElementById('shareTextarea'),
    copyShareTextBtn: document.getElementById('copyShareTextBtn'),
    nativeShareBtn: document.getElementById('nativeShareBtn'),
    textModalTitle: document.getElementById('textModalTitle'),

    toastContainer: document.getElementById('toastContainer')
  };

  // ==========================================================================
  // Initialization
  // ==========================================================================

  async function init() {
    initTheme();
    updateLayoutButtons();
    if (elements.sortSelect) {
      elements.sortSelect.value = state.sortBy;
    }
    setupEventListeners();
    await loadData();
    renderDivisionPills();
    populateDistrictSelect();
    updateFavoriteBadge();
    render();
    initPWA();
  }

  // Layout Management (List default, Grid optional, saved in localStorage)
  function setLayout(layout) {
    if (state.layout === layout) return;
    state.layout = layout;
    localStorage.setItem('bd_postcode_layout', layout);
    updateLayoutButtons();
    render();
  }

  function updateLayoutButtons() {
    if (elements.viewListBtn && elements.viewGridBtn) {
      elements.viewListBtn.classList.toggle('active', state.layout === 'list');
      elements.viewGridBtn.classList.toggle('active', state.layout === 'grid');
    }
  }

  // Theme Management
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('bd_postcode_theme', state.theme);
    updateThemeIcon();
  }

  function updateThemeIcon() {
    if (!elements.themeToggleBtn) return;
    elements.themeToggleBtn.innerHTML = state.theme === 'dark'
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }

  // Load Postal Code Data and Branch Offices
  async function loadData() {
    state.data = window.BD_POSTCODE_DATA;
    state.branchData = window.BD_BRANCH_OFFICES_DATA;

    if (!state.data) {
      showToast('Error loading postal code database.', 'error');
      return;
    }

    buildProcessedData();
  }

  // Combine or filter data depending on showBranchOffices toggle
  function buildProcessedData() {
    if (!state.data) return;

    state.divisions = state.data.divisions || [];
    const baseDistricts = state.data.districts || [];

    // Group branch offices by districtEn
    const branchByDistrict = new Map();
    if (state.branchData && state.branchData.branchOffices) {
      state.branchData.branchOffices.forEach(b => {
        const key = b.districtEn.toLowerCase();
        if (!branchByDistrict.has(key)) {
          branchByDistrict.set(key, []);
        }
        branchByDistrict.get(key).push(b);
      });
    }

    state.districts = baseDistricts.map(d => {
      const baseOffices = [...d.postOffices];
      if (state.showBranchOffices) {
        const extraBranches = branchByDistrict.get(d.districtEn.toLowerCase()) || [];
        return {
          ...d,
          postOffices: [...baseOffices, ...extraBranches]
        };
      }
      return {
        ...d,
        postOffices: baseOffices
      };
    });

    // Flatten list for global fast search
    state.allPostOffices = [];
    state.districts.forEach(d => {
      d.postOffices.forEach(po => {
        state.allPostOffices.push(po);
      });
    });
  }

  // ==========================================================================
  // Render Filters & Selectors
  // ==========================================================================

  const DIVISION_ORDER = [
    "Dhaka",
    "Chattogram",
    "Rajshahi",
    "Khulna",
    "Sylhet",
    "Barishal",
    "Rangpur",
    "Mymensingh"
  ];

  function renderDivisionPills() {
    if (!elements.divisionPillsContainer) return;

    let html = `
      <span class="division-label">DIVISION</span>
      <button class="division-pill ${state.activeDivision === 'all' ? 'active' : ''}" data-division="all">
        All
      </button>
    `;

    DIVISION_ORDER.forEach(divName => {
      const isActive = state.activeDivision === divName;
      html += `
        <button class="division-pill ${isActive ? 'active' : ''}" data-division="${divName}">
          ${divName}
        </button>
      `;
    });

    elements.divisionPillsContainer.innerHTML = html;
  }

  function populateDistrictSelect() {
    if (!elements.districtSelect) return;

    let filteredDistricts = state.districts;
    if (state.activeDivision !== 'all') {
      filteredDistricts = filteredDistricts.filter(d => d.divisionEn === state.activeDivision);
    }

    // Sort alphabetically by English district name
    filteredDistricts = [...filteredDistricts].sort((a, b) => a.districtEn.localeCompare(b.districtEn));

    let html = `<option value="all">Select District (All ${filteredDistricts.length})</option>`;
    filteredDistricts.forEach(d => {
      const selected = state.activeDistrict === d.districtEn ? 'selected' : '';
      html += `<option value="${d.districtEn}" ${selected}>${d.districtEn} (${d.districtBn})</option>`;
    });

    elements.districtSelect.innerHTML = html;
  }

  // ==========================================================================
  // Search & Filter Logic
  // ==========================================================================

  function getFilteredData() {
    const rawQuery = state.searchQuery;
    const queryInfo = normalizeSearchText(rawQuery);
    const searchToken = queryInfo.withEnDigits;

    // Filter districts first based on active division and active district selector
    let filteredDistricts = state.districts;

    if (state.activeDivision !== 'all') {
      filteredDistricts = filteredDistricts.filter(d => d.divisionEn === state.activeDivision);
    }

    if (state.activeDistrict !== 'all') {
      filteredDistricts = filteredDistricts.filter(d => d.districtEn === state.activeDistrict);
    }

    // Map through districts and filter post offices
    const resultDistricts = [];

    for (const district of filteredDistricts) {
      // If Favorites view mode is active, filter by starred districts
      if (state.viewMode === 'favorites' && !state.favoriteDistricts.has(district.districtEn)) {
        continue;
      }

      const dEn = district.districtEn.toLowerCase();
      const dBn = cleanBengaliText(district.districtBn);

      // Match only district name — NOT division name (searching "rajshahi" should not
      // surface all 8 Rajshahi-division districts before Rajshahi district itself)
      const districtNameMatches = searchToken && (
        dEn.includes(searchToken) ||
        dBn.includes(queryInfo.cleanBn)
      );

      const matchingOffices = district.postOffices.filter(po => {
        if (!searchToken) return true;

        // If district name itself matched, keep all its post offices
        if (districtNameMatches) return true;

        // Otherwise check post office specific fields
        const codeEn = po.postCodeEn || '';
        const codeBn = po.postCodeBn || '';
        const thana = cleanBengaliText(po.thanaBn);
        const thanaEn = (po.thanaEn || '').toLowerCase();
        const poName = cleanBengaliText(po.postOfficeBn);
        const poNameEn = (po.postOfficeEn || '').toLowerCase();

        return (
          (codeEn && codeEn.includes(searchToken)) ||
          (codeBn && codeBn.includes(queryInfo.cleanBn)) ||
          thana.includes(queryInfo.cleanBn) ||
          thana.includes(searchToken) ||
          thanaEn.includes(searchToken) ||
          poName.includes(queryInfo.cleanBn) ||
          poName.includes(searchToken) ||
          poNameEn.includes(searchToken)
        );
      });

      if (matchingOffices.length > 0) {
        resultDistricts.push({
          ...district,
          postOffices: sortPostOffices(matchingOffices),
          _districtNameMatches: districtNameMatches  // used for sort priority below
        });
      }
    }

    // Sort: districts whose own name matches the query come first (e.g. "Rajshahi District"
    // before other districts that only matched via a post office name)
    if (state.searchQuery) {
      resultDistricts.sort((a, b) => {
        if (a._districtNameMatches && !b._districtNameMatches) return -1;
        if (!a._districtNameMatches && b._districtNameMatches) return 1;
        return 0;
      });
    }

    return resultDistricts;
  }

  // Sort post offices within a district based on selected sort criteria
  function sortPostOffices(offices) {
    return [...offices].sort((a, b) => {
      if (state.sortBy === 'name') {
        const nameA = a.postOfficeBn || a.postOfficeEn || '';
        const nameB = b.postOfficeBn || b.postOfficeEn || '';
        return nameA.localeCompare(nameB, 'bn');
      } else if (state.sortBy === 'thana') {
        const thanaA = a.thanaBn || a.thanaEn || '';
        const thanaB = b.thanaBn || b.thanaEn || '';
        return thanaA.localeCompare(thanaB, 'bn');
      } else {
        // Default: 'code' - numeric ascending (1-9 / ১-৯)
        // Branch offices without code go after numbered codes in alphabetical order
        const codeA = a.postCodeEn ? parseInt(a.postCodeEn, 10) : 999999;
        const codeB = b.postCodeEn ? parseInt(b.postCodeEn, 10) : 999999;
        if (codeA !== codeB) {
          return codeA - codeB;
        }
        return (a.postOfficeBn || a.postOfficeEn || '').localeCompare(b.postOfficeBn || b.postOfficeEn || '', 'bn');
      }
    });
  }

  // ==========================================================================
  // Render View
  // ==========================================================================

  function render() {
    const filteredDistricts = getFilteredData();
    const totalOffices = filteredDistricts.reduce((sum, d) => sum + d.postOffices.length, 0);

    // Update stats
    if (elements.statFilteredCount) {
      elements.statFilteredCount.textContent = totalOffices;
    }
    if (elements.statDistrictCount) elements.statDistrictCount.textContent = filteredDistricts.length;

    if (filteredDistricts.length === 0) {
      renderEmptyState();
      return;
    }

    let html = '';
    filteredDistricts.forEach(district => {
      html += renderDistrictBlock(district);
    });

    elements.resultsContainer.innerHTML = html;
    bindDistrictActions();
  }

  function renderDistrictBlock(district) {
    const offices = district.postOffices;
    const isFavDistrict = state.favoriteDistricts.has(district.districtEn);

    return `
      <div class="district-block" id="district-${district.districtEn.toLowerCase().replace(/\s+/g, '-')}">
        <div class="district-header">
          <div class="district-info">
            <div class="district-names-wrap">
              <span class="district-name-en">${district.districtEn}</span>
              <span class="district-name-bn">(${district.districtBn} জেলা)</span>
              <button class="btn-star-district ${isFavDistrict ? 'starred' : ''}" data-district="${district.districtEn}" title="${isFavDistrict ? 'Remove from favorite districts' : 'Star this district'}">
                <svg viewBox="0 0 24 24" fill="${isFavDistrict ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </button>
            </div>
            <span class="district-division-tag">${district.divisionEn} Division (${district.divisionBn})</span>
            <span class="district-count-tag">${offices.length} Post Offices</span>
          </div>
          <div class="district-actions">
            <div class="district-share-dropdown">
              <button class="btn-share-trigger" data-district="${district.districtEn}" title="Share District" aria-label="Share options">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
              <div class="share-dropdown-menu">
                <button class="share-dropdown-item btn-share-text" data-district="${district.districtEn}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  <span>Share Text</span>
                </button>
                <button class="share-dropdown-item btn-export-img" data-district="${district.districtEn}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>Save as Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        ${state.layout === 'list'
        ? `
            <div class="district-table-wrapper">
              <table class="district-table">
                <thead>
                  <tr>
                    <th class="col-district" style="width: 22%;">District</th>
                    <th style="width: 28%;">Thana</th>
                    <th style="width: 28%;">Post Office</th>
                    <th style="width: 22%; text-align: right;">Post Code (Click to copy)</th>
                  </tr>
                </thead>
                <tbody>
                  ${offices.map(po => renderPostOfficeTableRow(po, district)).join('')}
                </tbody>
              </table>
            </div>
          `
        : `
            <div class="post-offices-grid">
              ${offices.map(po => renderPostOfficeCard(po, district)).join('')}
            </div>
          `
      }
      </div>
    `;
  }

  function renderPostOfficeTableRow(po, district) {
    const districtNameBn = po.districtBn || (district && district.districtBn) || '';
    const isBranch = po.isBranchOffice || !po.postCodeEn;

    return `
      <tr data-id="${po.id}" class="${isBranch ? 'branch-row' : ''}">
        <td class="col-district">
          <span class="mobile-field-tag">জেলা</span>
          <span class="table-district-cell">${districtNameBn}</span>
        </td>
        <td class="col-thana">
          <span class="mobile-field-tag">উপজেলা</span>
          <span class="table-thana-cell">${po.thanaBn}</span>
        </td>
        <td class="col-office">
          <span class="mobile-field-tag">ডাকঘর</span>
          <span class="table-office-cell">
            ${po.postOfficeBn || po.postOfficeEn}
            ${isBranch ? '<span class="branch-inline-tag">শাখা</span>' : ''}
          </span>
        </td>
        <td class="col-code" style="text-align: right;">
          <div class="table-code-wrapper">
            ${isBranch ? `
              <span class="branch-table-tag" title="শাখা ডাকঘর (উপজেলা অফিসের পোস্টকোড ব্যবহার করুন)">শাখা ডাকঘর (N/A)</span>
            ` : `
              <button class="po-code-btn table-code-badge" data-code="${po.postCodeEn}" data-code-bn="${po.postCodeBn}" data-name="${po.postOfficeBn}" title="Click to copy ${po.postOfficeBn} - ${po.postCodeBn}">
                <span class="code-bn">${po.postCodeBn}</span>
                <span class="code-en">${po.postCodeEn}</span>
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }

  function renderPostOfficeCard(po, district) {
    const districtBn = po.districtBn || (district && district.districtBn) || '';
    const locationText = districtBn ? `${po.thanaBn}, ${districtBn}` : po.thanaBn;
    const isBranch = po.isBranchOffice || !po.postCodeEn;

    return `
      <div class="post-office-card ${isBranch ? 'branch-card' : ''}" data-id="${po.id}">
        <div class="po-details">
          <div class="po-location" title="${locationText}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${locationText}</span>
          </div>
          <div class="po-title" title="${po.postOfficeBn || po.postOfficeEn}">
            ${po.postOfficeBn || po.postOfficeEn}
          </div>
        </div>
        <div class="po-code-box">
          ${isBranch ? `
            <div class="branch-code-badge" title="শাখা ডাকঘর (উপজেলা অফিসের পোস্টকোড ব্যবহার করুন)">
              <span class="branch-badge-label">শাখা ডাকঘর</span>
              <span class="branch-badge-sub">কোড নেই</span>
            </div>
          ` : `
            <button class="po-code-btn" data-code="${po.postCodeEn}" data-code-bn="${po.postCodeBn}" data-name="${po.postOfficeBn}" title="Click to copy ${po.postOfficeBn} - ${po.postCodeBn}">
              <span class="po-code-bn">${po.postCodeBn}</span>
              <span class="po-code-en">${po.postCodeEn}</span>
            </button>
          `}
        </div>
      </div>
    `;
  }

  function renderEmptyState() {
    const isFavMode = state.viewMode === 'favorites';
    elements.resultsContainer.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3>${isFavMode ? 'No Favorite Districts Saved' : 'No Results Found'}</h3>
        <p>${isFavMode
        ? 'You haven’t starred any districts yet. Click the star icon next to any district name to save it here for quick access.'
        : `We couldn't find any post codes matching "${escapeHtml(state.searchQuery)}". Try searching by District (e.g. Dhaka, কিশোরগঞ্জ), Thana, or 4-digit code.`
      }</p>
        <button class="btn-reset-search" id="btnResetSearch">
          ${isFavMode ? 'View All Districts' : 'Clear Search & Filters'}
        </button>
      </div>
    `;

    document.getElementById('btnResetSearch')?.addEventListener('click', () => {
      if (isFavMode) {
        state.viewMode = 'all';
      }
      resetFilters();
    });
  }

  // ==========================================================================
  // Event Listeners & Interactive Handlers
  // ==========================================================================

  function setupEventListeners() {
    // Theme toggle
    elements.themeToggleBtn?.addEventListener('click', toggleTheme);

    // Layout view toggle (List default vs Grid optional)
    elements.viewListBtn?.addEventListener('click', () => setLayout('list'));
    elements.viewGridBtn?.addEventListener('click', () => setLayout('grid'));

    // Branch offices toggle (EDBO)
    if (elements.branchToggle) {
      elements.branchToggle.checked = state.showBranchOffices;
      const wrap = elements.branchToggle.closest('.branch-toggle-wrap');
      if (wrap) wrap.classList.toggle('active', state.showBranchOffices);

      elements.branchToggle.addEventListener('change', (e) => {
        state.showBranchOffices = e.target.checked;
        localStorage.setItem('bd_postcode_show_branch', state.showBranchOffices);
        if (wrap) wrap.classList.toggle('active', state.showBranchOffices);
        buildProcessedData();
        renderDivisionPills();
        populateDistrictSelect();
        render();
        showToast(
          state.showBranchOffices
            ? 'পোস্ট কোড ছাড়া শাখা ডাকঘর তালিকায় যুক্ত করা হয়েছে!'
            : 'শাখা ডাকঘর তালিকা থেকে লুকানো হয়েছে।'
        );
      });
    }

    // Favorites View Toggle
    elements.favToggleBtn?.addEventListener('click', () => {
      state.viewMode = state.viewMode === 'favorites' ? 'all' : 'favorites';
      elements.favToggleBtn.classList.toggle('active', state.viewMode === 'favorites');
      render();
    });

    // Search Input
    elements.searchInput?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      elements.searchClearBtn?.classList.toggle('visible', state.searchQuery.length > 0);
      render();
    });

    // Clear Search Button
    elements.searchClearBtn?.addEventListener('click', () => {
      state.searchQuery = '';
      elements.searchInput.value = '';
      elements.searchClearBtn.classList.remove('visible');
      elements.searchInput.focus();
      render();
    });

    // Division Filter Pills delegation
    elements.divisionPillsContainer?.addEventListener('click', (e) => {
      const pill = e.target.closest('.division-pill');
      if (!pill) return;
      const division = pill.getAttribute('data-division');
      state.activeDivision = division;
      state.activeDistrict = 'all'; // reset district selector
      renderDivisionPills();
      populateDistrictSelect();
      render();
    });

    // Sort Selector Change
    elements.sortSelect?.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      localStorage.setItem('bd_postcode_sort', state.sortBy);
      render();
    });

    // District Selector Change
    elements.districtSelect?.addEventListener('change', (e) => {
      state.activeDistrict = e.target.value;
      render();
      if (state.activeDistrict !== 'all') {
        const blockId = `district-${state.activeDistrict.toLowerCase().replace(/\s+/g, '-')}`;
        const target = document.getElementById(blockId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    // Modal Close buttons
    elements.imageModalClose?.addEventListener('click', closeImageModal);
    elements.textModalClose?.addEventListener('click', closeTextModal);

    // Close modals on background click or Esc key
    elements.imageModal?.addEventListener('click', (e) => {
      if (e.target === elements.imageModal) closeImageModal();
    });
    elements.textModal?.addEventListener('click', (e) => {
      if (e.target === elements.textModal) closeTextModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeImageModal();
        closeTextModal();
        document.querySelectorAll('.share-dropdown-menu.show').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('.btn-share-trigger.active').forEach(b => b.classList.remove('active'));
      } else if (e.key === '/' && document.activeElement !== elements.searchInput) {
        e.preventDefault();
        elements.searchInput?.focus();
      }
    });

    // Close share dropdowns on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.share-dropdown-menu.show').forEach(m => m.classList.remove('show'));
      document.querySelectorAll('.btn-share-trigger.active').forEach(b => b.classList.remove('active'));
    });

    // Modal Action Buttons
    function copyShareText(msg = 'Formatted list copied to clipboard!') {
      navigator.clipboard.writeText(elements.shareTextarea.value).then(() => {
        showToast(msg);
      });
    }

    elements.copyShareTextBtn?.addEventListener('click', () => {
      copyShareText();
    });

    elements.nativeShareBtn?.addEventListener('click', async () => {
      const text = elements.shareTextarea.value;
      const title = elements.textModalTitle.textContent;
      if (navigator.share) {
        try {
          await navigator.share({ title, text });
          showToast('Shared successfully!');
        } catch (err) {
          if (err.name !== 'AbortError') showToast('Could not share.', 'error');
        }
      } else {
        copyShareText('Copied to clipboard (Share API not supported)!');
      }
    });
  }

  function resetFilters() {
    state.searchQuery = '';
    state.activeDivision = 'all';
    state.activeDistrict = 'all';
    if (elements.searchInput) elements.searchInput.value = '';
    elements.searchClearBtn?.classList.remove('visible');
    renderDivisionPills();
    populateDistrictSelect();
    render();
  }

  // Delegated events for cards & district blocks
  function bindDistrictActions() {
    // Copy Postal Code Click (Card badge or Table code badge)
    document.querySelectorAll('.po-code-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const codeBn = btn.getAttribute('data-code-bn') || btn.getAttribute('data-code');
        const name = btn.getAttribute('data-name');
        const copyText = `${name} - ${codeBn}`;

        navigator.clipboard.writeText(copyText).then(() => {
          btn.classList.add('copied');
          setTimeout(() => {
            btn.classList.remove('copied');
          }, 1200);
          showToast(`Copied: ${copyText}`);
        });
      });
    });

    // Star / Favorite District Click
    document.querySelectorAll('.btn-star-district').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const districtName = btn.getAttribute('data-district');
        toggleFavoriteDistrict(districtName);
      });
    });

    // Toggle Share Dropdown Menu
    document.querySelectorAll('.btn-share-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = btn.closest('.district-share-dropdown');
        const menu = dropdown?.querySelector('.share-dropdown-menu');
        const isAlreadyOpen = menu?.classList.contains('show');

        // Close all other open share dropdowns
        document.querySelectorAll('.share-dropdown-menu.show').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('.btn-share-trigger.active').forEach(b => b.classList.remove('active'));

        if (!isAlreadyOpen && menu) {
          menu.classList.add('show');
          btn.classList.add('active');
        }
      });
    });

    // Share District Text
    document.querySelectorAll('.btn-share-text').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.closest('.share-dropdown-menu')?.classList.remove('show');
        btn.closest('.district-share-dropdown')?.querySelector('.btn-share-trigger')?.classList.remove('active');
        const districtName = btn.getAttribute('data-district');
        const district = state.districts.find(d => d.districtEn === districtName);
        if (district) openTextShareModal(district);
      });
    });

    // Save/Share District Image
    document.querySelectorAll('.btn-export-img').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.closest('.share-dropdown-menu')?.classList.remove('show');
        btn.closest('.district-share-dropdown')?.querySelector('.btn-share-trigger')?.classList.remove('active');
        const districtName = btn.getAttribute('data-district');
        const district = state.districts.find(d => d.districtEn === districtName);
        if (district) openImageExportModal(district);
      });
    });
  }

  // ==========================================================================
  // Favorites Management (District-level favorites)
  // ==========================================================================

  function toggleFavoriteDistrict(districtName) {
    const district = state.districts.find(d => d.districtEn === districtName);
    const displayName = district ? `${district.districtEn} (${district.districtBn})` : districtName;

    if (state.favoriteDistricts.has(districtName)) {
      state.favoriteDistricts.delete(districtName);
      showToast(`Removed ${displayName} from favorites`);
    } else {
      state.favoriteDistricts.add(districtName);
      showToast(`Added ${displayName} to favorites!`);
    }
    localStorage.setItem('bd_postcode_fav_districts', JSON.stringify([...state.favoriteDistricts]));
    updateFavoriteBadge();
    render();
  }

  function updateFavoriteBadge() {
    if (!elements.favCountBadge) return;
    const count = state.favoriteDistricts.size;
    elements.favCountBadge.textContent = count;
    elements.favCountBadge.style.display = count > 0 ? 'inline-block' : 'none';
  }

  // ==========================================================================
  // Share as Text Modal
  // ==========================================================================

  function openTextShareModal(district) {
    state.activeModalDistrict = district;
    elements.textModalTitle.textContent = `Share Postal Codes - ${district.districtEn} (${district.districtBn})`;

    const sortedOffices = sortPostOffices(district.postOffices);

    // Format clean text list
    let text = `📮 Bangladesh Postal Codes: ${district.districtEn} District (${district.districtBn} জেলা)\n`;
    text += `Division: ${district.divisionEn} (${district.divisionBn})\n`;
    text += `Total Post Offices: ${sortedOffices.length}\n`;
    text += `--------------------------------------------------\n`;

    sortedOffices.forEach(po => {
      if (po.postCodeEn) {
        text += `• ${po.thanaBn} | ${po.postOfficeBn}: ${po.postCodeEn} (${po.postCodeBn})\n`;
      } else {
        text += `• ${po.thanaBn} | ${po.postOfficeBn || po.postOfficeEn} [শাখা ডাকঘর - কোড নেই]\n`;
      }
    });

    text += `--------------------------------------------------\n`;
    text += `Source: Bangladesh Postal Directory (https://postcodebd.vercel.app/)\n`;

    elements.shareTextarea.value = text;
    elements.textModal.classList.add('active');
  }

  function closeTextModal() {
    elements.textModal?.classList.remove('active');
  }

  // ==========================================================================
  // Share / Save as Image Modal
  // ==========================================================================

  async function openImageExportModal(district) {
    state.activeModalDistrict = district;
    elements.imageModalTitle.textContent = `Export Image - ${district.districtEn} (${district.districtBn})`;

    // Show placeholder while generating
    elements.imagePreview.innerHTML = `
      <div style="padding: 40px; color: var(--text-muted);">
        <p>🎨 Generating high-resolution graphic card...</p>
      </div>
    `;
    elements.imageModal.classList.add('active');

    try {
      const sortedDistrict = {
        ...district,
        postOffices: sortPostOffices(district.postOffices)
      };
      const dataUrl = await window.DistrictImageGenerator.generateDistrictCard(sortedDistrict, {
        theme: state.theme
      });

      elements.imagePreview.innerHTML = `<img src="${dataUrl}" alt="${district.districtEn} Postal Codes Card" />`;

      // Configure download button
      const filename = `bd-postcode-${district.districtEn.toLowerCase().replace(/\s+/g, '-')}.png`;
      elements.imageDownloadBtn.onclick = () => {
        window.DistrictImageGenerator.downloadImage(dataUrl, filename);
        showToast(`Downloaded ${filename}!`);
      };

      // Configure share button
      elements.imageShareBtn.onclick = async () => {
        // Try native Web Share with file if supported
        if (navigator.canShare && window.fetch) {
          try {
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], filename, { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: `${district.districtEn} Postal Codes`,
                text: `Postal codes for ${district.districtEn} District (${district.districtBn}), Bangladesh.`,
                files: [file]
              });
              showToast('Shared image successfully!');
              return;
            }
          } catch (e) {
            console.log('Native file share skipped, falling back to download', e);
          }
        }

        // Fallback: download image
        window.DistrictImageGenerator.downloadImage(dataUrl, filename);
        showToast('Image downloaded! You can now share it anywhere.');
      };

    } catch (err) {
      console.error('Image generation failed', err);
      elements.imagePreview.innerHTML = `<p style="color: red; padding: 20px;">Failed to generate image card.</p>`;
    }
  }

  function closeImageModal() {
    elements.imageModal?.classList.remove('active');
  }

  // ==========================================================================
  // PWA & Offline Support Integration
  // ==========================================================================

  let deferredInstallPrompt = null;

  function initPWA() {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('[SW] Service worker registered successfully:', registration.scope);

            // Check if there is an updated service worker waiting
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    showToast('New update available! Refresh for the latest version.', 'info');
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.warn('[SW] Service worker registration failed:', err);
          });
      });
    }

    // 2. Install App Prompt Handling (beforeinstallprompt)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      if (elements.pwaInstallBtn) {
        elements.pwaInstallBtn.style.display = 'inline-flex';
      }
    });

    if (elements.pwaInstallBtn) {
      elements.pwaInstallBtn.addEventListener('click', async () => {
        if (!deferredInstallPrompt) {
          showToast('App is ready or already installed.', 'info');
          return;
        }
        deferredInstallPrompt.prompt();
        const choiceResult = await deferredInstallPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          console.log('[PWA] User accepted installation prompt');
          elements.pwaInstallBtn.style.display = 'none';
        }
        deferredInstallPrompt = null;
      });
    }

    window.addEventListener('appinstalled', () => {
      console.log('[PWA] PostCode-BD app was successfully installed');
      if (elements.pwaInstallBtn) {
        elements.pwaInstallBtn.style.display = 'none';
      }
      showToast('PostCode-BD installed! You can now use it completely offline.', 'success');
    });

    // 3. Online & Offline Detection
    function handleNetworkChange() {
      const isOnline = navigator.onLine;
      if (elements.offlineIndicator) {
        elements.offlineIndicator.style.display = isOnline ? 'none' : 'inline-flex';
      }
      if (!isOnline) {
        showToast('You are offline — PostCode-BD works 100% offline! (অফলাইন মোড)', 'info');
      } else {
        showToast('Back online! (পুনরায় অনলাইন)', 'success');
      }
    }

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    // Initial check on load
    if (!navigator.onLine && elements.offlineIndicator) {
      elements.offlineIndicator.style.display = 'inline-flex';
    }
  }

  // ==========================================================================
  // Toast Notification System
  // ==========================================================================

  function showToast(message, type = 'success') {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
    if (type === 'error') {
      icon = `<svg class="toast-icon" style="color: #ef4444" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else if (type === 'info') {
      icon = `<svg class="toast-icon" style="color: #0284c7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `${icon}<span>${escapeHtml(message)}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
