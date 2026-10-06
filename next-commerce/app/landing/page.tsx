import type { Metadata } from 'next';
import { Shell } from '@/components/Shell';
import { LandingPage } from '@/components/LandingPage';

export const metadata: Metadata = {
  title: 'السوق · alSooq — the whole souk, in one app',
  description: 'Shop, travel, ship and move money from one wallet. Every payment stays held in escrow until delivery.',
};

export default function Page() {
  return <Shell current=""><LandingPage /></Shell>;
}
