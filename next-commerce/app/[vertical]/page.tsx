import { notFound } from 'next/navigation';
import { Shell } from '@/components/Shell';
import { Hero, type HeroCta } from '@/components/Hero';
import { MarketplaceFlow } from '@/components/flows/MarketplaceFlow';
import { MobilityFlow } from '@/components/flows/MobilityFlow';
import { LogisticsFlow } from '@/components/flows/LogisticsFlow';
import { commerce } from '@/lib/commerce';
import { money } from '@/lib/format';
import { sample } from '@/lib/sample';
import { VERTICALS, isVertical } from '@/lib/verticals';

export function generateStaticParams() {
  return Object.keys(VERTICALS).map((vertical) => ({ vertical }));
}

const CTA: Record<string, HeroCta> = {
  marketplace: { href: '#catalog', label: VERTICALS.marketplace.cta },
  mobility: { href: '#book', label: VERTICALS.mobility.cta },
  logistics: { href: '#ship', label: VERTICALS.logistics.cta },
};

export default async function VerticalPage({ params }: { params: Promise<{ vertical: string }> }) {
  const { vertical } = await params;
  if (!isVertical(vertical)) notFound();

  // logistics headline shows the one owner-confirmed number, straight from the shared sample data
  const L = sample.logistics;
  const copy = vertical === 'logistics'
    ? { ...VERTICALS.logistics, hl: [`${money(L.ratePerKg, L.currency, 'ar')} / كجم.`, `${money(L.ratePerKg, L.currency, 'en')} / kg.`] as [string, string] }
    : VERTICALS[vertical];
  const products = vertical === 'marketplace' ? await commerce.getProducts() : [];

  return (
    <Shell vertical={vertical} current={vertical}>
      <Hero copy={copy} cta={CTA[vertical]} />
      {vertical === 'marketplace' && <MarketplaceFlow products={products} />}
      {vertical === 'mobility' && <MobilityFlow />}
      {vertical === 'logistics' && <LogisticsFlow />}
    </Shell>
  );
}
