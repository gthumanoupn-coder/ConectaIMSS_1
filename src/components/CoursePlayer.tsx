import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  FileText, 
  Volume2, 
  Video, 
  Sparkles, 
  Download, 
  Clock, 
  Award, 
  BookOpen, 
  ChevronRight,
  Maximize2,
  Check,
  Plus,
  MessageSquare
} from 'lucide-react';
import { Course, Lesson, Module, Quiz, QuizAttempt, User, ForumThread } from '../types/lms';
import { CourseForum } from './CourseForum';

interface CoursePlayerProps {
  course: Course;
  currentUser: User;
  quizzes: Quiz[];
  quizAttempts?: QuizAttempt[];
  forumThreads?: ForumThread[];
  onSaveForumThread?: (thread: ForumThread) => void;
  onUpdateForumThread?: (thread: ForumThread) => void;
  onDeleteForumThread?: (threadId: string) => void;
  onBack: () => void;
  onStartQuiz: (quizId: string) => void;
  onToggleLessonCompletion: (lessonId: string) => void;
  onEditCourse?: (course: Course) => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  currentUser,
  quizzes,
  quizAttempts = [],
  forumThreads = [],
  onSaveForumThread,
  onUpdateForumThread,
  onDeleteForumThread,
  onBack,
  onStartQuiz,
  onToggleLessonCompletion,
  onEditCourse
}) => {
  // Find first lesson or active lesson
  const allLessons = course.modules.flatMap(m => m.lessons);
  const [activeLessonId, setActiveLessonId] = useState<string>(allLessons[0]?.id || '');
  const [videoPlaybackRate, setVideoPlaybackRate] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'content' | 'attachments' | 'notes' | 'forum'>('content');
  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDownloadAttachment = (name: string) => {
    setDownloadFeedback(`Descargando "${name}" desde el repositorio local seguro...`);
    setTimeout(() => setDownloadFeedback(null), 3000);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = videoPlaybackRate;
    }
  }, [videoPlaybackRate, activeLessonId]);

  const activeLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];
  const activeModule = course.modules.find(m => m.lessons.some(l => l.id === activeLesson?.id)) || course.modules[0];
  const activeModuleQuiz = activeModule?.quizId ? quizzes.find(q => q.id === activeModule.quizId) : null;

  const getModuleQuizAttempt = (quizId: string) => {
    return quizAttempts.find(a => a.quizId === quizId && a.studentId === currentUser.id);
  };

  // Calculate completed count
  const completedLessons = allLessons.filter(l => l.completedByStudentIds.includes(currentUser.id));
  const progressPercent = allLessons.length > 0 ? Math.round((completedLessons.length / allLessons.length) * 100) : 0;
  const isLessonCompleted = activeLesson?.completedByStudentIds.includes(currentUser.id);
  const courseThreads = forumThreads.filter(t => t.courseId === course.id);

  const handleNextLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === activeLessonId);
    if (currentIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[currentIndex + 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Bar for Learning Mode */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Volver al catálogo"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs text-[#DDC9A3] font-bold block uppercase tracking-wider">
              {course.category} &bull; Módulo {activeModule?.order || 1}
            </span>
            <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md md:max-w-xl">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
            <span className="font-mono tabular-nums">{completedLessons.length} / {allLessons.length}</span>
            <span>lecciones</span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#006657] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono tabular-nums font-semibold text-[#BC955C]">{progressPercent}%</span>
          </div>

          <button
            onClick={() => setActiveTab(prev => prev === 'forum' ? 'content' : 'forum')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs border ${
              activeTab === 'forum'
                ? 'bg-[#BC955C] text-white border-[#BC955C]'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Foro de Discusión y Dudas"
          >
            <MessageSquare className="w-4 h-4 text-[#DDC9A3]" />
            <span className="hidden md:inline">{activeTab === 'forum' ? 'Ver Lección' : 'Foro del Curso'}</span>
            <span className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.2 rounded-full text-slate-300">
              {courseThreads.length}
            </span>
          </button>

          {activeModuleQuiz && (
            <button
              onClick={() => onStartQuiz(activeModuleQuiz.id)}
              className="px-3 py-1.5 text-xs font-semibold bg-[#006657] hover:bg-[#004d41] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs border border-[#BC955C]/40"
            >
              <Award className="w-4 h-4" />
              <span className="hidden md:inline">Evaluación Automática</span>
              <span className="md:hidden">Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Zone Stage */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left/Center Zone: Interactive Multimedia Stage */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-900">
          <div className="max-w-4xl mx-auto space-y-6">

            {downloadFeedback && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{downloadFeedback}</span>
              </div>
            )}

            {/* Stage Frame: Video Player */}
            {activeLesson?.type === 'video' && (
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
                  {activeLesson.mediaUrl ? (
                    <video
                      key={activeLesson.mediaUrl}
                      ref={videoRef}
                      controls
                      autoPlay={false}
                      className="w-full h-full object-contain"
                      poster={course.coverImage}
                    >
                      <source src={activeLesson.mediaUrl} type="video/mp4" />
                      Tu navegador no soporta el reproductor de video HTML5.
                    </video>
                  ) : (
                    <div className="text-center p-8">
                      <Video className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">Archivo de video alojado en servidor on-premise local.</p>
                      <p className="text-xs text-slate-500 font-mono mt-1">{activeLesson.mediaFileName || 'multimedia.mp4'}</p>
                    </div>
                  )}
                </div>

                {/* Video Controls Bar */}
                <div className="bg-slate-950/80 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">Velocidad:</span>
                    {[0.75, 1, 1.25, 1.5, 2].map(rate => (
                      <button
                        key={rate}
                        onClick={() => setVideoPlaybackRate(rate)}
                        className={`px-2 py-0.5 rounded font-mono ${
                          videoPlaybackRate === rate 
                            ? 'bg-indigo-600 text-white font-semibold' 
                            : 'hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>

                  <span className="text-slate-400 font-mono">
                    Duración: {activeLesson.durationMinutes} min
                  </span>
                </div>
              </div>
            )}

            {/* Stage Frame: Audio Player */}
            {activeLesson?.type === 'audio' && (
              <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                    <Volume2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">
                      Guía Auditiva / Podcast Educativo
                    </span>
                    <h3 className="text-lg font-bold text-white">{activeLesson.title}</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {activeLesson.mediaFileName || 'audio_sesion.mp3'} &bull; {activeLesson.mediaFileSize || '8 MB'}
                    </p>
                  </div>
                </div>

                {/* Audio Waves Simulation */}
                <div className="h-14 bg-slate-900 rounded-lg p-2 flex items-center justify-between gap-1 overflow-hidden border border-slate-800">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-indigo-500 rounded-full transition-all duration-300"
                      style={{
                        height: `${Math.max(15, Math.sin(i * 0.4) * 80 + 20)}%`,
                        opacity: i % 2 === 0 ? 0.9 : 0.6
                      }}
                    />
                  ))}
                </div>

                {activeLesson.mediaUrl && (
                  <audio controls className="w-full">
                    <source src={activeLesson.mediaUrl} type="audio/mp3" />
                    Tu navegador no soporta el reproductor de audio.
                  </audio>
                )}
              </div>
            )}

            {/* Stage Frame: Document or Interactive */}
            {(activeLesson?.type === 'document' || activeLesson?.type === 'interactive') && (
              <div className="bg-slate-950 rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                      {activeLesson.type === 'interactive' ? 'Lección Interactiva' : 'Documento Técnico'}
                    </span>
                    <h2 className="text-xl font-bold text-white">{activeLesson.title}</h2>
                  </div>
                </div>

                {/* Lesson Markdown-like Reader */}
                <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  {activeLesson.content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-lg font-bold text-indigo-300 mt-6 mb-2">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('> ')) {
                      return (
                        <blockquote key={idx} className="border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-slate-900/60 rounded-r-lg text-slate-200 text-sm">
                          {paragraph.replace('> ', '')}
                        </blockquote>
                      );
                    }
                    if (paragraph.startsWith('```')) {
                      const codeContent = paragraph.replace(/```[a-z]*/g, '').trim();
                      return (
                        <pre key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-lg font-mono text-xs text-indigo-200 overflow-x-auto">
                          <code>{codeContent}</code>
                        </pre>
                      );
                    }
                    return (
                      <p key={idx} className="text-slate-300">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => onToggleLessonCompletion(activeLesson.id)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isLessonCompleted
                      ? 'bg-[#006657]/40 text-[#DDC9A3] border border-[#BC955C]/40 hover:bg-[#006657]/60'
                      : 'bg-[#006657] hover:bg-[#004d41] text-white shadow-xs border border-[#BC955C]/40'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isLessonCompleted ? 'Lección Completada' : 'Marcar como Completada'}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {activeModuleQuiz && (
                  (() => {
                    const attempt = getModuleQuizAttempt(activeModuleQuiz.id);
                    return (
                      <button
                        onClick={() => onStartQuiz(activeModuleQuiz.id)}
                        className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
                          attempt?.passed
                            ? 'bg-[#006657] hover:bg-[#004d41] text-white border border-[#BC955C]/40'
                            : 'bg-[#BC955C] hover:bg-[#a27e46] text-white'
                        }`}
                      >
                        <Award className="w-4 h-4" />
                        <span>
                          {attempt 
                            ? `Evaluación Módulo ${activeModule.order}: ${attempt.percentage}% (${attempt.passed ? 'Aprobada' : 'Reintentar'})`
                            : `Evaluación Módulo ${activeModule.order} (${activeModuleQuiz.passingScore}% mín)`}
                        </span>
                      </button>
                    );
                  })()
                )}

                <button
                  onClick={handleNextLesson}
                  className="px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1"
                >
                  <span>Siguiente Lección</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs: Recursos Descargables & Notas */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="flex border-b border-slate-800 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-5 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'content'
                      ? 'border-[#006657] text-[#DDC9A3] bg-slate-900/50'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Resumen de la Lección
                </button>
                <button
                  onClick={() => setActiveTab('attachments')}
                  className={`px-5 py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'attachments'
                      ? 'border-[#006657] text-[#DDC9A3] bg-slate-900/50'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Archivos Adjuntos</span>
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-mono">
                    {activeLesson.attachments.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('forum')}
                  className={`px-5 py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'forum'
                      ? 'border-[#006657] text-[#DDC9A3] bg-slate-900/50'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#BC955C]" />
                  <span>Foro de Dudas y Debate</span>
                  <span className="w-4 h-4 rounded-full bg-[#006657] text-white text-[10px] flex items-center justify-center font-mono">
                    {courseThreads.length}
                  </span>
                </button>
              </div>

              <div className="p-5">
                {activeTab === 'content' && (
                  <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                    <p className="font-semibold text-white">Objetivo Pedagógico IMSS:</p>
                    <p>Desarrollar competencias clínicas y administrativas en salud conforme a protocolos de la Coordinación de Unidades de Primer Nivel.</p>
                    <div className="pt-2 text-slate-400">
                      Docente Titular: <span className="text-[#DDC9A3] font-medium">{course.instructorName}</span> ({course.instructorRole})
                    </div>
                  </div>
                )}

                {activeTab === 'attachments' && (
                  <div>
                    {activeLesson.attachments.length > 0 ? (
                      <div className="space-y-2">
                        {activeLesson.attachments.map(att => (
                          <div 
                            key={att.id}
                            className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-[#BC955C] shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-white">{att.name}</p>
                                <p className="text-[11px] text-slate-400 font-mono">{att.size} &bull; {att.type}</p>
                              </div>
                            </div>
                                <button
                                  onClick={() => handleDownloadAttachment(att.name)}
                                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  title="Descargar archivo"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No hay archivos multimedia adicionales adjuntos a esta lección.</p>
                    )}
                  </div>
                )}

                {activeTab === 'forum' && (
                  <div className="pt-1">
                    <CourseForum
                      course={course}
                      currentUser={currentUser}
                      threads={forumThreads}
                      onSaveThread={onSaveForumThread || (() => {})}
                      onUpdateThread={onUpdateForumThread || (() => {})}
                      onDeleteThread={onDeleteForumThread || (() => {})}
                      initialModuleId={activeModule?.id}
                    />
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right Zone: Syllabus Accordion Sidebar */}
        <div className="w-full lg:w-80 xl:w-96 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-auto lg:h-full">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Contenido del Curso &bull; CUPN Conecta
            </h3>
            <p className="text-xs text-slate-400">
              {course.modules.length} Módulos &bull; {allLessons.length} Lecciones
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {course.modules.map(module => {
              const moduleLessons = module.lessons;
              const moduleCompleted = moduleLessons.every(l => l.completedByStudentIds.includes(currentUser.id));
              const modQuiz = module.quizId ? quizzes.find(q => q.id === module.quizId) : null;
              const attempt = modQuiz ? getModuleQuizAttempt(modQuiz.id) : null;

              return (
                <div key={module.id} className="p-3">
                  <div className="mb-2">
                    <span className="text-[11px] font-semibold text-[#BC955C]">
                      Módulo {module.order}
                    </span>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {module.title}
                    </h4>
                  </div>

                  <div className="space-y-1">
                    {moduleLessons.map(lesson => {
                      const isActive = lesson.id === activeLessonId;
                      const isCompleted = lesson.completedByStudentIds.includes(currentUser.id);

                      const TypeIcon = 
                        lesson.type === 'video' ? Video : 
                        lesson.type === 'audio' ? Volume2 : FileText;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors text-xs ${
                            isActive
                              ? 'bg-[#006657] text-white font-medium shadow-xs'
                              : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isCompleted ? (
                              <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                            ) : (
                              <TypeIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>

                          <span className={`text-[10px] font-mono shrink-0 ml-1.5 ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                            {lesson.durationMinutes}m
                          </span>
                        </button>
                      );
                    })}

                    {/* Dedicated Module Evaluation Block in Sidebar */}
                    {modQuiz ? (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-[#DDC9A3] truncate">
                            <Award className="w-3.5 h-3.5 text-[#BC955C] shrink-0" />
                            <span className="truncate">Evaluación Módulo {module.order}</span>
                          </div>
                          {attempt ? (
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              attempt.passed 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              {attempt.percentage}% {attempt.passed ? 'Aprobada' : 'Reprobada'}
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              {modQuiz.passingScore}% mín
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {modQuiz.title} &bull; {modQuiz.questions.length} reactivos
                        </p>

                        <button
                          onClick={() => onStartQuiz(modQuiz.id)}
                          className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                            attempt?.passed
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                              : 'bg-[#BC955C] hover:bg-[#a27e46] text-white shadow-xs'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>
                            {attempt 
                              ? (attempt.passed ? 'Repetir Evaluación' : 'Reintentar Evaluación') 
                              : `Realizar Evaluación Módulo ${module.order}`}
                          </span>
                        </button>
                      </div>
                    ) : (
                      (currentUser.role === 'profesor' || currentUser.role === 'admin') && onEditCourse && (
                        <button
                          onClick={() => onEditCourse(course)}
                          className="w-full mt-2 py-1.5 px-2 rounded-lg text-xs text-[#BC955C] hover:text-[#DDC9A3] hover:bg-slate-900 border border-dashed border-[#BC955C]/40 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Configurar Evaluación Módulo {module.order}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
