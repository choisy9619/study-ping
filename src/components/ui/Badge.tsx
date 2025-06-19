// 배지 컴포넌트

import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].join(' ')
  
  return (
    <span className={classes}>
      {children}
    </span>
  )
}

// 점 배지 (알림 등에 사용)
interface DotBadgeProps {
  show?: boolean
  className?: string
  color?: 'red' | 'green' | 'blue' | 'yellow'
}

export const DotBadge: React.FC<DotBadgeProps> = ({
  show = true,
  className = '',
  color = 'red'
}) => {
  if (!show) return null
  
  const colorClasses = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500'
  }
  
  return (
    <span className={`inline-block h-2 w-2 rounded-full ${colorClasses[color]} ${className}`} />
  )
}

// 숫자 배지
interface NumberBadgeProps {
  count: number
  max?: number
  showZero?: boolean
  className?: string
}

export const NumberBadge: React.FC<NumberBadgeProps> = ({
  count,
  max = 99,
  showZero = false,
  className = ''
}) => {
  if (count === 0 && !showZero) return null
  
  const displayCount = count > max ? `${max}+` : count.toString()
  
  return (
    <Badge variant="danger" size="sm" className={className}>
      {displayCount}
    </Badge>
  )
}
