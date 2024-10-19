// UserProfile.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { SunIcon, MoonIcon } from '@heroicons/react/20/solid';

interface UserProfileProps {
  title: string;
  subtitle: string;
  avatarUrl: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ title, subtitle, avatarUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  // Função para fechar o menu ao clicar fora ou perder o foco
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={toggleMenu}
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base font-medium text-zinc-950 sm:py-2 sm:text-sm dark:text-white"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="size-10 inline-grid shrink-0 align-middle rounded-full overflow-hidden">
            <Image
              className="size-full"
              src={avatarUrl}
              alt={`${title}'s avatar`}
              width={40}
              height={40}
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-zinc-950 dark:text-white">
              {title}
            </span>
            <span className="block truncate text-xs font-normal text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </span>
          </span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="ml-auto size-5"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          className="absolute left-1 bottom-full mb-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 dark:bg-zinc-800">
          <span className="mt-1.5 ml-2.5 mr-1.5 mb-1.5 inline-block">
            <span className="pl-1.5 mb-1.5 block truncate text-sm font-medium text-zinc-950 dark:text-white">
              {title}
            </span>
            <span className="pl-1.5 mb-1.5 block truncate text-xs font-normal text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </span>
          </span>
          <div className="border-t border-zinc-200 dark:border-zinc-600"></div>
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <a href="#"
               className="flex items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
               role="menuitem">
              <svg className="mr-3 h-5 w-5 text-zinc-500 dark:text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              Perfil
            </a>
            <a href="#"
               className="flex items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
               role="menuitem">
              <svg className="mr-3 h-5 w-5 text-zinc-500 dark:text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                      d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                      clip-rule="evenodd" />
              </svg>
              Configurações
            </a>
            <div className="py-0" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <span
              className="flex items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              role="menuitem">
                <svg className="mr-3 h-5 w-5 text-zinc-500 dark:text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd"
                        d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                        clip-rule="evenodd" />
                  <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
                </svg>
              Tema
            <button
              onClick={toggleDarkMode}
              className={`left-3 relative inline-flex h-8 w-24 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-[72px]' : 'translate-x-2'
                  }`}
                />
              <span className="absolute left-1.5 top-1.5">
                  <SunIcon className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
                </span>
              <span className="absolute right-1.5 top-1.5">
                  <MoonIcon className={`h-4 w-4 ${isDarkMode ? 'text-blue-300' : 'text-gray-400'}`} />
                </span>
            </button>
              </span>
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-600"></div>
            <a href="#"
               className="flex items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
               role="menuitem">
              <svg className="mr-3 h-5 w-5 text-zinc-500 dark:text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                      d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                      clip-rule="evenodd" />
              </svg>
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
