# AlSooq (السوق) — Site Files

This folder collects the alSooq prototypes, demos, and the strategic pitch deck into a single organized structure, following the bilingual naming convention below.

## Folder structure

```
AlSooq-Site/
│
├── 1_Public_Site / الموقع العام
│   ├── Landing_Page.html / صفحة الهبوط
│   └── Platform_Site.html / موقع المنصة
│
├── 2_Core_Platform / المنصة الأساسية
│   ├── Catalog_SDK.html / حزمة تطوير الكتالوج
│   └── Order_Lifecycle_Demo.html / عرض دورة حياة الطلب
│
├── 3_Service_SDKs / حزم تطوير الخدمات
│   └── SudanExpress_Merchant_SDK.html / حزمة تطوير تاجر سودان إكسبريس
│
├── 4_Mwasalati / مواصلاتي
│   ├── Route_Atlas.html / أطلس المسارات
│   ├── Negotiation_Module.html / وحدة التفاوض
│   └── Fleet_Console.html / وحدة الأسطول والتاجر
│
├── 5_Onboarding_Motion / العرض التعريفي
│   ├── Showcase.html / العرض
│   ├── Storyboard.html / لوحة القصة
│   └── Motion_Reel.html / شريط الحركة
│
├── 6_Internal_Reference / المرجع الداخلي
│   ├── Board_Deck.html / عرض مجلس الإدارة
│   └── Scenario_Benchmark.html / معيار السيناريو
│
└── 7_Pitch_Deck / العرض التقديمي
    ├── Pitch_Deck.html — interactive, self-contained, on-brand
    └── Pitch_Deck.pdf — static export of the same deck
```

## What's where

- **1_Public_Site** — the public-facing entry points. `Landing_Page` is the bilingual directory (5 category drawers + 4-pillar overview); `Platform_Site` is the full interactive platform site (hero, service tabs, roadmap, corridors).
- **2_Core_Platform** — `Catalog_SDK` (customer + merchant phone-prototype catalog) and `Order_Lifecycle_Demo` (animated swimlane order lifecycle).
- **3_Service_SDKs** — `SudanExpress_Merchant_SDK`, the logistics SDK (quote, waybill, pickup, hold-to-handover).
- **4_Mwasalati** — `Route_Atlas` (route map + live fare calculator), `Negotiation_Module` (inDriver-style banded counter-offer negotiation), and `Fleet_Console` (bilingual fleet inventory + maintenance schedule and the merchant/alSooq catalog workspace, folded into one console).
- **5_Onboarding_Motion** — `Showcase` (7-act merchant onboarding motion demo), `Storyboard` (5-slide animated brand storyboard), `Motion_Reel` (extended motion reel, largest file in the set).
- **6_Internal_Reference** — `Board_Deck` (20-slide CONFIDENTIAL Arabic/English strategic partnership deck) and `Scenario_Benchmark` (revenue/occupancy fleet-economics calculator).
- **7_Pitch_Deck** — the standalone strategic presentation, built to the same brand system as `Board_Deck` (sand/ink/clay/palm/gold palette, IBM Plex Sans + Sans Arabic, bilingual RTL), signed by Mohamed Fadl — The Architect. `Pitch_Deck.html` is the living, animated version (keyboard/click navigation, progress rail); `Pitch_Deck.pdf` is a flat export of the same 9 slides for sharing or printing.

## Notes on this pass

- Renamed every folder and file to the bilingual `N_Name` convention shown above (previously `01-public-site`, `alsooq-home.html`, etc.).
- **Fixed a broken link set found during the rename**: every reference to the platform site inside `Landing_Page.html` pointed to `../02-core-platform/alsooq-platform-site.html` — a path that never existed, since the platform site has always lived alongside the landing page, not in the core-platform folder. All 14 occurrences now correctly resolve to `Platform_Site.html` in the same folder.
- Updated the remaining cross-file links in `Landing_Page.html` (to `SudanExpress_Merchant_SDK`, `Route_Atlas`, `Negotiation_Module`) to the new paths. No other file in the set contains cross-file links.
- Folded the previously separate `pitch-deck/` working folder into `7_Pitch_Deck`, keeping only the two finished deliverables (the interactive HTML and its PDF export) and dropping intermediate build files, render scripts, fonts, and the earlier non-brand-compliant draft.
- All HTML files are self-contained (inline CSS/JS, fonts embedded or loaded per-file) and share the same bilingual Arabic (RTL) / English canonical brand system — IBM Plex Sans / Sans Arabic, and CSS custom properties like `--sand`, `--clay`, `--palm`, `--gold`.
