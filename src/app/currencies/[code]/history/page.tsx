
import React from 'react';
import WorkArea from '@/app/components/WorkArea';
import CurrencyRateChart from '@/app/components/CurrencyRateChart';
import { getCurrencyHistory } from '@/app/services/CurrencyService';
import { CurrencyQuotationHistoryDto } from '@/app/types/BaseCurrency';


interface PageProps {
  params: {
    code: string;
  };
}

export default async function Home({ params }: PageProps) {
  const code = params.code;
  const baseCurrency = 'BRL';

  let currencyData: CurrencyQuotationHistoryDto[] = [];

  if (code) {
    try {
      currencyData = await getCurrencyHistory(code);
    } catch (error) {
      console.error('Erro ao buscar histórico de moeda:', error);
    }
  }

  return (
    <WorkArea title="Histórico de Moedas">
      <CurrencyRateChart baseCurrency={baseCurrency} code={code} data={currencyData} />
    </WorkArea>
  );
}