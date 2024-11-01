'use client'
import React from 'react';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';

export interface CurrencyItemCardProps {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces?: number;
  baseCurrency?: string;
  quotationValue?: number;
  conversionRate: {
    rate: number;
    rateDate: string;
  };
  icon: string;
}

const handleQuotationValue = (value: number) => {
  if (value === 0) {
    return '0,00';
  }

  const formattedValue = 1 / value;
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(formattedValue);
}

export default function CurrencyItemCard(props: CurrencyItemCardProps) {
  const formattedDate = new Date(props.conversionRate.rateDate).toLocaleString();
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/currencies/${props.code}/history`);
  };

  return (
    <div className="bg-transparent dark:bg-transparent rounded-lg w-full h-full">
      <div className="flex gap-4">
        {/* Coluna da esquerda - Ícone */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 relative text-zinc-900 dark:text-white">
            <Image
              src={props.icon}
              alt={`${props.code} icon`}
              layout="fill"
              className="w-full h-full object-contain bg-transparent dark:bg-transparent text-zinc-900 dark:text-white"
            />
          </div>
        </div>

        {/* Coluna da direita - Informações */}
        <div className="flex-grow flex flex-col">
          <span className="text-lg font-medium">{props.symbol}</span>
          <span className="text-base text-gray-600 dark:text-gray-300">{props.name}</span>
          <span>
          <span className="text-3xl font-bold mt-1">
            {handleQuotationValue(props.conversionRate.rate)}
          </span>
          <span className="text-lg text-gray-600 dark:text-gray-300"> {props.baseCurrency} </span>
            <span className="justify-end text-sm text-amber-600 font-bold mt-0.5">  ( rate : {props.conversionRate.rate.toFixed(props.decimalPlaces || 2)} )
          </span>
          </span>
          {/* Data e hora com espaçamento */}
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Atualizado em: {formattedDate}
          </span>

          {/* Link no rodapé */}
          {/* Botão de histórico */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleNavigate}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-zinc-700 dark:text-white hover:bg-hover-light dark:hover:bg-hover-dark transition-colors"
            >
              Histórico
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}