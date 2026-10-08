import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  TrendingUp, 
  Award, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Calendar,
  X
} from 'lucide-react';
import { Course, QuizAttempt, User, Quiz } from '../types/lms';
import { exportToCSV } from '../services/storage';

interface AnalyticsDashboardProps {
  courses: Course[];
  quizAttempts: QuizAttempt[];
  users: User[];
  quizzes: Quiz[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  courses,
  quizAttempts,
  users,
  quizzes
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [selectedStudentAudit, setSelectedStudentAudit] = useState<User | null>(null);

  // Filter students
  const students = users.filter(u => u.role === 'alumno');

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = 
      selectedCourseFilter === 'all' || 
      student.enrolledCourseIds.includes(selectedCourseFilter);

    return matchesSearch && matchesCourse;
  });

  // Calculate Metrics
  const totalAttempts = quizAttempts.length;
  const passedAttempts = quizAttempts.filter(a => a.passed).length;
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;
  
  const totalScoreSum = quizAttempts.reduce((acc, curr) => acc + curr.percentage, 0);
  const avgScore = totalAttempts > 0 ? Math.round(totalScoreSum / totalAttempts) : 0;

  // Grade Distribution Buckets with official IMSS Pantone colors
  const gradeBuckets = [
    { label: '0-59%', count: quizAttempts.filter(a => a.percentage < 60).length, color: 'bg-rose-500' },
    { label: '60-69%', count: quizAttempts.filter(a => a.percentage >= 60 && a.percentage < 70).length, color: 'bg-[#BC955C]' },
    { label: '70-79%', count: quizAttempts.filter(a => a.percentage >= 70 && a.percentage < 80).length, color: 'bg-[#006657]/70' },
    { label: '80-89%', count: quizAttempts.filter(a => a.percentage >= 80 && a.percentage < 90).length, color: 'bg-[#006657]' },
    { label: '90-100%', count: quizAttempts.filter(a => a.percentage >= 90).length, color: 'bg-[#004d41]' },
  ];

  const maxBucketCount = Math.max(...gradeBuckets.map(b => b.count), 1);

  // Handle Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID Estudiante',
      'Nombre',
      'Correo Electrónico',
      'Departamento',
      'Cursos Inscritos',
      'Evaluaciones Rendidas',
      'Promedio (%)',
      'Estado',
      '2FA Activo'
    ];

    const rows = filteredStudents.map(student => {
      const studentAttempts = quizAttempts.filter(a => a.studentId === student.id);
      const studentAvg = studentAttempts.length > 0
        ? Math.round(studentAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / studentAttempts.length)
        : 0;

      return [
        student.id,
        student.name,
        student.email,
        student.department,
        student.enrolledCourseIds.length,
        studentAttempts.length,
        studentAvg,
        studentAvg >= 70 ? 'Aprobado' : (studentAttempts.length > 0 ? 'En Riesgo' : 'Sin Evaluaciones'),
        student.twoFactorEnabled ? 'Sí' : 'No'
      ];
    });

    exportToCSV(`reporte_analiticas_estudiantes_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Export Toolbar */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Panel de Analíticas y Desempeño Académico
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitoreo en tiempo real del progreso estudiantil &bull; Exportación compatible con BI y formatos estándar
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-2 bg-[#006657] hover:bg-[#004d41] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF Institucional</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Estudiantes Monitoreados</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {students.length}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span>En servidores locales</span>
            <span aria-hidden="true">&bull;</span>
            <span className="text-emerald-600 font-medium">100% Activos</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Calificación Promedio</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {avgScore}%
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span>Mínimo institucional</span>
            <span aria-hidden="true">&bull;</span>
            <span className="text-slate-700 font-mono">70%</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Tasa de Aprobación</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {passRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span>{passedAttempts} de {totalAttempts} intentos</span>
            <span aria-hidden="true">&bull;</span>
            <span className="text-emerald-600 font-medium">Acreditados</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Cursos en Catálogo</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {courses.length}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span>{quizzes.length} Evaluaciones</span>
            <span aria-hidden="true">&bull;</span>
            <span>Multimedia Activo</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics: Histogram of Grades & Performance by Course */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Histogram of Grade Distribution */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Distribución de Calificaciones</h2>
              <p className="text-xs text-slate-500">Agrupamiento de puntajes en todas las evaluaciones automáticas</p>
            </div>
            <span className="text-xs font-mono text-slate-500">n = {totalAttempts}</span>
          </div>

          <div className="space-y-3 pt-2">
            {gradeBuckets.map((bucket, i) => {
              const barWidthPercent = (bucket.count / maxBucketCount) * 100;
              return (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className="w-16 font-mono text-slate-600 text-right">{bucket.label}</span>
                  <div className="flex-1 h-6 bg-slate-100 rounded-md overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-sm ${bucket.color} transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${Math.max(barWidthPercent, 4)}%` }}
                    >
                      {bucket.count > 0 && (
                        <span className="text-[10px] text-white font-mono font-bold">
                          {bucket.count}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="w-8 font-mono text-slate-500 text-right">{bucket.count}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Criterio: &lt;60% Reprobado &bull; &ge;70% Aprobado</span>
            <span className="font-semibold text-indigo-600">Actualización en tiempo real</span>
          </div>
        </div>

        {/* Course Completion and Participation */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Métricas por Curso Activo</h2>
              <p className="text-xs text-slate-500">Alumnos inscritos y promedio de evaluaciones</p>
            </div>
          </div>

          <div className="space-y-4">
            {courses.slice(0, 4).map(course => {
              const courseAttempts = quizAttempts.filter(a => a.courseId === course.id);
              const courseAvg = courseAttempts.length > 0
                ? Math.round(courseAttempts.reduce((acc, c) => acc + c.percentage, 0) / courseAttempts.length)
                : 0;

              return (
                <div key={course.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">{course.title}</span>
                    <span className="font-mono font-bold text-slate-900">{courseAvg > 0 ? `${courseAvg}% prom.` : 'Sin intentos'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{course.enrolledStudentIds.length} Alumnos inscritos</span>
                    <span>{course.modules.length} Módulos &bull; {course.durationHours}h</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por estudiante o departamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Todos los Cursos</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Grid Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Estudiante</th>
                <th className="py-3 px-4">Departamento</th>
                <th className="py-3 px-4 text-center">Cursos</th>
                <th className="py-3 px-4 text-center">Evaluaciones</th>
                <th className="py-3 px-4 text-right">Promedio General</th>
                <th className="py-3 px-4 text-center">Estado Académico</th>
                <th className="py-3 px-4 text-center">Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => {
                  const studentAttempts = quizAttempts.filter(a => a.studentId === student.id);
                  const studentAvg = studentAttempts.length > 0
                    ? Math.round(studentAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / studentAttempts.length)
                    : 0;
                  const isApproved = studentAvg >= 70;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.avatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{student.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {student.department}
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums">
                        {student.enrolledCourseIds.length}
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums">
                        {studentAttempts.length}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                        {studentAttempts.length > 0 ? (
                          <span className={studentAvg >= 70 ? 'text-emerald-700' : 'text-rose-600'}>
                            {studentAvg}%
                          </span>
                        ) : (
                          <span className="text-slate-400 italic font-normal">Sin notas</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {studentAttempts.length > 0 ? (
                          <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                            isApproved ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {isApproved ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-amber-600" />
                            )}
                            <span>{isApproved ? 'Acreditado' : 'En Reforzamiento'}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">En progreso</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedStudentAudit(student)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>Ver Ficha</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No se encontraron estudiantes para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Student Detailed Audit Sheet */}
      {selectedStudentAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentAudit.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedStudentAudit.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedStudentAudit.email} &bull; {selectedStudentAudit.department}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentAudit(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Historial de Evaluaciones y Calificaciones
              </h4>

              {quizAttempts.filter(a => a.studentId === selectedStudentAudit.id).length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {quizAttempts.filter(a => a.studentId === selectedStudentAudit.id).map(attempt => (
                    <div 
                      key={attempt.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{attempt.quizTitle}</p>
                        <p className="text-[11px] text-slate-500">{attempt.courseTitle} &bull; {attempt.completedAt}</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold text-sm ${attempt.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {attempt.percentage}%
                        </span>
                        <p className={`text-[10px] uppercase font-bold ${attempt.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {attempt.passed ? 'Aprobado' : 'Reprobado'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  El alumno aún no ha realizado intentos de evaluación automática en sus cursos inscritos.
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedStudentAudit(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
