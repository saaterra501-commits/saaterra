'use client';

import NachoNachoCard from './NachoNachoCard';

export default function AppSumoDealCard({ deal, onBuyClick }) {
  return <NachoNachoCard deal={deal} onBuyClick={onBuyClick} />;
}
