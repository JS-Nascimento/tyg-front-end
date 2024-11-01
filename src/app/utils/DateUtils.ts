import { format } from 'date-fns';


export function formatDateToISO(date: Date): string {
  return  format(new Date(date + 'T00:00:00'), 'dd/MM/yyyy');
}

export function formatDateToISOCustom(date: Date, formatDate: string): string {
  return  format(new Date(date + 'T00:00:00'), formatDate);
}