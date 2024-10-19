'use client';
import React, { ReactNode, useState } from 'react';
import UserProfile from '@/app/components/UserProfile';
import Image from 'next/image';
import Link from 'next/link';
import { ChartBarIcon, CreditCardIcon, HomeIcon } from '@heroicons/react/16/solid';
import { BellIcon, PrinterIcon } from '@heroicons/react/24/solid';
import NotificationDropdown from '@/app/components/NotificationDropdown';
import { Notification } from '@/app/components/NotificationDropdown';

interface SidebarProps {
  children: ReactNode;
  logoUrl: string;
  userName: string;
  userAvatar: string;
  userEmail: string;
  notifications: Notification[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, logoUrl, userName, userEmail, userAvatar, notifications }) => {
  const [activeItem, setActiveItem] = useState('#1');

  const menuItems = [
    { name: 'Home', href: '#1', icon: <HomeIcon className="w-6 h-6" /> },
    { name: 'Contas', href: '#2', icon: <CreditCardIcon className="w-6 h-6" /> },
    { name: 'Análises', href: '#3', icon: <ChartBarIcon className="w-6 h-6" /> },
    { name: 'Relatórios', href: '#4', icon: <PrinterIcon className="w-6 h-6" /> },
    { name: 'Alertas', href: '#5', icon: <BellIcon className="w-6 h-6" /> },
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div
        className="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
        <div className="fixed inset-y-0 left-0 w-64 max-lg:hidden">
          <nav className="flex h-full min-h-0 flex-col">
            <div
              className="flex flex-col border-b border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5">
              <div data-slot="section" className="flex flex-col gap-0.5">
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
                <NotificationDropdown notifications={notifications || []} />
              </div>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="truncate">Support</span>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
                </svg>
                <span className="truncate">Changelog</span>
              </a>
            </span>
              </div>
            </div>
            <div
              className="max-lg:hidden flex flex-col border-t border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5">
              <div data-slot="section" className="flex flex-col gap-0.5">
                <UserProfile title={userName} subtitle={userEmail} avatarUrl={userAvatar} />
              </div>
            </div>
          </nav>
        </div>
        <header className="flex items-center justify-between px-4 lg:hidden">
          <button
            aria-label="Toggle navigation"
            onClick={toggleSidebar}
            className="p-2 rounded-lg focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fill-rule="evenodd"
                    d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                    clip-rule="evenodd" />
            </svg>
          </button>
          <UserProfile title={userName} subtitle={userEmail} avatarUrl={userAvatar} dropdownDirection={"down"} imageShape={"rounded"} showNameEmail={false} dropdownPosition={'left'}/>
        </header>
        {children}
      </div>
      {/*<next-route-announcer style={{ position: "absolute" }} />*/}
    </>
  );
};

export default Sidebar;