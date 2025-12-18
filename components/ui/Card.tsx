
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 sm:p-8 border border-slate-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
