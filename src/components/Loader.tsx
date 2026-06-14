'use client';

import { LineSpinner } from 'ldrs/react'
import 'ldrs/react/LineSpinner.css'

export interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
  stroke?: number;
  speed?: number;
}

export function Loader({ 
  size = 40, 
  color = '#082052',
  className = '',
  stroke = 5,
  speed = 2
}: LoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
        <LineSpinner
            size={size}
            color={color}
            stroke={stroke}
            speed={speed}
        />
    </div>
  );
}