/* alSooq · Kit runtime — bilingual (AR RTL / EN LTR) UI blocks as light-DOM custom elements.
     <aq-nav current="">   <aq-footer>   <aq-product-card ...>   <aq-checkout steps='[...]'>   <aq-workspace vertical="">
   Classic script (no modules/build) so every page opens from file:// and deploys as-is on Vercel.
   Load after sample-data.js:  <script defer src="js/sample-data.js"></script><script defer src="js/alsooq-ui.js"></script> */
(function () {
  'use strict';
  var AQ = (window.AQ = window.AQ || {});
  AQ.config = Object.assign({ whatsapp: '' }, AQ.config); // owner-confirmed number goes here; empty = button hidden
  var KEY = 'aq-lang';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  AQ.esc = esc;

  /* ── language ─────────────────────────────────────────────────────── */
  AQ.lang = 'ar';
  AQ.t = function (ar, en) { return AQ.lang === 'ar' ? ar : en; };
  AQ.setLang = function (l) {
    AQ.lang = l === 'en' ? 'en' : 'ar';
    var d = document.documentElement;
    d.lang = AQ.lang;
    d.dir = AQ.lang === 'ar' ? 'rtl' : 'ltr';
    // leaf text only: <h2 data-ar="…" data-en="…">
    document.querySelectorAll('[data-ar]').forEach(function (e) {
      var v = e.getAttribute('data-' + AQ.lang);
      if (v != null) e.textContent = v;
    });
    try { localStorage.setItem(KEY, AQ.lang); } catch (e) { /* private mode */ }
    document.dispatchEvent(new CustomEvent('aq:lang', { detail: { lang: AQ.lang } }));
  };

  /* ── numbers & money: Arabic-Indic digits + ج.س in AR, Latin + SDG in EN (owner rule) ── */
  AQ.num = function (n, o) { return new Intl.NumberFormat(AQ.lang === 'ar' ? 'ar-EG' : 'en-US', o).format(n); };
  var CUR = { SDG: { ar: 'ج.س', en: 'SDG' }, EGP: { ar: 'ج.م', en: 'EGP' } };
  AQ.money = function (n, cur) { var c = CUR[cur] || { ar: cur, en: cur }; return AQ.num(n) + ' ' + c[AQ.lang]; };

  /* ── icons (inline SVG, stroke = currentColor; no emoji as icons) ──── */
  var P = {
    shop: '<path d="M4 8h16l-1 4a3 3 0 0 1-3 2.4H8A3 3 0 0 1 5 12z"/><path d="M4 8l1.4-3.2A2 2 0 0 1 7.2 3.6h9.6A2 2 0 0 1 18.6 4.8L20 8"/><path d="M7 15v4.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5V15"/>',
    build: '<path d="M3 21h18"/><path d="M5 21V9l5-3 5 3v12"/><path d="M15 21V12l4 2.2V21"/><path d="M8.5 12h3M8.5 15.5h3"/>',
    bus: '<rect x="4" y="4" width="16" height="13" rx="2.4"/><path d="M4 11h16"/><path d="M7 20v-1M17 20v-1"/>',
    cap: '<path d="M12 4L2.5 8.5 12 13l9.5-4.5z"/><path d="M6.5 10.5V15c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.5"/><path d="M21.5 8.5v5"/>',
    wallet: '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v1"/><rect x="3.5" y="7.5" width="17" height="12" rx="2.4"/><path d="M20.5 12H16a2 2 0 0 0 0 4h4.5"/>',
    store: '<path d="M4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9"/><path d="M3 6.5 4.5 4h15L21 6.5a2.5 2.5 0 0 1-4.5 1.5 2.5 2.5 0 0 1-4.5 0 2.5 2.5 0 0 1-4.5 0A2.5 2.5 0 0 1 3 6.5Z"/><path d="M9 20v-5h4v5"/>',
    truck: '<rect x="2.5" y="7" width="11" height="9" rx="1.4"/><path d="M13.5 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>',
    bank: '<path d="M3 9 12 4l9 5"/><path d="M4 9h16"/><path d="M6 9v8M10 9v8M14 9v8M18 9v8"/><path d="M4 20h16"/>',
    shield: '<path d="M12 3 5 5.5V11c0 4.4 3 7.7 7 9 4-1.3 7-4.6 7-9V5.5z"/><path d="m9 11.5 2 2 3.5-3.8"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    arrow: '<path d="M9 6l6 6-6 6"/>',
    box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
    receipt: '<path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5z"/><path d="M9 8h6M9 12h6"/>',
    chart: '<path d="M4 20V4M4 20h16"/><path d="M8 20v-6M12 20v-9M16 20v-4M20 20V8"/>',
    tag: '<path d="M4 11.5V5.5A1.5 1.5 0 0 1 5.5 4h6l8 8-6 6z"/><circle cx="8.5" cy="8.5" r="1.2"/>',
    layers: '<path d="M12 3 3 8l9 5 9-5z"/><path d="M3 12l9 5 9-5M3 16l9 5 9-5"/>'
  };
  AQ.icon = function (n) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || P.box) + '</svg>';
  };

  /* base: every block re-renders itself when the language flips */
  class AQElement extends HTMLElement {
    connectedCallback() {
      this._l = () => this.render();
      document.addEventListener('aq:lang', this._l);
      if (this.setup) this.setup();
      this.render();
    }
    disconnectedCallback() { document.removeEventListener('aq:lang', this._l); }
  }
  function define(tag, methods, observed) {
    var C = class extends AQElement {};
    Object.assign(C.prototype, methods);
    if (observed) Object.defineProperty(C, 'observedAttributes', { get: function () { return observed; } });
    customElements.define(tag, C);
  }

  /* ── <aq-nav current="marketplace|mobility|logistics|merchant"> ───── */
  var NAV = [
    { id: 'marketplace', href: 'marketplace.html', ar: 'السوق', en: 'Marketplace' },
    { id: 'mobility', href: 'mobility.html', ar: 'مواصلاتي', en: 'Mwasalati' },
    { id: 'logistics', href: 'logistics.html', ar: 'سودان إكسبريس', en: 'Sudan Express' },
    { id: 'merchant', href: 'merchant.html', ar: 'التاجر', en: 'Merchant' }
  ];
  define('aq-nav', {
    setup: function () {
      this.addEventListener('click', function (e) {
        var b = e.target.closest('[data-lang]');
        if (b) AQ.setLang(b.getAttribute('data-lang'));
      });
    },
    render: function () {
      var cur = this.getAttribute('current') || '';
      var links = NAV.map(function (n) {
        return '<a href="' + n.href + '"' + (n.id === cur ? ' aria-current="page"' : '') + '>' + esc(AQ.t(n.ar, n.en)) + '</a>';
      }).join('');
      this.innerHTML =
        '<a class="aq-skip" href="#main">' + esc(AQ.t('تخطَّ إلى المحتوى', 'Skip to content')) + '</a>' +
        '<div class="aq-nav"><div class="aq-wrap aq-nav__row">' +
        '<a class="aq-brand" href="index.html" aria-label="' + esc(AQ.t('السوق — الرئيسية', 'alSooq — home')) + '">' +
        '<span class="aq-brand__mark" aria-hidden="true">س</span><span><b>' + esc(AQ.t('السوق', 'alSooq')) + '</b><small>Hawil ecosystem</small></span></a>' +
        '<nav class="aq-nav__links" aria-label="' + esc(AQ.t('أقسام المنظومة', 'Ecosystem')) + '">' + links + '</nav>' +
        '<div class="aq-nav__end"><div class="aq-lang" role="group" aria-label="Language">' +
        '<button type="button" data-lang="ar" aria-pressed="' + (AQ.lang === 'ar') + '">ع</button>' +
        '<button type="button" data-lang="en" aria-pressed="' + (AQ.lang === 'en') + '">EN</button></div>' +
        '<a class="aq-btn aq-btn--primary aq-nav__cta" href="../index.html">' + esc(AQ.t('افتح التطبيق', 'Launch app')) + '</a></div>' +
        '</div></div>';
    }
  });

  /* ── <aq-footer> ──────────────────────────────────────────────────── */
  define('aq-footer', {
    render: function () {
      this.innerHTML = '<footer class="aq-foot"><div class="aq-wrap aq-foot__row"><span>' +
        esc(AQ.t('السوق · منظومة هويل', 'alSooq · Hawil ecosystem')) + '</span><span>' +
        esc(AQ.t('واجهة أوّلية للعرض. الأرقام المعلَّمة «توضيحي» ليست أرقاماً فعلية، وشعارات الشركاء تُضاف بعد الاتفاقات.',
                 'Prototype for review. Figures marked “Illustrative” are not actuals; partner logos are added only after agreements.')) +
        '</span></div></footer>';
    }
  });

  /* ── <aq-product-card sku name-ar name-en price currency merchant verified tag-ar tag-en icon> ── */
  define('aq-product-card', {
    setup: function () {
      var self = this;
      this.addEventListener('click', function (e) {
        if (!e.target.closest('[data-add]')) return;
        self.dispatchEvent(new CustomEvent('aq:add', { bubbles: true, detail: {
          sku: self.getAttribute('sku'), ar: self.getAttribute('name-ar'), en: self.getAttribute('name-en'),
          price: Number(self.getAttribute('price')), currency: self.getAttribute('currency') || 'SDG'
        } }));
      });
    },
    render: function () {
      var g = this.getAttribute.bind(this);
      var name = AQ.t(g('name-ar'), g('name-en'));
      var tag = AQ.t(g('tag-ar') || '', g('tag-en') || '');
      this.innerHTML =
        '<article class="aq-card aq-pcard"><div class="aq-pcard__media">' +
        (tag ? '<span class="aq-pill aq-pcard__tag">' + esc(tag) + '</span>' : '') + AQ.icon(g('icon') || 'box') + '</div>' +
        '<div class="aq-pcard__body"><h3>' + esc(name) + '</h3>' +
        '<div class="aq-pcard__merchant">' + (this.hasAttribute('verified') ? AQ.icon('shield') : '') + esc(g('merchant') || '') +
        (this.hasAttribute('verified') ? '<span class="aq-sr">' + esc(AQ.t('تاجر موثّق', 'Verified merchant')) + '</span>' : '') + '</div>' +
        '<div class="aq-pcard__foot"><span class="aq-price">' + esc(AQ.money(Number(g('price')), g('currency') || 'SDG')) + '</span>' +
        '<button type="button" class="aq-btn aq-btn--primary" data-add aria-label="' + esc(AQ.t('أضف إلى السلة: ', 'Add to cart: ') + name) + '">' + esc(AQ.t('أضف', 'Add')) + '</button>' +
        '</div></div></article>';
    }
  });

  /* ── <aq-checkout steps='[{"id","ar","en","next_ar?","next_en?"}]'> ──
     Children <section data-step="id"> are the panels. The element adds the stepper + Back/Next.
       • native validation runs first (required/pattern/min…), then a cancelable `aq:validate` event
       • emits `aq:step` {index,id} after every move; el.goTo(id) jumps programmatically            */
  class AQCheckout extends HTMLElement {
    connectedCallback() {
      if (this._ready) return;
      this._ready = true;
      this.steps = JSON.parse(this.getAttribute('steps') || '[]');
      this.panels = this.steps.map((s) => this.querySelector(':scope > [data-step="' + s.id + '"]'));
      this.panels.forEach((p) => {
        if (!p) return;
        p.classList.add('aq-panel');
        var h = p.querySelector('h3'); if (h) h.tabIndex = -1;
      });
      this.ol = document.createElement('ol'); this.ol.className = 'aq-steps';
      this.bar = document.createElement('div'); this.bar.className = 'aq-actions';
      this.insertBefore(this.ol, this.firstChild);
      this.appendChild(this.bar);
      this.i = 0;
      this.bar.addEventListener('click', (e) => {
        var b = e.target.closest('[data-go]'); if (!b) return;
        this.move(b.getAttribute('data-go') === 'next' ? 1 : -1);
      });
      document.addEventListener('aq:lang', () => this.paint());
      this.paint();
    }
    paint() {
      var last = this.i === this.steps.length - 1, s = this.steps[this.i] || {};
      this.ol.setAttribute('aria-label', AQ.t('خطوات الطلب', 'Steps'));
      this.ol.innerHTML = this.steps.map((st, k) =>
        '<li class="aq-step"' + (k === this.i ? ' aria-current="step"' : '') + (k < this.i ? ' data-done' : '') + '>' + esc(AQ.t(st.ar, st.en)) + '</li>').join('');
      this.panels.forEach((p, k) => { if (p) p.hidden = k !== this.i; });
      this.bar.hidden = last;
      this.bar.innerHTML =
        '<button type="button" class="aq-btn aq-btn--ghost" data-go="back"' + (this.i === 0 ? ' style="visibility:hidden"' : '') + '>' + esc(AQ.t('رجوع', 'Back')) + '</button>' +
        '<button type="button" class="aq-btn aq-btn--primary" data-go="next">' + esc(AQ.t(s.next_ar || 'التالي', s.next_en || 'Next')) + '</button>';
    }
    move(d) {
      var to = this.i + d;
      if (to < 0 || to >= this.steps.length) return;
      if (d > 0) {
        var inputs = this.panels[this.i] ? this.panels[this.i].querySelectorAll('input,select,textarea') : [];
        for (var k = 0; k < inputs.length; k++) { if (!inputs[k].checkValidity()) { inputs[k].reportValidity(); return; } }
        var ev = new CustomEvent('aq:validate', { bubbles: true, cancelable: true, detail: { index: this.i, id: this.steps[this.i].id } });
        if (!this.dispatchEvent(ev)) return;
      }
      this.i = to; this.paint();
      var h = this.panels[to] && this.panels[to].querySelector('h3');
      if (h) h.focus();                      // move focus so screen readers announce the new step
      this.dispatchEvent(new CustomEvent('aq:step', { bubbles: true, detail: { index: to, id: this.steps[to].id } }));
    }
    goTo(id) {
      var k = this.steps.findIndex((s) => s.id === id);
      if (k < 0) return;
      this.i = k; this.paint();
      this.dispatchEvent(new CustomEvent('aq:step', { bubbles: true, detail: { index: k, id: id } }));
    }
  }
  customElements.define('aq-checkout', AQCheckout);

  /* ── <aq-workspace vertical="marketplace|mobility|logistics"> — merchant console shell ── */
  var TABS = [{ id: 'overview', ar: 'نظرة عامة', en: 'Overview', ic: 'chart' }, { id: 'orders', ar: 'الطلبات', en: 'Orders', ic: 'receipt' }];
  var STAGES = [['طلب', 'Request'], ['عرض', 'Offer'], ['تسوية', 'Settlement'], ['ثقة', 'Trust']];
  define('aq-workspace', {
    setup: function () {
      var self = this; this.tab = 'overview';
      this.addEventListener('click', function (e) {
        var b = e.target.closest('[data-tab]'); if (!b) return;
        self.tab = b.getAttribute('data-tab'); self.render();
        var f = self.querySelector('[data-tab][aria-current="true"]'); if (f) f.focus();
      });
    },
    attributeChangedCallback: function () { if (this.isConnected) this.render(); },
    render: function () {
      var d = (AQ.sample && AQ.sample.workspace[this.getAttribute('vertical') || 'marketplace']) || { kpis: [], orders: [] };
      var side = TABS.map(function (t) {
        return '<button type="button" data-tab="' + t.id + '"' + (t.id === this.tab ? ' aria-current="true"' : '') + '>' + AQ.icon(t.ic) + esc(AQ.t(t.ar, t.en)) + '</button>';
      }, this).join('');
      var counts = [0, 0, 0, 0]; d.orders.forEach(function (o) { counts[o.stage]++; });
      var kpis = d.kpis.map(function (k) {
        return '<div class="aq-card aq-kpi"><span>' + esc(AQ.t(k.ar, k.en)) + '</span><b>' + esc(k.cur ? AQ.money(k.v, k.cur) : AQ.num(k.v) + (k.suffix || '')) + '</b></div>';
      }).join('');
      var stages = STAGES.map(function (s, k) { return '<li' + (counts[k] ? ' data-on' : '') + '>' + esc(AQ.t(s[0], s[1])) + ' · ' + esc(AQ.num(counts[k])) + '</li>'; }).join('');
      var rows = d.orders.map(function (o) {
        return '<tr><td class="aq-mono">' + esc(o.ref) + '</td><td>' + esc(AQ.t(o.ar, o.en)) + '</td><td class="aq-num">' + esc(AQ.money(o.amount, o.cur)) +
          '</td><td><span class="aq-pill' + (o.stage === 3 ? ' aq-pill--ok' : '') + '">' + esc(AQ.t(STAGES[o.stage][0], STAGES[o.stage][1])) + '</span></td></tr>';
      }).join('');
      var table = '<div class="aq-card aq-tablewrap"><table class="aq-table"><thead><tr><th>' + esc(AQ.t('المرجع', 'Ref')) + '</th><th>' + esc(AQ.t('الطرف', 'Party')) +
        '</th><th>' + esc(AQ.t('المبلغ', 'Amount')) + '</th><th>' + esc(AQ.t('المرحلة', 'Stage')) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
      var badge = '<p><span class="aq-illustrative">' + esc(AQ.t('توضيحي — ليست أرقاماً فعلية', 'SCHEMATIC · NOT ACTUALS')) + '</span></p>';
      this.innerHTML = '<div class="aq-ws"><nav class="aq-card aq-ws__side" aria-label="' + esc(AQ.t('لوحة التاجر', 'Merchant console')) + '">' + side + '</nav><div class="aq-ws__main">' + badge +
        (this.tab === 'overview'
          ? '<div class="aq-kpis">' + kpis + '</div><ol class="aq-stages" aria-label="' + esc(AQ.t('مسار المعاملة', 'Transaction flow')) + '">' + stages + '</ol>' + table
          : table) + '</div></div>';
    }
  }, ['vertical']);

  /* ── boot ─────────────────────────────────────────────────────────── */
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* ignore */ }
  AQ.setLang(saved || document.documentElement.lang || 'ar');
})();
