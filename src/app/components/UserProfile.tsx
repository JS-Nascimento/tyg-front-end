// UserProfile.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  SunIcon,
  MoonIcon,
  AdjustmentsHorizontalIcon,
  ClipboardDocumentListIcon,
  LightBulbIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid';
import { useTheme } from '../themes/ThemeContext';
import { useAuth } from '@/app/hook/useAuth';
import Link from 'next/link';

interface UserProfileProps {
  title: string;
  subtitle: string;
  avatarUrl: string;
  dropdownDirection?: 'up' | 'down'; // Prop para controlar a direção do dropdown
  dropdownPosition?: 'right' | 'left';
  showNameEmail?: boolean; // Prop para controlar a exibição do nome e e-mail
  imageShape?: 'circle' | 'rounded'; // Prop para definir o formato da imagem

}

const UserProfile: React.FC<UserProfileProps> = ({
                                                   title,
                                                   subtitle,
                                                   avatarUrl,
                                                   dropdownDirection = 'up', // Default para dropdown abrir para baixo
                                                   dropdownPosition = 'right', // Default para dropdown abrir para direita
                                                   showNameEmail = true, // Default para exibir nome e email
                                                   imageShape = 'circle', // Default para imagem circular
                                                 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  // Função para fechar o menu ao clicar fora ou perder o foco
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await logout()
      if (isDarkMode) {
        toggleDarkMode();
      }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Define se o dropdown abre para cima ou para baixo
  const dropdownPositionClass = dropdownDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2';
  const dropdownOrientationClass = dropdownPosition === 'left' ? 'right-0' : 'left-0';
  // Define se a imagem é circular ou com bordas arredondadas
  const imageShapeClass = imageShape === 'circle' ? 'rounded-full' : 'rounded-md';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={toggleMenu}
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base font-medium text-zinc-950 sm:py-2 sm:text-sm dark:text-white"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className={`size-10 inline-grid shrink-0 align-middle overflow-hidden ${imageShapeClass}`}>
            <Image
              className="size-full"
              src={avatarUrl}
              alt={`${title}'s avatar`}
              width={40}
              height={40}
            />
          </span>
          {showNameEmail && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-zinc-950 dark:text-white">
                {title}
              </span>
              <span className="block truncate text-xs font-normal text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </span>
            </span>
          )}
        </span>
        {dropdownDirection === 'up' && (
          <ChevronUpIcon className="ml-auto size-5" />
        )}
        {dropdownDirection === 'down' && (
          <ChevronDownIcon className="ml-auto size-5" />
        )}
      </button>
      {isOpen && (
        <div
          className={`absolute ${dropdownOrientationClass} ${dropdownPositionClass} w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 dark:bg-background-alternativedark`}
        >

          <div className="mt-1.5 ml-2.5 mr-1.5 mb-1.5">
            <span className="pl-1.5 block truncate text-sm font-medium text-zinc-950 dark:text-white">
              {title}
            </span>
            <span className="pl-1.5 block truncate text-xs font-normal text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </span>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-600"></div>
          <div className="py-1" role="menu" aria-orientation="vertical">
            {/* Opções do menu */}
            <a href="#"
               className="flex items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-blue-600"
               role="menuitem">
              <ClipboardDocumentListIcon
                className="h-4 w-4 mr-2 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100" />
              Perfil
            </a>
            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-blue-600"
            >
              <AdjustmentsHorizontalIcon
                className="h-4 w-4 mr-2 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100"
              />
              Configurações
            </Link>
            <div className="border-t border-zinc-200 dark:border-zinc-600"></div>
            <div className="py-2 px-4">
              <span className="flex items-center gap-2">
                <LightBulbIcon
                  className="h-4 w-4  text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100" />
                <span
                  className="text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-blue-600">Tema</span>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                    isDarkMode ? 'bg-blue-900' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-[28px]' : 'translate-x-1'
                    }`}
                  />
                  <span className="absolute left-1 top-1">
                    <SunIcon className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
                  </span>
                  <span className="absolute right-1 top-1">
                    <MoonIcon className={`h-4 w-4 ${isDarkMode ? 'text-blue-300' : 'text-gray-400'}`} />
                  </span>
                </button>
              </span>
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-600"></div>
            <a onClick={handleLogout}
               className="flex items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-blue-600"
               role="menuitem">
              <ArrowRightStartOnRectangleIcon
                className="h-4 w-4 mr-2 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100" />
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
