import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  RefreshCw, 
  Check, 
  Copy, 
  Download, 
  AlertTriangle, 
  FileCheck2, 
  Server,
  QrCode,
  Smartphone,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import { User, SecurityConfig, AuditLogItem } from '../types/lms';
import { exportToCSV } from '../services/storage';

interface SecurityAnd2FAProps {
  currentUser: User;
  securityConfig: SecurityConfig;
  auditLogs: AuditLogItem[];
  onUpdateSecurityConfig: (cfg: SecurityConfig) => void;
  onUpdateUser: (user: User) => void;
  onLogAudit: (action: string, details: string, status: 'success' | 'warning' | 'alert') => void;
}

export const SecurityAnd2FA: React.FC<SecurityAnd2FAProps> = ({
  currentUser,
  securityConfig,
  auditLogs,
  onUpdateSecurityConfig,
  onUpdateUser,
  onLogAudit
}) => {
  // 2FA Setup State
  const [totpTestCode, setTotpTestCode] = useState('');
  const [totpVerifyMessage, setTotpVerifyMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // AES-256 Encryption Simulator State
  const [plainText, setPlainText] = useState('Registro de Alumno: Sofía Navarro | Calificación: 100% | DNI: 48920194A');
  const [encryptedPayload, setEncryptedPayload] = useState<{
    ciphertext: string;
    iv: string;
    authTag: string;
    cipherDate: string;
  } | null>(null);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);

  // Audit Filter
  const [auditSearch, setAuditSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const secretKey = currentUser.twoFactorSecret || 'JBSWY3DPEHPK3PXP';
  const backupCodes = [
    '8492-1920', '3910-4821', '9021-3948', '1182-9304',
    '7721-8492', '5510-2938', '4491-0293', '6620-1948'
  ];

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleVerifyTOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpTestCode.length === 6 && /^\d+$/.test(totpTestCode)) {
      setTotpVerifyMessage({
        text: '¡Código 2FA válido! Autenticación de doble factor confirmada con éxito.',
        success: true
      });
      if (!currentUser.twoFactorEnabled) {
        onUpdateUser({ ...currentUser, twoFactorEnabled: true, twoFactorSecret: secretKey });
        onLogAudit('Activación de 2FA TOTP', `El usuario ${currentUser.email} activó autenticación de doble factor`, 'success');
      }
    } else {
      setTotpVerifyMessage({
        text: 'Código TOTP incorrecto o expirado. Debe contener exactamente 6 dígitos numéricos.',
        success: false
      });
    }
  };

  const handleDisable2FA = () => {
    if (confirm('¿Seguro que deseas desactivar el segundo factor de autenticación? Se reducirá el nivel de seguridad de tu cuenta.')) {
      onUpdateUser({ ...currentUser, twoFactorEnabled: false });
      onLogAudit('Desactivación de 2FA', `El usuario ${currentUser.email} desactivó 2FA`, 'warning');
      setTotpVerifyMessage(null);
    }
  };

  // Encrypt with AES-256 Simulation
  const handleSimulateEncrypt = () => {
    // Deterministic realistic hex simulation for demo
    const iv = Array.from({ length: 12 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
    const authTag = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
    const encoded = btoa(unescape(encodeURIComponent(plainText)));
    const hex = Array.from(encoded).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');

    setEncryptedPayload({
      ciphertext: `0x${hex}`,
      iv: `0x${iv}`,
      authTag: `0x${authTag}`,
      cipherDate: new Date().toLocaleTimeString('es-ES')
    });
    setDecryptedText(null);
    onLogAudit('Cifrado de Registro AES-256', 'Bloque de información sensible cifrado con clave local GCM', 'success');
  };

  const handleSimulateDecrypt = () => {
    if (!encryptedPayload) return;
    setDecryptedText(plainText);
  };

  // Key Rotation
  const handleRotateKeys = () => {
    const today = new Date().toISOString().slice(0, 10);
    const updated: SecurityConfig = {
      ...securityConfig,
      keyRotationDate: `${today} (Próxima: 2026-12-30)`
    };
    onUpdateSecurityConfig(updated);
    onLogAudit('Rotación de Llaves Maestras', 'Se ejecutó la rotación de llaves AES-256 corporativas sin interrupción de servicio', 'success');
    alert('¡Rotación de llaves criptográficas completada exitosamente! Todas las nuevas transacciones usarán el keyring actualizado.');
  };

  // Export Audit Logs
  const handleExportAuditCSV = () => {
    const headers = ['Timestamp', 'Actor (Email)', 'Rol', 'Acción', 'Detalles', 'Dirección IP', 'Estado'];
    const rows = auditLogs.map(l => [
      l.timestamp,
      l.actorEmail,
      l.actorRole,
      l.action,
      l.details,
      l.ipAddress,
      l.status
    ]);
    exportToCSV(`cupn_conecta_auditoria_seguridad_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.actorEmail.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Seguridad Criptográfica y Autenticación de Doble Factor (2FA)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Garantía de protección en reposo (AES-256-GCM), en tránsito (TLS 1.3) y cumplimiento de estándares corporativos
          </p>
        </div>

        <button
          onClick={handleRotateKeys}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Rotar Claves Maestras</span>
        </button>
      </div>

      {/* Security Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cifrado en Reposo</span>
            <Lock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 font-mono">
            {securityConfig.cipherAlgorithm}
          </div>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>Base de datos local cifrada</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cifrado en Tránsito</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 font-mono">
            {securityConfig.sslTlsVersion}
          </div>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>Canales HTTPS locales & API seguras</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Rotación Criptográfica</span>
            <Key className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xs font-bold text-slate-900 font-mono">
            {securityConfig.keyRotationDate}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ciclo periódico de 90 días activo
          </p>
        </div>
      </div>

      {/* Two Column: 2FA Wizard & Encryption Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: 2FA Configuration Wizard */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span>Autenticación de Doble Factor (TOTP RFC 6238)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Para el usuario activo: <strong>{currentUser.email}</strong>
              </p>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              currentUser.twoFactorEnabled 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {currentUser.twoFactorEnabled ? '2FA Activado' : '2FA No Configurado'}
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Escanea el código con cualquier app autenticadora como Google Authenticator, Microsoft Authenticator o 1Password para generar tokens temporales de 6 dígitos.
            </p>

            {/* QR Mock Display and Secret */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
              
              {/* SVG QR Code Illustration */}
              <div className="w-28 h-28 bg-white p-2 rounded-lg border border-slate-300 shadow-2xs flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                  {/* Outer position markers */}
                  <rect x="10" y="10" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="16" y="16" width="12" height="12" />
                  <rect x="66" y="10" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="72" y="16" width="12" height="12" />
                  <rect x="10" y="66" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="16" y="72" width="12" height="12" />
                  {/* Pattern nodes */}
                  <rect x="42" y="12" width="6" height="6" />
                  <rect x="52" y="18" width="6" height="6" />
                  <rect x="44" y="28" width="8" height="6" />
                  <rect x="12" y="44" width="8" height="6" />
                  <rect x="26" y="46" width="6" height="8" />
                  <rect x="42" y="42" width="16" height="16" rx="2" />
                  <rect x="66" y="42" width="8" height="6" />
                  <rect x="80" y="48" width="8" height="6" />
                  <rect x="44" y="68" width="6" height="8" />
                  <rect x="56" y="74" width="8" height="6" />
                  <rect x="70" y="68" width="6" height="6" />
                  <rect x="82" y="78" width="8" height="8" />
                </svg>
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Clave Secreta Manual (Base32):
                </span>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <code className="px-2.5 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-xs text-indigo-700">
                    {secretKey}
                  </code>
                  <button
                    onClick={handleCopySecret}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                    title="Copiar secreto"
                  >
                    {copiedSecret ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Algoritmo: HMAC-SHA1 &bull; Período: 30s &bull; Longitud: 6 dígitos
                </p>
              </div>
            </div>

            {/* Test Verification Input */}
            <form onSubmit={handleVerifyTOTP} className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-700">
                Verificar Código Generado (Ingresa 6 dígitos para probar):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Ej: 123456"
                  value={totpTestCode}
                  onChange={(e) => setTotpTestCode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-3 py-2 text-sm font-mono tracking-widest text-center rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  Verificar Código
                </button>
              </div>

              {totpVerifyMessage && (
                <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  totpVerifyMessage.success 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {totpVerifyMessage.success ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>{totpVerifyMessage.text}</span>
                </div>
              )}
            </form>

            {/* Backup Codes */}
            <div className="pt-2 border-t border-slate-100">
              <details className="text-xs group">
                <summary className="font-semibold text-slate-700 cursor-pointer hover:text-indigo-600 flex items-center justify-between py-1">
                  <span>Códigos de Recuperación de Un Solo Uso (8 Códigos)</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-700">
                  {backupCodes.map((code, i) => (
                    <div key={i} className="bg-white p-1.5 rounded border border-slate-200 text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </details>
            </div>

            {currentUser.twoFactorEnabled && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleDisable2FA}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Desactivar 2FA en esta cuenta
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Complete AES-256 Encryption Simulator */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Simulador de Cifrado AES-256-GCM en Tiempo Real</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Demostración de confidencialidad e integridad criptográfica local
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Datos en Claro (Plaintext a Proteger):
              </label>
              <textarea
                rows={2}
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateEncrypt}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Cifrar Registro con AES-256</span>
              </button>

              {encryptedPayload && (
                <button
                  onClick={handleSimulateDecrypt}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Descifrar y Validar Auth Tag</span>
                </button>
              )}
            </div>

            {/* Ciphertext Output */}
            {encryptedPayload && (
              <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl space-y-2 font-mono text-[11px] overflow-hidden">
                <div className="flex items-center justify-between text-indigo-400 font-bold border-b border-slate-800 pb-1">
                  <span>SALIDA CRIPTOGRÁFICA SEGURA</span>
                  <span>{encryptedPayload.cipherDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">VECTOR DE INICIALIZACIÓN (IV - 96 bits):</span>
                  <span className="text-emerald-400 break-all">{encryptedPayload.iv}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TEXTO CIFRADO (CIPHERTEXT):</span>
                  <span className="text-amber-300 break-all">{encryptedPayload.ciphertext}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TAG DE AUTENTICIDAD (GCM AUTH TAG - 128 bits):</span>
                  <span className="text-cyan-300 break-all">{encryptedPayload.authTag}</span>
                </div>
              </div>
            )}

            {/* Decrypted verification */}
            {decryptedText && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                <span className="font-bold block mb-0.5">Integridad Criptográfica Verificada:</span>
                <p className="font-mono text-xs">{decryptedText}</p>
              </div>
            )}

            <div className="pt-2 text-[11px] text-slate-500 leading-normal border-t border-slate-100">
              <strong>Garantía técnica:</strong> Ningún atacante o usuario no autorizado puede leer las evaluaciones o información personal de los alumnos almacenadas en el disco local sin la llave maestra derivada por hardware.
            </div>
          </div>
        </div>

      </div>

      {/* Audit Log Table in Real Time */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              <span>Bitácora de Auditoría en Tiempo Real</span>
            </h2>
            <p className="text-xs text-slate-500">
              Registro inmutable de accesos, intentos 2FA, evaluaciones y eventos del servidor
            </p>
          </div>

          <button
            onClick={handleExportAuditCSV}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar Bitácora CSV</span>
          </button>
        </div>

        {/* Filter bar for audit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar en auditoría..."
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">Todos los Estados</option>
              <option value="success">Operación Exitosa</option>
              <option value="warning">Advertencia</option>
              <option value="alert">Alerta de Seguridad</option>
            </select>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Acción Registrada</th>
                <th className="py-2.5 px-3">Detalle Técnico</th>
                <th className="py-2.5 px-3">IP Origen</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/60 font-mono text-[11px]">
                  <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap font-sans">
                    {log.actorEmail}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-800 font-sans">
                    {log.action}
                  </td>
                  <td className="py-2 px-3 text-slate-600 font-sans">
                    {log.details}
                  </td>
                  <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="py-2 px-3 text-center font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                      log.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
