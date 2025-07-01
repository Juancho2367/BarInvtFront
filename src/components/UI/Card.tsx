import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  footer,
}) => {
  return (
    <div
      className={`bg-white overflow-hidden shadow rounded-lg ${className}`}
    >
      {title && (
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h3>
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
      {footer && (
        <div className="bg-gray-50 px-4 py-4 sm:px-6">
          <div className="text-sm">{footer}</div>
        </div>
      )}
    </div>
  );
};

export default Card; 