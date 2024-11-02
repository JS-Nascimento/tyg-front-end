import React from 'react';
import { PlusIcon, TrashIcon, PencilIcon, DocumentArrowDownIcon } from '@heroicons/react/20/solid';

const ActionButtonGroup = () => {
  return (
  <div className={`px-4 pb-4 -mt-3`}>
    <div className="flex space-x-2">
      <button className="group p-2 rounded bg-blue-500 hover:bg-blue-600 text-white relative">
        <PlusIcon className="h-5 w-5" />
        <span className="absolute left-full ml-2 w-auto p-1 text-xs text-white bg-black rounded shadow opacity-0 group-hover:opacity-100">Incluir</span>
      </button>
      <button className="group p-2 rounded bg-red-500 hover:bg-red-600 text-white relative">
        <TrashIcon className="h-5 w-5" />
        <span className="absolute left-full ml-2 w-auto p-1 text-xs text-white bg-black rounded shadow opacity-0 group-hover:opacity-100">Excluir</span>
      </button>
      <button className="group p-2 rounded bg-green-500 hover:bg-green-600 text-white relative">
        <PencilIcon className="h-5 w-5" />
        <span className="absolute left-full ml-2 w-auto p-1 text-xs text-white bg-black rounded shadow opacity-0 group-hover:opacity-100">Alterar</span>
      </button>
      <button className="group p-2 rounded bg-gray-500 hover:bg-gray-600 text-white relative">
        <DocumentArrowDownIcon className="h-5 w-5" />
        <span className="absolute left-full ml-2 w-auto p-1 text-xs text-white bg-black rounded shadow opacity-0 group-hover:opacity-100">Exportar</span>
      </button>
    </div>
  </div>
  );
}

export default ActionButtonGroup;
