import React, { ReactNode } from 'react';

 export interface CardProps {
  id?: number
  title: string;
  content: ReactNode;
  size?: {
    w: number;
    h: number;
  }
}
const Card: React.FC<CardProps> = ({ id, content }) => {
  const handleClick = (e: React.MouseEvent) => {
    // Previne a propagação do clique para o grid
    e.stopPropagation();
  };
  return (
    <div onClick={handleClick} key={id} className={`bg-white dark:bg-background-dark rounded-md -z-30 `} style={{ width: '100%', height: '100%' }}>
      {content}
    </div>
  );
};

export default Card;
