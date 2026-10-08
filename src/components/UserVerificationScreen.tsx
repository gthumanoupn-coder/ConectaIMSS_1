import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  AlertCircle, 
  Search, 
  Check, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Building, 
  Sparkles,
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import { User, UserRole } from '../types/lms';
import { ImssLogo } from './ImssLogo';

interface UserVerificationScreenProps {
  users: User[];
  onVerifySuccess: (user: User) => void;
  onLogAudit?: (action: string, details: string, status: 'success' | 'warning' | 'alert') => void;
}

export const UserVerificationScreen: React.FC<UserVerificationScreenProps> = ({
  users,
  onVerifySuccess,
  onLogAudit
}) => {
  // Pre-select first user or allow selecting
  const [selectedUser, setSelectedUser] = useState<User>(() => users[0] || null);
  const [password, setPassword] = useState('123456');
  const [twoFactorCode, setTwoFactorCode] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const roleLabels: Record<UserRole, { title: string; badgeClass: string; roleDesc: string }> = {
    admin: { 
      title: 'Administrador Delegacional', 
      badgeClass: 'text-[#006657] bg-[#e6f0ee] border-[#006657]/40',
      roleDesc: 'Gestión total, control de usuarios, on-premise y catálogo institucional'
    },
    profesor: { 
      title: 'Profesor / Docente Titular', 
      badgeClass: 'text-[#a27e46] bg-[#FAF5ED] border-[#BC955C]/40',
      roleDesc: 'Diseño pedagógico, gestión de contenidos, foros y reactivos'
    },
    alumno: { 
      title: 'Alumno / Personal de Salud', 
      badgeClass: 'text-slate-800 bg-[#faf7f2] border-[#DDC9A3]',
      roleDesc: 'Capacitación médica continua, reproducción multimedia y exámenes'
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setErrorMessage(null);
    // Fill sample values for quick and seamless verification
    setPassword('123456');
    setTwoFactorCode('123456');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedUser) {
      setErrorMessage('Por favor, selecciona un usuario para verificar su identidad.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Debe ingresar la clave o PIN institucional de acceso.');
      return;
    }

    if (selectedUser.twoFactorEnabled) {
      if (!twoFactorCode.trim() || twoFactorCode.length !== 6 || !/^\d+$/.test(twoFactorCode)) {
        setErrorMessage('El usuario requiere autenticación 2FA. Ingrese el código numérico de 6 dígitos.');
        return;
      }
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      onLogAudit?.(
        'Verificación de Identidad e Ingreso',
        `Usuario ${selectedUser.name} (${selectedUser.email}) verificado con éxito. Sesión bloqueada a su espacio.`,
        'success'
      );
      onVerifySuccess(selectedUser);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f7f6] via-[#FAF9F6] to-[#eaeef0] text-slate-900 flex flex-col justify-between">
      
      {/* Top Institutional Header Ribbon */}
      <header className="bg-[#006657] text-white py-2 px-4 sm:px-8 border-b-2 border-[#BC955C] shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider uppercase text-[#DDC9A3]">
              Instituto Mexicano del Seguro Social
            </span>
            <span className="text-white/40 hidden sm:inline">&bull;</span>
            <span className="text-white/90 hidden sm:inline">
              Coordinación de Unidades de Primer Nivel (CUPN)
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#DDC9A3]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistema Central de Autenticación & Verificación NOM-024</span>
          </div>
        </div>
      </header>

      {/* Main Verification Card Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        
        {/* Institutional Title & Branding */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-md border border-slate-200 mb-2">
            <ImssLogo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Portal de Verificación y Acceso al Espacio Institucional
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Por directivas de seguridad informática del IMSS, debe verificar su identidad para ingresar a su espacio de trabajo. 
            <strong className="text-[#006657] font-semibold block sm:inline sm:ml-1">
              Una vez dentro, el cambio entre usuarios está bloqueado para preservar la integridad de las sesiones.
            </strong>
          </p>
        </div>

        {/* Security Alert Banner */}
        <div className="mb-6 bg-[#e6f0ee] border border-[#006657]/30 rounded-xl p-3 sm:p-4 text-xs text-[#006657] flex items-start gap-3 shadow-2xs">
          <ShieldCheck className="w-5 h-5 shrink-0 text-[#006657] mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-slate-900">
              Política de Seguridad de Sesión Única (CUPN Conecta)
            </p>
            <p className="text-slate-700">
              Seleccione su cuenta y valide sus credenciales para habilitar su espacio (alumnos, docentes o administración). La plataforma bloqueará el acceso cruzado entre cuentas durante su sesión activa.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Left Column: Personnel Directory Selection */}
          <div className="lg:col-span-7 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#006657]" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    1. Seleccione su Identidad IMSS
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {filteredUsers.length} usuario(s) disponibles
                </span>
              </div>

              {/* Search Bar & Role Filters */}
              <div className="space-y-2 mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, correo o clínica..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#006657] transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  <button
                    onClick={() => setRoleFilter('all')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      roleFilter === 'all'
                        ? 'bg-[#006657] text-white font-semibold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setRoleFilter('alumno')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      roleFilter === 'alumno'
                        ? 'bg-[#006657] text-white font-semibold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Alumnos
                  </button>
                  <button
                    onClick={() => setRoleFilter('profesor')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      roleFilter === 'profesor'
                        ? 'bg-[#006657] text-white font-semibold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Docentes
                  </button>
                  <button
                    onClick={() => setRoleFilter('admin')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      roleFilter === 'admin'
                        ? 'bg-[#006657] text-white font-semibold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Administración
                  </button>
                </div>
              </div>

              {/* Users List with interactive selection */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUser?.id === user.id;
                  const roleConfig = roleLabels[user.role] || roleLabels.alumno;

                  return (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-white border-[#006657] ring-2 ring-[#006657]/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="relative shrink-0">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200"
                          />
                          {isSelected && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#006657] text-white flex items-center justify-center text-[10px] ring-2 ring-white">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-slate-900 truncate">
                              {user.name}
                            </h3>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${roleConfig.badgeClass}`}>
                              {roleConfig.title}
                            </span>
                            {user.twoFactorEnabled && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                2FA Activo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={`text-[11px] font-semibold px-2 py-1 rounded-md ${
                          isSelected ? 'bg-[#006657] text-white' : 'text-slate-400'
                        }`}>
                          {isSelected ? 'Seleccionado' : 'Elegir'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <div className="p-6 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Unidades de Medicina Familiar & UMAE
              </span>
              <span className="font-mono">Versión 2.4.0-IMSS</span>
            </div>
          </div>

          {/* Right Column: Credential & Security Verification Form */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-white flex flex-col justify-between">
            {selectedUser ? (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Fingerprint className="w-4 h-4 text-[#006657]" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    2. Verificación de Credenciales
                  </h2>
                </div>

                {/* Selected Identity Card Summary */}
                <div className="p-3.5 bg-[#FAF5ED] rounded-xl border border-[#BC955C]/40 space-y-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#006657]/30"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {selectedUser.name}
                      </p>
                      <p className="text-[11px] text-slate-600 truncate">{selectedUser.email}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{selectedUser.department}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#BC955C]/20 text-[11px] text-slate-700">
                    <span className="font-semibold text-slate-900">Espacio Asignado: </span>
                    {selectedUser.role === 'alumno' && 'Mis Cursos, Evaluaciones y Diplomas'}
                    {selectedUser.role === 'profesor' && 'Gestión Docente, Creación de Cursos y Foros'}
                    {selectedUser.role === 'admin' && 'Administración Delegacional y Configuración'}
                  </div>
                </div>

                {/* Password / PIN input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#006657]" />
                      PIN o Contraseña Institucional
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Demo: 123456</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingrese contraseña o PIN"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#006657] font-mono tracking-wider"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Two Factor Authentication Input (if enabled) */}
                {selectedUser.twoFactorEnabled && (
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-700" />
                        Token de Seguridad 2FA (TOTP)
                      </label>
                      <span className="text-[10px] text-emerald-700 font-mono">Demo: 123456</span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Usuario con 2FA activo. Ingrese el código de 6 dígitos:
                    </p>
                    <input
                      type="text"
                      maxLength={6}
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full text-center tracking-[0.4em] font-mono font-bold text-base py-2 rounded-lg border border-emerald-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                      required
                    />
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Verification & Entry Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 px-4 bg-[#006657] hover:bg-[#004d41] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 border border-[#BC955C]/40 group disabled:opacity-60 cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verificando Identidad Criptográfica...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verificar Identidad e Ingresar al Espacio</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#BC955C]" />
                    <span>Aviso de Protección de Sesión:</span>
                  </div>
                  <p>
                    Una vez confirmada la verificación, ingresará al espacio del perfil seleccionado. 
                    Por seguridad, no se permitirá cambiar de usuario en la pantalla mientras la sesión esté activa.
                  </p>
                </div>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <UserCheck className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">
                  Seleccione un usuario de la lista izquierda
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Elija su cuenta para proceder con la verificación de identidad.
                </p>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-4 sm:px-8 text-center text-xs text-slate-500">
        <p>
          CUPN Conecta &bull; Instituto Mexicano del Seguro Social &bull; Servidor Institucional Seguro
        </p>
      </footer>

    </div>
  );
};
