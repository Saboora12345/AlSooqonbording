'use client';
import { useLang } from './LangProvider';
import { Icon } from './Icon';
import { money } from '@/lib/format';
import type { Product } from '@/lib/types';

export function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const { lang, t } = useLang();
  const name = t(product.titleAr, product.titleEn);
  return (
    <article className="aq-card aq-pcard">
      <div className="aq-pcard__media">
        {product.tag && <span className="aq-pill aq-pcard__tag">{t(...product.tag)}</span>}
        <Icon name={product.icon} />
      </div>
      <div className="aq-pcard__body">
        <h3>{name}</h3>
        <div className="aq-pcard__merchant">
          {product.verified && <><Icon name="shield" /><span className="aq-sr">{t('تاجر موثّق', 'Verified merchant')}</span></>}
          {product.merchant}
        </div>
        <div className="aq-pcard__foot">
          <span className="aq-price">{money(product.price, product.currency, lang)}</span>
          <button type="button" className="aq-btn aq-btn--primary" onClick={() => onAdd(product)} aria-label={t('أضف إلى السلة: ', 'Add to cart: ') + name}>
            {t('أضف', 'Add')}
          </button>
        </div>
      </div>
    </article>
  );
}
