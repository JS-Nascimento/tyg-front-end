import React, { useState, useRef, useEffect, ReactElement } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import Image from 'next/image';

interface CurrencyCardProps {
  code: string;
  name: string;
  quotation: string;
  rate: string;
  image: string;
}
interface DropdownMenuProps {
  onClose: () => void;
  positionRef: React.RefObject<HTMLDivElement>;
}

function DropdownMenu({ onClose, positionRef }: DropdownMenuProps): ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as EventListener);
    };
  }, [onClose]);

  useEffect(() => {
    if (positionRef.current && wrapperRef.current) {
      const rect = positionRef.current.getBoundingClientRect();
      const isOutOfViewport = rect.bottom + 300 > window.innerHeight;
      if (isOutOfViewport) {
        wrapperRef.current.style.bottom = '100%';
        wrapperRef.current.style.top = 'auto';
      } else {
        wrapperRef.current.style.top = '100%';
        wrapperRef.current.style.bottom = 'auto';
      }
    }
  }, [positionRef]);


  return (
    <div ref={wrapperRef} className="absolute right-0 -mt-4 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800">
      <a href="#" onClick={onClose} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
        Inativar
      </a>
    </div>
  );
}

function CurrencyCard({ code, name, quotation, rate, image }: CurrencyCardProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = (): void => setIsOpen(!isOpen);

  return (
    <div className="relative flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <div className="flex items-center space-x-4">
        <Image src={image} alt="Icon" width={32} height={32} className="shrink-0" />
        <div className="flex flex-col justify-between">
          <span className="text-lg font-extrabold text-gray-900 dark:text-white">{name}</span>
          <p className="text-md font-semibold text-gray-600 dark:text-gray-400">{code}  {quotation}</p>
          <p className="text-md text-gray-600 dark:text-gray-400">{rate}</p>
        </div>
      </div>
      <div ref={buttonRef}>
        {isOpen && <DropdownMenu onClose={toggleDropdown} positionRef={buttonRef} />}
        <button onClick={toggleDropdown} className="p-2 rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring">
          <FiMoreVertical className="text-gray-900 dark:text-white" />
        </button>
      </div>
    </div>
  );
}

export default CurrencyCard;
