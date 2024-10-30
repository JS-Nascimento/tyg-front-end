import Image from 'next/image';
import { Bars3Icon } from '@heroicons/react/20/solid';

interface HeaderProps {
  userAvatar: string;
  userName: string;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ userAvatar, userName, toggleSidebar }) => {
  return (
    <header className="flex items-center px-4 lg:hidden">
      <div className="py-2.5">
        {/* Botão para abrir/fechar o sidebar */}
        <button
          aria-label="Toggle navigation"
          onClick={toggleSidebar}
          className="flex items-center p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      <div className="ml-auto">
        {/* Avatar do usuário */}
        <button
          type="button"
          aria-label="User menu"
          className="flex items-center gap-3 p-2 rounded-full focus:outline-none"
        >
          <span className="inline-block h-10 w-10 rounded-full overflow-hidden">
            <Image
              src={userAvatar}
              alt={`${userName}'s avatar`}
              width={40}
              height={40}
              className="object-cover"
            />
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
