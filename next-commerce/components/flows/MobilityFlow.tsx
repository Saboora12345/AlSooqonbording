'use client';
import { useState } from 'react';
import { useLang } from '../LangProvider';
import { CheckoutSteps, type Step } from '../CheckoutSteps';
import { money } from '@/lib/format';
import { sample } from '@/lib/sample';

/** Boarding point → fare → seat → payment → ticket. Fare AMOUNTS are owner-confirmed; boarding points are placeholders. */
export function MobilityFlow() {
  const { lang, t } = useLang();
  const M = sample.mobility;
  const [boarding, setBoarding] = useState<string | null>(null);
  const [fare, setFare] = useState<string | null>(null);
  const [seat, setSeat] = useState<string | null>(null);
  const f = M.fares.find((x) => x.id === fare);
  const b = M.boarding.find((x) => x.id === boarding);
  const seats = Array.from({ length: M.seatRows }, (_, r) => ['A', 'B', null, 'C', 'D'].map((c) => (c ? `${r + 1}${c}` : null)));

  const steps: Step[] = [
    { id: 'boarding', ar: 'نقطة الصعود', en: 'Boarding point',
      content: (<><h3 tabIndex={-1}>{t('من أين تصعد؟', 'Where do you board?')}</h3>
        <div className="aq-choices" role="radiogroup">{M.boarding.map((x) => (
          <label key={x.id} className="aq-radio"><input type="radio" name="boarding" required checked={boarding === x.id} onChange={() => setBoarding(x.id)} /><b className="aq-placeholder">{t(x.ar, x.en)}</b></label>))}</div></>) },
    { id: 'fare', ar: 'الأجرة', en: 'Fare',
      content: (<><h3 tabIndex={-1}>{t('اختر الأجرة', 'Choose a fare')}</h3>
        <div className="aq-choices" role="radiogroup">{M.fares.map((x) => (
          <label key={x.id} className="aq-radio"><input type="radio" name="fare" required checked={fare === x.id} onChange={() => setFare(x.id)} /><b>{t(x.ar, x.en)}</b><span className="aq-num">{money(x.amount, M.currency, lang)}</span></label>))}</div></>) },
    { id: 'seat', ar: 'المقعد', en: 'Seat', validate: () => (seat ? null : t('اختر مقعداً للمتابعة.', 'Pick a seat to continue.')),
      content: (<><h3 tabIndex={-1}>{t('اختر مقعدك', 'Pick your seat')}</h3>
        <p style={{ marginBlockEnd: 'var(--aq-s-4)' }}><span className="aq-illustrative">{t('تخطيط توضيحي', 'Illustrative layout')}</span></p>
        <div className="aq-seatmap" role="group" aria-label="Seats">{seats.flat().map((id, k) => id === null ? <span key={k} className="aq-aisle" /> : (
          <button key={id} type="button" className="aq-seat" aria-pressed={seat === id} disabled={M.taken.includes(id)}
            aria-label={t('مقعد ', 'Seat ') + id + (M.taken.includes(id) ? t(' — محجوز', ' — taken') : '')} onClick={() => setSeat(id)}>{id}</button>))}</div></>) },
    { id: 'pay', ar: 'الدفع', en: 'Payment', nextAr: 'ادفع واصدر التذكرة', nextEn: 'Pay and issue ticket',
      content: (<><h3 tabIndex={-1}>{t('الدفع', 'Payment')}</h3>
        <div className="aq-choices" role="radiogroup"><label className="aq-radio"><input type="radio" name="method" defaultChecked /><b>{t('محفظة حوّل', 'Hawil wallet')}</b><span>{t('خصم فوري.', 'Instant debit.')}</span></label></div>
        <div className="aq-summary" style={{ marginBlockStart: 'var(--aq-s-5)' }}><div className="aq-total"><span>{t('الأجرة', 'Fare')}</span><span className="aq-price">{f ? money(f.amount, M.currency, lang) : '—'}</span></div></div></>) },
    { id: 'ticket', ar: 'التذكرة', en: 'Ticket',
      content: (<><h3 tabIndex={-1}>{t('تذكرتك', 'Your ticket')}</h3>
        <div className="aq-hero__grid" style={{ gridTemplateColumns: 'auto 1fr', gap: 'var(--aq-s-5)' }}>
          <div className="aq-qr" role="img" aria-label="QR placeholder">QR</div>
          <div className="aq-summary">
            <div><span>{t('نقطة الصعود', 'Boarding')}</span><span className="aq-placeholder">{b ? t(b.ar, b.en) : '—'}</span></div>
            <div><span>{t('الأجرة', 'Fare')}</span><span>{f ? `${t(f.ar, f.en)} · ${money(f.amount, M.currency, lang)}` : '—'}</span></div>
            <div><span>{t('المقعد', 'Seat')}</span><span>{seat ?? '—'}</span></div>
            <div><span>{t('رقم التذكرة', 'Ticket ID')}</span><span className="aq-placeholder">[TICKET ID]</span></div>
          </div></div></>) },
  ];
  return (
    <section className="aq-sec" id="book"><div className="aq-wrap">
      <div className="aq-sec__head"><div><h2>{t('احجز مقعدك', 'Book your seat')}</h2><p>{t('خمس خطوات قصيرة.', 'Five short steps.')}</p></div>
        <span className="aq-illustrative">{t('الأجرة مؤكَّدة · باقي البيانات توضيحية', 'Fares confirmed · other data illustrative')}</span></div>
      <CheckoutSteps steps={steps} />
    </div></section>
  );
}
