import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  AlertTriangle, 
  X, 
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import { 
  Course, 
  Quiz, 
  QuizAttempt, 
  User, 
  PushNotification, 
  AuditLogItem, 
  SecurityConfig, 
  OnPremiseConfig, 
  Lesson,
  ForumThread,
  CertificateTemplate 
} from './types/lms';
import { StorageService, triggerPushNotification } from './services/storage';

// Components
import { Navbar } from './components/Navbar';
import { CourseCatalog } from './components/CourseCatalog';
import { CoursePlayer } from './components/CoursePlayer';
import { CourseEditor } from './components/CourseEditor';
import { InteractiveLessonBuilder } from './components/InteractiveLessonBuilder';
import { QuizView } from './components/QuizView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { UserManagement } from './components/UserManagement';
import { SecurityAnd2FA } from './components/SecurityAnd2FA';
import { OnPremiseServerConfig } from './components/OnPremiseServerConfig';
import { CalendarModal } from './components/CalendarModal';
import { NotificationCenter } from './components/NotificationCenter';
import { CertificateModal } from './components/CertificateModal';
import { UserVerificationScreen } from './components/UserVerificationScreen';
import { CourseForum } from './components/CourseForum';
import { CertificateDesigner } from './components/CertificateDesigner';

export default function App() {
  // Load State from persistent StorageService
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [courses, setCourses] = useState<Course[]>(() => StorageService.getCourses());
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => StorageService.getQuizzes());
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => StorageService.getQuizAttempts());
  const [notifications, setNotifications] = useState<PushNotification[]>(() => StorageService.getNotifications());
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => StorageService.getAuditLogs());
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>(() => StorageService.getSecurityConfig());
  const [onPremiseConfig, setOnPremiseConfig] = useState<OnPremiseConfig>(() => StorageService.getOnPremiseConfig());
  const [forumThreads, setForumThreads] = useState<ForumThread[]>(() => StorageService.getForumThreads());
  const [certificateTemplate, setCertificateTemplate] = useState<CertificateTemplate>(() => StorageService.getCertificateTemplate());

  // Current User
  const [currentUserId, setCurrentUserId] = useState<string>(() => StorageService.getCurrentUserId());
  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  // Navigation and Active Views
  const [activeTab, setActiveTab] = useState<string>('courses');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Flow Subviews
  const [playingCourse, setPlayingCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [buildingLessonCourse, setBuildingLessonCourse] = useState<Course | null>(null);
  const [runningQuizId, setRunningQuizId] = useState<string | null>(null);

  // Modals
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeCertificateAttempt, setActiveCertificateAttempt] = useState<QuizAttempt | null>(null);
  // User verification on app entry
  const [isUserVerified, setIsUserVerified] = useState<boolean>(false);
  const [coursePendingDeletion, setCoursePendingDeletion] = useState<Course | null>(null);
  const [viewingForumCourse, setViewingForumCourse] = useState<Course | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync state to local storage
  useEffect(() => {
    StorageService.saveUsers(users);
  }, [users]);

  useEffect(() => {
    StorageService.saveCourses(courses);
  }, [courses]);

  useEffect(() => {
    StorageService.saveQuizzes(quizzes);
  }, [quizzes]);

  useEffect(() => {
    StorageService.saveQuizAttempts(quizAttempts);
  }, [quizAttempts]);

  useEffect(() => {
    StorageService.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    StorageService.saveAuditLogs(auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    StorageService.saveSecurityConfig(securityConfig);
  }, [securityConfig]);

  useEffect(() => {
    StorageService.saveOnPremiseConfig(onPremiseConfig);
  }, [onPremiseConfig]);

  useEffect(() => {
    StorageService.saveForumThreads(forumThreads);
  }, [forumThreads]);

  useEffect(() => {
    StorageService.saveCertificateTemplate(certificateTemplate);
  }, [certificateTemplate]);

  useEffect(() => {
    StorageService.setCurrentUserId(currentUserId);
  }, [currentUserId]);

  // Forum Action Handlers
  const handleSaveForumThread = (newThread: ForumThread) => {
    setForumThreads(prev => [newThread, ...prev]);
    logAudit('Nueva Publicación en Foro', `Tema creado: "${newThread.title}" (Categoría: ${newThread.category})`, 'success');
    showToast('Publicación agregada con éxito al foro del curso');
  };

  const handleUpdateForumThread = (updatedThread: ForumThread) => {
    setForumThreads(prev => prev.map(t => t.id === updatedThread.id ? updatedThread : t));
  };

  const handleDeleteForumThread = (threadId: string) => {
    setForumThreads(prev => prev.filter(t => t.id !== threadId));
    logAudit('Eliminación de Tema en Foro', `Publicación con ID ${threadId} eliminada`, 'warning');
    showToast('Publicación eliminada del foro');
  };

  // Audit Logger Helper
  const logAudit = (action: string, details: string, status: 'success' | 'warning' | 'alert') => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('es-ES'),
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action,
      details,
      ipAddress: '192.168.10.45 (Local Intranet)',
      status
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // User Verification and Workspace Access Handlers
  const handleVerifyUserSuccess = (verifiedUser: User) => {
    setCurrentUserId(verifiedUser.id);
    setIsUserVerified(true);

    // Update user's lastLogin
    const nowStr = new Date().toLocaleString('es-ES');
    setUsers(prev => prev.map(u => u.id === verifiedUser.id ? { ...u, lastLogin: nowStr } : u));

    // Direct user to their role-specific workspace
    if (verifiedUser.role === 'alumno') {
      setActiveTab('my-courses');
    } else if (verifiedUser.role === 'profesor') {
      setActiveTab('course-management');
    } else {
      setActiveTab('courses');
    }

    setPlayingCourse(null);
    setEditingCourse(null);
    setBuildingLessonCourse(null);
    setRunningQuizId(null);
    setViewingForumCourse(null);

    showToast(`Identidad verificada: Bienvenido a su espacio, ${verifiedUser.name}`);
    logAudit(
      'Verificación de Identidad e Ingreso',
      `Acceso verificado para ${verifiedUser.name} (${verifiedUser.email}). Sesión exclusiva activada.`,
      'success'
    );
  };

  const handleLogout = () => {
    setIsUserVerified(false);
    setPlayingCourse(null);
    setEditingCourse(null);
    setBuildingLessonCourse(null);
    setRunningQuizId(null);
    setViewingForumCourse(null);
    logAudit('Cierre de Sesión', `El usuario ${currentUser.email} cerró su sesión. Espacio de trabajo asegurado.`, 'success');
    showToast('Sesión finalizada. Ingrese y verifique nuevamente su identidad para acceder.');
  };

  // Student Course Enrollment
  const handleEnrollCourse = (courseId: string) => {
    const updatedCourses = courses.map(c => {
      if (c.id === courseId && !c.enrolledStudentIds.includes(currentUser.id)) {
        return {
          ...c,
          enrolledStudentIds: [...c.enrolledStudentIds, currentUser.id]
        };
      }
      return c;
    });
    setCourses(updatedCourses);

    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id && !u.enrolledCourseIds.includes(courseId)) {
        return {
          ...u,
          enrolledCourseIds: [...u.enrolledCourseIds, courseId]
        };
      }
      return u;
    });
    setUsers(updatedUsers);

    showToast('¡Inscripción exitosa en el curso!');
    logAudit('Inscripción de Alumno', `El estudiante ${currentUser.email} se inscribió al curso ${courseId}`, 'success');
  };

  // Lesson Completion Toggle
  const handleToggleLessonCompletion = (lessonId: string) => {
    const updatedCourses = courses.map(course => {
      return {
        ...course,
        modules: course.modules.map(mod => {
          return {
            ...mod,
            lessons: mod.lessons.map(lesson => {
              if (lesson.id === lessonId) {
                const isCompleted = lesson.completedByStudentIds.includes(currentUser.id);
                const updatedStudentIds = isCompleted
                  ? lesson.completedByStudentIds.filter(id => id !== currentUser.id)
                  : [...lesson.completedByStudentIds, currentUser.id];
                return { ...lesson, completedByStudentIds: updatedStudentIds };
              }
              return lesson;
            })
          };
        })
      };
    });
    setCourses(updatedCourses);

    // Keep active playing course in sync
    if (playingCourse) {
      const updatedPlaying = updatedCourses.find(c => c.id === playingCourse.id) || playingCourse;
      setPlayingCourse(updatedPlaying);
    }
    showToast('Progreso de la lección actualizado');
  };

  // Save Quiz Attempt
  const handleSaveAttempt = (attempt: QuizAttempt) => {
    setQuizAttempts([attempt, ...quizAttempts]);
    logAudit('Evaluación Calificada', `Examen ${attempt.quizTitle} rendido con ${attempt.percentage}% (${attempt.passed ? 'Aprobado' : 'Reprobado'})`, attempt.passed ? 'success' : 'warning');
    
    // Send in-app notification
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: attempt.passed ? '¡Evaluación Aprobada con Éxito!' : 'Resultado de Evaluación',
      message: `Has obtenido ${attempt.percentage}% en ${attempt.quizTitle}. ${attempt.passed ? 'Tu certificado está listo para descarga.' : 'Puedes reintentar cuando gustes.'}`,
      date: 'Ahora',
      read: false,
      type: 'grade',
      courseId: attempt.courseId
    };
    setNotifications([newNotif, ...notifications]);
    triggerPushNotification(newNotif.title, newNotif.message);
  };

  // Course Save (from CourseEditor)
  const handleSaveCourse = (savedCourse: Course, savedQuizzes?: Quiz[] | Quiz) => {
    const exists = courses.some(c => c.id === savedCourse.id);
    let updatedCourses: Course[];
    if (exists) {
      updatedCourses = courses.map(c => c.id === savedCourse.id ? savedCourse : c);
    } else {
      updatedCourses = [savedCourse, ...courses];
    }
    setCourses(updatedCourses);

    if (savedQuizzes) {
      const quizList = Array.isArray(savedQuizzes) ? savedQuizzes : [savedQuizzes];
      let currentQuizzes = [...quizzes];
      for (const q of quizList) {
        const idx = currentQuizzes.findIndex(item => item.id === q.id);
        if (idx >= 0) {
          currentQuizzes[idx] = q;
        } else {
          currentQuizzes.push(q);
        }
      }
      setQuizzes(currentQuizzes);
    }

    setEditingCourse(null);
    showToast('Curso y evaluaciones por módulo guardados con éxito');
    logAudit('Publicación de Curso', `Curso "${savedCourse.title}" y sus evaluaciones de módulo guardados en el servidor local`, 'success');
  };

  // Save Lesson with Quiz (from InteractiveLessonBuilder)
  const handleSaveLessonWithQuiz = (moduleId: string, newLesson: Lesson, newQuiz?: Quiz) => {
    if (!buildingLessonCourse) return;

    const updatedModules = buildingLessonCourse.modules.map(mod => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          lessons: [...mod.lessons, newLesson],
          quizId: newQuiz ? newQuiz.id : mod.quizId
        };
      }
      return mod;
    });

    const updatedCourse: Course = {
      ...buildingLessonCourse,
      modules: updatedModules,
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    
    if (newQuiz) {
      setQuizzes([newQuiz, ...quizzes]);
    }

    setBuildingLessonCourse(null);
    showToast('¡Lección interactiva y evaluación creadas y publicadas con éxito!');
    logAudit('Creación de Lección Interactiva', `Lección "${newLesson.title}" agregada al curso ${updatedCourse.title}`, 'success');
  };

  // Trigger test push notification
  const handleTriggerTestPush = (title: string, message: string) => {
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      date: 'Ahora mismo',
      read: false,
      type: 'reminder'
    };
    setNotifications([newNotif, ...notifications]);
    triggerPushNotification(title, message);
    showToast('Recordatorio push emitido al dispositivo');
  };

  // Administrator Course Deletion Handlers
  const handleRequestDeleteCourse = (course: Course) => {
    setCoursePendingDeletion(course);
  };

  const handleConfirmDeleteCourse = () => {
    if (!coursePendingDeletion) return;
    const courseToDelete = coursePendingDeletion;
    const courseId = courseToDelete.id;
    const courseTitle = courseToDelete.title;

    // 1. Remove course from state
    setCourses(prev => prev.filter(c => c.id !== courseId));

    // 2. Remove associated quizzes and quiz attempts, and forum threads
    setQuizzes(prev => prev.filter(q => q.courseId !== courseId));
    setQuizAttempts(prev => prev.filter(qa => qa.courseId !== courseId));
    setForumThreads(prev => prev.filter(t => t.courseId !== courseId));

    // 3. Remove enrolled course from all users
    setUsers(prev => prev.map(u => ({
      ...u,
      enrolledCourseIds: u.enrolledCourseIds.filter(id => id !== courseId)
    })));

    // 4. Close any active subviews if viewing/editing the deleted course
    if (editingCourse?.id === courseId) setEditingCourse(null);
    if (playingCourse?.id === courseId) setPlayingCourse(null);
    if (buildingLessonCourse?.id === courseId) setBuildingLessonCourse(null);
    if (viewingForumCourse?.id === courseId) setViewingForumCourse(null);
    if (runningQuizId) {
      const q = quizzes.find(item => item.id === runningQuizId);
      if (q && q.courseId === courseId) {
        setRunningQuizId(null);
      }
    }

    // 5. Emit system push notification
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Curso Eliminado del Sistema',
      message: `El curso "${courseTitle}" ha sido purgado permanentemente del catálogo institucional por la Administración.`,
      date: 'Ahora',
      read: false,
      type: 'course_update'
    };
    setNotifications(prev => [newNotif, ...prev]);

    // 6. Security Audit Trail entry
    logAudit(
      'Eliminación Permanente de Curso',
      `El Administrador ${currentUser.name} (${currentUser.email}) eliminó de forma irreversible el curso "${courseTitle}" (ID: ${courseId}) y sus evaluaciones asociadas de la plataforma CUPN Conecta.`,
      'alert'
    );

    setCoursePendingDeletion(null);
    showToast(`Curso "${courseTitle}" eliminado correctamente de la plataforma`);
  };

  // Active Quiz Object
  const currentRunningQuiz = runningQuizId ? quizzes.find(q => q.id === runningQuizId) : null;
  const currentQuizCourse = currentRunningQuiz ? courses.find(c => c.id === currentRunningQuiz.courseId) : null;

  // Initial Verification Gate: Prompt user verification on entry to enter their space
  if (!isUserVerified) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
        {toastMessage && (
          <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700 animate-in slide-in-from-bottom duration-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{toastMessage}</span>
          </div>
        )}
        <UserVerificationScreen
          users={users}
          onVerifySuccess={handleVerifyUserSuccess}
          onLogAudit={logAudit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700 animate-in slide-in-from-bottom duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation Bar (Except when inside immersive CoursePlayer) */}
      {!playingCourse && (
        <Navbar
          currentUser={currentUser}
          allUsers={users}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setEditingCourse(null);
            setBuildingLessonCourse(null);
            setRunningQuizId(null);
          }}
          notifications={notifications}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenCalendar={() => setIsCalendarOpen(true)}
          onOpen2FA={() => setActiveTab('security')}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}

      {/* Subviews & Screen Routing */}
      <main className="flex-1">
        
        {/* 1. Immersive Course Player View */}
        {playingCourse ? (
          <CoursePlayer
            course={playingCourse}
            currentUser={currentUser}
            quizzes={quizzes}
            quizAttempts={quizAttempts}
            forumThreads={forumThreads}
            onSaveForumThread={handleSaveForumThread}
            onUpdateForumThread={handleUpdateForumThread}
            onDeleteForumThread={handleDeleteForumThread}
            onBack={() => setPlayingCourse(null)}
            onStartQuiz={(quizId) => {
              setRunningQuizId(quizId);
              setPlayingCourse(null);
            }}
            onToggleLessonCompletion={handleToggleLessonCompletion}
            onEditCourse={(course) => {
              setPlayingCourse(null);
              setEditingCourse(course);
            }}
          />
        ) : runningQuizId && currentRunningQuiz && currentQuizCourse ? (
          /* 2. Automated Evaluation Engine View */
          <div className="py-6">
            <QuizView
              quiz={currentRunningQuiz}
              course={currentQuizCourse}
              currentUser={currentUser}
              onBack={() => {
                setRunningQuizId(null);
                setPlayingCourse(currentQuizCourse);
              }}
              onSaveAttempt={handleSaveAttempt}
              onOpenCertificate={(attempt) => setActiveCertificateAttempt(attempt)}
            />
          </div>
        ) : buildingLessonCourse ? (
          /* 3. Interactive Guided Lesson Builder (Requested Flow) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <InteractiveLessonBuilder
              course={buildingLessonCourse}
              currentUser={currentUser}
              onSaveLessonWithQuiz={handleSaveLessonWithQuiz}
              onBack={() => setBuildingLessonCourse(null)}
            />
          </div>
        ) : editingCourse ? (
          /* 4. Complete Course Editor */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CourseEditor
              course={editingCourse}
              currentUser={currentUser}
              onSaveCourse={handleSaveCourse}
              onBack={() => setEditingCourse(null)}
              existingQuizzes={quizzes}
              onDeleteCourse={handleRequestDeleteCourse}
            />
          </div>
        ) : (
          /* 5. Standard Tab Views */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            
            {/* Tab: Catálogo de Cursos General */}
            {activeTab === 'courses' && (
              <CourseCatalog
                courses={courses}
                currentUser={currentUser}
                onSelectCourse={(course) => setPlayingCourse(course)}
                onEditCourse={(course) => setEditingCourse(course)}
                onCreateCourse={() => setEditingCourse({
                  id: `course-${Date.now()}`,
                  title: '',
                  slug: '',
                  description: '',
                  instructorId: currentUser.id,
                  instructorName: currentUser.name,
                  instructorRole: currentUser.department,
                  category: 'Ciberseguridad & Normatividad',
                  level: 'Intermedio',
                  coverImage: '',
                  durationHours: 20,
                  published: true,
                  modules: [
                    {
                      id: `mod-${Date.now()}`,
                      title: 'Módulo 1: Fundamentos',
                      description: 'Objetivos iniciales',
                      order: 1,
                      lessons: []
                    }
                  ],
                  enrolledStudentIds: [],
                  calendarEvents: [],
                  updatedAt: new Date().toISOString().slice(0, 10)
                })}
                onEnrollCourse={handleEnrollCourse}
                onDeleteCourse={handleRequestDeleteCourse}
                forumThreads={forumThreads}
                onOpenForum={(course) => setViewingForumCourse(course)}
              />
            )}

            {/* Tab: Mis Cursos (Alumno) */}
            {activeTab === 'my-courses' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <h1 className="text-xl font-bold text-slate-900">Mis Aprendizajes & Cursos Inscritos</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Accede a tus materiales multimedia interactivos y continúa con tu progreso académico.
                  </p>
                </div>
                <CourseCatalog
                  courses={courses.filter(c => c.enrolledStudentIds.includes(currentUser.id))}
                  currentUser={currentUser}
                  onSelectCourse={(course) => setPlayingCourse(course)}
                  onEditCourse={(course) => setEditingCourse(course)}
                  onCreateCourse={() => {}}
                  onEnrollCourse={handleEnrollCourse}
                  onDeleteCourse={currentUser.role === 'admin' ? handleRequestDeleteCourse : undefined}
                  forumThreads={forumThreads}
                  onOpenForum={(course) => setViewingForumCourse(course)}
                />
              </div>
            )}

            {/* Tab: Mis Calificaciones (Alumno) */}
            {activeTab === 'my-grades' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <h1 className="text-xl font-bold text-slate-900">Mis Evaluaciones Automáticas y Certificados</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Consulta tus puntajes obtenidos, retroalimentación pedagógica y descarga tus diplomas acreditados.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="py-3 px-4">Evaluación</th>
                          <th className="py-3 px-4">Curso Asociado</th>
                          <th className="py-3 px-4 text-center">Calificación</th>
                          <th className="py-3 px-4 text-center">Estado</th>
                          <th className="py-3 px-4">Fecha de Rendición</th>
                          <th className="py-3 px-4 text-right">Diploma</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {quizAttempts.filter(a => a.studentId === currentUser.id).length > 0 ? (
                          quizAttempts.filter(a => a.studentId === currentUser.id).map(attempt => (
                            <tr key={attempt.id} className="hover:bg-slate-50/80">
                              <td className="py-3 px-4 font-semibold text-slate-900">{attempt.quizTitle}</td>
                              <td className="py-3 px-4 text-slate-600">{attempt.courseTitle}</td>
                              <td className="py-3 px-4 text-center font-mono font-bold text-sm">
                                <span className={attempt.passed ? 'text-emerald-700' : 'text-rose-700'}>
                                  {attempt.percentage}%
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  attempt.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {attempt.passed ? 'Aprobado' : 'Reprobado'}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{attempt.completedAt}</td>
                              <td className="py-3 px-4 text-right">
                                {attempt.passed ? (
                                  <button
                                    onClick={() => setActiveCertificateAttempt(attempt)}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
                                  >
                                    Ver Certificado
                                  </button>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">No disponible</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400">
                              Aún no has rendido evaluaciones. ¡Ingresa a tus cursos e inicia las pruebas de aprendizaje!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Gestión de Cursos para Profesores y Administradores */}
            {activeTab === 'course-management' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">
                      {currentUser.role === 'admin' ? 'Panel de Gestión y Eliminación de Cursos' : 'Panel de Gestión Docente & Contenidos'}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      {currentUser.role === 'admin' 
                        ? 'Supervisión centralizada del catálogo IMSS: crea, edita y elimina permanentemente cursos de la plataforma'
                        : 'Crea y edita cursos, sube archivos multimedia y diseña lecciones interactivas guiadas'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        // Open lesson builder for the first course
                        setBuildingLessonCourse(courses[0]);
                      }}
                      className="px-4 py-2 bg-[#006657] hover:bg-[#004d41] text-white rounded-lg text-xs font-bold transition-colors shadow-xs border border-[#BC955C]/40"
                    >
                      + Nueva Lección Interactiva
                    </button>

                    <button
                      onClick={() => setEditingCourse({
                        id: `course-${Date.now()}`,
                        title: '',
                        slug: '',
                        description: '',
                        instructorId: currentUser.id,
                        instructorName: currentUser.name,
                        instructorRole: currentUser.department,
                        category: 'Ciberseguridad & Normatividad',
                        level: 'Intermedio',
                        coverImage: '',
                        durationHours: 20,
                        published: true,
                        modules: [
                          {
                            id: `mod-${Date.now()}`,
                            title: 'Módulo 1: Introducción',
                            description: 'Bases conceptuales',
                            order: 1,
                            lessons: []
                          }
                        ],
                        enrolledStudentIds: [],
                        calendarEvents: [],
                        updatedAt: new Date().toISOString().slice(0, 10)
                      })}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                      + Crear Curso Completo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map(course => (
                    <div key={course.id} className="p-4 bg-white rounded-xl border border-slate-200 hover:border-[#006657]/40 shadow-xs flex flex-col justify-between space-y-4 transition-all">
                      <div className="flex items-start gap-3">
                        <img src={course.coverImage} alt="" className="w-20 h-16 object-cover rounded-lg shrink-0 border border-slate-200" />
                        <div className="flex-1 truncate">
                          <span className="text-[10px] text-[#006657] font-bold uppercase tracking-wider">{course.category}</span>
                          <h3 className="text-sm font-bold text-slate-900 truncate">{course.title}</h3>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {course.modules.length} Módulos &bull; {course.enrolledStudentIds.length} Alumnos inscritos
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setBuildingLessonCourse(course)}
                          className="flex-1 py-1.5 px-3 bg-[#FAF5ED] hover:bg-[#e6f0ee] text-[#006657] border border-[#BC955C]/40 rounded-lg text-xs font-semibold transition-colors"
                        >
                          + Lección Multimedia
                        </button>
                        <button
                          onClick={() => setEditingCourse(course)}
                          className="py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Editar Curso
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewingForumCourse(course)}
                          className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Foro del curso (Dudas, debates y materiales adicionales)"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#006657]" />
                          <span>Foro ({forumThreads.filter(t => t.courseId === course.id).length})</span>
                        </button>

                        {currentUser.role === 'admin' && (
                          <button
                            type="button"
                            onClick={() => handleRequestDeleteCourse(course)}
                            className="py-1.5 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                            title="Eliminar curso de la plataforma (Administrador)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Analíticas y Desempeño */}
            {activeTab === 'analytics' && (
              <AnalyticsDashboard
                courses={courses}
                quizAttempts={quizAttempts}
                users={users}
                quizzes={quizzes}
              />
            )}

            {/* Tab: Gestión de Usuarios (Admin) */}
            {activeTab === 'users' && (
              <UserManagement
                users={users}
                currentUser={currentUser}
                onUpdateUsers={(updated) => setUsers(updated)}
                onLogAudit={logAudit}
              />
            )}

            {/* Tab: Editor y Diseñador de Diplomas y Reconocimientos (Admin) */}
            {activeTab === 'certificate-designer' && currentUser.role === 'admin' && (
              <CertificateDesigner
                initialTemplate={certificateTemplate}
                users={users}
                courses={courses}
                quizAttempts={quizAttempts}
                onSaveTemplate={(updatedTmpl) => {
                  setCertificateTemplate(updatedTmpl);
                  StorageService.saveCertificateTemplate(updatedTmpl);
                }}
                onLogAudit={logAudit}
                showToast={showToast}
              />
            )}

            {/* Tab: Servidor On-Premise y Nube (Admin) */}
            {activeTab === 'server-config' && (
              <OnPremiseServerConfig
                currentUser={currentUser}
                config={onPremiseConfig}
                onUpdateConfig={(cfg) => setOnPremiseConfig(cfg)}
                onReloadAllData={() => {
                  setUsers(StorageService.getUsers());
                  setCourses(StorageService.getCourses());
                  setQuizzes(StorageService.getQuizzes());
                  setQuizAttempts(StorageService.getQuizAttempts());
                  setAuditLogs(StorageService.getAuditLogs());
                  setSecurityConfig(StorageService.getSecurityConfig());
                  setOnPremiseConfig(StorageService.getOnPremiseConfig());
                  setCertificateTemplate(StorageService.getCertificateTemplate());
                  showToast('Datos del sistema sincronizados');
                }}
                onLogAudit={logAudit}
              />
            )}

            {/* Tab: Cifrado y Seguridad 2FA */}
            {activeTab === 'security' && (
              <SecurityAnd2FA
                currentUser={currentUser}
                securityConfig={securityConfig}
                auditLogs={auditLogs}
                onUpdateSecurityConfig={(sec) => setSecurityConfig(sec)}
                onUpdateUser={(updated) => {
                  setUsers(users.map(u => u.id === updated.id ? updated : u));
                }}
                onLogAudit={logAudit}
              />
            )}

          </div>
        )}

      </main>

      {/* Global Modals */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        courses={courses}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => {
          setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        }}
        onMarkAllAsRead={() => {
          setNotifications(notifications.map(n => ({ ...n, read: true })));
        }}
        onTriggerTestPush={handleTriggerTestPush}
        currentUser={currentUser}
      />

      <CertificateModal
        attempt={activeCertificateAttempt}
        template={certificateTemplate}
        onClose={() => setActiveCertificateAttempt(null)}
      />

      {/* Modal Global del Foro de Discusión del Curso */}
      {viewingForumCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-950 rounded-2xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl border border-slate-800 space-y-4 max-h-[92vh] overflow-y-auto">
            <CourseForum
              course={viewingForumCourse}
              currentUser={currentUser}
              threads={forumThreads}
              onSaveThread={handleSaveForumThread}
              onUpdateThread={handleUpdateForumThread}
              onDeleteThread={handleDeleteForumThread}
              onClose={() => setViewingForumCourse(null)}
            />
          </div>
        </div>
      )}

      {/* Modal Global de Confirmación de Eliminación de Curso por el Administrador */}
      {coursePendingDeletion && (
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
                    Privilegio de Administrador CUPN Conecta
                  </span>
                </div>
              </div>
              <button
                onClick={() => setCoursePendingDeletion(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-900">{coursePendingDeletion.title}</p>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600 font-mono">
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  {coursePendingDeletion.category}
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  Docente: {coursePendingDeletion.instructorName}
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  {coursePendingDeletion.modules.length} Módulos
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  {coursePendingDeletion.enrolledStudentIds.length} Alumnos inscritos
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2 bg-red-50/70 p-3.5 rounded-xl border border-red-200/70">
              <div className="flex items-center gap-1.5 font-bold text-red-800">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>Impacto de la eliminación permanente:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700">
                <li>Se purgarán todos los videos, audios, lecciones y reactivos evaluativos.</li>
                <li>Los {coursePendingDeletion.enrolledStudentIds.length} alumnos inscritos perderán el acceso al curso.</li>
                <li>La acción quedará asentada en la bitácora de auditoría delegacional del IMSS.</li>
              </ul>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCoursePendingDeletion(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCourse}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sí, Eliminar Curso Permanentemente</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
