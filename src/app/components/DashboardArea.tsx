"use client";

import React, { useState } from 'react';
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
  // Estado para controlar qual card está sendo arrastado
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const defaultLayouts: Layout[] = cards.map((card, index) => {
    const { w = 3, h = 2 } = card.size ?? {};
    const maxCols = 12;
    const gap = 0.5; // Espaçamento entre cards

    const cardsPerRow = Math.floor(maxCols / (w + gap));
    const rowIndex = Math.floor(index / cardsPerRow);
    const colIndex = index % cardsPerRow;

    // Adiciona o gap no cálculo das posições
    const x = colIndex * (w + gap);
    const y = rowIndex * (h + gap);

    return {
      i: index.toString(),
      x,
      y,
      w,
      h,
      static: false,
    };
  });

  return (
    <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pl-64 lg:pr-2 lg:pt-2">
      <div className="flex-1 overflow-auto p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
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
            isResizable={false}
            isDraggable={true}
            margin={[6, 6]}
            compactType={'vertical'}
            preventCollision={true}
            onDragStart={(layout, oldItem, newItem) => {
              setIsDragging(true);
              setDraggedItemId(newItem.i);
            }}
            onDragStop={() => {
              setIsDragging(false);
              setDraggedItemId(null);
            }}
            draggableHandle=".drag-handle" // Adiciona uma área específica para arrastar
          >
            {cards.map((card, index) => (
              <div
                key={index.toString()}
                className={`
                  bg-white dark:bg-background-dark shadow-md rounded-md
                  ${isDragging && draggedItemId === index.toString() ? 'cursor-grabbing' : 'cursor-grab'}
                  transition-colors duration-200
                `}
                onClick={(e) => {
                  // Previne a propagação do clique apenas se não estiver arrastando
                  if (!isDragging) {
                    e.stopPropagation();
                  }
                }}
              >
                <div className="h-full w-full">
                  <div className="drag-handle h-6 w-full bg-gray-100 dark:bg-gray-800 rounded-t-md cursor-grab" />
                  <div className="p-4">
                    <CardComponent
                      id={index}
                      title={card.title}
                      content={card.content}
                    />
                  </div>
                </div>
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>
    </main>
  );
};

export default DashboardArea;