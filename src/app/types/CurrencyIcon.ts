// Currencies

const base = '/currencies';
export const CURRENCY_ICONS = {
  USD: base + '/usd.png',
  EUR: base + '/eur.png',
  GBP: base + '/gbp.png',
  JPY: base + '/jpy.png',
  BRL: base + '/brl.png',
  GENERIC: base + '/exchange.png',
} as const;
// Tipo para ajudar no autocomplete
export type CurrencyIconCode = keyof typeof CURRENCY_ICONS;

export const getCurrencyIconPath = (code: string): string => {
  const upperCode = code.toUpperCase();
  return CURRENCY_ICONS[upperCode as CurrencyIconCode] || CURRENCY_ICONS.GENERIC;
};