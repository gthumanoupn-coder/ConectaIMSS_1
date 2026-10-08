import React from 'react';
import { 
  QrCode, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { QuizAttempt, CertificateTemplate, CertificateSigner } from '../types/lms';
import { ImssLogo } from './ImssLogo';

interface CertificateDocumentProps {
  attempt: QuizAttempt;
  template: CertificateTemplate;
  className?: string;
  isPrintPreview?: boolean;
}

export const CertificateDocument: React.FC<CertificateDocumentProps> = ({
  attempt,
  template,
  className = '',
  isPrintPreview = false
}) => {
  const verificationHash = `${template.securityHashPrefix || 'IMSS-NOM024-SHA256'}:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855-${attempt.id}`;
  const activeSigners = (template.signers || []).filter(s => s.enabled);

  // Determine font family styling
  const fontClass = template.fontFamily === 'serif' 
    ? 'font-serif' 
    : template.fontFamily === 'mono' 
    ? 'font-mono' 
    : 'font-sans';

  // Determine border styles based on borderFamily
  const getBorderStyle = () => {
    switch (template.borderFamily) {
      case 'ornate-gold':
        return {
          border: `5px double ${template.primaryColor}`,
          outline: `3px solid ${template.accentColor}`,
          outlineOffset: '-10px',
          boxShadow: `inset 0 0 0 16px ${template.backgroundColor}, inset 0 0 0 18px ${template.accentColor}40`
        };
      case 'modern-clean':
        return {
          border: `2px solid ${template.primaryColor}`,
          borderLeft: `12px solid ${template.primaryColor}`,
          borderRight: `12px solid ${template.accentColor}`,
          outline: `1px dashed ${template.accentColor}80`,
          outlineOffset: '-8px'
        };
      case 'medical-emerald':
        return {
          border: `4px solid ${template.primaryColor}`,
          outline: `2px solid ${template.accentColor}`,
          outlineOffset: '-8px',
          boxShadow: `inset 0 0 0 10px ${template.backgroundColor}, inset 0 0 0 12px ${template.primaryColor}30`
        };
      case 'executive-navy':
        return {
          border: `6px double ${template.primaryColor}`,
          outline: `2px solid ${template.accentColor}`,
          outlineOffset: '-14px',
          boxShadow: `inset 0 0 0 20px ${template.backgroundColor}, inset 0 0 0 22px ${template.primaryColor}20`
        };
      case 'minimalist':
        return {
          border: `1px solid ${template.accentColor}`,
          boxShadow: 'none'
        };
      case 'classic-double':
      default:
        return {
          border: `6px double ${template.primaryColor}`,
          outline: `2px solid ${template.accentColor}`,
          outlineOffset: '-12px'
        };
    }
  };

  // Helper for handwritten signature calligraphy
  const renderSignature = (signer: CertificateSigner) => {
    switch (signer.signatureStyle) {
      case 'calligraphy-2':
        return (
          <svg className="w-36 h-10 mx-auto" viewBox="0 0 160 45" fill="none">
            <path 
              d="M10 25 C30 5, 45 40, 60 18 C75 -2, 90 42, 110 20 C125 5, 140 35, 155 22 M35 30 Q70 12 145 28" 
              stroke={template.primaryColor} 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'calligraphy-3':
        return (
          <svg className="w-36 h-10 mx-auto" viewBox="0 0 160 45" fill="none">
            <path 
              d="M15 32 C25 10, 40 10, 55 25 C70 40, 80 5, 105 18 C130 30, 145 12, 150 25 M20 22 L140 22" 
              stroke={template.primaryColor} 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        );
      case 'calligraphy-4':
        return (
          <svg className="w-36 h-10 mx-auto" viewBox="0 0 160 45" fill="none">
            <path 
              d="M12 28 C28 12, 38 35, 50 15 C65 -5, 80 40, 100 22 C120 5, 135 30, 152 18 M25 35 Q85 20 135 35" 
              stroke={template.primaryColor} 
              strokeWidth="2.4" 
              strokeLinecap="round"
            />
          </svg>
        );
      case 'seal':
        return (
          <div className="h-10 mx-auto flex items-center justify-center gap-1">
            <span 
              className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded border uppercase"
              style={{ borderColor: template.accentColor, color: template.primaryColor }}
            >
              FIRMADO ELECTRÓNICAMENTE NOM-024
            </span>
          </div>
        );
      case 'calligraphy-1':
      default:
        return (
          <svg className="w-36 h-10 mx-auto" viewBox="0 0 160 45" fill="none">
            <path 
              d="M12 28 C35 8, 48 38, 65 14 C80 -5, 95 38, 115 15 C130 -2, 142 32, 150 20 M20 34 L138 26" 
              stroke={template.primaryColor} 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        );
    }
  };

  // Helper for Institutional Seal Badge
  const renderSeal = () => {
    if (template.sealType === 'none') return null;

    if (template.sealType === 'digital-hologram') {
      return (
        <div 
          className="w-18 h-18 rounded-full flex flex-col items-center justify-center p-1 text-center shadow-md relative overflow-hidden"
          style={{
            background: `radial-gradient(circle, #ffffff 30%, ${template.accentColor}30 70%, ${template.accentColor} 100%)`,
            border: `2px solid ${template.accentColor}`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none" />
          <ShieldCheck className="w-6 h-6 mb-0.5" style={{ color: template.primaryColor }} />
          <span className="text-[7px] font-black uppercase tracking-wider" style={{ color: template.primaryColor }}>
            VALIDEZ OFICIAL
          </span>
          <span className="text-[6px] font-mono font-bold" style={{ color: template.accentColor }}>
            NOM-024
          </span>
        </div>
      );
    }

    if (template.sealType === 'cupn-shield') {
      return (
        <div 
          className="w-18 h-18 rounded-full flex flex-col items-center justify-center p-1 text-center shadow-md border-2"
          style={{
            backgroundColor: '#ffffff',
            borderColor: template.primaryColor
          }}
        >
          <Award className="w-6 h-6 mb-0.5" style={{ color: template.accentColor }} />
          <span className="text-[7px] font-black uppercase tracking-tighter" style={{ color: template.primaryColor }}>
            CUPN CONECTA
          </span>
          <span className="text-[6px] font-bold text-slate-500">
            PRIMER NIVEL
          </span>
        </div>
      );
    }

    if (template.sealType === 'nom024-badge') {
      return (
        <div 
          className="w-18 h-18 rounded-2xl flex flex-col items-center justify-center p-1 text-center shadow-md border-2 rotate-2"
          style={{
            backgroundColor: '#FAF5ED',
            borderColor: template.accentColor
          }}
        >
          <CheckCircle2 className="w-6 h-6 mb-0.5" style={{ color: template.primaryColor }} />
          <span className="text-[7px] font-black uppercase tracking-wider" style={{ color: template.primaryColor }}>
            ACREDITADO
          </span>
          <span className="text-[6px] font-mono font-extrabold" style={{ color: template.accentColor }}>
            IMSS SALUD
          </span>
        </div>
      );
    }

    // Default: 'imss-gold'
    return (
      <div 
        className="w-18 h-18 rounded-full flex flex-col items-center justify-center p-1 text-center shadow-md relative"
        style={{
          backgroundColor: '#FFFFFF',
          border: `3px double ${template.accentColor}`,
          boxShadow: `0 0 0 2px ${template.primaryColor}20`
        }}
      >
        <Sparkles className="w-5 h-5 mb-0.5" style={{ color: template.accentColor }} />
        <span className="text-[7px] font-black uppercase tracking-wider" style={{ color: template.primaryColor }}>
          SELLO OFICIAL
        </span>
        <span className="text-[6px] font-bold uppercase tracking-widest" style={{ color: template.accentColor }}>
          IMSS &bull; CUPN
        </span>
      </div>
    );
  };

  return (
    <div 
      className={`p-6 sm:p-10 text-center rounded-xl relative shadow-inner overflow-hidden select-none transition-all ${className}`}
      style={{
        backgroundColor: template.backgroundColor,
        ...getBorderStyle()
      }}
    >
      {/* Background Watermark (Escudo IMSS translúcido) */}
      {template.showWatermark && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: template.watermarkOpacity || 0.08 }}
        >
          <div className="scale-200 transform">
            <ImssLogo size="xl" showText={false} />
          </div>
        </div>
      )}

      {/* Decorative Ornate Corners for 'ornate-gold' border */}
      {template.borderFamily === 'ornate-gold' && (
        <>
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: template.accentColor }} />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: template.accentColor }} />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: template.accentColor }} />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: template.accentColor }} />
        </>
      )}

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Header with IMSS Official Logo & Institutional Title */}
        <div className="flex flex-col items-center justify-center mb-3">
          {template.showLogo && (
            <div className="mb-2">
              <ImssLogo size={template.logoSize || 'xl'} showText={false} />
            </div>
          )}

          <h1 
            className={`text-sm sm:text-base font-extrabold uppercase tracking-widest mt-1 ${fontClass}`}
            style={{ color: template.primaryColor }}
          >
            {template.institutionName || 'INSTITUTO MEXICANO DEL SEGURO SOCIAL'}
          </h1>
          
          <p 
            className="text-[11px] sm:text-xs font-bold tracking-wider uppercase mt-0.5"
            style={{ color: template.primaryColor }}
          >
            {template.coordinationName || 'Coordinación de Unidades de Primer Nivel (CUPN)'}
          </p>

          <div className="flex items-center gap-2 mt-1 flex-wrap justify-center">
            <span 
              className="text-[11px] font-black tracking-wide uppercase"
              style={{ color: template.accentColor }}
            >
              {template.platformName || 'CUPN Conecta'}
            </span>
            {template.slogan && (
              <>
                <span className="text-slate-400 text-xs">&bull;</span>
                <span className="text-[10px] text-slate-600 italic font-medium">
                  {template.slogan}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Document Type Ribbon / Divider */}
        <div className="my-3 flex items-center justify-center gap-3 w-full max-w-lg">
          <div className="h-0.5 flex-1" style={{ backgroundColor: template.accentColor }} />
          <span 
            className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-extrabold px-2 text-center"
            style={{ color: template.primaryColor }}
          >
            {template.documentTypeTitle || 'CONSTANCIA DE ACREDITACIÓN ACADÉMICA'}
          </span>
          <div className="h-0.5 flex-1" style={{ backgroundColor: template.accentColor }} />
        </div>

        {/* Introductory Clause */}
        <p className="text-xs text-slate-600 mb-3 italic max-w-xl mx-auto leading-relaxed">
          {template.introductoryText || 'La Coordinación de Unidades de Primer Nivel del IMSS, a través de la plataforma CUPN Conecta, otorga la presente a:'}
        </p>

        {/* Recipient / Student Name */}
        <div className="my-2">
          {template.studentHonorPrefix && (
            <span className="text-xs font-bold uppercase tracking-wider block text-slate-500 mb-0.5">
              {template.studentHonorPrefix}
            </span>
          )}
          <h2 
            className={`text-2xl sm:text-3xl font-extrabold mb-1 ${fontClass}`}
            style={{ 
              color: template.primaryColor,
              textDecorationLine: 'underline',
              textDecorationColor: template.accentColor,
              textDecorationThickness: '2px',
              textUnderlineOffset: '8px'
            }}
          >
            {attempt.studentName}
          </h2>
        </div>

        {/* Accreditation Clause */}
        <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mt-4 mb-4">
          {template.accreditationClause || 'Por haber cumplido y acreditado satisfactoriamente los objetivos de capacitación, evaluación automática y competencias clínicas del programa:'}
        </p>

        {/* Course Box / Score Badge */}
        <div 
          className="bg-white/95 p-3.5 sm:p-4 rounded-xl border inline-block mb-5 shadow-xs max-w-lg w-full"
          style={{ borderColor: `${template.accentColor}80` }}
        >
          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {attempt.courseTitle}
          </h3>

          {template.showScoreBox && (
            <div className="flex items-center justify-center gap-3 text-xs text-slate-600 mt-2 font-mono flex-wrap">
              <span>
                Calificación: <strong style={{ color: template.primaryColor }}>{attempt.percentage}%</strong>
              </span>
              <span style={{ color: template.accentColor }}>&bull;</span>
              <span>
                Puntaje: <strong>{attempt.score}/{attempt.maxScore} pts</strong>
              </span>
              <span style={{ color: template.accentColor }}>&bull;</span>
              <span 
                className="font-bold uppercase px-1.5 py-0.5 rounded text-[10px]"
                style={{ backgroundColor: `${template.primaryColor}15`, color: template.primaryColor }}
              >
                Acreditado
              </span>
            </div>
          )}
        </div>

        {/* Signatures & Institutional Seal Section */}
        <div 
          className="w-full mt-4 pt-5 border-t grid gap-4 items-end text-xs"
          style={{ 
            borderColor: `${template.accentColor}80`,
            gridTemplateColumns: activeSigners.length === 1 
              ? '1fr auto' 
              : activeSigners.length === 2 
              ? '1fr auto 1fr' 
              : 'repeat(4, minmax(0, 1fr))'
          }}
        >
          {/* Signer 1 */}
          {activeSigners[0] && (
            <div className="text-center">
              <div 
                className="h-10 border-b max-w-[170px] mx-auto mb-1 flex items-center justify-center font-bold"
                style={{ borderColor: 'rgba(100, 116, 139, 0.5)' }}
              >
                {renderSignature(activeSigners[0])}
              </div>
              <p className="font-bold text-slate-800 text-[11px]">{activeSigners[0].name}</p>
              <p className="text-[10px] text-slate-600 font-medium">{activeSigners[0].title}</p>
              <p className="text-[9px] text-slate-500">{activeSigners[0].department}</p>
            </div>
          )}

          {/* Central QR Code or Seal Stamp */}
          <div className="flex flex-col items-center justify-center gap-1.5 px-2">
            {template.showQrCode ? (
              <div 
                className="w-16 h-16 bg-white p-1 rounded-lg border shadow-2xs flex items-center justify-center"
                style={{ borderColor: template.accentColor }}
              >
                <QrCode className="w-12 h-12" style={{ color: template.primaryColor }} />
              </div>
            ) : (
              renderSeal()
            )}

            {template.showQrCode && (
              <p 
                className="text-[9px] font-mono font-bold tracking-tight"
                style={{ color: template.primaryColor }}
              >
                FOLIO: {(template.qrFolioPrefix || 'CUPN-')}{attempt.id.toUpperCase()}
              </p>
            )}
          </div>

          {/* Signer 2 */}
          {activeSigners[1] && (
            <div className="text-center">
              <div 
                className="h-10 border-b max-w-[170px] mx-auto mb-1 flex items-center justify-center font-bold"
                style={{ borderColor: 'rgba(100, 116, 139, 0.5)' }}
              >
                {renderSignature(activeSigners[1])}
              </div>
              <p className="font-bold text-slate-800 text-[11px]">{activeSigners[1].name}</p>
              <p className="text-[10px] text-slate-600 font-medium">{activeSigners[1].title}</p>
              <p className="text-[9px] text-slate-500">{activeSigners[1].department}</p>
            </div>
          )}

          {/* Signer 3 (if present) */}
          {activeSigners[2] && (
            <div className="text-center">
              <div 
                className="h-10 border-b max-w-[170px] mx-auto mb-1 flex items-center justify-center font-bold"
                style={{ borderColor: 'rgba(100, 116, 139, 0.5)' }}
              >
                {renderSignature(activeSigners[2])}
              </div>
              <p className="font-bold text-slate-800 text-[11px]">{activeSigners[2].name}</p>
              <p className="text-[10px] text-slate-600 font-medium">{activeSigners[2].title}</p>
              <p className="text-[9px] text-slate-500">{activeSigners[2].department}</p>
            </div>
          )}
        </div>

        {/* Institutional City, Slogan and Cryptographic Verification Footer */}
        <div className="w-full mt-6 pt-3 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-500 font-mono gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider font-sans" style={{ color: template.primaryColor }}>
              {template.cityAndDateText || 'Ciudad de México, D.F.'} &bull; {attempt.completedAt}
            </span>
          </div>

          {template.showCryptographicHash && (
            <div className="text-right">
              <span className="break-all opacity-85">
                {verificationHash}
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
