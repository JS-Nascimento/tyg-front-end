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

export interface BaseCurrency {
  code: string;
  name: string;
  symbol: string;
  currencies: Currency[];
}

export interface CurrencyQuotationHistoryDto {
  averageRate: number;
  maxRate: number;
  minRate: number;
  dateOnly: Date;
}