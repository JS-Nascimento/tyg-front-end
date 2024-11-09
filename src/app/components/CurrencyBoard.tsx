'use client';

import { useCallback, useEffect, useState } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';
import CurrencyCard from '@/app/components/CurrencyBoardCard';
import AddCurrencyModal from '@/app/components/AddCurrencyModal';
import { AvailableCurrency, BaseCurrency } from '@/app/interfaces/BaseCurrency';
import { useLoading } from '@/app/components/LoadingSystem';
import { getErrorByCode } from '@/app/errors/ErrorMessages';
import { getCurrencyIconPath } from '@/app/types/CurrencyIcon';
import { useToast } from '@/app/services/ToastService';


interface CurrencyData {
  baseCurrency: string;
  code: string;
  name: string;
  quotation: string;
  rate: string;
  image: string;
}

interface CurrencyBoardProps {
  availableCurrencies: AvailableCurrency[];
  data: CurrencyData[];
  title: string;
}

export default function CurrencyBoard({
                                        data,
                                        title,
                                        availableCurrencies,
                                      }: CurrencyBoardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [currencyList, setCurrencyList] = useState<CurrencyData[]>(data);
  const [availableCurrencyList, setAvailableCurrencyList] = useState<AvailableCurrency[]>(availableCurrencies);
  const { showToast } = useToast();

  const mapperToCurrencyData = (data: BaseCurrency): CurrencyData[] => {
    return data.currencies
      .filter(currency => currency.code !== data.code)
      .map((currency) => {
        return {
          baseCurrency: data.code,
          code: currency.code,
          name: currency.name,
          quotation: (1 / currency.conversionRate.rate).toFixed(2),
          rate: currency.conversionRate.rate.toFixed(currency.decimalPlaces),
          image: getCurrencyIconPath(currency.code),
        };
      });
  };

  const updateAvailableCurrencies = useCallback((currentCurrencies: CurrencyData[]) => {
    const selectedCurrencyCodes = new Set(currentCurrencies.map(curr => curr.code));

    setAvailableCurrencyList(prevAvailable =>
      prevAvailable.filter(currency => !selectedCurrencyCodes.has(currency.code))
    );
  }, []);

  const fetchData = useCallback(async () => {
    startLoading();
    try {

      const response = await fetch('/api/currencies');
      if (!response.ok) throw new Error('Failed to fetch currencies' + response);
      const data = await response.json();
      const mappedData = mapperToCurrencyData(data);
      setCurrencyList(mappedData);
      updateAvailableCurrencies(mappedData);

    } catch (error) {
      showToast({
        title: 'Erro',
        content: 'Erro ao buscar dados de moedas.',
        type: 'error'
      });
      console.error('Unexpected error:', error);
    } finally {
      stopLoading();
    }
  }, [updateAvailableCurrencies, startLoading, stopLoading, showToast]);

  // Atualiza os dados ao montar o componente
  useEffect(() => {
  }, [fetchData]);

  const handleSaveCurrency = async (selectedCurrencyCode: string) => {
    if (!selectedCurrencyCode) {
      showToast({
        title: 'Atenção',
        content: 'Por favor selecione uma moeda.',
        type: 'warning'
      });
      return;
    }

    startLoading();
    try {
      const response = await fetch('/api/currencies/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: selectedCurrencyCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        const { errorCode } = result;
        const error = getErrorByCode(errorCode);
        showToast({
          title: error.errorCode.toString() || 'Erro',
          content: error.message || 'Erro ao adicionar moeda',
          type: 'error'
        });
        return;
      }

      showToast({
        title: 'Sucesso',
        content: 'Moeda adicionada com sucesso!',
        type: 'success'
      });
      await fetchData(); // Atualiza a lista após inserção bem-sucedida
    } catch (error) {
      showToast({
        title: 'Erro',
        content:'Ocorreu um erro inesperado ao adicionar a moeda.',
        type: 'error'
      });
      console.error('Unexpected error:', error);
    } finally {
      stopLoading();
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-white py-1 antialiased dark:bg-zinc-900 md:py-2 h-full rounded-lg overflow-hidden">
      <div className="mx-auto max-w-full-xl px-4 2xl:px-4 mb-4">
        <div className="mb-2 md:mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Moeda base: {title}
            </h2>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading}
              className={`text-white bg-blue-700 hover:bg-blue-700/90 focus:ring-4
                focus:ring-blue-700/50 focus:outline-none font-medium rounded-lg
                text-sm px-5 py-2.5 text-center inline-flex items-center
                dark:focus:ring-[#2557D6]/50
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <CurrencyDollarIcon className="h-6 w-6 font-black" />
              <span className="ml-1.5">
                {isLoading ? 'Processando...' : 'Incluir Moeda'}
              </span>
            </button>
          </div>
        </div>

        {currencyList.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Nenhuma moeda adicionada ainda
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currencyList.map((currency) => (
              <CurrencyCard
                key={`${currency.baseCurrency}-${currency.code}`}
                baseCurrency={currency.baseCurrency}
                code={currency.code}
                name={currency.name}
                quotation={currency.quotation}
                rate={currency.rate}
                image={currency.image}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddCurrencyModal
          availableCurrencies={availableCurrencyList}
          onSave={handleSaveCurrency}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
