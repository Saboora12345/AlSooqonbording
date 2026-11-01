'use client';
import { useState } from 'react';
import { useLang } from './LangProvider';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MerchantWorkspace } from './MerchantWorkspace';
import { VERTICALS } from '@/lib/verticals';
import type { VerticalId } from '@/lib/types';

/** Owns the vertical state, so it renders its own data-vertical wrapper (re-tints nav, buttons, tiles together). */
export function MerchantConsole() {
  const { t } = useLang();
  const [v, setV] = useState<VerticalId>('marketplace');
  return (
    <div className="aq-page" data-vertical={v}>
      <Navbar current="merchant" />
      <main id="main"><section className="aq-sec"><div className="aq-wrap">
        <div className="aq-sec__head">
          <div>
            <h1 style={{ fontSize: 'var(--aq-fs-xl)' }}>{t('لوحة التاجر', 'Merchant workspace')}</h1>
            <p>{t('لوحة واحدة، وتتلوّن بحسب القطاع. المسار: طلب ← عرض ← تسوية ← ثقة.', 'One console that re-tints per vertical. The flow: Request → Offer → Settlement → Trust.')}</p>
          </div>
          <div role="group" aria-label="Vertical" style={{ display: 'flex', gap: 'var(--aq-s-2)', flexWrap: 'wrap' }}>
            {(Object.keys(VERTICALS) as VerticalId[]).map((id) => (
              <button key={id} type="button" className="aq-chip" aria-pressed={v === id} onClick={() => setV(id)}>{t(...VERTICALS[id].nav)}</button>
            ))}
          </div>
        </div>
        <MerchantWorkspace vertical={v} />
      </div></section></main>
      <Footer />
    </div>
  );
}
