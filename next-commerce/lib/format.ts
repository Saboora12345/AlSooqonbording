import type { Currency, Lang } from './types';

/** Arabic-Indic digits in AR, Latin in EN (owner rule). */
export const num = (n: number, lang: Lang) => new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(n);

const CUR: Record<Currency, Record<Lang, string>> = { SDG: { ar: 'ج.س', en: 'SDG' }, EGP: { ar: 'ج.م', en: 'EGP' } };
export const money = (n: number, cur: Currency, lang: Lang) => `${num(n, lang)} ${CUR[cur][lang]}`;
