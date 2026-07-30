import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'gold-outline' | 'ghost' | 'dark' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-mono',
    md: 'px-4 py-2 text-xs sm:text-sm font-mono',
    lg: 'px-6 py-3 text-sm font-mono font-bold',
  };

  const variantClasses = {
    gold: 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-black font-bold shadow-lg hover:brightness-110 active:scale-[0.98]',
    'gold-outline':
      'bg-[#050505] text-[#c5a059] border border-[#c5a059]/60 hover:bg-[#c5a059]/10 hover:border-[#c5a059]',
    ghost: 'bg-transparent text-stone-300 hover:text-stone-100 hover:bg-white/5',
    dark: 'bg-[#0e0e11] text-stone-200 border border-white/10 hover:border-white/20 hover:bg-white/5',
    danger: 'bg-red-950/60 text-red-200 border border-red-800/60 hover:bg-red-900/80',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
