import { sample } from './sample';
import type { Product } from './types';

/**
 * The commerce seam. Pages only ever call `commerce.*`, never a vendor SDK.
 *
 * To plug in Vercel's Next.js Commerce (Shopify Storefront API):
 *   1. copy `lib/shopify` from github.com/vercel/commerce into this folder,
 *   2. write `fromShopify(p): Product` mapping its product shape to ours,
 *   3. implement CommerceProvider below with those calls and export it as `commerce`
 *      (env: SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN).
 * Nothing in app/ or components/ changes. Not implemented here on purpose: it can't be verified without a store.
 */
export interface CommerceProvider {
  getProducts(opts?: { limit?: number }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
}

const products: Product[] = sample.products.map((p) => ({
  id: p.sku, titleAr: p.ar, titleEn: p.en, price: p.price, currency: 'SDG', merchant: p.merchant, verified: p.verified, icon: p.icon, tag: p.tag,
}));

const mock: CommerceProvider = {
  async getProducts(opts) { return products.slice(0, opts?.limit ?? products.length); },
  async getProduct(id) { return products.find((p) => p.id === id); },
};

export const commerce: CommerceProvider = mock;
