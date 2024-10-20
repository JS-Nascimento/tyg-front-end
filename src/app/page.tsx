// app/page.tsx

import React from 'react';
import WorkArea from '@/app/components/WorkArea';
import Card from '@/app/components/Card';

export default function Home() {
  const cards: { title: string; content: string; size: '3x3' | '6x6' | '9x9' | '12x6' | '3x2' }[] = [
    { title: 'Card 1', content: 'Descrição do Card 1', size: '3x3' },
    { title: 'Card 2', content: 'Descrição do Card 2', size: '6x6' },
    { title: 'Card 3', content: 'Descrição do Card 3', size: '9x9' },
    { title: 'Card 4', content: 'Descrição do Card 4', size: '12x6' },
  ];
  return (
    <>
      <WorkArea title="Dashboard">
        {cards.map((card, index) => (
          <Card key={index} title={card.title} content={card.content} size={card.size} />
        ))}
      </WorkArea>
    </>
  );
};

