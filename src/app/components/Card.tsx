import React from 'react';

 export interface CardProps {
  key?: number
  title: string;
  content: string;
}
const Card: React.FC<CardProps> = ({key, title, content}) => {

  return (
    <div key={key} className={`bg-white  dark:bg-background-dark shadow-md p-4 rounded-md -z-30`} style={{ width: '100%', height: '100%' }}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p>{content}</p>
    </div>
  );
};

export default Card;
