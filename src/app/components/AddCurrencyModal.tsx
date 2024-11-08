'use client';

import React, { useState } from 'react';
import Modal from '@/app/components/ModalGeneric';
import { AvailableCurrency } from '@/app/interfaces/BaseCurrency';

interface AddCurrencyModalProps {
  availableCurrencies: AvailableCurrency[];
  onSave: (selectedCurrencyCode: string) => void;
  onClose: () => void;
}

const AddCurrencyModal: React.FC<AddCurrencyModalProps> = ({ availableCurrencies, onSave, onClose }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = () => {
    if (selectedCurrency) {
      onSave(selectedCurrency);
      onClose();
    } else {
      setErrorMessage('Por favor, selecione uma moeda.');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} >
      <div className="max-w-md mx-auto dark:bg-zinc-900">
        <h2 className="text-lg font-bold">Adicionar Nova Moeda</h2>
        <div className="mt-4">
          <label htmlFor="currency-select" className="block text-sm font-medium text-gray-700">
            Selecione a Moeda
          </label>
          <select
            id="currency-select"
            value={selectedCurrency || ''}
            onChange={(e) => {
              setSelectedCurrency(e.target.value);
              setErrorMessage(null);
            }}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-zinc-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>
              Selecione a Moeda
            </option>
            {availableCurrencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {`${currency.code} - ${currency.description}`}
              </option>
            ))}
          </select>
          {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose}
                  className="outline-1 bg-zinc-500 hover:bg-zinc-500/90 focus:ring-4 focus:ring-zinc-500/50 text-white px-4 py-2 rounded">
            Voltar
          </button>
          <button onClick={handleSave}
                  className="bg-blue-700 hover:bg-blue-700/90 focus:ring-4 focus:ring-blue-700/50 text-white px-4 py-2 rounded">
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddCurrencyModal;
