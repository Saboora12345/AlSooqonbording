'use client';
import Link from 'next/link';
import { useLang } from './LangProvider';
import { Icon } from './Icon';
import { Hero } from './Hero';
import type { VerticalCopy } from '@/lib/verticals';

type T = [ar: string, en: string];
interface Door { id: string; icon: string; title: T; desc: T; action: T; href?: string; }

// Headline is the approved line from landing.html; the lede only states things the prototype actually does.
const HERO: VerticalCopy = {
  nav: ['', ''],
  eyebrow: ['منصّة واحدة · منظومة هويل', 'One platform · Hawil ecosystem'],
  title: ['السوق كامل، ', 'The whole souk, '],
  hl: ['في تطبيق واحد.', 'in one app.'],
  lede: ['تسوّق، سافر، اشحن من القاهرة، وحوّل المال من محفظة واحدة. كل دفعة تبقى محجوزة في الأمانة حتى التسليم.',
    'Shop, travel, ship from Cairo and move money from one wallet. Every payment stays held in escrow until delivery.'],
  cta: ['', ''],
};

const DOORS: Door[] = [
  { id: 'marketplace', icon: 'shop', href: '/marketplace', title: ['السوق', 'Marketplace'], desc: ['كتالوج، بطاقات منتجات، ودفع بالأمانة.', 'Catalog, product cards and escrow checkout.'], action: ['تصفّح', 'Browse'] },
  { id: 'mobility', icon: 'bus', href: '/mobility', title: ['مواصلاتي', 'Mwasalati'], desc: ['حجز مقعد بخمس خطوات وتذكرة برمز QR.', 'Five-step seat booking and a QR ticket.'], action: ['احجز مقعداً', 'Book a seat'] },
  { id: 'logistics', icon: 'truck', href: '/logistics', title: ['سودان إكسبريس', 'Sudan Express'], desc: ['تسعيرة بالكيلو، دفع بالأمانة، وبوليصة.', 'Per-kilo quote, escrow payment and a waybill.'], action: ['احسب شحنتك', 'Quote a shipment'] },
  // No finance page exists yet, so this tile is not a link and says so with a visible placeholder.
  { id: 'finance', icon: 'wallet', title: ['المال', 'Finance'], desc: ['أمانة وحوالات وتمويل داخل المحفظة.', 'Escrow, remittance and financing inside the wallet.'], action: ['', ''] },
];

export function LandingPage() {
  const { t } = useLang();
  return (
    <>
      <Hero copy={HERO} cta={{ href: '/marketplace', label: ['ابدأ التسوّق', 'Start shopping'] }} />
      <section className="aq-sec" id="verticals" aria-labelledby="verticals-h">
        <div className="aq-wrap">
          <div className="aq-sec__head">
            <div>
              <h2 id="verticals-h">{t('ابدأ من أي قطاع', 'Start from any vertical')}</h2>
              <p>{t('المحفظة نفسها والأمانة نفسها في كل قطاع.', 'The same wallet and the same escrow in every vertical.')}</p>
            </div>
          </div>
          <div className="aq-grid">
            {DOORS.map((d) => {
              const body = (
                <>
                  <span className="aq-tile__icon"><Icon name={d.icon} /></span>
                  <h3>{t(...d.title)}</h3>
                  <p>{t(...d.desc)}</p>
                  {d.href ? <span className="aq-pill">{t(...d.action)}</span> : <span className="aq-placeholder">[FINANCE PAGE]</span>}
                </>
              );
              return d.href
                ? <Link key={d.id} href={d.href} className="aq-card aq-tile">{body}</Link>
                : <div key={d.id} className="aq-card aq-tile" aria-disabled="true">{body}</div>;
            })}
          </div>
        </div>
      </section>
    </>
  );
}
