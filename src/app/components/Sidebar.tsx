'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import UserProfile from '@/app/components/UserProfile';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChartBarIcon,
  CreditCardIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Bars4Icon,
  XMarkIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/16/solid';
import { BellIcon, PrinterIcon } from '@heroicons/react/24/solid';
import NotificationDropdown from '@/app/components/NotificationDropdown';
import { Notification } from '@/app/interfaces/Notification';
import { useAuth } from '@/app/hook/useAuth';

interface SidebarProps {
  children: ReactNode;
  logoUrl: string;
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
  notifications?: Notification[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, logoUrl }) => {
  const [activeItem, setActiveItem] = useState('#1');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const auth = useAuth();

  const authProps: SidebarProps = {
    children,
    logoUrl,
    userName: auth.user?.name || '',
    userEmail: auth.user?.email || '',
    userAvatar: '/avatar.jpg',
    notifications: [
      { id: 1, message: 'Relatório de Fechamento Mensal finalizado', read: false },
      { id: 2, message: 'Análise de desempenho de ativo finalizado', read: false },
      { id: 3, message: 'Sua mensalidade está próxima do vencimento', read: false },
    ],
  };

  // rotas aqui para paginas
  const menuItems = [
    { name: 'Home', href: '/home', icon: <HomeIcon className="w-6 h-6" /> },
    { name: 'Moedas', href: '/currencies', icon: <CurrencyDollarIcon className="w-6 h-6" /> },
    { name: 'Contas', href: '#2', icon: <CreditCardIcon className="w-6 h-6" /> },
    { name: 'Análises', href: '/analysis', icon: <ChartBarIcon className="w-6 h-6" /> },
    { name: 'Relatórios', href: '#4', icon: <PrinterIcon className="w-6 h-6" /> },
    { name: 'Alertas', href: '#5', icon: <BellIcon className="w-6 h-6" /> },
  ];

  const handleResize = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setIsLargeScreen(true);
      setIsSidebarOpen(true);
    } else {
      setIsLargeScreen(false);
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isSidebarOpen === null) {
      handleResize();
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebarElement = document.querySelector('.sidebar');
      if (sidebarElement && !sidebarElement.contains(event.target as Node) && !isLargeScreen) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLargeScreen]);

  return (
    <>
      <div
        className="relative isolate flex min-h-svh w-full bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
        <div
          className={`sidebar fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 bg-gray-100 dark:bg-zinc-950 ${
            isSidebarOpen ? 'translate-x-0 lg:w-64' : '-translate-x-full'
          } m-1.5 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg lg:m-0 lg:border-0 lg:rounded-none lg:shadow-none lg:translate-x-0 lg:relative`}
        >
          <nav className="flex h-full min-h-0 flex-col ">
            <div
              className="flex flex-col border-b border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5">
              <div data-slot="section" className="flex flex-col gap-0.5">
                {isSidebarOpen && !isLargeScreen && <div className="flex items-center justify-between">
                  <button
                    aria-label="Toggle navigation"
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg  focus:outline-solid focus:outline-gray-300 hover:bg-hover-light dark:hover:bg-hover-dark"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
                }
                <span className="relative">
                  <div className="cursor-default flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6
                  font-medium text-zinc-950 sm:py-2 sm:text-sm/5 data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0
                  data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5 data-[slot=icon]:last:*:ml-auto
                  data-[slot=icon]:last:*:size-5 sm:data-[slot=icon]:last:*:size-4 data-[slot=avatar]:*:-m-0.5
                  data-[slot=avatar]:*:size-7 data-[slot=avatar]:*:[--ring-opacity:10%] sm:data-[slot=avatar]:*:size-6
                  data-[hover]:bg-zinc-950/5 data-[slot=icon]:*:data-[hover]:fill-zinc-950 data-[active]:bg-zinc-950/5
                  data-[slot=icon]:*:data-[active]:fill-zinc-950 data-[slot=icon]:*:data-[current]:fill-zinc-950
                  dark:text-white dark:data-[slot=icon]:*:fill-zinc-400 dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:
                  data-[hover]:fill-white dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:fill-white dark:data-[slot=icon]:*:data-[current]:fill-white">
                    <span
                      className="absolute left-0 top-1/2 size-[max(100%,3.5rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                      aria-hidden="true" />
                      <span data-slot="avatar"
                            className="inline-grid shrink-0 align-middle rounded-full outline outline-1 -outline-offset-1 outline-black/[--ring-opacity] dark:outline-white/[--ring-opacity]"
                            style={{ width: '60px', height: '60px' }}>
                        <Image
                          className="rounded-full"
                          src={logoUrl}
                          alt="logo's avatar"
                          width={60}
                          height={60}
                        />
                      </span>
                    <span className="truncate font-bold">TYG Investmment</span>
              </div>
            </span>
              </div>
              <div
                data-slot="section"
                className="max-lg:hidden flex flex-col gap-0.5"
              >
                <NotificationDropdown notifications={authProps.notifications || []} />
              </div>
            </div>
            <div
              className="flex flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8">
              <div data-slot="section" className="flex flex-col gap-0.5">
                {menuItems.map((item) => (
                  <span className="relative" key={item.href}>
                    <span
                      className={`absolute inset-y-2 -left-1 w-1 rounded-full transition-all ${
                        activeItem === item.href
                          ? 'bg-blue-500 dark:bg-white'
                          : 'bg-transparent'
                      }`}
                      style={{ opacity: activeItem === item.href ? 1 : 0 }}
                    />
                    <Link
                      href={item.href}
                      onClick={() => setActiveItem(item.href)}
                      className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base font-medium ${
                        activeItem === item.href
                          ? 'text-zinc-950 bg-zinc-100 dark:text-white dark:bg-white/10'
                          : 'text-zinc-500 dark:text-zinc-400'
                      } sm:py-2 sm:text-sm/5 hover:bg-zinc-950/5 dark:hover:bg-white/5`}
                      type="button"
                    >
                      <span
                        className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                        aria-hidden="true"
                      />
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      <span className="truncate">{item.name}</span>
                    </Link>

                  </span>
                ))}
              </div>
              <div aria-hidden="true" className="mt-8 flex-1" />
              <div data-slot="section" className="flex flex-col gap-0.5">
                <span className="relative">
              <a
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5 data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5 data-[slot=icon]:last:*:ml-auto data-[slot=icon]:last:*:size-5 sm:data-[slot=icon]:last:*:size-4 data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 data-[slot=avatar]:*:[--ring-opacity:10%] sm:data-[slot=avatar]:*:size-6 data-[hover]:bg-zinc-950/5 data-[slot=icon]:*:data-[hover]:fill-zinc-950 data-[active]:bg-zinc-950/5 data-[slot=icon]:*:data-[active]:fill-zinc-950 data-[slot=icon]:*:data-[current]:fill-zinc-950 dark:text-white dark:data-[slot=icon]:*:fill-zinc-400 dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:data-[hover]:fill-white dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:fill-white dark:data-[slot=icon]:*:data-[current]:fill-white"
                type="button"
                data-headlessui-state=""
                href="#"
              >
                <span
                  className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                  aria-hidden="true"
                />
                <QuestionMarkCircleIcon className="w-6 h-6" />
                <span className="truncate">Suporte</span>
              </a>
            </span>
                <span className="relative">
              <a
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5 data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5 data-[slot=icon]:last:*:ml-auto data-[slot=icon]:last:*:size-5 sm:data-[slot=icon]:last:*:size-4 data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 data-[slot=avatar]:*:[--ring-opacity:10%] sm:data-[slot=avatar]:*:size-6 data-[hover]:bg-zinc-950/5 data-[slot=icon]:*:data-[hover]:fill-zinc-950 data-[active]:bg-zinc-950/5 data-[slot=icon]:*:data-[active]:fill-zinc-950 data-[slot=icon]:*:data-[current]:fill-zinc-950 dark:text-white dark:data-[slot=icon]:*:fill-zinc-400 dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:data-[hover]:fill-white dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:fill-white dark:data-[slot=icon]:*:data-[current]:fill-white"
                type="button"
                data-headlessui-state=""
                href="#"
              >
                <span
                  className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                  aria-hidden="true"
                />
                <SparklesIcon className="w-6 h-6" />
                <span className="truncate">Atualizações</span>
              </a>
            </span>
              </div>
            </div>
            <div
              className="max-lg:hidden flex flex-col border-t border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5">
              <div data-slot="section" className="flex flex-col gap-0.5">
                <UserProfile title={authProps.userName || ''} subtitle={authProps.userEmail || ''} avatarUrl={authProps.userAvatar || ''} />
              </div>
            </div>
          </nav>
        </div>
        {/* Main content */}
        <div className={`flex-1 flex flex-col min-h-svh ${isSidebarOpen ? '-ml-64' : 'ml-0'}`}>
          <header className="flex items-center justify-between px-4 lg:hidden">
            <button
              aria-label="Toggle navigation"
              onClick={toggleSidebar}
              className="p-2 rounded-lg  focus:outline-solid focus:outline-gray-300 hover:bg-hover-light dark:hover:bg-hover-dark"
            >
              <Bars4Icon className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <NotificationDropdown notifications={authProps.notifications || []} showTitle={false} />
              <UserProfile title={authProps.userName || ''} subtitle={authProps.userEmail || ''} avatarUrl={authProps.userAvatar || ''}  dropdownDirection={'down'}
                           imageShape={'rounded'} showNameEmail={false} dropdownPosition={'left'} />
            </div>
          </header>
          {children}
        </div>
      </div>
      {/*<next-route-announcer style={{ position: "absolute" }} />*/}
    </>
  );
};

export default Sidebar;