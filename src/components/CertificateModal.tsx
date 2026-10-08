import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { QuizAttempt, CertificateTemplate } from '../types/lms';
import { StorageService } from '../services/storage';
import { CertificateDocument } from './CertificateDocument';

interface CertificateModalProps {
  attempt: QuizAttempt | null;
  template?: CertificateTemplate;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  attempt,
  template,
  onClose
}) => {
  if (!attempt) return null;

  // Use provided template or load the administrator's configured template from storage
  const activeTemplate = template || StorageService.getCertificateTemplate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl border border-[#006657]/30 space-y-4 animate-in fade-in zoom-in-95 max-h-[94vh] overflow-y-auto">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between no-print pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#006657]">
            <CheckCircle2 className="w-4 h-4 text-[#006657]" />
            <span>Documento Oficial Avalado por el Instituto Mexicano del Seguro Social</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-[#FAF5ED] text-[#BC955C] border border-[#BC955C]/40 font-mono">
              NOM-024-SSA3
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#006657] hover:bg-[#004d41] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Imprimir documento oficial o guardar como PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Institutional Diploma Component */}
        <CertificateDocument
          attempt={attempt}
          template={activeTemplate}
          className="w-full"
        />

        {/* Bottom verification badge */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 no-print">
          <div className="flex items-center gap-1 text-[11px]">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verificación delegacional activa &bull; Folio digital emitido por CUPN Conecta</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Diseño validado por la Administración IMSS
          </span>
        </div>

      </div>
    </div>
  );
};
