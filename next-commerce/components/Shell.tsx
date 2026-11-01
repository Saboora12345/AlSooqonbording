import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import type { VerticalId } from '@/lib/types';

/** One wrapper per page: sets data-vertical (the ONLY thing a vertical changes) and frames nav/main/footer. */
export function Shell({ vertical, current, children }: { vertical?: VerticalId; current: string; children: ReactNode }) {
  return (
    <div className="aq-page" data-vertical={vertical}>
      <Navbar current={current} />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
