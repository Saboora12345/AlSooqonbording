'use client';
import { useState } from 'react';
import { useLang } from './LangProvider';
import { Icon } from './Icon';
import { money, num } from '@/lib/format';
import { sample } from '@/lib/sample';
import type { VerticalId } from '@/lib/types';

const STAGES: [string, string][] = [['طلب', 'Request'], ['عرض', 'Offer'], ['تسوية', 'Settlement'], ['ثقة', 'Trust']];

/** Merchant console shell. Data is SCHEMATIC (labelled) until wired to the real API. */
export function MerchantWorkspace({ vertical }: { vertical: VerticalId }) {
  const { lang, t } = useLang();
  const [tab, setTab] = useState<'overview' | 'orders'>('overview');
  const d = sample.workspace[vertical];
  const counts = [0, 0, 0, 0]; d.orders.forEach((o) => counts[o.stage]++);
  const table = (
    <div className="aq-card aq-tablewrap">
      <table className="aq-table">
        <thead><tr><th>{t('المرجع', 'Ref')}</th><th>{t('الطرف', 'Party')}</th><th>{t('المبلغ', 'Amount')}</th><th>{t('المرحلة', 'Stage')}</th></tr></thead>
        <tbody>
          {d.orders.map((o) => (
            <tr key={o.ref}>
              <td className="aq-mono">{o.ref}</td><td>{t(o.ar, o.en)}</td><td className="aq-num">{money(o.amount, o.cur, lang)}</td>
              <td><span className={`aq-pill${o.stage === 3 ? ' aq-pill--ok' : ''}`}>{t(...STAGES[o.stage])}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return (
    <div className="aq-ws">
      <nav className="aq-card aq-ws__side" aria-label={t('لوحة التاجر', 'Merchant console')}>
        <button type="button" aria-current={tab === 'overview'} onClick={() => setTab('overview')}><Icon name="chart" />{t('نظرة عامة', 'Overview')}</button>
        <button type="button" aria-current={tab === 'orders'} onClick={() => setTab('orders')}><Icon name="receipt" />{t('الطلبات', 'Orders')}</button>
      </nav>
      <div className="aq-ws__main">
        <p><span className="aq-illustrative">{t('توضيحي — ليست أرقاماً فعلية', 'SCHEMATIC · NOT ACTUALS')}</span></p>
        {tab === 'overview' ? (
          <>
            <div className="aq-kpis">
              {d.kpis.map((k) => (
                <div key={k.en} className="aq-card aq-kpi"><span>{t(k.ar, k.en)}</span><b>{k.cur ? money(k.v, k.cur, lang) : num(k.v, lang) + (k.suffix ?? '')}</b></div>
              ))}
            </div>
            <ol className="aq-stages" aria-label={t('مسار المعاملة', 'Transaction flow')}>
              {STAGES.map((s, k) => <li key={s[1]} data-on={counts[k] ? '' : undefined}>{t(...s)} · {num(counts[k], lang)}</li>)}
            </ol>
            {table}
          </>
        ) : table}
      </div>
    </div>
  );
}
