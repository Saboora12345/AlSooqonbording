import type { VerticalId } from './types';

type T = [ar: string, en: string];
export interface VerticalCopy { nav: T; eyebrow: T; title: T; hl: T; lede: T; cta: T; }

export const VERTICALS: Record<VerticalId, VerticalCopy> = {
  marketplace: {
    nav: ['السوق', 'Marketplace'],
    eyebrow: ['السوق · الأمانة تحمي الطرفين', 'Marketplace · escrow protects both sides'],
    title: ['اشترِ بأمان. ', 'Buy safely. '],
    hl: ['لا يصل المال للبائع قبل أن يصلك الطلب.', 'The seller is paid only after your order arrives.'],
    lede: ['يُحجز المبلغ في الأمانة، ويُفرج عنه عندما تؤكّد الاستلام بالمسح. تتصفّح، تضيف، وتدفع من محفظة حوّل.',
      'Your payment is held in escrow and released when you confirm delivery by scan. Browse, add, and pay from the Hawil wallet.'],
    cta: ['تصفّح الكتالوج', 'Browse the catalog'],
  },
  mobility: {
    nav: ['مواصلاتي', 'Mwasalati'],
    eyebrow: ['مواصلاتي · حجز مقعد', 'Mwasalati · seat booking'],
    title: ['احجز مقعد الغد. ', 'Book tomorrow’s seat. '],
    hl: ['تصلك التذكرة برمز QR.', 'Your ticket arrives as a QR code.'],
    lede: ['اختر نقطة الصعود والأجرة والمقعد، وادفع من محفظتك. كل رحلة تفتح لك باباً إلى الخدمات المالية.',
      'Pick a boarding point, a fare and a seat, then pay from your wallet. Every ride opens a door to financial services.'],
    cta: ['ابدأ الحجز', 'Start booking'],
  },
  logistics: {
    nav: ['سودان إكسبريس', 'Sudan Express'],
    eyebrow: ['سودان إكسبريس · القاهرة ← الخرطوم', 'Sudan Express · Cairo → Khartoum'],
    title: ['من القاهرة إلى الخرطوم، ', 'Cairo to Khartoum, '],
    hl: ['سعر الكيلو ثابت.', 'one flat rate per kilo.'],
    lede: ['سعر ثابت للبضائع العامة. الأصناف الخاصة (إلكترونيات، قابلة للكسر) والسعر الشامل عند الطلب.',
      'A flat rate for general cargo. Specialty classes (electronics, fragile) and the all-inclusive price are on request.'],
    cta: ['احسب شحنتك', 'Quote your shipment'],
  },
};

export const isVertical = (v: string): v is VerticalId => v in VERTICALS;
