'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { CurrencyQuotationHistoryDto } from '@/app/interfaces/BaseCurrency';
import { paginate, SortOrder } from '@/app/utils/PaginatedResult';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/16/solid';
import { formatDateToISO, formatDateToISOCustom } from '@/app/utils/DateUtils';
import { useCurrencyStore } from '@/app/store/currencyStore';
import { useLoading } from '@/app/components/LoadingSystem';

interface RateChartProps {
  baseCurrency: string;
  code: string;
  data: CurrencyQuotationHistoryDto[];
  onPeriodChange: (days: number) => Promise<CurrencyQuotationHistoryDto[]>;
}

const RateChart: React.FC<RateChartProps> = ({
                                               baseCurrency,
                                               code,
                                               data: initialData,
                                               onPeriodChange,
                                             }) => {
  const { startLoading, stopLoading } = useLoading();
  const { currencyData, setData } = useCurrencyStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const options = [
    { label: '7 dias', value: 7 },
    { label: '30 dias', value: 30 },
    { label: '60 dias', value: 60 },
    { label: '90 dias', value: 90 },
    { label: '120 dias', value: 120 },
    { label: '180 dias', value: 180 },
    { label: '360 dias', value: 360 },
    { label: '5 anos', value: 1825 },
  ];

// Inicializa o store com os dados iniciais
  useEffect(() => {
    setData(initialData);
  }, [initialData, setData]);

  const sortedData = useMemo(() => {
    return [...currencyData].sort((a, b) =>
      new Date(a.dateOnly + 'T00:00:00').getTime() - new Date(b.dateOnly + 'T00:00:00').getTime(),
    );
  }, [currencyData]);

  const chartData = useMemo(() => {
    return sortedData.map(item => Number(item.averageRate.toFixed(2)));
  }, [sortedData]);

  const categories = useMemo(() => {
    return sortedData.map(item => formatDateToISOCustom(item.dateOnly, 'dd/MM'));
  }, [sortedData]);

  const [selectedOption, setSelectedOption] = useState(options.find(opt => opt.value === 30) || options[0]);

  const paginatedResult = useMemo(() => {
    return paginate(
      sortedData,
      currentPage,
      itemsPerPage,
      'dateOnly' as keyof CurrencyQuotationHistoryDto,
      sortOrder,
    );
  }, [sortedData, currentPage, itemsPerPage, sortOrder]);

  const initialDate = sortedData.length > 0 ? formatDateToISO(sortedData[0].dateOnly) : '';
  const finalDate = sortedData.length > 0 ? formatDateToISO(sortedData[sortedData.length - 1].dateOnly) : '';

  const currentAverage = chartData.length > 0 ? chartData[chartData.length - 1] : 0;
  const previousAverage = chartData.length > 0 ? chartData[0] : 0;
  const percentageChange = previousAverage !== 0
    ? ((currentAverage - previousAverage) / previousAverage * 100).toFixed(2)
    : '0.00';
  const isPositiveChange = Number(percentageChange) > 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'ASC' ? 'DESC' : 'ASC');
  };

  const handlePeriodChange = async (option: typeof options[0]) => {
    try {
      startLoading();
      const newData = await onPeriodChange(option.value);
      setData(newData);
      setSelectedOption(option);
      setIsDropdownOpen(false);
    } catch (error) {
      stopLoading();
      console.error('Erro ao atualizar período:', error);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('apexcharts').then((ApexCharts) => {
        const options = {
          chart: {
            height: '100%',
            maxWidth: '100%',
            type: 'area',
            fontFamily: 'Inter, sans-serif',
            dropShadow: {
              enabled: false,
            },
            toolbar: {
              show: true,
            },
          },
          tooltip: {
            enabled: true,
            x: {
              show: true,
            },
            y: {
              formatter: (value: number) => `BRL ${value.toFixed(2)}`,
            },
          },
          fill: {
            type: 'gradient',
            gradient: {
              opacityFrom: 0.55,
              opacityTo: 0,
              shade: '#1C64F2',
              gradientToColors: ['#1C64F2'],
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: 6,
            curve: 'smooth',
          },
          grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
              left: 2,
              right: 2,
              top: 0,
            },
          },
          series: [
            {
              name: 'Taxa',
              data: chartData,
              color: '#1A56DB',
            },
          ],
          legend: {
            show: false,
          },
          xaxis: {
            categories: categories,
            labels: {
              show: true,
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
          yaxis: {
            show: false,
          },
        };

        const chartElement = document.getElementById('rate-chart');
        if (chartElement) {
          chartElement.innerHTML = '';
          const chart = new ApexCharts.default(chartElement, options);
          chart.render();

          return () => {
            chart.destroy();
          };
        }
      });
    }
  }, [chartData, categories]);

  return (

    <div>
      <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
        <div className="flex justify-between">
          <div>
            <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
              {baseCurrency} {currentAverage?.toFixed(2) ?? '0.00'}
            </h5>
            <div
              className={`flex items-center px-2.5 py-0.5 text-base font-semibold ${
                isPositiveChange
                  ? 'text-green-500 dark:text-green-500'
                  : 'text-red-500 dark:text-red-500'
              } text-center`}>
              <p className="text-sm text-zinc-900 dark:text-white mr-1">Variação</p> {percentageChange}%
              <svg
                className="w-3 h-3 ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isPositiveChange ? 'M5 13V1m0 0L1 5m4-4 4 4' : 'M5 1v12m0 0l4-4m-4 4L1 9'}
                />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Moeda {code}
            </p>
            <p className="text-zinc-800 dark:text-gray-50">Período: {initialDate} até {finalDate}</p>
          </div>
        </div>
        <div className="mt-4" style={{ height: '200px' }}>
          <div id="rate-chart"></div>
        </div>
        <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
          <div className="flex justify-between items-center pt-5 relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
              type="button">
              Últimos {selectedOption.label}
              <svg className="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="m1 1 4 4 4-4" />
              </svg>
            </button>

            <div
              className={`absolute top-full left-0 z-10 mt-2 w-36 bg-white rounded-lg shadow-lg dark:bg-gray-800 ${
                isDropdownOpen ? 'block' : 'hidden'
              }`}>
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                {options.map((option) => (
                  <li key={option.value}>
                    <button
                      onClick={() => handlePeriodChange(option)}
                      className={`block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
                        selectedOption.value === option.value ? 'bg-gray-100 dark:bg-gray-600' : ''
                      }`}>
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="mt-4 rounded-lg max-h-[350px] overflow-y-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-2 cursor-pointer flex items-center gap-1" onClick={toggleSortOrder}>
                Data {sortOrder === 'ASC' ? <ArrowUpIcon className={`w-4 h-4`} /> :
                <ArrowDownIcon className={`w-4 h-4`} />}
              </th>
              <th className="px-4 py-2">Média</th>
              <th className="px-4 py-2">Máxima</th>
              <th className="px-4 py-2">Mínima</th>
            </tr>
            </thead>
            <tbody>
            {paginatedResult.data.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                  {format(new Date(item.dateOnly + 'T00:00:00'), 'dd/MM/yyyy')}
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{item.averageRate.toFixed(2)}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{item.maxRate.toFixed(2)}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{item.minRate.toFixed(2)}</td>
              </tr>
            ))}
            </tbody>
          </table>
          <nav aria-label="Page navigation" className="mt-4 flex justify-end">
            <ul className="flex items-center -space-x-px h-8 text-sm">
              <li>
                <button
                  onClick={() => handlePageChange(paginatedResult.currentPage - 1)}
                  disabled={paginatedResult.currentPage === 1}
                  className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-2.5 h-2.5 rtl:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </button>
              </li>

              {[...Array(paginatedResult.totalPages)].map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className={`flex items-center justify-center px-3 h-8 leading-tight ${
                      paginatedResult.currentPage === index + 1
                        ? 'text-blue-600 border border-blue-300 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600'
                        : 'text-gray-500 border border-gray-300 bg-white dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                    } hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li>
                <button
                  onClick={() => handlePageChange(paginatedResult.currentPage + 1)}
                  disabled={paginatedResult.currentPage === paginatedResult.totalPages}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-2.5 h-2.5 rtl:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default RateChart;