"use client";

import "./Card.css";

interface CardProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, ...props }: CardProps) => {
  return (
    <div className="card" {...props}>
      {children}
    </div>
  );
};
