/* alSooq · Kit sample data — the ONLY place figures live.
   Rules (from the repo owner, CLAUDE.md + sudan-express-brand-ops):
     • `confirmed: true`  → supplied by the owner; safe to show as fact.
     • everything else    → ILLUSTRATIVE; the UI labels it ("SCHEMATIC · NOT ACTUALS").
     • `null`             → not supplied yet; the UI shows a visible [PLACEHOLDER], never a guess.
   Replace this file with real API calls (see next-commerce/lib/commerce.ts for the typed seam). */
window.AQ = window.AQ || {};
AQ.sample = {
  /* illustrative marketplace catalog (names/prices are NOT real listings) */
  products: [
    { sku: 'p1', icon: 'shop',   ar: 'سلة تسوّق منزلية',        en: 'Household basket',        price: 42000,  merchant: 'Nile Retail',      verified: true,  tag: ['الأكثر طلباً', 'Popular'] },
    { sku: 'p2', icon: 'build',  ar: 'أسمنت بورتلاندي (طن)',    en: 'Portland cement (ton)',   price: 68000,  merchant: 'Atbara Materials', verified: true,  tag: null },
    { sku: 'p3', icon: 'build',  ar: 'حديد تسليح (طن)',         en: 'Rebar (ton)',             price: 95000,  merchant: 'Atbara Materials', verified: true,  tag: null },
    { sku: 'p4', icon: 'cap',    ar: 'رسوم فصل جامعي',          en: 'University term fees',    price: 150000, merchant: 'U. of Khartoum',   verified: true,  tag: null },
    { sku: 'p5', icon: 'wallet', ar: 'شحن رصيد المحفظة',        en: 'Wallet top-up',           price: 5000,   merchant: 'Hawil',            verified: true,  tag: null },
    { sku: 'p6', icon: 'shop',   ar: 'مستلزمات مكتبية',         en: 'Office supplies',         price: 18000,  merchant: 'Nile Retail',      verified: false, tag: null },
    { sku: 'p7', icon: 'box',    ar: 'طرد تجهيز متجر',          en: 'Shop-fitting parcel',     price: 36000,  merchant: 'Souk Supply',      verified: false, tag: ['جديد', 'New'] },
    { sku: 'p8', icon: 'tag',    ar: 'قسيمة خصم',               en: 'Discount voucher',        price: 2500,   merchant: 'alSooq',           verified: true,  tag: null }
  ],

  mobility: {
    /* owner-confirmed amounts (CLAUDE.md, 2026-09). Tier NAMES and boarding points are not supplied. */
    confirmed: { fares: true, tierNames: false, boarding: false, seats: false },
    currency: 'SDG',
    fares: [
      { id: 't1', amount: 3000,  ar: 'الفئة الأولى',  en: 'Tier 1' },
      { id: 't2', amount: 8000,  ar: 'الفئة الثانية', en: 'Tier 2' },
      { id: 't3', amount: 15000, ar: 'الفئة الثالثة', en: 'Tier 3' }
    ],
    boarding: [
      { id: 'b1', ar: '[نقطة الصعود ١]', en: '[BOARDING POINT 1]' },
      { id: 'b2', ar: '[نقطة الصعود ٢]', en: '[BOARDING POINT 2]' },
      { id: 'b3', ar: '[نقطة الصعود ٣]', en: '[BOARDING POINT 3]' }
    ],
    seatRows: 6,            // illustrative 2+2 layout
    taken: ['1B', '3A', '4D']
  },

  logistics: {
    /* owner-confirmed: 88 EGP/kg, Cairo → Khartoum, flat for general cargo. Everything else: ask the owner. */
    confirmed: { ratePerKg: true },
    currency: 'EGP',
    ratePerKg: 88,
    route: { from: { ar: 'القاهرة', en: 'Cairo' }, to: { ar: 'الخرطوم', en: 'Khartoum' } },
    minWeightKg: null,       // [MIN WEIGHT]
    transitDays: null,       // [TRANSIT]
    allInclusiveEGP: null,   // [ALL-INCLUSIVE EGP] — "on request"
    specialtyClasses: 'on-request'   // electronics / fragile
  },

  /* workspace tiles & rows — ALL illustrative. stage: 0 Request · 1 Offer · 2 Settlement · 3 Trust */
  workspace: {
    marketplace: {
      kpis: [
        { ar: 'مبيعات اليوم', en: "Today's sales", v: 412000, cur: 'SDG' },
        { ar: 'طلبات مفتوحة', en: 'Open orders', v: 14 },
        { ar: 'محجوز في الأمانة', en: 'Held in escrow', v: 187500, cur: 'SDG' },
        { ar: 'درجة الثقة', en: 'Trust score', v: 92, suffix: '/100' }
      ],
      orders: [
        { ref: 'MK-1041', ar: 'نيل للتجزئة', en: 'Nile Retail', amount: 42000, cur: 'SDG', stage: 2 },
        { ref: 'MK-1042', ar: 'مواد عطبرة', en: 'Atbara Materials', amount: 68000, cur: 'SDG', stage: 1 },
        { ref: 'MK-1043', ar: 'سوق للتوريد', en: 'Souk Supply', amount: 36000, cur: 'SDG', stage: 0 },
        { ref: 'MK-1044', ar: 'نيل للتجزئة', en: 'Nile Retail', amount: 18000, cur: 'SDG', stage: 3 }
      ]
    },
    mobility: {
      kpis: [
        { ar: 'تذاكر اليوم', en: 'Tickets today', v: 126 },
        { ar: 'مقاعد شاغرة', en: 'Seats open', v: 38 },
        { ar: 'إيراد اليوم', en: "Today's revenue", v: 540000, cur: 'SDG' },
        { ar: 'الالتزام بالمواعيد', en: 'On-time', v: 94, suffix: '%' }
      ],
      orders: [
        { ref: 'MW-2201', ar: 'رحلة ١', en: 'Trip 1', amount: 8000, cur: 'SDG', stage: 3 },
        { ref: 'MW-2202', ar: 'رحلة ٢', en: 'Trip 2', amount: 3000, cur: 'SDG', stage: 2 },
        { ref: 'MW-2203', ar: 'رحلة ٣', en: 'Trip 3', amount: 15000, cur: 'SDG', stage: 1 }
      ]
    },
    logistics: {
      kpis: [
        { ar: 'شحنات مفتوحة', en: 'Open shipments', v: 9 },
        { ar: 'كيلوات هذا الأسبوع', en: 'Kg this week', v: 640 },
        { ar: 'محجوز في الأمانة', en: 'Held in escrow', v: 56320, cur: 'EGP' },
        { ar: 'تسليم في الموعد', en: 'On-time delivery', v: 91, suffix: '%' }
      ],
      orders: [
        { ref: 'SX-3301', ar: 'القاهرة ← الخرطوم', en: 'Cairo → Khartoum', amount: 8800, cur: 'EGP', stage: 2 },
        { ref: 'SX-3302', ar: 'القاهرة ← الخرطوم', en: 'Cairo → Khartoum', amount: 4400, cur: 'EGP', stage: 1 },
        { ref: 'SX-3303', ar: 'القاهرة ← الخرطوم', en: 'Cairo → Khartoum', amount: 17600, cur: 'EGP', stage: 0 }
      ]
    }
  }
};
