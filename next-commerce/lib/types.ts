export type Lang = 'ar' | 'en';
export type Currency = 'SDG' | 'EGP';
export type VerticalId = 'marketplace' | 'mobility' | 'logistics';

export interface Product {
  id: string;
  titleAr: string;
  titleEn: string;
  price: number;
  currency: Currency;
  merchant: string;
  verified: boolean;
  icon: string;
  tag?: [string, string] | null;
}

/** Mirrors kit/js/sample-data.js. `confirmed` flags are owner-supplied facts; the rest is illustrative. */
export interface Sample {
  products: { sku: string; icon: string; ar: string; en: string; price: number; merchant: string; verified: boolean; tag: [string, string] | null }[];
  mobility: {
    confirmed: Record<string, boolean>;
    currency: Currency;
    fares: { id: string; amount: number; ar: string; en: string }[];
    boarding: { id: string; ar: string; en: string }[];
    seatRows: number;
    taken: string[];
  };
  logistics: {
    confirmed: Record<string, boolean>;
    currency: Currency;
    ratePerKg: number;
    route: { from: { ar: string; en: string }; to: { ar: string; en: string } };
  };
  workspace: Record<VerticalId, {
    kpis: { ar: string; en: string; v: number; cur?: Currency; suffix?: string }[];
    orders: { ref: string; ar: string; en: string; amount: number; cur: Currency; stage: 0 | 1 | 2 | 3 }[];
  }>;
}
