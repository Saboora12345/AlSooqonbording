'use client';
import Link from 'next/link';
import { useLang } from './LangProvider';
import { VERTICALS } from '@/lib/verticals';

const LINKS = [
  { id: 'marketplace', href: '/marketplace' }, { id: 'mobility', href: '/mobility' }, { id: 'logistics', href: '/logistics' },
  { id: 'merchant', href: '/merchant', label: ['التاجر', 'Merchant'] as [string, string] },
] as const;

/** Logo at inline-start (right in RTL), vertical switcher, language toggle, CTA at inline-end. */
export function Navbar({ current }: { current: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <div className="aq-nav">
      <a className="aq-skip" href="#main">{t('تخطَّ إلى المحتوى', 'Skip to content')}</a>
      <div className="aq-wrap aq-nav__row">
        <Link className="aq-brand" href="/" aria-label={t('السوق — الرئيسية', 'alSooq — home')}>
          <span className="aq-brand__mark" aria-hidden="true">س</span>
          <span><b>{t('السوق', 'alSooq')}</b><small>Hawil ecosystem</small></span>
        </Link>
        <nav className="aq-nav__links" aria-label={t('أقسام المنظومة', 'Ecosystem')}>
          {LINKS.map((l) => {
            const label = 'label' in l ? l.label : VERTICALS[l.id].nav;
            return <Link key={l.id} href={l.href} aria-current={current === l.id ? 'page' : undefined}>{t(label[0], label[1])}</Link>;
          })}
        </nav>
        <div className="aq-nav__end">
          <div className="aq-lang" role="group" aria-label="Language">
            <button type="button" aria-pressed={lang === 'ar'} onClick={() => setLang('ar')}>ع</button>
            <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>
      </div>
    </div>
  );
}
