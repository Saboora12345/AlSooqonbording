'use client';
import type { ReactNode } from 'react';
import { useLang } from './LangProvider';
import type { VerticalCopy } from '@/lib/verticals';

export interface HeroCta { href: string; label: [string, string]; }

export function Hero({ copy, cta, art }: { copy: VerticalCopy; cta?: HeroCta; art?: ReactNode }) {
  const { t } = useLang();
  return (
    <section className="aq-hero">
      <div className={art ? 'aq-wrap aq-hero__grid' : 'aq-wrap'}>
        <div>
          <span className="aq-eyebrow">{t(...copy.eyebrow)}</span>
          <h1>{t(...copy.title)}<span className="aq-hl">{t(...copy.hl)}</span></h1>
          <p className="aq-lede">{t(...copy.lede)}</p>
          {cta && <div className="aq-hero__cta"><a className="aq-btn aq-btn--primary aq-btn--lg" href={cta.href}>{t(...cta.label)}</a></div>}
        </div>
        {art && <div className="aq-hero__art">{art}</div>}
      </div>
    </section>
  );
}
