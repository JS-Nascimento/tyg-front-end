// app/page.tsx
import React from 'react';
import DashboardArea from './components/DashboardArea';

export default function Home() {
  const cards = [
    { order: 1, title: 'Card 0', content: 'Conteúdo do Card 1', size: { w: 3, h: 3 } },
    { order: 2, title: 'Card 12', content: 'Conteúdo do Card 1', size: { w: 3, h: 3 } },
    { order: 3, title: 'Card 1b2', content: 'Conteúdo do Card 1', size: { w: 3, h: 6 } },
    { order: 4, title: 'Card 1c2', content: 'Conteúdo do Card 1', size: { w: 3, h: 3 } },
    { order: 5, title: 'Card 1d2', content: 'Conteúdo do Card 1', size: { w: 6, h: 3 } },
    { order: 6, title: 'Card 2', content: 'Conteúdo do Card 2', size: { w: 6, h: 6 } },
    { order: 7, title: 'Card 3', content: 'Conteúdo do Card 3', size: { w: 6, h: 9 } },
    { order: 8, title: 'Card 4', content: 'Conteúdo do Card 4', size: { w: 12, h: 6 } },
  ];

  return (
    <DashboardArea title="Dashboard" cards={cards} />
  );
}
