import React from 'react';

interface ImssLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'color' | 'white' | 'dark';
}

export const ImssLogo: React.FC<ImssLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'color'
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10', text: 'text-lg', sub: 'text-[10px]' },
    lg: { box: 'w-12 h-12', text: 'text-xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', text: 'text-2xl', sub: 'text-sm' }
  };

  const primaryColor = variant === 'white' ? '#FFFFFF' : '#006657'; // Pantone 561 C
  const accentGold = '#BC955C'; // Pantone 465 C

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* IMSS Emblem Icon */}
      <div 
        className={`${sizeMap[size].box} rounded-lg flex items-center justify-center p-1 shrink-0 shadow-xs transition-transform duration-200`}
        style={{ 
          backgroundColor: variant === 'white' ? 'rgba(255,255,255,0.15)' : '#006657',
          border: `1.5px solid ${variant === 'white' ? 'rgba(255,255,255,0.3)' : '#BC955C'}`
        }}
        title="Instituto Mexicano del Seguro Social"
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Emblem Background Canvas */}
          <rect width="100" height="100" rx="20" fill="#006657" />
          
          {/* Stylized IMSS Eagle & Sheltering Mother-Child Silhouette */}
          {/* Outer Protective Eagle Wing & Crest */}
          <path
            d="M 22 36 C 22 20, 36 14, 50 14 C 64 14, 78 20, 78 36 C 78 52, 68 68, 50 78 C 32 68, 22 52, 22 36 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          {/* Eagle Beak & Profile */}
          <path
            d="M 24 35 Q 32 30 40 34 Q 34 38 28 42 Z"
            fill="#FFFFFF"
          />
          {/* Mother & Child Arc */}
          <path
            d="M 40 32 C 48 30, 58 35, 62 44 C 66 53, 62 64, 50 72 C 38 64, 34 53, 38 44 C 41 38, 45 35, 50 35 C 55 35, 58 39, 57 44 C 56 49, 52 52, 47 52 C 44 52, 42 50, 43 47 C 44 44, 47 43, 49 45"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Mother's serene face & Child cradling lines */}
          <path
            d="M 45 46 Q 48 48 51 46 Q 49 52 46 54"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="58" r="3.5" fill="#FFFFFF" />
          {/* Golden accent leaf/crest dot */}
          <circle cx="50" cy="22" r="2.5" fill="#BC955C" />
        </svg>
      </div>

      {/* Institutional Wordmark */}
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-baseline gap-1.5">
            <span 
              className={`font-black font-serif tracking-tight ${sizeMap[size].text}`}
              style={{ color: primaryColor }}
            >
              CUPN Conecta
            </span>
            <span 
              className="font-bold text-[9px] tracking-widest uppercase px-1 py-0.5 rounded"
              style={{ 
                color: '#BC955C', 
                backgroundColor: '#FAF5ED', 
                border: '1px solid #DDC9A3' 
              }}
            >
              IMSS
            </span>
          </div>
          <span 
            className={`font-medium tracking-tight text-slate-500 mt-1 line-clamp-1 ${sizeMap[size].sub}`}
          >
            Coordinación de Unidades de Primer Nivel
          </span>
          <span 
            className="text-[9px] text-[#006657] font-semibold italic mt-0.5 hidden sm:block"
          >
            "Conectando conocimiento, fortaleciendo servicios."
          </span>
        </div>
      )}
    </div>
  );
};
