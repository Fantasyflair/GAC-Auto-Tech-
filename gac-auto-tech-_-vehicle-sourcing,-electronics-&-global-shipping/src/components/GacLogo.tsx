import React from 'react';

interface GacLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'trimmed' | 'full';
}

export const GAC_LOGO_URL = '/assets/aistudio/gac_logo_trimmed.jpg';
export const GAC_LOGO_ORIGINAL_URL = '/assets/aistudio/photo_2026-10-28_18-00-19_5d49b819.jpg';

export const GacLogo: React.FC<GacLogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'trimmed'
}) => {
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28'
  };

  const logoSrc = variant === 'full' ? GAC_LOGO_ORIGINAL_URL : GAC_LOGO_URL;

  return (
    <div 
      className={`inline-flex items-center shrink-0 select-none transition-opacity duration-200 hover:opacity-95 ${className}`}
      aria-label="GAC AUTO TECH CANADA INC."
    >
      <img
        src={logoSrc}
        alt="GAC AUTO TECH CANADA INC."
        className={`${sizeClasses[size]} w-auto object-contain object-left`}
        loading="eager"
        onError={(e) => {
          // If trimmed fails for any reason, fallback directly to original photo
          if (e.currentTarget.src !== GAC_LOGO_ORIGINAL_URL) {
            e.currentTarget.src = GAC_LOGO_ORIGINAL_URL;
          }
        }}
      />
    </div>
  );
};
