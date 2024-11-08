'use client';

import React, { Suspense, useEffect, useState } from 'react';
import DashboardArea from '../components/DashboardArea';
import CurrencyItemCard, { CurrencyItemCardProps } from '@/app/components/CurrencyItemCard';
import { getCurrencyIconPath } from '@/app/types/CurrencyIcon';
import { toast } from 'react-toastify';
import { BaseCurrency, Currency } from '@/app/interfaces/BaseCurrency';
import CurrencyItemCardSkeleton from '@/app/components/syncfusion/CurrencyItemCardSkeleton';

type CardProps = {
  order: number;
  title: string;
  content: React.ReactNode;
  size: { w: number; h: number };
};

export default function Home() {
  const [currencyData, setCurrencyData] = useState<CardProps[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrencyData = async () => {
     setLoading(true);
      try {
        const response = await fetch('/api/currencies');
        if (!response.ok) throw new Error('Failed to fetch currency data');

        const baseCurrency = await response.json();
        if (baseCurrency && baseCurrency.currencies.length > 0) {
          const data = baseCurrency.currencies
            .filter((currency: BaseCurrency) => currency.code !== baseCurrency.code)
            .map((currency: Currency, index: number) => {
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
          setCurrencyData(data);
        }
      } catch (error) {
        console.error('Error fetching currency data:', error);
        toast.error('Failed to load currency data');
      } finally {
       setLoading(false);
      }
    };

    fetchCurrencyData().then(r => r);
  }, []);
  return (
    <>
      {loading ? (

        <DashboardArea
          title="Dashboard"
          cards={Array(4).fill({ content: <CurrencyItemCardSkeleton />, size: { w: 3, h: 2 } })}
        />
      ) : (
        <DashboardArea title="Dashboard" cards={currencyData || []} />
      )}
    </>
  );
}