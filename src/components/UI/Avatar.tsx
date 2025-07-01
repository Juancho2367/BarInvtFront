import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  initials?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  className = '',
  initials,
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  if (initials) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium ${className}`}
      >
        {getInitials(initials)}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center ${className}`}
    >
      <svg
        className="h-6 w-6 text-gray-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </div>
  );
};

export default Avatar; 