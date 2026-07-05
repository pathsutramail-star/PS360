import React from 'react';
import { cn } from '../../utils';

interface CardProps extends React.ComponentProps<"div"> {
  className?: string;
  children?: React.ReactNode;
  key?: React.Key;
}

export function Card({ className, ...props }: CardProps) {
  return (
    <div 
      className={cn("bg-white rounded-2xl border border-gray-200/60 shadow-[0_2px_12px_-3px_rgba(6,81,237,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-gray-300/50", className)} 
      {...props} 
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn("px-6 py-5 border-b border-gray-100", className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardProps) {
  return <h3 className={cn("text-lg font-semibold font-display text-gray-900 tracking-tight", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("p-6", className)} {...props} />;
}
