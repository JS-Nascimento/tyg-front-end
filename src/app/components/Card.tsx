import React from 'react';

 export interface CardProps {
  id?: number
  title: string;
  content: string;
  size?: {
    w: number;
    h: number;
  }
}
const Card: React.FC<CardProps> = ({id, title, content}) => {

  return (
    <div key={id} className={`bg-white  dark:bg-background-dark shadow-md p-4 rounded-md -z-30`} style={{ width: '100%', height: '100%' }}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p>{content}</p>
    </div>
  );
};

export default Card;
