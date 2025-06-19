// 로딩 컴포넌트

import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text, fullScreen = false, className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const spinner = (
    <svg
      className={`animate-spin ${sizeClasses[size]} text-blue-600`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {spinner}
      {text && <p className={`text-gray-600 ${textSizeClasses[size]}`}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">{content}</div>;
  }

  return content;
};

// 스켈레톤 로딩 컴포넌트
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', width, height, circle = false }) => {
  const style: React.CSSProperties = {};
  if (width) {
    style.width = width;
  }

  if (height) {
    style.height = height;
  }

  const classes = ['animate-pulse bg-gray-200', circle ? 'rounded-full' : 'rounded', className].join(' ');

  return <div className={classes} style={style} />;
};

// 인라인 스피너 (텍스트와 함께 사용)
export const Spinner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={`animate-spin h-4 w-4 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};
