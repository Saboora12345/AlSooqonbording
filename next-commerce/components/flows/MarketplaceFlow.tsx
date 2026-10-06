'use client';
import { useLang } from '../LangProvider';
import { useCart } from '../Cart';
import { ProductCard } from '../ProductCard';
import { CheckoutSteps, type Step } from '../CheckoutSteps';
import { money } from '@/lib/format';
import type { Product } from '@/lib/types';

/** Catalog grid + escrow checkout. `products` is fetched on the server via lib/commerce. */
export function MarketplaceFlow({ products }: { products: Product[] }) {
  const { lang, t } = useLang();
  const cart = useCart();
  const total = money(cart.total, 'SDG', lang);

  const steps: Step[] = [
    { id: 'cart', ar: 'السلة', en: 'Cart', validate: () => (cart.count === 0 ? t('أضف عنصراً واحداً على الأقل.', 'Add at least one item.') : null),
      content: (<>
        <h3 tabIndex={-1}>{t('سلتك', 'Your cart')}</h3>
        <ul className="aq-summary">
          {cart.lines.length === 0 && <li style={{ color: 'var(--aq-ink-2)' }}>{t('السلة فارغة. أضف عناصر من الكتالوج.', 'Your cart is empty. Add items from the catalog.')}</li>}
          {cart.lines.map((l) => (
            <li key={l.product.id}>
              <span>{t(l.product.titleAr, l.product.titleEn)} × {l.qty}</span>
              <span className="aq-price">{money(l.product.price * l.qty, 'SDG', lang)}{' '}
                <button type="button" className="aq-btn aq-btn--ghost" onClick={() => cart.remove(l.product.id)}>{t('إزالة', 'Remove')}</button>
              </span>
            </li>
          ))}
        </ul>
      </>) },
    { id: 'delivery', ar: 'التوصيل', en: 'Delivery',
      content: (<>
        <h3 tabIndex={-1}>{t('بيانات التوصيل', 'Delivery details')}</h3>
        <div className="aq-form">
          <div className="aq-field"><label htmlFor="f-name">{t('الاسم', 'Name')}</label><input id="f-name" type="text" autoComplete="name" required /></div>
          <div className="aq-field"><label htmlFor="f-phone">{t('رقم الهاتف', 'Phone')}</label><input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" required /></div>
          <div className="aq-field"><label htmlFor="f-area">{t('المدينة والحي', 'City and area')}</label><input id="f-area" type="text" autoComplete="address-level2" required /></div>
        </div>
      </>) },
    { id: 'pay', ar: 'الدفع بالأمانة', en: 'Escrow payment', nextAr: 'ادفع إلى الأمانة', nextEn: 'Pay into escrow',
      content: (<>
        <h3 tabIndex={-1}>{t('الدفع إلى الأمانة', 'Pay into escrow')}</h3>
        <div className="aq-choices" role="radiogroup">
          <label className="aq-radio"><input type="radio" name="method" defaultChecked /><b>{t('محفظة حوّل', 'Hawil wallet')}</b><span>{t('خصم فوري، والمبلغ محجوز.', 'Instant debit, funds held.')}</span></label>
          <label className="aq-radio"><input type="radio" name="method" /><b>{t('تحويل بنكي', 'Bank transfer')}</b><span>{t('عبر بنك شريك.', 'Via a partner bank.')}</span></label>
        </div>
        <div className="aq-summary" style={{ marginBlockStart: 'var(--aq-s-5)' }}><div className="aq-total"><span>{t('الإجمالي', 'Total')}</span><span className="aq-price">{total}</span></div></div>
      </>) },
    { id: 'done', ar: 'التأكيد', en: 'Confirmed',
      content: (<>
        <h3 tabIndex={-1}>{t('تم حجز المبلغ في الأمانة', 'Funds are held in escrow')}</h3>
        <p>{t('يُفرج عنه للبائع عند تأكيد الاستلام بالمسح.', 'It is released to the seller when you confirm receipt by scan.')}</p>
        <p style={{ marginBlockStart: 'var(--aq-s-3)' }}>{t('رقم الطلب: ', 'Order ref: ')}<span className="aq-placeholder">[ORDER REF]</span></p>
      </>) },
  ];

  return (
    <>
      <section className="aq-sec" id="catalog"><div className="aq-wrap">
        <div className="aq-sec__head">
          <div><h2>{t('الكتالوج', 'Catalog')}</h2><p>{t('تجّار موثّقون، وأسعار بالجنيه السوداني.', 'Verified merchants, prices in Sudanese pounds.')}</p></div>
          <span className="aq-illustrative">{t('كتالوج توضيحي — ليس عروضاً حقيقية', 'Illustrative catalog — not real listings')}</span>
        </div>
        <div className="aq-grid">{products.map((p) => <ProductCard key={p.id} product={p} onAdd={cart.add} />)}</div>
        {cart.count > 0 && (
          <div className="aq-cartbar">
            <div aria-live="polite"><b>{cart.count} {t('عنصر', 'items')}</b> · <span className="aq-price">{total}</span></div>
            <a className="aq-btn aq-btn--primary" href="#checkout">{t('إتمام الطلب', 'Checkout')}</a>
          </div>
        )}
      </div></section>
      <section className="aq-sec" id="checkout"><div className="aq-wrap">
        <div className="aq-sec__head"><div><h2>{t('مسار الدفع', 'Checkout')}</h2><p>{t('أربع خطوات. المبلغ يبقى محجوزاً حتى التسليم.', 'Four steps. Funds stay held until delivery.')}</p></div></div>
        <CheckoutSteps steps={steps} />
      </div></section>
    </>
  );
}
