import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showSubtitle = false }) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-tr from-[#d97706] via-[#f0b232] to-[#fde68a] p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0`}>
        <div className="w-full h-full bg-[#0b0e14] rounded-[10px] flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 fill-current text-[#f0b232]" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6.5L12 2L20 6.5V17.5L12 22L4 17.5V6.5Z" stroke="#f0b232" strokeWidth="2" fill="none" />
            <polygon points="10,8 16,12 10,16" fill="#f0b232" />
          </svg>
        </div>
      </div>
      <div>
        <div className={`font-bold tracking-tight ${textSizes[size]} flex items-center gap-1`}>
          <span className="text-[#f0b232]">Gold</span>
          <span className="text-slate-100">Motion</span>
        </div>
        {showSubtitle && (
          <div className="text-[10px] tracking-wider text-slate-400 font-mono uppercase">
            Mobile Master Pro
          </div>
        )}
      </div>
    </div>
  );
};
