import React from 'react';
import WorkArea from '@/app/components/WorkArea';
import CurrencyRateChart from '@/app/components/CurrencyRateChart';
import { getCurrencyHistory } from '@/app/services/CurrencyService';
import { CurrencyQuotationHistoryDto } from '@/app/interfaces/BaseCurrency';
import { fetchCurrencyHistory } from '@/app/actions/currencyActions';

interface PageProps {
  params: {
    code: string;
  };
}

export default async function Home({ params }: PageProps) {

  const code = params.code;
  const baseCurrency = 'BRL';
  const initialDays = 30;

  let initialData: CurrencyQuotationHistoryDto[] = [];

  if (code) {
    try {
      initialData = await  getCurrencyHistory(code, initialDays);
    } catch (error) {
      console.error('Erro ao buscar histórico de moeda:', error);
    }
  }

  return (
    <WorkArea title="Histórico de Moedas">
      <CurrencyRateChart
        baseCurrency={baseCurrency}
        code={code}
        data={initialData}
        onPeriodChange={fetchCurrencyHistory.bind(null, code)}
      />
    </WorkArea>
  );
}