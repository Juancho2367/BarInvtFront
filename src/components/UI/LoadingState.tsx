import React from 'react';
import Spinner from './Spinner';

interface LoadingStateProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  text = 'Loading...',
  size = 'md',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 ${className}`}
    >
      <Spinner size={size} />
      {text && (
        <p className="mt-2 text-sm font-medium text-gray-500">{text}</p>
      )}
    </div>
  );
};

export default LoadingState; 