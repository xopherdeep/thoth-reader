import React from 'react';

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  icon,
  badge,
  className = '',
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-[#c5a059] shrink-0">{icon}</span>}
        {badge && (
          <span className="text-[10px] font-mono uppercase bg-[#050505] text-[#c5a059] px-2 py-0.5 rounded border border-[#c5a059]/40">
            {badge}
          </span>
        )}
      </div>
      <h3 className="atu-font text-xl sm:text-2xl font-bold text-stone-100 tracking-wide">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
