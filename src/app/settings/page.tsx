'use client';
import WorkArea from '@/app/components/WorkArea';
import SettingsForm from '@/app/components/SettingsForm';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { AvailableCurrency } from '@/app/interfaces/BaseCurrency';
import { useToast } from '@/app/services/ToastService';
import SettingsFormSkeleton from '@/app/components/syncfusion/SettingsFormSkeleton';
import { Locale, Timezone } from '@/app/interfaces/SettingsOptions';
import { useUserSettings } from '@/app/hook/useUserSettings';
import { useLoading } from '@/app/components/LoadingSystem';

export default function SettingsPage() {
  const { settings } = useUserSettings();
  // const { settings: storeSettings } = useUserStore();
  const [availableCurrenciesList, setAvailableCurrenciesList] = useState<AvailableCurrency[]>([]);
  const [availableTimeZoneList, setAvailableTimeZoneList] = useState<Timezone[]>([]);
  const [availableLocalesList, setAvailableLocalesList] = useState<Locale[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const { showToast } = useToast();
  const { stopLoading }= useLoading();

  const fetchAvailableCurrencies = useCallback(async () => {
    try {
      const response = await fetch('/api/currencies/availableCurrencies', {
        cache: 'no-store',
      });

      if (!response.ok) throw new Error('Failed to fetch currencies data.');

      const availableCurrencies: AvailableCurrency[] = await response.json();
      setAvailableCurrenciesList(availableCurrencies);
    } catch (error) {
      console.error('Error fetching available currencies data:', error);
      showToast({
        title: 'Erro',
        content: 'Erro ao buscar dados de moedas.',
        type: 'error',
      });
    }
  }, [showToast]);

  const fetchAvailableTimezones = useCallback(async () => {
    try {

      const response = await fetch('/api/settings/options/timezone');

      if (!response.ok) throw new Error('Failed to fetch timezones data.');

      const availableTimezones: Timezone[] = await response.json();
      setAvailableTimeZoneList(availableTimezones);

    } catch (error) {
      console.error('Error fetching available timezones data:', error);
      showToast({
        title: 'Erro',
        content: 'Erro ao buscar dados de fuso horário.',
        type: 'error',
      });
    }
  }, [showToast]);

  const fetchAvailableLocales = useCallback(async () => {
    try {
      const response = await fetch('/api/settings/options/locale');
      if (!response.ok) throw new Error('Failed to fetch locales data.');
      const availableLocales: Locale[] = await response.json();
      setAvailableLocalesList(availableLocales);
    } catch (error) {
      console.error('Error fetching available locales data:', error);
      showToast({
        title: 'Erro',
        content: 'Erro ao buscar dados de linguagem.',
        type: 'error',
      });
    }
  }, [showToast]);

  useEffect(() => {
    if (!dataFetched) {
      const loadData = async () => {
        try {

          stopLoading();

          await Promise.all([
            fetchAvailableCurrencies(),
            fetchAvailableTimezones(),
            fetchAvailableLocales()
          ]);
          setDataFetched(true);
        } finally {
          setLoading(false);
        }
      };

      loadData().then(r => r);
    }
  }, [dataFetched, fetchAvailableCurrencies, fetchAvailableTimezones, fetchAvailableLocales]);

  const isLoading = loading || !settings;

  return (
    <WorkArea title={'Configurações'}>
      {isLoading ? (
        <SettingsFormSkeleton />
      ) : (
        <Suspense fallback={<SettingsFormSkeleton />}>
          <SettingsForm
            availableCurrencies={availableCurrenciesList}
            availableTimezones={availableTimeZoneList}
            availableLocales={availableLocalesList}
            actualSettings={settings}
          />
        </Suspense>
      )}
    </WorkArea>
  );
}