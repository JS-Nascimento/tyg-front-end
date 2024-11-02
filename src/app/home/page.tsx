// app/page.tsx
import React, { ReactNode } from 'react';
import DashboardArea from '../components/DashboardArea';
import type { Metadata } from 'next';
import CurrencyItemCard, { CurrencyItemCardProps } from '@/app/components/CurrencyItemCard';
import { getCurrencyIconPath } from '@/app/types/CurrencyIcon';
import { getCurrencyData } from '@/app/services/CurrencyService';

type CardProps = {
  order: number;
  title: string;
  content: ReactNode;
  size: { w: number; h: number };
}

export const metadata: Metadata = {
  title: 'TYG Investments',
  description: 'Track your growth investments',
};

export default async function Home() {
  // Buscar dados diretamente no servidor
  let currencyData: CardProps[] | undefined;

  try {
    const baseCurrency = await getCurrencyData();
    if (baseCurrency && baseCurrency.currencies.length > 0) {

      currencyData = baseCurrency.currencies
        .filter(currency => currency.code !== baseCurrency.code)
        .map((currency, index) => {
        const props: CurrencyItemCardProps = {
          code: currency.code,
          name: currency.name,
          symbol: currency.symbol,
          baseCurrency: baseCurrency.code,
          decimalPlaces: currency.decimalPlaces,
          conversionRate: currency.conversionRate,
          icon: getCurrencyIconPath(currency.code),
        };
        return {
          order: index + 1,
          title: currency.symbol,
          content: <CurrencyItemCard {...props} />,
          size: { w: 3, h: 2 },
        };
      });
    }
  } catch (error) {
    console.error('Failed to fetch currency data:', error);
    currencyData = undefined;
  }

  // Renderiza `DashboardArea` com os dados de moeda
  return (
    <DashboardArea title="Dashboard" cards={currencyData} />
  );
}
