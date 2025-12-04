import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'pink' | 'blue' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  className = ''
}: ButtonProps) => {
  const baseStyles = 'rounded-full transition-all duration-200 flex items-center justify-center gap-2 active:scale-95';
  
  const variantStyles = {
    primary: 'bg-[#00FF94] text-black font-semibold hover:shadow-[0_0_24px_rgba(0,255,148,0.4)] disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-white text-black font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
    pink: 'bg-[#FF0055] text-white font-semibold hover:shadow-[0_0_24px_rgba(255,0,85,0.4)] disabled:opacity-50 disabled:cursor-not-allowed',
    blue: 'bg-[#2E5CFF] text-white font-semibold hover:shadow-[0_0_24px_rgba(46,92,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'bg-transparent border-2 border-white/20 text-white font-semibold hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed'
  };
  
  const sizeStyles = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6',
    lg: 'h-14 px-8'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};
