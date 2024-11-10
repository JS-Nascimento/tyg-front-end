'use client';
import WorkArea from '@/app/components/WorkArea';
import SettingsForm from '@/app/components/SettingsForm';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { AvailableCurrency } from '@/app/interfaces/BaseCurrency';
import { useToast } from '@/app/services/ToastService';
import SettingsFormSkeleton from '@/app/components/syncfusion/SettingsFormSkeleton';
import { Locale, Timezone } from '@/app/interfaces/SettingsOptions';
import { useSession } from 'next-auth/react';
import { UserDataSettings } from '@/app/types/User';


export default function SettingsPage() {
  const { data: session } = useSession();
  const [availableCurrenciesList, setAvailableCurrenciesList] = useState<AvailableCurrency[]>([]);
  const [availableTimeZoneList, setAvailableTimeZoneList] = useState<Timezone[]>([]);
  const [availableLocalesList, setAvailableLocalesList] = useState<Locale[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Log para debug
  useEffect(() => {
    console.log('Session:', session);
    console.log('User settings:', session?.user?.settings);
  }, [session]);

  const getUserSettings = (): UserDataSettings => {
    if (!session?.user?.settings) {
      return {
        baseCurrency: 'USD',
        zoneTime: 'America/Sao_Paulo',
        locale: 'pt-BR',
        decimalPlaces: 2,
        currencyDecimalPlaces: 2,
        darkMode: false,
      };
    }

    return {
      baseCurrency: session.user.settings.baseCurrency,
      zoneTime: session.user.settings.zoneTime,
      locale: session.user.settings.locale,
      decimalPlaces: session.user.settings.decimalPlaces,
      currencyDecimalPlaces: session.user.settings.currencyDecimalPlaces,
      darkMode: session.user.settings.darkMode,
    };
  };

  const fetchAvailableCurrencies = useCallback(async () => {
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
  }, [showToast]);
  const fetchAvailableTimezones = useCallback(async () => {
    try {
      const [availableTimezonesResponse] = await Promise.all([
        fetch('/api/settings/options/timezone', {
          next: { revalidate: 84800 },
        }),
      ]);

      if (!availableTimezonesResponse.ok) {
        throw new Error('Failed to fetch timezones data.');
      }

      const availableTimezones: Timezone[] = await availableTimezonesResponse.json();
      setAvailableTimeZoneList(availableTimezones);

    } catch (error) {
      console.error('Error fetching available timezones data:', error);
      showToast({
        title: 'Erro',
        content: 'Erro ao buscar dados de fuso horário.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);
  const fetchAvailableLocales = useCallback(async () => {
    try {
      const [availableLocalesResponse] = await Promise.all([
        fetch('/api/settings/options/locale', {
          next: { revalidate: 84800 },
        }),
      ]);

      if (!availableLocalesResponse.ok) {
        throw new Error('Failed to fetch locales data.');
      }

      const availableLocales: Locale[] = await availableLocalesResponse.json();
      setAvailableLocalesList(availableLocales);

    } catch (error) {
      console.error('Error fetching available locales data:', error);
      showToast({
        title: 'Erro',
        content: 'Erro ao buscar dados de linguagem.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAvailableCurrencies().then(r => r);
    fetchAvailableTimezones().then(r => r);
    fetchAvailableLocales().then(r => r);
  }, [fetchAvailableCurrencies, fetchAvailableTimezones, fetchAvailableLocales]);

  return (
    <WorkArea title={'Configurações'}>
      {loading ? (
        <SettingsFormSkeleton />
      ) : (
        <Suspense fallback={<SettingsFormSkeleton />}>
          <SettingsForm
            availableCurrencies={availableCurrenciesList}
            availableTimezones={availableTimeZoneList}
            availableLocales={availableLocalesList}
            actualSettings={getUserSettings()}
          />
        </Suspense>
      )}
    </WorkArea>
  );
}