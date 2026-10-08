import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  BookOpen, 
  Play, 
  Plus, 
  Edit3, 
  Users,
  Trash2,
  AlertTriangle,
  X,
  ShieldAlert,
  CheckCircle2,
  Award,
  MessageSquare
} from 'lucide-react';
import { Course, User, ForumThread } from '../types/lms';

interface CourseCatalogProps {
  courses: Course[];
  currentUser: User;
  onSelectCourse: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onCreateCourse: () => void;
  onEnrollCourse: (courseId: string) => void;
  onDeleteCourse?: (course: Course) => void;
  forumThreads?: ForumThread[];
  onOpenForum?: (course: Course) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  currentUser,
  onSelectCourse,
  onEditCourse,
  onCreateCourse,
  onEnrollCourse,
  onDeleteCourse,
  forumThreads = [],
  onOpenForum
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const categories = [
    'Todos', 
    'Ciberseguridad & Normatividad', 
    'Infraestructura & Servidores', 
    'Educación Médica & Multimedia', 
    'Analítica & Gestión'
  ];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Actions */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#006657]/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#006657]" />
            <span className="text-[11px] font-bold text-[#BC955C] uppercase tracking-wider">
              Dirección de Prestaciones Médicas &bull; IMSS
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Catálogo Oficial de Capacitación y Cursos E-Learning
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Formación continua para personal médico, de enfermería y administrativo con evaluación automática
          </p>
        </div>

        {(currentUser.role === 'profesor' || currentUser.role === 'admin') && (
          <button
            onClick={onCreateCourse}
            className="px-4 py-2 bg-[#006657] hover:bg-[#004d41] text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-colors shadow-xs self-start sm:self-auto border border-[#BC955C]/40"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Curso IMSS</span>
          </button>
        )}
      </div>

      {/* Admin Privileges Info Banner */}
      {currentUser.role === 'admin' && (
        <div className="bg-amber-50/90 border border-amber-200/80 text-amber-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Modo Administrador Activo:</strong> Puedes crear, editar y <strong className="text-red-700">eliminar permanentemente</strong> cualquier curso institucional de la plataforma CUPN Conecta.
            </span>
          </div>
          <span className="font-mono text-[10px] text-amber-800 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded font-bold shrink-0 uppercase">
            Control Delegacional
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por curso, docente o tema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#006657] shadow-2xs"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-[#FAF5ED] rounded-lg border border-[#DDC9A3]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#006657] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-[#006657]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const isEnrolled = course.enrolledStudentIds.includes(currentUser.id) || (currentUser.enrolledCourseIds && currentUser.enrolledCourseIds.includes(course.id));
          const allLessons = course.modules.flatMap(m => m.lessons);
          const completedLessons = allLessons.filter(l => l.completedByStudentIds.includes(currentUser.id));
          const progressPercent = allLessons.length > 0 ? Math.round((completedLessons.length / allLessons.length) * 100) : 0;
          const isInstructor = course.instructorId === currentUser.id || currentUser.role === 'admin';

          return (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-[#006657]/40 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              {/* Card Cover with Scrim */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                <img
                  src={course.coverImage}
                  alt={course.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                
                {/* Level and Category as Unboxed Text Metadata */}
                <div className="absolute top-3 left-3 text-xs font-medium text-white drop-shadow-xs flex items-center gap-1.5">
                  <span className="font-bold text-[#DDC9A3]">{course.category}</span>
                  <span aria-hidden="true">&bull;</span>
                  <span>{course.level}</span>
                </div>

                {/* Enrolled Badge for Students */}
                {isEnrolled && currentUser.role === 'alumno' && (
                  <div className="absolute top-3 right-3 bg-[#006657] text-[#DDC9A3] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#BC955C]/40 shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Inscrito &bull; {progressPercent}%</span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#BC955C]" />
                    <span>{course.durationHours} horas</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#BC955C]" />
                    <span>{course.modules.length} Módulos</span>
                  </span>
                </div>

                {/* Bottom line progress tracker on image for enrolled students */}
                {isEnrolled && currentUser.role === 'alumno' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                    <div 
                      className="h-full bg-gradient-to-r from-[#006657] to-[#BC955C] transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }} 
                    />
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#006657] transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Instructor & Enrolled Metadata */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">Docente:</span>
                    <span className="font-semibold text-slate-800 truncate">{course.instructorName}</span>
                  </div>
                  <span className="shrink-0 flex items-center gap-1 text-[11px] font-mono">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.enrolledStudentIds.length} personal</span>
                  </span>
                </div>

                {/* Prominent Visual Progress Bar for Enrolled Students */}
                {isEnrolled && currentUser.role === 'alumno' && (
                  <div className="bg-[#FAF5ED] p-3 rounded-xl border border-[#BC955C]/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#006657]" />
                        <span>Progreso de Lecciones</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] text-slate-500">
                          {completedLessons.length}/{allLessons.length} lecciones
                        </span>
                        <span className="font-mono font-bold text-xs text-[#006657] bg-white px-1.5 py-0.5 rounded border border-[#006657]/20 shadow-2xs">
                          {progressPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Styled Visual Progress Bar */}
                    <div className="h-2.5 w-full bg-slate-200/90 rounded-full overflow-hidden p-0.5 border border-slate-300/40">
                      <div 
                        className="h-full bg-gradient-to-r from-[#006657] via-[#008f7a] to-[#BC955C] rounded-full transition-all duration-500 shadow-xs"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>
                        {allLessons.length - completedLessons.length > 0 
                          ? `${allLessons.length - completedLessons.length} lección(es) restante(s)` 
                          : '¡Todas las lecciones concluidas!'}
                      </span>
                      {progressPercent === 100 ? (
                        <span className="text-[#006657] font-bold flex items-center gap-1">
                          <Award className="w-3 h-3 text-[#BC955C]" />
                          <span>100% Completado</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          En curso
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  {currentUser.role === 'alumno' ? (
                    isEnrolled ? (
                      <>
                        <button
                          onClick={() => onSelectCourse(course)}
                          className="flex-1 py-2 px-3 bg-[#006657] hover:bg-[#004d41] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Continuar Capacitación</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenForum ? onOpenForum(course) : onSelectCourse(course)}
                          className="py-2 px-2.5 bg-[#FAF5ED] hover:bg-[#e6f0ee] text-[#006657] border border-[#BC955C]/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                          title="Abrir Foro de Dudas y Debate del curso"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#BC955C]" />
                          <span className="hidden sm:inline">Foro</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            ({forumThreads.filter(t => t.courseId === course.id).length})
                          </span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onEnrollCourse(course.id)}
                          className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Inscribirme en el Curso</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenForum ? onOpenForum(course) : onSelectCourse(course)}
                          className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Ver Foro de Discusión y Dudas del curso"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#006657]" />
                          <span className="hidden sm:inline">Foro</span>
                        </button>
                      </>
                    )
                  ) : (
                    <>
                      <button
                        onClick={() => onSelectCourse(course)}
                        className="flex-1 py-2 px-3 bg-[#FAF5ED] hover:bg-[#e6f0ee] text-[#006657] border border-[#BC955C]/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Ver Contenido</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenForum ? onOpenForum(course) : onSelectCourse(course)}
                        className="py-2 px-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Foro de Discusión y Asesoría Académica"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#BC955C]" />
                        <span className="hidden sm:inline">Foro</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          ({forumThreads.filter(t => t.courseId === course.id).length})
                        </span>
                      </button>

                      {isInstructor && (
                        <button
                          onClick={() => onEditCourse(course)}
                          className="py-2 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Editar curso y evaluaciones"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                      )}

                      {/* Admin Delete Action */}
                      {currentUser.role === 'admin' && onDeleteCourse && (
                        <button
                          type="button"
                          onClick={() => setCourseToDelete(course)}
                          className="py-2 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                          title="Eliminar curso de la plataforma (Acción de Administrador)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Eliminar</span>
                        </button>
                      )}
                    </>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal for Course Deletion by Administrator */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    ¿Eliminar curso de la plataforma?
                  </h3>
                  <span className="text-[11px] font-semibold text-red-600 uppercase tracking-wide">
                    Privilegio de Administrador CUPN
                  </span>
                </div>
              </div>
              <button
                onClick={() => setCourseToDelete(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-900">{courseToDelete.title}</p>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600 font-mono">
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  {courseToDelete.category}
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  Docente: {courseToDelete.instructorName}
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  {courseToDelete.modules.length} Módulos
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  {courseToDelete.enrolledStudentIds.length} Alumnos inscritos
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2 bg-red-50/70 p-3.5 rounded-xl border border-red-200/70">
              <div className="flex items-center gap-1.5 font-bold text-red-800">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>Impacto de la eliminación irreversible:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700">
                <li>Se purgarán todos los videos, audios, lecciones y reactivos asociados.</li>
                <li>Los {courseToDelete.enrolledStudentIds.length} alumnos inscritos perderán el acceso al curso.</li>
                <li>Esta acción quedará registrada en la bitácora de auditoría del sistema.</li>
              </ul>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteCourse) {
                    onDeleteCourse(courseToDelete);
                  }
                  setCourseToDelete(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sí, Eliminar Curso</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
