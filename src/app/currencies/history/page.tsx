// app/page.tsx

import React from 'react';
import WorkArea from '@/app/components/WorkArea';
import CurrencyRateChart from '@/app/components/CurrencyRateChart';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TYG Investments',
  description: 'Track your growth investments',
};

interface RateData {
  averageRate: number;
  maxRate: number;
  minRate: number;
  dateOnly: string;
}
export default function Home() {
  const baseCurrency = 'BRL';
  const mockRateData: RateData[] = [
    {
      "averageRate": 6.157,
      "maxRate": 6.157,
      "minRate": 6.157,
      "dateOnly": "2024-10-28"
    },
    {
      "averageRate": 6.150,
      "maxRate": 6.150,
      "minRate": 6.150,
      "dateOnly": "2024-10-27"
    },
    {
      "averageRate": 6.161,
      "maxRate": 6.161,
      "minRate": 6.161,
      "dateOnly": "2024-10-26"
    },
    {
      "averageRate": 6.184,
      "maxRate": 6.184,
      "minRate": 6.184,
      "dateOnly": "2024-10-25"
    },
    {
      "averageRate": 6.138,
      "maxRate": 6.138,
      "minRate": 6.138,
      "dateOnly": "2024-10-24"
    },
    {
      "averageRate": 6.150,
      "maxRate": 6.150,
      "minRate": 6.150,
      "dateOnly": "2024-10-23"
    },
    {
      "averageRate": 6.153,
      "maxRate": 6.153,
      "minRate": 6.153,
      "dateOnly": "2024-10-22"
    },
    {
      "averageRate": 6.116,
      "maxRate": 6.116,
      "minRate": 6.116,
      "dateOnly": "2024-10-21"
    },
    {
      "averageRate": 6.112,
      "maxRate": 6.112,
      "minRate": 6.112,
      "dateOnly": "2024-10-20"
    },
    {
      "averageRate": 6.035,
      "maxRate": 6.038,
      "minRate": 6.031,
      "dateOnly": "2024-10-19"
    },
    {
      "averageRate": 6.024,
      "maxRate": 6.038,
      "minRate": 6.002,
      "dateOnly": "2024-10-18"
    },
    {
      "averageRate": 6.002,
      "maxRate": 6.002,
      "minRate": 6.002,
      "dateOnly": "2024-10-17"
    },
    {
      "averageRate": 6.067,
      "maxRate": 6.067,
      "minRate": 6.067,
      "dateOnly": "2024-10-16"
    },
    {
      "averageRate": 6.071,
      "maxRate": 6.071,
      "minRate": 6.071,
      "dateOnly": "2024-10-15"
    }
  ];
  return (
    <WorkArea title="Histórico de Moedas" >
      <CurrencyRateChart baseCurrency={baseCurrency} code={'USD'} data={mockRateData} />
    </WorkArea>
  );
}