export interface ConversionRate {
  rate: number;
  rateDate: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
  conversionRate: ConversionRate;
}

export default interface BaseCurrency {
  code: string;
  name: string;
  symbol: string;
  currencies: Currency[];
}