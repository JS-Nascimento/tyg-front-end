'use client';
import WorkArea from '@/app/components/WorkArea';
import SettingsForm from '@/app/components/SettingsForm';
import { Suspense, useEffect, useState } from 'react';
import { AvailableCurrency } from '@/app/interfaces/BaseCurrency';
import { useToast } from '@/app/services/ToastService';
import CurrencyBoardSkeleton from '@/app/components/CurrencyBoardSkeleton';
import SettingsFormSkeleton from '@/app/components/syncfusion/SettingsFormSkeleton';

export default function SettingsPage() {
  const [availableCurrenciesList, setAvailableCurrenciesList] = useState<AvailableCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [availableCurrenciesResponse] = await Promise.all([
        fetch('/api/currencies/availableCurrencies', { cache: 'no-store' }),
      ]);

      if (!availableCurrenciesResponse.ok) {
        throw new Error('Failed to fetch currencies data.');
      }

      const availableCurrencies: AvailableCurrency[] = await availableCurrenciesResponse.json();
      setAvailableCurrenciesList(availableCurrencies);

    } catch (error) {
      console.error('Error fetching available currencies data:', error);
      showToast({
        title: 'Erro',
        content: 'Erro ao buscar dados de moedas.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData().then(r => r);
  }, []);

  return (
    <WorkArea title={'Configurações'}>
      {loading ? (
        <SettingsFormSkeleton />
      ) : (
        <Suspense fallback={<SettingsFormSkeleton />}>
          <SettingsForm availableCurrencies={availableCurrenciesList} />
        </Suspense>
      )}
    </WorkArea>
  );
}