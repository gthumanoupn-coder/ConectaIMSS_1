import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  ShieldCheck, 
  ChevronDown, 
  Menu, 
  X, 
  Lock,
  Palette,
  LogOut,
  ShieldAlert,
  UserCheck,
  Award,
  Users
} from 'lucide-react';
import { User, PushNotification } from '../types/lms';
import { ImssLogo } from './ImssLogo';

interface NavbarProps {
  currentUser: User;
  allUsers?: User[];
  onSwitchUser?: (user: User) => void;
  onLogout?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: PushNotification[];
  onOpenNotifications: () => void;
  onOpenCalendar: () => void;
  onOpen2FA: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers = [],
  onSwitchUser,
  onLogout,
  activeTab,
  setActiveTab,
  notifications,
  onOpenNotifications,
  onOpenCalendar,
  onOpen2FA,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [paletteTooltipOpen, setPaletteTooltipOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<string, { label: string; color: string; badge: string }> = {
    admin: { label: 'Administrador Delegacional', color: 'text-[#006657] bg-[#e6f0ee] border-[#006657]/30', badge: 'Admin' },
    profesor: { label: 'Profesor / Docente Titular', color: 'text-[#006657] bg-[#FAF5ED] border-[#BC955C]/40', badge: 'Docente' },
    alumno: { label: 'Alumno / Personal IMSS', color: 'text-slate-800 bg-[#faf7f2] border-[#DDC9A3]', badge: 'Alumno' }
  };

  const currentRole = roleLabels[currentUser.role] || roleLabels.alumno;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      
      {/* Top Institutional Header Ribbon with Official Pantone Colors */}
      <div className="bg-[#006657] text-white text-[11px] font-medium px-4 sm:px-6 py-1 flex items-center justify-between border-b border-[#BC955C]/30">
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold tracking-wider uppercase text-[#DDC9A3]">
            Instituto Mexicano del Seguro Social
          </span>
          <span className="hidden md:inline text-white/60">&bull;</span>
          <span className="hidden md:inline text-white/90">
            Coordinación de Unidades de Primer Nivel (CUPN)
          </span>
          <span className="hidden lg:inline text-[#DDC9A3]/80 italic">
            — "Conectando conocimiento, fortaleciendo servicios."
          </span>
        </div>

        {/* Pantone Palette Indicator Badge */}
        <div className="relative">
          <button
            onClick={() => setPaletteTooltipOpen(!paletteTooltipOpen)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-black/20 hover:bg-black/30 transition-colors border border-[#BC955C]/40 text-[#DDC9A3]"
            title="Especificaciones de color institucional"
          >
            <div className="flex items-center -space-x-1">
              <span className="w-2.5 h-2.5 rounded-full border border-white/50 bg-[#006657]" title="Pantone 561 C" />
              <span className="w-2.5 h-2.5 rounded-full border border-white/50 bg-[#BC955C]" title="Pantone 465 C" />
              <span className="w-2.5 h-2.5 rounded-full border border-white/50 bg-[#DDC9A3]" title="Pantone 468 C" />
            </div>
            <span className="hidden sm:inline font-mono">Pantone IMSS</span>
          </button>

          {paletteTooltipOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white text-slate-800 p-3 rounded-lg shadow-xl border border-slate-200 z-50 text-left animate-in fade-in zoom-in-95">
              <p className="text-[11px] font-bold text-slate-900 mb-2 border-b pb-1">
                Colores Institucionales IMSS
              </p>
              <div className="space-y-1.5 text-[10px] font-mono">
                <div className="flex items-center justify-between p-1 rounded bg-[#e6f0ee]">
                  <span className="flex items-center gap-1.5 font-bold text-[#006657]">
                    <span className="w-3 h-3 rounded-xs bg-[#006657]" /> Pantone 561 C
                  </span>
                  <span>#006657</span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-[#FAF5ED]">
                  <span className="flex items-center gap-1.5 font-bold text-[#a27e46]">
                    <span className="w-3 h-3 rounded-xs bg-[#BC955C]" /> Pantone 465 C
                  </span>
                  <span>#BC955C</span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-[#faf7f2]">
                  <span className="flex items-center gap-1.5 font-bold text-slate-700">
                    <span className="w-3 h-3 rounded-xs bg-[#DDC9A3]" /> Pantone 468 C
                  </span>
                  <span>#DDC9A3</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Brand title wordmark with official IMSS Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('courses')}
              className="flex items-center text-left focus-visible:outline-hidden group"
            >
              <ImssLogo size="md" />
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'courses' 
                  ? 'bg-[#006657] text-white font-semibold shadow-2xs' 
                  : 'text-slate-700 hover:text-[#006657] hover:bg-[#e6f0ee]/60'
              }`}
            >
              Catálogo de Cursos
            </button>

            {currentUser.role === 'alumno' && (
              <>
                <button
                  onClick={() => setActiveTab('my-courses')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'my-courses' 
                      ? 'bg-[#006657] text-white font-semibold shadow-2xs' 
                      : 'text-slate-700 hover:text-[#006657] hover:bg-[#e6f0ee]/60'
                  }`}
                >
                  Mis Capacitaciones
                </button>
                <button
                  onClick={() => setActiveTab('my-grades')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'my-grades' 
                      ? 'bg-[#006657] text-white font-semibold shadow-2xs' 
                      : 'text-slate-700 hover:text-[#006657] hover:bg-[#e6f0ee]/60'
                  }`}
                >
                  Calificaciones & Diplomas
                </button>
              </>
            )}

            {currentUser.role === 'profesor' && (
              <>
                <button
                  onClick={() => setActiveTab('course-management')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'course-management' 
                      ? 'bg-[#006657] text-white font-semibold shadow-2xs' 
                      : 'text-slate-700 hover:text-[#006657] hover:bg-[#e6f0ee]/60'
                  }`}
                >
                  Gestión Docente
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'analytics' 
                      ? 'bg-[#006657] text-white font-semibold shadow-2xs' 
                      : 'text-slate-700 hover:text-[#006657] hover:bg-[#e6f0ee]/60'
                  }`}
                >
                  Analíticas de Personal
                </button>
              </>
            )}

            {currentUser.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('course-management')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'course-management' 
                      ? 'bg-[#006657] text-white font-semibold shadow-2xs' 
                      : 'text-slate-700 hover:text-[#006657] hover:bg-[#e6f0ee]/60'
                  }`}
                >
                  Gestión de Cursos
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'analytics' 
                      ? 'bg-[#006657] text-white font-semibold shadow-2xs' 
                      : 'text-slate-700 hover:text-[#006657] hover:bg-[#e6f0ee]/60'
                  }`}
                >
                  Reportes Delegacionales
                </button>
                <button
                  onClick={() => setActiveTab('server-config')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'server-config' 
                      ? 'bg-[#006657] text-white font-semibold shadow-2xs' 
                      : 'text-slate-700 hover:text-[#006657] hover:bg-[#e6f0ee]/60'
                  }`}
                >
                  Servidor On-Premise
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Actions, Calendario, Notificaciones, 2FA y Perfil */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Calendario Externo Trigger */}
            <button
              onClick={onOpenCalendar}
              title="Calendario Académico y Sesiones Clínicas"
              className="p-2 text-slate-600 hover:text-[#006657] hover:bg-[#e6f0ee] rounded-lg transition-colors relative"
            >
              <Calendar className="w-5 h-5" />
            </button>

            {/* Notificaciones Push Trigger */}
            <button
              onClick={onOpenNotifications}
              title="Avisos y Recordatorios Institucionales"
              className="p-2 text-slate-600 hover:text-[#006657] hover:bg-[#e6f0ee] rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#006657] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono ring-1 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 2FA Status Badge & Trigger */}
            <button
              onClick={onOpen2FA}
              title="Seguridad 2FA y Cifrado AES-256"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ShieldCheck className={`w-4 h-4 ${currentUser.twoFactorEnabled ? 'text-[#006657]' : 'text-[#BC955C]'}`} />
              <span className="hidden xl:inline">2FA:</span>
              <span className={currentUser.twoFactorEnabled ? 'text-[#006657] font-semibold' : 'text-[#BC955C] font-semibold'}>
                {currentUser.twoFactorEnabled ? 'Activo' : 'Pendiente'}
              </span>
            </button>

            {/* User Profile & Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center gap-2 p-1.5 pl-2.5 rounded-lg border transition-all text-left ${
                  currentUser.role === 'admin' && (activeTab === 'users' || activeTab === 'certificate-designer' || activeTab === 'security')
                    ? 'border-[#006657] bg-[#e6f0ee]/50 ring-2 ring-[#006657]/20 shadow-xs'
                    : 'border-slate-200 hover:border-[#006657]/40 bg-white'
                }`}
                title={currentUser.role === 'admin' ? 'Menú de usuario y herramientas de Administrador' : 'Menú de usuario'}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-[#006657]/30"
                />
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-semibold text-slate-900 leading-tight max-w-[120px] truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize flex items-center gap-1">
                    <span>{currentUser.role}</span>
                    {currentUser.role === 'admin' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006657]" title="Acciones de administrador disponibles"></span>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <>
                  {/* Backdrop for outside click dismiss */}
                  <div 
                    className="fixed inset-0 z-40 bg-black/5" 
                    onClick={() => setUserDropdownOpen(false)} 
                  />

                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Rol activo:</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${currentRole.color}`}>
                          {currentRole.label}
                        </span>
                      </div>
                    </div>

                    {/* Session Protection & Locked User Identity Notice */}
                    <div className="px-3.5 py-2.5 border-b border-slate-100 bg-[#e6f0ee]/40 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#006657]">
                        <ShieldCheck className="w-4 h-4 text-[#006657]" />
                        <span>Identidad Verificada & Protegida</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        El cambio de usuario está deshabilitado durante la sesión por directiva de seguridad del IMSS (NOM-024).
                      </p>
                    </div>

                    <div className="px-2 pt-2 space-y-1">
                      {/* ADMINISTRATOR MODULES IN DROPDOWN */}
                      {currentUser.role === 'admin' && (
                        <div className="p-1.5 bg-[#FAF5ED]/60 rounded-lg border border-[#DDC9A3]/50 space-y-1 mb-2">
                          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#006657] flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#006657]" />
                              <span>Gestión de Administrador</span>
                            </span>
                            <span className="text-[9px] bg-[#006657] text-white px-1.5 py-0.2 rounded font-semibold">Exclusivo</span>
                          </div>

                          {/* Control de Usuarios */}
                          <button
                            onClick={() => {
                              setActiveTab('users');
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-md transition-all ${
                              activeTab === 'users'
                                ? 'bg-[#006657] text-white font-semibold shadow-xs'
                                : 'text-slate-800 hover:bg-white hover:text-[#006657]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1 rounded ${activeTab === 'users' ? 'bg-white/20' : 'bg-[#006657]/10'}`}>
                                <Users className={`w-3.5 h-3.5 ${activeTab === 'users' ? 'text-white' : 'text-[#006657]'}`} />
                              </div>
                              <div className="text-left">
                                <div className="font-semibold leading-tight">Control de Usuarios</div>
                                <div className={`text-[10px] ${activeTab === 'users' ? 'text-white/80' : 'text-slate-500'}`}>
                                  Altas, roles, matrículas y contraseñas
                                </div>
                              </div>
                            </div>
                            {activeTab === 'users' && (
                              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-medium">Activo</span>
                            )}
                          </button>

                          {/* Diseño de Diplomas */}
                          <button
                            onClick={() => {
                              setActiveTab('certificate-designer');
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-md transition-all ${
                              activeTab === 'certificate-designer'
                                ? 'bg-[#006657] text-white font-semibold shadow-xs'
                                : 'text-slate-800 hover:bg-white hover:text-[#006657]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1 rounded ${activeTab === 'certificate-designer' ? 'bg-white/20' : 'bg-[#BC955C]/20'}`}>
                                <Award className={`w-3.5 h-3.5 ${activeTab === 'certificate-designer' ? 'text-white' : 'text-[#BC955C]'}`} />
                              </div>
                              <div className="text-left">
                                <div className="font-semibold leading-tight">Diseño de Diplomas</div>
                                <div className={`text-[10px] ${activeTab === 'certificate-designer' ? 'text-white/80' : 'text-slate-500'}`}>
                                  Editor institucional, firmas y sellos
                                </div>
                              </div>
                            </div>
                            {activeTab === 'certificate-designer' && (
                              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-medium">Activo</span>
                            )}
                          </button>

                          {/* Panel de Cifrado y Auditoría */}
                          <button
                            onClick={() => {
                              setActiveTab('security');
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-md transition-all ${
                              activeTab === 'security'
                                ? 'bg-[#006657] text-white font-semibold shadow-xs'
                                : 'text-slate-800 hover:bg-white hover:text-[#006657]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1 rounded ${activeTab === 'security' ? 'bg-white/20' : 'bg-[#006657]/10'}`}>
                                <ShieldAlert className={`w-3.5 h-3.5 ${activeTab === 'security' ? 'text-white' : 'text-[#006657]'}`} />
                              </div>
                              <div className="text-left">
                                <div className="font-semibold leading-tight">Cifrado & Auditoría</div>
                                <div className={`text-[10px] ${activeTab === 'security' ? 'text-white/80' : 'text-slate-500'}`}>
                                  Bitácora NOM-024 y llaves criptográficas
                                </div>
                              </div>
                            </div>
                            {activeTab === 'security' && (
                              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-medium">Activo</span>
                            )}
                          </button>
                        </div>
                      )}

                      {/* General User Actions */}
                      <button
                        onClick={() => {
                          onOpen2FA();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#006657]" />
                        <span>Configurar 2FA y Llaves Criptográficas</span>
                      </button>

                      {onLogout && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded-md transition-colors font-semibold mt-1 border-t border-slate-100 pt-2"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-600" />
                          <span>Cerrar Sesión y Salir del Espacio</span>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg md:hidden"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top duration-150">
          <div className="p-3 bg-[#FAF5ED] rounded-lg mb-3 flex items-center justify-between border border-[#DDC9A3]">
            <div className="flex items-center gap-2">
              <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full ring-1 ring-[#006657]" />
              <div>
                <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-600 capitalize">{currentUser.role} &bull; {currentUser.department}</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${currentRole.color}`}>
              {currentRole.badge}
            </span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => { setActiveTab('courses'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${activeTab === 'courses' ? 'bg-[#006657] text-white' : 'text-slate-700'}`}
            >
              Catálogo de Cursos
            </button>

            {currentUser.role === 'alumno' && (
              <>
                <button
                  onClick={() => { setActiveTab('my-courses'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${activeTab === 'my-courses' ? 'bg-[#006657] text-white' : 'text-slate-700'}`}
                >
                  Mis Capacitaciones
                </button>
                <button
                  onClick={() => { setActiveTab('my-grades'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${activeTab === 'my-grades' ? 'bg-[#006657] text-white' : 'text-slate-700'}`}
                >
                  Calificaciones & Diplomas
                </button>
              </>
            )}

            {currentUser.role === 'profesor' && (
              <>
                <button
                  onClick={() => { setActiveTab('course-management'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${activeTab === 'course-management' ? 'bg-[#006657] text-white' : 'text-slate-700'}`}
                >
                  Gestión Docente
                </button>
                <button
                  onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${activeTab === 'analytics' ? 'bg-[#006657] text-white' : 'text-slate-700'}`}
                >
                  Analíticas de Personal
                </button>
              </>
            )}

            {currentUser.role === 'admin' && (
              <>
                <button
                  onClick={() => { setActiveTab('course-management'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${activeTab === 'course-management' ? 'bg-[#006657] text-white' : 'text-slate-700'}`}
                >
                  Gestión y Eliminación de Cursos
                </button>
                <button
                  onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${activeTab === 'analytics' ? 'bg-[#006657] text-white' : 'text-slate-700'}`}
                >
                  Reportes Delegacionales
                </button>
                <button
                  onClick={() => { setActiveTab('server-config'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${activeTab === 'server-config' ? 'bg-[#006657] text-white' : 'text-slate-700'}`}
                >
                  Servidor Local Hospitalario
                </button>

                {/* Submódulo de Menú de Administrador */}
                <div className="pt-2 mt-1 border-t border-slate-200 bg-[#FAF5ED]/50 p-2 rounded-lg space-y-1">
                  <div className="px-2 py-0.5 text-[10px] font-bold text-[#006657] uppercase tracking-wider flex items-center justify-between">
                    <span>Herramientas de Administrador</span>
                    <span className="text-[9px] bg-[#006657] text-white px-1.5 py-0.2 rounded font-semibold">Exclusivo</span>
                  </div>
                  <button
                    onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-2.5 py-2 text-xs font-medium rounded-md flex items-center gap-2 ${activeTab === 'users' ? 'bg-[#006657] text-white font-semibold' : 'text-slate-700 hover:bg-white'}`}
                  >
                    <Users className={`w-4 h-4 ${activeTab === 'users' ? 'text-white' : 'text-[#006657]'}`} />
                    <span>Control de Usuarios</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('certificate-designer'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-2.5 py-2 text-xs font-medium rounded-md flex items-center gap-2 ${activeTab === 'certificate-designer' ? 'bg-[#006657] text-white font-semibold' : 'text-slate-700 hover:bg-white'}`}
                  >
                    <Award className={`w-4 h-4 ${activeTab === 'certificate-designer' ? 'text-white' : 'text-[#BC955C]'}`} />
                    <span>Diseño de Diplomas</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('security'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-2.5 py-2 text-xs font-medium rounded-md flex items-center gap-2 ${activeTab === 'security' ? 'bg-[#006657] text-white font-semibold' : 'text-slate-700 hover:bg-white'}`}
                  >
                    <ShieldAlert className={`w-4 h-4 ${activeTab === 'security' ? 'text-white' : 'text-[#006657]'}`} />
                    <span>Cifrado AES-256 & Auditoría</span>
                  </button>
                </div>
              </>
            )}

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => { onOpenCalendar(); setMobileMenuOpen(false); }}
                className="flex-1 py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 rounded-md text-center"
              >
                Calendario
              </button>
              <button
                onClick={() => { onOpenNotifications(); setMobileMenuOpen(false); }}
                className="flex-1 py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 rounded-md text-center"
              >
                Avisos ({unreadCount})
              </button>
            </div>

            {/* Mobile Session Notice & Logout */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="p-2.5 bg-[#e6f0ee]/60 rounded-lg text-[11px] text-[#006657] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-tight">
                  Identidad verificada: cambio de usuario deshabilitado en esta sesión.
                </span>
              </div>
              {onLogout && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Cerrar Sesión y Salir del Espacio</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
