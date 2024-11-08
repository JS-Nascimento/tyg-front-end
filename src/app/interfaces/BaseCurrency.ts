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

export interface CurrencyCardDto {
  baseCurrency: string;
  code: string;
  name: string;
  quotation: string;
  rate: string;
  image: string;
}

export interface AvailableCurrency {
  code: string;
  description: string;
}