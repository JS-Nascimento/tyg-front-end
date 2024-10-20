// app/components/Card.tsx
import React from 'react';

interface CardProps {
  title: string;
  content: string | React.ReactNode;
  size: '3x3' | '3x2' | '6x6' | '9x9' | '12x6';
}

const sizeClasses = {
  '3x3': 'w-3/12 h-3/12',
  '3x2': 'w-3/12 h-2/12',
  '6x6': 'w-6/12 h-6/12',
  '9x9': 'w-9/12 h-9/12',
  '12x6': 'w-full h-6/12',
};

const Card: React.FC<CardProps> = ({ title, content, size }) => {
  const cardSizeClass = sizeClasses[size];

  return (
    <div className={`p-4 bg-blue-100 rounded-lg shadow-md dark:bg-blue-900 ${cardSizeClass}`}>
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-2 text-sm">
        {content}
      </div>
    </div>
  );
};

export default Card;
