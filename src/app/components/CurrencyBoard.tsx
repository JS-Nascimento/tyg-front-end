'use client';
import CurrencyCard from '@/app/components/CurrencyBoardCard';

import { PlusIcon } from '@heroicons/react/24/solid';
import React from 'react';

interface CurrencyBoardProps {
  data: CurrencyData[];
  title: string;
}

type CurrencyData = {
  code: string;
  name: string;
  quotation: string;
  rate: string;
  image: string;
}

export default function CurrencyBoard( { data, title }: CurrencyBoardProps ) {
  return (
      <div className="bg-white py-1 antialiased dark:bg-zinc-900 md:py-2 h-full rounded-lg ">
        <div className="max-w-full -xl px-4 2xl:px-4">
          <div className="mb-2 flex items-center justify-between gap-4 md:mb-4">
            <pre className="text-lg font-semibold text-gray-900 dark:text-white sm:text-2xl">Moeda base : {title}</pre>
            <div className="mb-1 flex items-center justify-between gap-4">
              <button type="button"
                      className="text-white bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 me-2 mb-2">
                <PlusIcon className="h-5 w-5 font-black" />
                <p className={`ml-1.5`}>Incluir Moeda</p>
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((currency, index) => (
                <CurrencyCard key={index} code={currency.code} name={currency.name} quotation={currency.quotation}
                              rate={currency.rate} image={currency.image} />
            ))}
          </div>
        </div>
      </div>
  );
}