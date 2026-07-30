import React from 'react';

interface EsotericBadgeProps {
  icon?: React.ReactNode;
  text: string;
  subText?: string;
  className?: string;
}

export const EsotericBadge: React.FC<EsotericBadgeProps> = ({ icon, text, subText, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono tracking-[0.15em] uppercase bg-gradient-to-r from-[#c5a059]/12 to-[#c5a059]/5 text-[#c5a059] border border-[#c5a059]/25 shadow-[0_0_16px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.05)] ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{text}</span>
      {subText && (
        <>
          <span className="w-1 h-1 rounded-full bg-[#c5a059]/60 shrink-0" />
          <span>{subText}</span>
        </>
      )}
    </div>
  );
};
