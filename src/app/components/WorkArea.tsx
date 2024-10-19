import React, { ReactNode } from 'react';

interface WorkAreaProps {
  children: ReactNode;
  title: string;
}

const WorkArea: React.FC<WorkAreaProps> = ({ children, title }) => {
  return (
    <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pl-64 lg:pr-2 lg:pt-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-screen-2xl">
          <h1 className="text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white">
            {title}
          </h1>
          <hr
            role="presentation"
            className="mt-6 w-full border-t border-zinc-950/10 dark:border-white/10"
          />
          {/* Renderiza o conteúdo dinâmico */}
          <div className="mt-6 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default WorkArea;
