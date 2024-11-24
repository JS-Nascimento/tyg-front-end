
export type User = {
  tenantId: string;
  email: string;
  name: string;
  image?: string;
  roles?: string[];
  notifications?: Notification[];
  settings: UserDataSettings;
};


export interface UserDataSettings {
  baseCurrency: string;
  zoneTime: string;
  locale: string;
  decimalPlaces: number;
  currencyDecimalPlaces: number;
  darkMode: boolean;
}
