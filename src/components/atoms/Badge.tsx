import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'element' | 'major' | 'court' | 'minor' | 'outline' | 'stone';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'sm',
  className = '',
  icon,
}) => {
  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5',
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantClasses = {
    gold: 'bg-[#050505] text-[#c5a059] border border-[#c5a059]/40',
    element: 'bg-gradient-to-r from-[#c5a059]/20 to-stone-900/80 text-stone-200 border border-[#c5a059]/30',
    major: 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/60 font-semibold',
    court: 'bg-purple-950/40 text-purple-300 border border-purple-500/30',
    minor: 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30',
    outline: 'bg-black/40 text-stone-300 border border-white/10',
    stone: 'bg-stone-900 text-stone-300 border border-stone-800',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono uppercase rounded-sm ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
