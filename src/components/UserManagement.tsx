import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Key, 
  Lock, 
  Search, 
  Filter, 
  Download, 
  Check, 
  X, 
  Edit2, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck,
  Building,
  Mail,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { User, UserRole } from '../types/lms';
import { exportToCSV } from '../services/storage';

const PRESET_AVATARS = [
  { label: 'Dra. Gabriela Solís (Educación en Salud)', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&h=256&q=80' },
  { label: 'Dr. Carlos Valenzuela (Epidemiología)', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&h=256&q=80' },
  { label: 'Ing. Mateo Arismendi (Tecnologías)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80' },
  { label: 'Dra. Sofía Navarro (Médico Familiar)', url: 'https://images.unsplash.com/photo-1594824813576-96a99281a8b9?auto=format&fit=crop&w=256&h=256&q=80' },
  { label: 'Lic. Diego Morales (Enfermería)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80' },
  { label: 'Dra. Camila Peña (Medicina Continua)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80' }
];

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onUpdateUsers: (users: User[]) => void;
  onLogAudit: (action: string, details: string, status: 'success' | 'warning' | 'alert') => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  currentUser,
  onUpdateUsers,
  onLogAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
    department: string;
    status: 'active' | 'suspended';
    twoFactorEnabled: boolean;
  }>({
    name: '',
    email: '',
    role: 'alumno',
    avatar: '',
    department: 'Coordinación de Unidades de Primer Nivel IMSS',
    status: 'active',
    twoFactorEnabled: false
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'alumno',
      avatar: PRESET_AVATARS[3].url, // default avatar
      department: 'Residencia Médica Familiar HGZ IMSS',
      status: 'active',
      twoFactorEnabled: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || PRESET_AVATARS[0].url,
      department: user.department,
      status: user.status,
      twoFactorEnabled: user.twoFactorEnabled
    });
    setIsModalOpen(true);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La fotografía no debe superar 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, avatar: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const avatarUrl = formData.avatar.trim() || (editingUser ? editingUser.avatar : PRESET_AVATARS[0].url);

    if (editingUser) {
      // Update existing
      const updated = users.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            ...formData,
            avatar: avatarUrl,
            twoFactorSecret: formData.twoFactorEnabled ? (u.twoFactorSecret || 'JBSWY3DPEHPK3PXP') : undefined
          };
        }
        return u;
      });
      onUpdateUsers(updated);
      onLogAudit('Actualización de Usuario y Fotografía', `Usuario ${formData.email} modificado con fotografía de perfil actualizada`, 'success');
    } else {
      // Create new
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar: avatarUrl,
        department: formData.department,
        status: formData.status,
        twoFactorEnabled: formData.twoFactorEnabled,
        twoFactorSecret: formData.twoFactorEnabled ? 'JBSWY3DPEHPK3PXP' : undefined,
        enrolledCourseIds: [],
        createdAt: new Date().toISOString().slice(0, 10),
        lastLogin: 'Nunca'
      };
      onUpdateUsers([...users, newUser]);
      onLogAudit('Creación de Usuario Institucional con Fotografía', `Nuevo usuario registrado: ${formData.email} con avatar institucional`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteUser = (id: string, email: string) => {
    if (id === currentUser.id) {
      alert('No puedes eliminar tu propia cuenta de administrador activa.');
      return;
    }
    if (confirm(`¿Estás seguro de desvincular al usuario ${email}?`)) {
      const updated = users.filter(u => u.id !== id);
      onUpdateUsers(updated);
      onLogAudit('Eliminación de Usuario', `Cuenta ${email} removida del servidor local`, 'warning');
    }
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const updated = users.map(u => u.id === user.id ? { ...u, status: newStatus as any } : u);
    onUpdateUsers(updated);
    onLogAudit('Cambio de Estado de Acceso', `Usuario ${user.email} marcado como ${newStatus}`, newStatus === 'suspended' ? 'warning' : 'success');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nombre', 'Email', 'Rol', 'Departamento', 'Estado', '2FA Habilitado', 'Fecha Creación', 'Último Acceso'];
    const rows = filteredUsers.map(u => [
      u.id,
      u.name,
      u.email,
      u.role,
      u.department,
      u.status,
      u.twoFactorEnabled ? 'Activo' : 'Inactivo',
      u.createdAt,
      u.lastLogin
    ]);
    exportToCSV(`cupn_conecta_directorio_usuarios_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Gestión Centralizada de Usuarios y Roles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Administración centralizada de accesos: Administrador, Profesores e Instructores, y Alumnos
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exportar Directorio CSV</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-2 bg-[#006657] hover:bg-[#004d41] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs border border-[#BC955C]/40"
          >
            <UserPlus className="w-4 h-4" />
            <span>Crear Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Role Counts Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Administradores</span>
            <p className="text-lg font-bold text-slate-900 font-mono">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Profesores / Docentes</span>
            <p className="text-lg font-bold text-slate-900 font-mono">
              {users.filter(u => u.role === 'profesor').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Alumnos / Estudiantes</span>
            <p className="text-lg font-bold text-slate-900 font-mono">
              {users.filter(u => u.role === 'alumno').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Todos los Roles</option>
            <option value="admin">Administrador</option>
            <option value="profesor">Profesor</option>
            <option value="alumno">Alumno</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Rol Asignado</th>
                <th className="py-3 px-4">Departamento</th>
                <th className="py-3 px-4 text-center">Seguridad 2FA</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4">Último Acceso</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map(user => {
                const roleBadge: Record<UserRole, { label: string; style: string }> = {
                  admin: { label: 'Administrador', style: 'text-rose-700 bg-rose-50 border-rose-200' },
                  profesor: { label: 'Profesor', style: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
                  alumno: { label: 'Alumno', style: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
                };

                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${roleBadge[user.role].style}`}>
                        {roleBadge[user.role].label}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {user.department}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {user.twoFactorEnabled ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Habilitado</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                          <span>Pendiente</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                          user.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {user.status === 'active' ? 'Activo' : 'Suspendido'}
                      </button>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {user.lastLogin}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 text-slate-500 hover:text-[#006657] hover:bg-[#e6f0ee] rounded transition-colors"
                          title="Editar usuario, rol y fotografía"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingUser ? 'Editar Cuenta y Rol' : 'Crear Nuevo Usuario Institucional'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              
              {/* Fotografía Institucional de Perfil */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Fotografía de Perfil del Usuario
                </label>
                
                <div className="flex items-center gap-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="relative shrink-0">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Fotografía"
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-[#006657] shadow-xs bg-white"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center ring-2 ring-slate-300">
                        <Camera className="w-7 h-7 text-slate-500" />
                      </div>
                    )}
                    
                    <label 
                      className="absolute -bottom-1 -right-1 p-1.5 bg-[#006657] hover:bg-[#004d41] text-white rounded-full cursor-pointer shadow-md transition-colors"
                      title="Subir fotografía"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 bg-[#006657] hover:bg-[#004d41] text-white rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Fotografía</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileUpload}
                          className="hidden"
                        />
                      </label>

                      {formData.avatar && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, avatar: '' }))}
                          className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors font-medium"
                        >
                          Quitar
                        </button>
                      )}
                    </div>

                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="O ingresa enlace de imagen (https://...)"
                      className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#006657]"
                    />
                  </div>
                </div>

                {/* Preset Avatars for quick selection */}
                <div className="mt-2">
                  <span className="text-[11px] text-slate-500 block mb-1">
                    Sugerencias institucionales rápidas:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatar: preset.url }))}
                        className={`relative w-8 h-8 rounded-full overflow-hidden shrink-0 transition-all ${
                          formData.avatar === preset.url 
                            ? 'ring-2 ring-[#006657] scale-110 shadow-sm' 
                            : 'opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Lic. Andrés Restrepo"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#006657]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico Corporativo</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="andres.restrepo@imss.gob.mx"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#006657]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rol en Plataforma</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#006657]"
                  >
                    <option value="alumno">Alumno / Estudiante</option>
                    <option value="profesor">Profesor / Docente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estado de Cuenta</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#006657]"
                  >
                    <option value="active">Activo</option>
                    <option value="suspended">Suspendido</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Departamento / Área</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Ej: Residencia Médica Familiar, Epidemiología..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#006657]"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.twoFactorEnabled}
                    onChange={(e) => setFormData({ ...formData, twoFactorEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-[#006657] focus:ring-[#006657] border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800">Habilitar Autenticación 2FA</span>
                    <p className="text-[11px] text-slate-500">Exige token TOTP de 6 dígitos para iniciar sesión.</p>
                  </div>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#006657] hover:bg-[#004d41] text-white rounded-lg transition-colors shadow-xs border border-[#BC955C]/40"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
