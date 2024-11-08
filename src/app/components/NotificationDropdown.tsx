import React, { useState, useEffect, useRef } from 'react';
import { InboxArrowDownIcon } from '@heroicons/react/20/solid';
import { Notification } from '@/app/interfaces/Notification';


interface NotificationDropdownProps {
  notifications: Notification[];
  showTitle?: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications,
                                                                   showTitle = true}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState<Notification[]>(notifications);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Atualiza o número de notificações não lidas
  useEffect(() => {
    const count = notificationList.filter((notification) => !notification.read).length;
    setUnreadCount(count);
  }, [notificationList]);

  // Função para alternar o estado do dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);
  const dropdownPosition = showTitle ? 'left-1.5' :  '-right-6' ;
  // Marca a notificação como lida ao passar o foco
  const markAsRead = (id: number) => {
    setNotificationList((prevList) =>
      prevList.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative flex items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5 data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5 data-[slot=icon]:last:*:ml-auto data-[slot=icon]:last:*:size-5 sm:data-[slot=icon]:last:*:size-4 data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 data-[slot=avatar]:*:[--ring-opacity:10%] sm:data-[slot=avatar]:*:size-6 data-[hover]:bg-zinc-950/5 data-[slot=icon]:*:data-[hover]:fill-zinc-950 data-[active]:bg-zinc-950/5 data-[slot=icon]:*:data-[active]:fill-zinc-950 data-[slot=icon]:*:data-[current]:fill-zinc-950 dark:text-white dark:data-[slot=icon]:*:fill-zinc-400 dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:data-[hover]:fill-white dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:fill-white dark:data-[slot=icon]:*:data-[current]:fill-white"
      >
        <div className="relative">
          <InboxArrowDownIcon className="w-6 h-6 text-zinc-950 bg-zinc-100 dark:text-white dark:bg-white/10" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-4 right-5 transform translate-x-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
        {unreadCount}
      </span>
          )}
        </div>
        {showTitle && <span className="m-1.5 text-zinc-950 bg-zinc-100 dark:text-white dark:bg-white/10">Inbox</span>}
      </button>

      {isOpen && (
        <div
          className={`absolute ${dropdownPosition} mt-2 w-96 bg-white rounded-md shadow-lg overflow-hidden ring-1 ring-black ring-opacity-5 z-10`}>
          <div className="max-h-60 overflow-y-auto">
            {notificationList.length === 0 ? (
              <div className="p-4 text-gray-500">Nenhuma notificação</div>
            ) : (
              notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 cursor-pointer ${
                    notification.read
                      ? 'bg-read-light dark:bg-read-dark'
                      : 'bg-background-light dark:bg-background-dark'
                  } hover:bg-hover-light dark:hover:bg-hover-dark`}
                  onMouseEnter={() => markAsRead(notification.id)}
                >
                  {notification.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
