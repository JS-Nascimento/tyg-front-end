import { UserDataSettings } from '@/app/types/User';
import { getError } from '@/app/errors/ErrorMessages';

export function createUserSettingsPayload(data: UserDataSettings) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data object');
  }

  const {
    baseCurrency,
    zoneTime,
    locale,
    decimalPlaces,
    currencyDecimalPlaces,
    darkMode,
  } = data;

  if (!baseCurrency) {
    return { error: getError('InvalidBaseCurrency') };
  }

  if (!zoneTime) {
    return { error: getError('InvalidZoneTime') };
  }

  if (!locale) {
    return { error: getError('InvalidLocale') };
  }

  if (decimalPlaces === undefined || decimalPlaces === null) {
    return { error: getError('InvalidDecimalPlaces') };
  }

  if (currencyDecimalPlaces === undefined || currencyDecimalPlaces === null) {
    return { error: getError('InvalidCurrencyDecimalPlaces') };
  }

  if (darkMode === undefined || darkMode === null) {
    return { error: getError('InvalidDarkMode') };
  }

  return {
    baseCurrency,
    zoneTime,
    locale,
    decimalPlaces,
    currencyDecimalPlaces,
    darkMode,
  };
}