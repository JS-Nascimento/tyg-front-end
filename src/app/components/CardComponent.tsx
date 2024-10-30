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
const Card: React.FC<CardProps> = ({id,  content}) => {

  return (
    <div key={id} className={`bg-white  dark:bg-background-dark shadow-md p-4 rounded-md -z-30`} style={{ width: '100%', height: '100%' }}>
      {/*<h2 className="text-xl font-bold mb-2">{title}</h2>*/}
      {content}
    </div>
  );
};

export default Card;
