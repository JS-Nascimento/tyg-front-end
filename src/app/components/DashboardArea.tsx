"use client";

import React from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { CardProps } from './CardComponent';
import CardComponent from '@/app/components/CardComponent';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardArea {
  title: string;
  cards?: CardProps[];
}

const DashboardArea: React.FC<DashboardArea> = ({ title, cards = [] }) => {

  // Define layouts com base nos tamanhos específicos dos cards
  const defaultLayouts: Layout[] = cards.map((card, index) => {
    // Define valores padrão para `size` caso não estejam definidos
    const { w, h } = card.size ?? { w: 3, h: 2 };

    // Calcula a posição `x` para garantir alinhamento correto
    const x = (index * h) % 12;
    const y = Math.floor((index * w) / 12);

    return {
      i: index.toString(),
      x, // Usa o valor calculado de `x`
      y, // Usa o valor calculado de `y`
      w: w, // Largura do card em colunas
      h: h, // Altura do card em linhas
      static: false, // Pode ser movido
    };
  });

  return (
    <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pl-64 lg:pr-2 lg:pt-2">
      <div
        className="flex-1 overflow-auto p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-screen-2xl">
          <h1 className="text-2xl font-semibold text-zinc-950 sm:text-xl dark:text-white">
            {title}
          </h1>
          <hr
            role="presentation"
            className="mt-6 w-full border-t border-zinc-950/10 dark:border-white/10"
          />
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: defaultLayouts }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={100}
            isResizable={false} // Impede o redimensionamento
            isDraggable={true} // Permite mover os cards
            compactType={'vertical'} // Não compacta automaticamente os cards
            preventCollision={true} // Evita colisões
          >
            {cards.map((card, index) => (
              <div key={index.toString()} className="bg-white dark:bg-background-dark shadow-md rounded-md">
                <CardComponent
                  id={index}
                  title={card.title}
                  content={card.content}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>
    </main>
      );
      };

      export default DashboardArea;
