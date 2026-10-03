'use client';
import { useState } from 'react';
import { useLang } from '../LangProvider';
import { CheckoutSteps, type Step } from '../CheckoutSteps';
import { money, num } from '@/lib/format';
import { sample } from '@/lib/sample';

/** Only the 88 EGP/kg rate is owner-confirmed. Min weight, transit, all-inclusive price and WhatsApp stay [PLACEHOLDER]s. */
export function LogisticsFlow() {
  const { lang, t } = useLang();
  const L = sample.logistics;
  const [kg, setKg] = useState('');
  const w = parseFloat(kg) || 0;
  const total = money(Math.round(w * L.ratePerKg * 100) / 100, L.currency, lang);
  const rate = `${money(L.ratePerKg, L.currency, lang)}${t(' / كجم', ' / kg')}`;

  const steps: Step[] = [
    { id: 'details', ar: 'بيانات الشحنة', en: 'Shipment',
      content: (<><h3 tabIndex={-1}>{t('ماذا ستشحن؟', 'What are you shipping?')}</h3>
        <div className="aq-form"><div className="aq-field"><label htmlFor="f-kg">{t('الوزن (كيلو)', 'Weight (kg)')}</label>
          <input id="f-kg" type="number" inputMode="decimal" min="0.1" step="0.1" required value={kg} onChange={(e) => setKg(e.target.value)} />
          <small>{t('الحد الأدنى للوزن عند الطلب.', 'Minimum weight on request.')}</small></div></div>
        <div className="aq-choices" role="radiogroup" style={{ marginBlockStart: 'var(--aq-s-4)' }}>
          <label className="aq-radio"><input type="radio" name="cls" defaultChecked /><b>{t('بضائع عامة', 'General cargo')}</b><span>{t('سعر الكيلو الثابت.', 'The flat per-kilo rate.')}</span></label>
          <label className="aq-radio" aria-disabled="true" style={{ opacity: 0.55 }}><input type="radio" name="cls" disabled /><b>{t('أصناف خاصة', 'Specialty classes')}</b><span>{t('إلكترونيات وقابلة للكسر — عند الطلب.', 'Electronics and fragile — on request.')}</span></label>
        </div></>) },
    { id: 'quote', ar: 'التسعيرة', en: 'Quote',
      content: (<><h3 tabIndex={-1}>{t('تسعيرتك', 'Your quote')}</h3>
        <div className="aq-summary">
          <div><span>{t('المسار', 'Route')}</span><span>{t(`${L.route.from.ar} ← ${L.route.to.ar}`, `${L.route.from.en} → ${L.route.to.en}`)}</span></div>
          <div><span>{t('الوزن', 'Weight')}</span><span className="aq-num">{num(w, lang)} {t('كجم', 'kg')}</span></div>
          <div><span>{t('سعر الكيلو', 'Per-kilo rate')}</span><span className="aq-num">{rate}</span></div>
          <div className="aq-total"><span>{t('الإجمالي', 'Total')}</span><span className="aq-price">{total}</span></div>
        </div>
        <p style={{ marginBlockStart: 'var(--aq-s-3)', color: 'var(--aq-ink-2)' }}>{t('مدة النقل: ', 'Transit: ')}<span className="aq-placeholder">[TRANSIT]</span></p></>) },
    { id: 'pay', ar: 'الدفع بالأمانة', en: 'Escrow payment', nextAr: 'ادفع واصدر البوليصة', nextEn: 'Pay and issue waybill',
      content: (<><h3 tabIndex={-1}>{t('الدفع إلى الأمانة', 'Pay into escrow')}</h3>
        <div className="aq-choices" role="radiogroup"><label className="aq-radio"><input type="radio" name="method" defaultChecked /><b>{t('محفظة حوّل', 'Hawil wallet')}</b><span>{t('المبلغ محجوز حتى مسح التسليم.', 'Held until the handover scan.')}</span></label></div>
        <div className="aq-summary" style={{ marginBlockStart: 'var(--aq-s-5)' }}><div className="aq-total"><span>{t('الإجمالي', 'Total')}</span><span className="aq-price">{total}</span></div></div></>) },
    { id: 'waybill', ar: 'البوليصة', en: 'Waybill',
      content: (<><h3 tabIndex={-1}>{t('بوليصة الشحن', 'Waybill')}</h3>
        <div className="aq-hero__grid" style={{ gridTemplateColumns: 'auto 1fr', gap: 'var(--aq-s-5)' }}>
          <div className="aq-qr" role="img" aria-label="QR placeholder">QR</div>
          <div className="aq-summary">
            <div><span>{t('رقم البوليصة', 'Waybill ID')}</span><span className="aq-placeholder">[WAYBILL ID]</span></div>
            <div><span>{t('المبلغ المحجوز', 'Held in escrow')}</span><span className="aq-price">{total}</span></div>
            <div><span>{t('واتساب', 'WhatsApp')}</span><span className="aq-placeholder">[WHATSAPP]</span></div>
          </div></div></>) },
  ];
  return (
    <section className="aq-sec" id="ship"><div className="aq-wrap">
      <div className="aq-sec__head"><div><h2>{t('اشحن الآن', 'Ship now')}</h2><p>{t('أربع خطوات، والمبلغ محجوز حتى التسليم.', 'Four steps, with funds held until delivery.')}</p></div></div>
      <CheckoutSteps steps={steps} />
    </div></section>
  );
}
