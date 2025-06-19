// 기본 카드 컴포넌트

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  onClick,
  hoverable = false,
}) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200';

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const interactiveClasses =
    onClick || hoverable ? 'cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5' : '';

  const classes = [baseClasses, paddingClasses[padding], shadowClasses[shadow], interactiveClasses, className].join(
    ' '
  );

  const Element = onClick ? 'button' : 'div';

  return (
    <Element className={classes} onClick={onClick}>
      {children}
    </Element>
  );
};

// 카드 헤더 컴포넌트
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`border-b border-gray-200 pb-3 mb-4 ${className}`}>{children}</div>;
};

// 카드 제목 컴포넌트
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>;
};

// 카드 내용 컴포넌트
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

// 카드 푸터 컴포넌트
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return <div className={`border-t border-gray-200 pt-3 mt-4 ${className}`}>{children}</div>;
};
