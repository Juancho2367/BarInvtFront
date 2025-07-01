import React from 'react';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  text?: string;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
  text,
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        className={`h-full w-px bg-gray-200 ${className}`}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (text) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-sm text-gray-500">{text}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full border-t border-gray-200 ${className}`}
      role="separator"
      aria-orientation="horizontal"
    />
  );
};

export default Divider; 