'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';
import {
  ColumnDirective,
  ColumnsDirective,
  Filter,
  GridComponent,
  Inject,
  Page,
  Resize,
  Sort,
  Toolbar,
} from '@syncfusion/ej2-react-grids';
import AddCurrencyModal from '@/app/components/AddCurrencyModal';
import { AvailableCurrency, BaseCurrency } from '@/app/interfaces/BaseCurrency';
import { useLoading } from '@/app/components/LoadingSystem';
import { getErrorByCode } from '@/app/errors/ErrorMessages';
import { useToast } from '@/app/services/ToastService';
import { getCurrencyIconPath } from '@/app/types/CurrencyIcon';
import { useUserStore } from '@/app/store/userStore';
import { useTheme } from '@/app/themes/ThemeContext';
import Image from 'next/image';


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

export default function CurrencyDataGrid({
                                           data,
                                           title,
                                           availableCurrencies,
                                         }: CurrencyBoardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [currencyList, setCurrencyList] = useState<CurrencyData[]>(data);
  const [availableCurrencyList, setAvailableCurrencyList] = useState<AvailableCurrency[]>(availableCurrencies);
  const { showToast } = useToast();
  const { getSettings } = useUserStore();
  const { isDarkMode } = useTheme();
  const gridRef = useRef<GridComponent | null>(null);

  const imageTemplate = (props: CurrencyData) => {
    return (
      <div className="flex items-center gap-3">
        <Image
          src={props.image}
          alt={props.code}
          width={24}
          height={24}
          className="rounded-full object-cover"
        />
        <span className="font-medium ">{props.code}</span>
      </div>
    );
  };

  const rateTemplate = (props: CurrencyData) => {
    return <div className="text-right ">{props.rate}</div>;
  };

  const quotationTemplate = (props: CurrencyData) => {
    return <div className="text-right ">{props.quotation}</div>;
  };

  const nameTemplate = (props: CurrencyData) => {
    return <div>{props.name}</div>;
  };

  const gridSettings = ({
    allowFiltering: true,
    allowSorting: true,
    filterSettings: { type: 'Excel' },
    toolbar: ['Search'],
    pageSettings: { pageSize: 8 },
    rowHeight: 50,
    enableHover: true,
    allowTextWrap: true,
    enableHeaderFocus: true,
    cssClass: isDarkMode ? 'dark' : '',
  });


  const mapperToCurrencyData = useCallback((data: BaseCurrency): CurrencyData[] => {
    const userSettings = getSettings();
    return data.currencies
      .filter(currency => currency.code !== data.code)
      .map((currency) => ({
        baseCurrency: data.code,
        code: currency.code,
        name: currency.name,
        quotation: (1 / currency.conversionRate.rate).toFixed(userSettings?.currencyDecimalPlaces || 2),
        rate: currency.conversionRate.rate.toFixed(userSettings?.decimalPlaces),
        image: getCurrencyIconPath(currency.code),
      }));
  }, [getSettings]);

  const updateAvailableCurrencies = useCallback((currentCurrencies: CurrencyData[]) => {
    const selectedCurrencyCodes = new Set(currentCurrencies.map(curr => curr.code));
    setAvailableCurrencyList(prevAvailable =>
      prevAvailable.filter(currency => !selectedCurrencyCodes.has(currency.code)),
    );
  }, []);

  const fetchData = useCallback(async () => {
    startLoading();
    try {
      const response = await fetch('/api/currencies');
      if (!response.ok) throw new Error('Failed to fetch currencies');
      const data = await response.json();
      const mappedData = mapperToCurrencyData(data);
      setCurrencyList(mappedData);
      updateAvailableCurrencies(mappedData);
    } catch (error) {
      showToast({
        title: 'Erro',
        content: 'Erro ao buscar dados de moedas.',
        type: 'error',
      });
      console.error('Unexpected error:', error);
    } finally {
      stopLoading();
    }
  }, [updateAvailableCurrencies, startLoading, stopLoading, showToast, mapperToCurrencyData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.cssClass = isDarkMode ? 'dark' : '';
      gridRef.current.refresh();
    }
  }, [isDarkMode]);

  const handleSaveCurrency = async (selectedCurrencyCode: string) => {
    if (!selectedCurrencyCode) {
      showToast({
        title: 'Atenção',
        content: 'Por favor selecione uma moeda.',
        type: 'warning',
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
          type: 'error',
        });
        return;
      }

      showToast({
        title: 'Sucesso',
        content: 'Moeda adicionada com sucesso!',
        type: 'success',
      });
      await fetchData();
    } catch (error) {
      showToast({
        title: 'Erro',
        content: 'Ocorreu um erro inesperado ao adicionar a moeda.',
        type: 'error',
      });
      console.error('Unexpected error:', error);
    } finally {
      stopLoading();
      setIsModalOpen(false);
    }
  };

  return (

    <div className="rounded-lg overflow-hidden shadow-sm">
      <div className="px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold sm:text-2xl">
            Moeda base: {title}
          </h2>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium
              text-white bg-blue-600 rounded-lg hover:bg-blue-700
              focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <CurrencyDollarIcon className="w-5 h-5 mr-2" />
            {isLoading ? 'Processando...' : 'Incluir Moeda'}
          </button>
        </div>

        {currencyList.length === 0 ? (
          <div className="text-center py-8 ">
            Nenhuma moeda adicionada ainda
          </div>
        ) : (
          <div className="min-h-[500px]">
            <GridComponent
              ref={gridRef}
              dataSource={currencyList}
              allowPaging={true}
              {...gridSettings}
              height="100%"
              width="100%"
              locale={getSettings()?.locale}
              cssClass={isDarkMode ? 'tailwind-dark' : 'tailwind'}
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="code"
                  headerText="Moeda"
                  width="180"
                  template={imageTemplate}
                />
                <ColumnDirective
                  field="name"
                  headerText="Nome"
                  width="250"
                  template={nameTemplate}
                />
                <ColumnDirective
                  field="quotation"
                  headerText="Cotação"
                  width="150"
                  template={quotationTemplate}
                />
                <ColumnDirective
                  field="rate"
                  headerText="Taxa"
                  width="150"
                  template={rateTemplate}
                />
              </ColumnsDirective>
              <Inject services={[Filter, Sort, Resize, Page, Toolbar]} />
            </GridComponent>
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