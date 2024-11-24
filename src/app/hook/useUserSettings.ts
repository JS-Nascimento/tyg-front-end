// hooks/useUserSettings.ts
import { useUserStore } from '@/app/store/userStore';
import { UserDataSettings } from '@/app/types/User';

const DEFAULT_SETTINGS: UserDataSettings = {
  baseCurrency: 'USD',
  zoneTime: 'America/Sao_Paulo',
  locale: 'pt-BR',
  decimalPlaces: 2,
  currencyDecimalPlaces: 2,
  darkMode: false,
};

export function useUserSettings() {
  const { settings } = useUserStore();

  const getCurrentSettings = (): UserDataSettings => {
    if (!settings) {
      return DEFAULT_SETTINGS;
    }

    return {
      baseCurrency: settings.baseCurrency,
      zoneTime: settings.zoneTime,
      locale: settings.locale,
      decimalPlaces: settings.decimalPlaces,
      currencyDecimalPlaces: settings.currencyDecimalPlaces,
      darkMode: settings.darkMode,
    };
  };

  return {
    settings: getCurrentSettings(),
    defaultSettings: DEFAULT_SETTINGS
  };
}