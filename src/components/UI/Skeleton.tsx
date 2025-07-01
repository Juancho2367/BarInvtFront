import React from 'react';

interface SkeletonProps {
  type?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  type = 'text',
  width,
  height,
  className = '',
}) => {
  const baseClasses = 'animate-pulse bg-gray-200';

  const typeClasses = {
    text: 'rounded',
    circle: 'rounded-full',
    rect: 'rounded-md',
  };

  const style = {
    width: width || (type === 'circle' ? '40px' : '100%'),
    height: height || (type === 'circle' ? '40px' : '20px'),
  };

  return (
    <div
      className={`${baseClasses} ${typeClasses[type]} ${className}`}
      style={style}
    />
  );
};

export default Skeleton; 