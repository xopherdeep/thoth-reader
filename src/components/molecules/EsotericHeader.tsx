import React from 'react';
import { motion } from 'motion/react';

interface EsotericHeaderProps {
  badge?: React.ReactNode;
  titleTop: string;
  titleBottom?: string;
  subtitle?: string;
  className?: string;
}

export const EsotericHeader: React.FC<EsotericHeaderProps> = ({
  badge,
  titleTop,
  titleBottom,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Optional Badge */}
      {badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {badge}
        </motion.div>
      )}

      {/* Main Title */}
      <h2 className="atu-font text-2xl sm:text-[2rem] font-extrabold tracking-wide leading-[1.15]">
        <span
          className="bg-gradient-to-br from-[#f5ecd4] via-[#c5a059] to-[#8a6520] bg-clip-text text-transparent animate-shimmer"
          style={{
            backgroundImage:
              'linear-gradient(105deg, #f5ecd4 0%, #c5a059 30%, #d6b77b 50%, #c5a059 70%, #8a6520 100%)',
          }}
        >
          {titleTop}
        </span>
        {titleBottom && (
          <>
            <br />
            <span className="text-stone-100/90 text-xl sm:text-2xl font-bold">
              {titleBottom}
            </span>
          </>
        )}
      </h2>

      {/* Lore Subtitle */}
      {subtitle && (
        <p className="text-[13px] sm:text-sm text-stone-400 font-serif leading-[1.7] max-w-2xl">
          {subtitle}
        </p>
      )}

      {/* Animated Divider */}
      <div className="animate-line-reveal h-px bg-gradient-to-r from-[#c5a059]/40 via-[#c5a059]/15 to-transparent" />
    </div>
  );
};
