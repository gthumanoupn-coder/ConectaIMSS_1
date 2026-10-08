import React, { useState } from 'react';
import { ShieldCheck, Lock, X, AlertCircle, Check } from 'lucide-react';
import { User } from '../types/lms';

interface TwoFactorModalProps {
  isOpen: boolean;
  targetUser: User | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  isOpen,
  targetUser,
  onConfirm,
  onCancel
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Accept valid 6 digits
    if (code.length === 6 && /^\d+$/.test(code)) {
      setError(false);
      setCode('');
      onConfirm();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Verificación 2FA Requerida</h3>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-600 space-y-2">
          <p>
            El usuario <strong>{targetUser.name}</strong> tiene configurada la autenticación de dos factores.
          </p>
          <p className="text-[11px] text-slate-500">
            Ingresa el token de 6 dígitos de tu aplicación autenticadora (Google Authenticator / TOTP). 
            <span className="text-indigo-600 block mt-1">Tip de prueba: Ingresa cualquier código de 6 dígitos numéricos (ej. 123456).</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              autoFocus
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => {
                setError(false);
                setCode(e.target.value.replace(/\D/g, ''));
              }}
              className="w-full text-center tracking-[0.5em] font-mono text-xl py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-700 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Código inválido. Debe contener exactamente 6 dígitos numéricos.</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs"
            >
              Verificar Token
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
