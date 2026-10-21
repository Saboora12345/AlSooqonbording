'use client';
import Link from 'next/link';
import { useLang } from './LangProvider';
import { Icon } from './Icon';
import { Hero } from './Hero';
import type { VerticalCopy } from '@/lib/verticals';
import type { VerticalId } from '@/lib/types';

type T = [ar: string, en: string];
interface Card { href: string; v?: VerticalId; icon: string; t: T; d: T; pill: T; }

const CARDS: Card[] = [
  { href: '/marketplace', v: 'marketplace', icon: 'shop', t: ['السوق', 'Marketplace'], d: ['كتالوج، بطاقات منتجات، ودفع بالأمانة.', 'Catalog, product cards and escrow checkout.'], pill: ['التمييز: طين', 'Accent: clay'] },
  { href: '/mobility', v: 'mobility', icon: 'bus', t: ['مواصلاتي', 'Mwasalati'], d: ['حجز مقعد بخمس خطوات وتذكرة برمز QR.', 'Five-step seat booking and a QR ticket.'], pill: ['التمييز: أزرق', 'Accent: blue'] },
  { href: '/logistics', v: 'logistics', icon: 'truck', t: ['سودان إكسبريس', 'Sudan Express'], d: ['تسعيرة بالكيلو، دفع بالأمانة، وبوليصة.', 'Per-kilo quote, escrow payment and waybill.'], pill: ['التمييز: كحلي', 'Accent: navy'] },
  { href: '/merchant', icon: 'chart', t: ['لوحة التاجر', 'Merchant workspace'], d: ['لوحة واحدة تتلوّن بحسب القطاع.', 'One console that re-tints per vertical.'], pill: ['ترث كل شيء', 'Inherits everything'] },
];

const HERO: VerticalCopy = {
  nav: ['', ''], eyebrow: ['مجموعة الواجهة', 'UI kit'], title: ['تصميم واحد، ', 'One design DNA, '], hl: ['لكل قطاع.', 'for every vertical.'],
  lede: ['الخطوط والألوان والظلال والحركة معرَّفة مرة واحدة. كل قطاع يغيّر لون التمييز فقط، ويرث الباقي.',
    'Type, colour, depth and motion are defined once. Each vertical swaps the accent and inherits the rest.'], cta: ['', ''],
};

export function Hub() {
  const { t } = useLang();
  return (
    <>
      <Hero copy={HERO} />
      <section className="aq-sec" style={{ paddingBlockStart: 0 }}><div className="aq-wrap">
        <div className="aq-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))' }}>
          {CARDS.map((c) => (
            <Link key={c.href} href={c.href} className="aq-card" data-vertical={c.v} style={{ display: 'grid', gap: 'var(--aq-s-3)' }}>
              <span className="aq-pcard__media" style={{ aspectRatio: 'auto', padding: 'var(--aq-s-4)', borderRadius: 'var(--aq-r)' }}><Icon name={c.icon} /></span>
              <h3>{t(...c.t)}</h3>
              <p style={{ color: 'var(--aq-ink-2)' }}>{t(...c.d)}</p>
              <span className="aq-pill">{t(...c.pill)}</span>
            </Link>
          ))}
        </div>
      </div></section>
    </>
  );
}
