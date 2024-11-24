// app/currency/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import WorkArea from '@/app/components/WorkArea';
import CurrencyBoardSkeleton from '@/app/components/CurrencyBoardSkeleton';
import { AvailableCurrency, BaseCurrency, Currency, CurrencyCardDto } from '@/app/interfaces/BaseCurrency';
import { getCurrencyIconPath } from '@/app/types/CurrencyIcon';
import { useToast } from '@/app/services/ToastService';
import CurrencyDataGrid from '@/app/components/syncfusion/CurrencyDataGrid/CurrencyDataGrid';


export default function CurrencyPage() {
  const [baseCurrencyData, setBaseCurrencyData] = useState<string>('');
  const [currenciesData, setCurrenciesData] = useState<CurrencyCardDto[]>([]);
  const [availableCurrenciesList, setAvailableCurrenciesList] = useState<AvailableCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [currenciesResponse, availableCurrenciesResponse] = await Promise.all([
        fetch('/api/currencies', { cache: 'no-store' }),
        fetch('/api/currencies/availableCurrencies', { cache: 'no-store' })
      ]);

      if (!currenciesResponse.ok || !availableCurrenciesResponse.ok) {
        throw new Error('Failed to fetch currencies data.');
      }

      const baseCurrency: BaseCurrency = await currenciesResponse.json();
      const availableCurrencies: AvailableCurrency[] = await availableCurrenciesResponse.json();

      // Processa os dados da moeda base e as currencies disponíveis
      if (baseCurrency && baseCurrency.currencies.length > 0) {
        setBaseCurrencyData(`${baseCurrency.code} - ${baseCurrency.name}`);

        const processedCurrencies = baseCurrency.currencies.map((currency: Currency) => ({
          baseCurrency: baseCurrency.code,
          code: currency.code,
          name: currency.name,
          quotation: (1 / currency.conversionRate.rate).toFixed(2),
          rate: currency.conversionRate.rate.toFixed(currency.decimalPlaces),
          image: getCurrencyIconPath(currency.code),
        }));

        setCurrenciesData(processedCurrencies);

        // Filtra `availableCurrencies` removendo aquelas que já estão em `processedCurrencies`
        const processedCurrencyCodes = new Set(processedCurrencies.map((currency) => currency.code));
        setAvailableCurrenciesList(
          availableCurrencies.filter((currency) => !processedCurrencyCodes.has(currency.code))
        );


      }
    } catch (error) {
      console.error('Error fetching currency data:', error);
      showToast({
        title: 'Erro',
        content: 'Erro ao buscar dados de moedas.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData().then(r => r);
  }, []);

  return (
    <WorkArea title="Moedas">
      {loading ? (
        <CurrencyBoardSkeleton />
      ) : (
        <Suspense fallback={<CurrencyBoardSkeleton />}>
          <CurrencyDataGrid
            title={baseCurrencyData ?? ''}
            data={currenciesData ?? []}
            availableCurrencies={availableCurrenciesList ?? []}
          />
        </Suspense>
      )}
    </WorkArea>
  );
}
