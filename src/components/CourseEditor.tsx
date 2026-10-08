import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Upload, 
  Video, 
  Volume2, 
  FileText, 
  Award, 
  Clock, 
  Paperclip, 
  Sparkles, 
  Check, 
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Course, Module, Lesson, LessonType, Quiz, Question, QuestionType, User } from '../types/lms';

interface ModuleQuizConfig {
  enabled: boolean;
  id: string;
  title: string;
  description: string;
  passingScore: number;
  timeLimitMinutes: number;
  questions: Question[];
}

interface CourseEditorProps {
  course?: Course | null;
  currentUser: User;
  onSaveCourse: (course: Course, quizzes?: Quiz[]) => void;
  onBack: () => void;
  existingQuizzes: Quiz[];
  onDeleteCourse?: (course: Course) => void;
}

export const CourseEditor: React.FC<CourseEditorProps> = ({
  course,
  currentUser,
  onSaveCourse,
  onBack,
  existingQuizzes,
  onDeleteCourse
}) => {
  // Course Core State
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [category, setCategory] = useState(course?.category || 'Ciberseguridad & Normatividad');
  const [level, setLevel] = useState<'Principiante' | 'Intermedio' | 'Avanzado'>(course?.level || 'Intermedio');
  const [durationHours, setDurationHours] = useState(course?.durationHours || 20);
  const [coverImage, setCoverImage] = useState(course?.coverImage || '');
  
  const [modules, setModules] = useState<Module[]>(() => {
    if (course?.modules && course.modules.length > 0) {
      return course.modules;
    }
    return [
      {
        id: `mod-${Date.now()}`,
        title: 'Módulo 1: Introducción y Fundamentos',
        description: 'Conceptos iniciales y marco de trabajo institucional IMSS.',
        order: 1,
        lessons: []
      }
    ];
  });

  // Per-Module Quizzes Map
  const [moduleQuizzesMap, setModuleQuizzesMap] = useState<Record<string, ModuleQuizConfig>>(() => {
    const map: Record<string, ModuleQuizConfig> = {};
    const initModules = course?.modules && course.modules.length > 0 ? course.modules : [
      {
        id: `mod-${Date.now()}`,
        title: 'Módulo 1: Introducción y Fundamentos',
        description: 'Conceptos iniciales y marco de trabajo institucional IMSS.',
        order: 1,
        lessons: []
      }
    ];

    initModules.forEach((mod, idx) => {
      // Find existing quiz attached to this module
      const existingQuiz = existingQuizzes.find(q => q.moduleId === mod.id || (idx === 0 && q.courseId === course?.id && !q.moduleId));
      if (existingQuiz) {
        map[mod.id] = {
          enabled: true,
          id: existingQuiz.id,
          title: existingQuiz.title,
          description: existingQuiz.description,
          passingScore: existingQuiz.passingScore,
          timeLimitMinutes: existingQuiz.timeLimitMinutes,
          questions: existingQuiz.questions
        };
      } else {
        map[mod.id] = {
          enabled: false,
          id: `quiz-${course?.id || 'new'}-${mod.id}`,
          title: `Evaluación del Módulo ${idx + 1}: ${mod.title}`,
          description: `Evaluación de conocimientos y competencias del Módulo ${idx + 1}`,
          passingScore: 70,
          timeLimitMinutes: 15,
          questions: [
            {
              id: `q-${Date.now()}-${idx}`,
              text: `¿Cuál es el objetivo primordial abordado en el Módulo ${idx + 1}?`,
              type: 'single_choice',
              points: 50,
              options: [
                { id: `opt-1-${idx}`, text: 'Asegurar el cumplimiento de los estándares clínicos e informáticos del IMSS', isCorrect: true },
                { id: `opt-2-${idx}`, text: 'Omitir los procedimientos de seguridad y confidencialidad', isCorrect: false },
                { id: `opt-3-${idx}`, text: 'Compartir credenciales de acceso institucional sin supervisión', isCorrect: false }
              ],
              explanation: 'La capacitación continua garantiza la adecuada atención del derechohabiente y la seguridad de la información institucional.'
            }
          ]
        };
      }
    });

    return map;
  });

  // Selected module for Quiz Editor
  const [selectedQuizModuleId, setSelectedQuizModuleId] = useState<string>(() => {
    const initModules = course?.modules && course.modules.length > 0 ? course.modules : [];
    return initModules[0]?.id || '';
  });

  // Handle Cover Image Upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Module
  const handleAddModule = () => {
    const newModId = `mod-${Date.now()}`;
    const newOrder = modules.length + 1;
    const newMod: Module = {
      id: newModId,
      title: `Módulo ${newOrder}: Nuevo Módulo`,
      description: 'Descripción de los objetivos temáticos del módulo.',
      order: newOrder,
      lessons: []
    };

    setModules([...modules, newMod]);

    // Initialize quiz config for this new module
    setModuleQuizzesMap(prev => ({
      ...prev,
      [newModId]: {
        enabled: true,
        id: `quiz-${course?.id || 'new'}-${newModId}`,
        title: `Evaluación del Módulo ${newOrder}: Nuevo Módulo`,
        description: `Evaluación de reactivos del Módulo ${newOrder}`,
        passingScore: 70,
        timeLimitMinutes: 15,
        questions: [
          {
            id: `q-${Date.now()}`,
            text: `¿Cuál es el postulado principal del Módulo ${newOrder}?`,
            type: 'single_choice',
            points: 50,
            options: [
              { id: 'opt-a1', text: 'Aplicación correcta de protocolos de la CUPN IMSS', isCorrect: true },
              { id: 'opt-a2', text: 'Incumplimiento de las normativas de salud', isCorrect: false }
            ],
            explanation: 'La acreditación institucional se basa en el dominio de las competencias normativas y operativas.'
          }
        ]
      }
    }));

    setSelectedQuizModuleId(newModId);
  };

  // Delete Module
  const handleDeleteModule = (moduleId: string) => {
    if (modules.length <= 1) {
      alert('El curso debe contener al menos un módulo formativo.');
      return;
    }
    const updated = modules.filter(m => m.id !== moduleId);
    setModules(updated);
    if (selectedQuizModuleId === moduleId) {
      setSelectedQuizModuleId(updated[0]?.id || '');
    }
  };

  // Add Lesson to Module
  const handleAddLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: 'Nueva Lección Interactiva',
      type: 'video',
      durationMinutes: 15,
      content: '### Contenido de la Lección\nExplica los conceptos clave y competencias del IMSS aquí...',
      attachments: [],
      completedByStudentIds: []
    };

    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: [...m.lessons, newLesson] };
      }
      return m;
    }));
  };

  // Update Lesson Field
  const handleUpdateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
        };
      }
      return m;
    }));
  };

  // Delete Lesson
  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
      }
      return m;
    }));
  };

  // Handle Media File Upload Mock
  const handleMediaUpload = (moduleId: string, lessonId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video');
      const isAudio = file.type.startsWith('audio');
      const type: LessonType = isVideo ? 'video' : isAudio ? 'audio' : 'document';
      
      const fakeUrl = isVideo 
        ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        : 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg';

      handleUpdateLesson(moduleId, lessonId, {
        type,
        mediaUrl: fakeUrl,
        mediaFileName: file.name,
        mediaFileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  // Helpers for Active Module Quiz Editing
  const activeQuizModuleId = selectedQuizModuleId || modules[0]?.id;
  const activeQuizConfig = moduleQuizzesMap[activeQuizModuleId] || {
    enabled: false,
    id: `quiz-default-${activeQuizModuleId}`,
    title: 'Evaluación del Módulo',
    description: 'Evaluación de competencias',
    passingScore: 70,
    timeLimitMinutes: 15,
    questions: []
  };

  const updateActiveQuizConfig = (updates: Partial<ModuleQuizConfig>) => {
    if (!activeQuizModuleId) return;
    setModuleQuizzesMap(prev => ({
      ...prev,
      [activeQuizModuleId]: {
        ...activeQuizConfig,
        ...updates
      }
    }));
  };

  // Add Question to Active Module Quiz
  const handleAddQuestionToActiveQuiz = () => {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      text: 'Nueva pregunta de evaluación para este módulo...',
      type: 'single_choice',
      points: 25,
      options: [
        { id: `opt-1-${Date.now()}`, text: 'Opción A (Correcta)', isCorrect: true },
        { id: `opt-2-${Date.now()}`, text: 'Opción B', isCorrect: false }
      ],
      explanation: 'Justificación pedagógica de la respuesta correcta.'
    };
    updateActiveQuizConfig({
      questions: [...activeQuizConfig.questions, newQ]
    });
  };

  // Save Complete Course and All Module Quizzes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor especifica un título para el curso.');
      return;
    }

    const courseId = course?.id || `course-${Date.now()}`;
    const savedQuizzes: Quiz[] = [];

    // Map each module to its quiz if enabled
    const updatedModules = modules.map((m, idx) => {
      const qConfig = moduleQuizzesMap[m.id];
      if (qConfig && qConfig.enabled && qConfig.questions.length > 0) {
        const quizId = qConfig.id || `quiz-${courseId}-${m.id}`;
        savedQuizzes.push({
          id: quizId,
          courseId,
          moduleId: m.id,
          title: qConfig.title || `Evaluación del Módulo ${idx + 1}: ${m.title}`,
          description: qConfig.description || `Evaluación automática para el Módulo ${idx + 1}`,
          passingScore: Number(qConfig.passingScore) || 70,
          timeLimitMinutes: Number(qConfig.timeLimitMinutes) || 15,
          questions: qConfig.questions
        });
        return { ...m, quizId };
      }
      return { ...m, quizId: undefined };
    });

    const savedCourse: Course = {
      id: courseId,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      category,
      level,
      durationHours: Number(durationHours) || 20,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      instructorId: course?.instructorId || currentUser.id,
      instructorName: course?.instructorName || currentUser.name,
      instructorRole: course?.instructorRole || currentUser.department,
      published: true,
      modules: updatedModules,
      enrolledStudentIds: course?.enrolledStudentIds || [],
      calendarEvents: course?.calendarEvents || [],
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    onSaveCourse(savedCourse, savedQuizzes);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-[#006657]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#BC955C]">
                CUPN Conecta &bull; Coordinación de Unidades de Primer Nivel
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {course ? 'Editor de Curso y Evaluaciones por Módulo' : 'Crear Nuevo Curso Institucional IMSS'}
            </h1>
            <p className="text-xs text-slate-500">
              Desarrolla módulos, sube archivos multimedia y configura una evaluación automática para cada módulo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {currentUser.role === 'admin' && course && onDeleteCourse && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el curso "${course.title}" de CUPN Conecta? Se perderán todos sus módulos y evaluaciones.`)) {
                  onDeleteCourse(course);
                }
              }}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Eliminar curso de la plataforma (Administrador)"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar Curso</span>
            </button>
          )}

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#006657] hover:bg-[#004d41] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors border border-[#BC955C]/40"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Curso y Evaluaciones</span>
          </button>
        </div>
      </div>

      {/* Main Course Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#006657] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#006657]" />
          <span>1. Información General del Curso</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Curso</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Seguridad en Datos Médicos y Cifrado de Expedientes Clínicos"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#006657] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción Pedagógica</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe los objetivos de aprendizaje, competencias clínicas o tecnológicas del personal IMSS..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#006657] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Ciberseguridad & Normatividad">Ciberseguridad & Normatividad</option>
                  <option value="Infraestructura & Servidores">Infraestructura & Servidores</option>
                  <option value="Educación Médica & Multimedia">Educación Médica & Multimedia</option>
                  <option value="Analítica & Gestión">Analítica & Gestión</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nivel</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duración (Horas)</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Cover Image Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Imagen de Portada</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-[#006657] transition-colors flex flex-col items-center justify-center min-h-[170px] bg-slate-50 relative overflow-hidden">
              {coverImage ? (
                <div className="w-full h-full relative group">
                  <img src={coverImage} alt="Portada" className="w-full h-36 object-cover rounded-lg" />
                  <label className="absolute inset-0 bg-black/50 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                    Cambiar Imagen
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-400 mb-1" />
                  <p className="text-xs text-slate-600 font-medium">Subir Imagen de Portada</p>
                  <p className="text-[10px] text-slate-400">PNG, JPG hasta 5MB</p>
                  <label className="mt-2 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded cursor-pointer">
                    Seleccionar Archivo
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modules and Multimedia Lessons Manager */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#006657] flex items-center gap-2">
              <Video className="w-4 h-4 text-[#006657]" />
              <span>2. Estructura de Módulos y Archivos Multimedia</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Organiza los contenidos didácticos y comprueba la evaluación asociada a cada módulo
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddModule}
            className="px-3.5 py-2 bg-[#FAF5ED] hover:bg-[#e6f0ee] text-[#006657] border border-[#BC955C]/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Agregar Módulo</span>
          </button>
        </div>

        <div className="space-y-6">
          {modules.map((mod, modIdx) => {
            const qData = moduleQuizzesMap[mod.id];
            return (
              <div key={mod.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
                
                {/* Module Header Inputs */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => {
                        const updated = modules.map(m => m.id === mod.id ? { ...m, title: e.target.value } : m);
                        setModules(updated);
                      }}
                      placeholder={`Título del Módulo ${modIdx + 1}`}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                    />
                    <input
                      type="text"
                      value={mod.description}
                      onChange={(e) => {
                        const updated = modules.map(m => m.id === mod.id ? { ...m, description: e.target.value } : m);
                        setModules(updated);
                      }}
                      placeholder="Descripción temática del módulo"
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteModule(mod.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-colors"
                    title="Eliminar módulo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Module Evaluation Status Card */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      qData?.enabled ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          Evaluación Automática del Módulo {modIdx + 1}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          qData?.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {qData?.enabled ? 'Configurada' : 'Sin Evaluación'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {qData?.enabled
                          ? `${qData.title} &bull; ${qData.questions.length} reactivos &bull; Mínimo ${qData.passingScore}%`
                          : 'Puedes activar un examen exclusivo para medir el aprendizaje de este módulo'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!qData?.enabled) {
                        setModuleQuizzesMap(prev => ({
                          ...prev,
                          [mod.id]: {
                            ...prev[mod.id],
                            enabled: true
                          }
                        }));
                      }
                      setSelectedQuizModuleId(mod.id);
                      const el = document.getElementById('section-quiz-module-builder');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 bg-[#FAF5ED] hover:bg-[#e6f0ee] text-[#006657] border border-[#BC955C]/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{qData?.enabled ? 'Editar Evaluación de este Módulo' : '+ Activar Evaluación en este Módulo'}</span>
                  </button>
                </div>

                {/* Lessons List in Module */}
                <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-[#006657]/30">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>Lecciones y Materiales ({mod.lessons.length})</span>
                    <button
                      type="button"
                      onClick={() => handleAddLesson(mod.id)}
                      className="text-[#006657] hover:text-[#004d41] text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Lección Multimedia</span>
                    </button>
                  </div>

                  {mod.lessons.map((lesson, lesIdx) => (
                    <div key={lesson.id} className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex-1 flex items-center gap-2">
                          <span className="font-mono text-[11px] text-slate-400">#{lesIdx + 1}</span>
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => handleUpdateLesson(mod.id, lesson.id, { title: e.target.value })}
                            placeholder="Título de la lección..."
                            className="flex-1 px-2.5 py-1 text-xs font-semibold border-b border-transparent hover:border-slate-300 focus:border-[#006657] focus:outline-hidden"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-slate-500 text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            <input
                              type="number"
                              min="1"
                              max="120"
                              value={lesson.durationMinutes}
                              onChange={(e) => handleUpdateLesson(mod.id, lesson.id, { durationMinutes: Number(e.target.value) })}
                              className="w-12 px-1 py-0.5 text-xs text-center border border-slate-200 rounded font-mono"
                            />
                            <span>min</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteLesson(mod.id, lesson.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Eliminar lección"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Multimedia File Upload Row */}
                      <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-600 truncate">
                          {lesson.type === 'video' ? <Video className="w-4 h-4 text-[#006657]" /> : <Volume2 className="w-4 h-4 text-amber-500" />}
                          <span className="font-semibold">{lesson.mediaFileName || 'Sin archivo multimedia cargado'}</span>
                          {lesson.mediaFileSize && (
                            <span className="text-[10px] text-slate-400 font-mono">({lesson.mediaFileSize})</span>
                          )}
                        </div>

                        <label className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium cursor-pointer inline-flex items-center gap-1 self-start sm:self-auto">
                          <Upload className="w-3 h-3" />
                          <span>Subir Video / Audio</span>
                          <input
                            type="file"
                            accept="video/*,audio/*"
                            onChange={(e) => handleMediaUpload(mod.id, lesson.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Explanatory text */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Texto Explicativo y Apuntes Didácticos</label>
                        <textarea
                          rows={2}
                          value={lesson.content}
                          onChange={(e) => handleUpdateLesson(mod.id, lesson.id, { content: e.target.value })}
                          placeholder="Escribe la explicación teórica, normativas o procedimiento clínico..."
                          className="w-full p-2 text-xs rounded border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#006657] focus:outline-hidden font-sans"
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Automated Quiz Creator PER MODULE */}
      <div id="section-quiz-module-builder" className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="pb-3 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#006657] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#BC955C]" />
                <span>3. Sistema de Evaluaciones Automáticas por Módulo</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Crea y calibra una evaluación independiente para cada módulo temático del curso
              </p>
            </div>
          </div>
        </div>

        {/* Module Selector Tabs */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Selecciona el módulo para diseñar su evaluación:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
            {modules.map((m, idx) => {
              const q = moduleQuizzesMap[m.id];
              const isSelected = activeQuizModuleId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedQuizModuleId(m.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#006657] text-white shadow-xs border border-[#BC955C]/40'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Módulo {idx + 1}: {m.title || `Módulo ${idx + 1}`}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    q?.enabled
                      ? (isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800')
                      : (isSelected ? 'bg-white/10 text-white/70' : 'bg-slate-200 text-slate-500')
                  }`}>
                    {q?.enabled ? `${q.questions.length} reactivos` : 'Sin Examen'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quiz Configuration for Selected Module */}
        {activeQuizModuleId && (
          <div className="p-4 sm:p-5 rounded-xl border border-[#BC955C]/30 bg-[#FAF5ED]/40 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006657]" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Configuración de Evaluación: {modules.find(m => m.id === activeQuizModuleId)?.title}
                </h3>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-2xs">
                <input
                  type="checkbox"
                  checked={activeQuizConfig.enabled}
                  onChange={(e) => updateActiveQuizConfig({ enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-[#006657] focus:ring-[#006657] border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800">
                  {activeQuizConfig.enabled ? 'Evaluación Activada' : 'Activar Evaluación'}
                </span>
              </label>
            </div>

            {activeQuizConfig.enabled ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Título de la Evaluación</label>
                    <input
                      type="text"
                      value={activeQuizConfig.title}
                      onChange={(e) => updateActiveQuizConfig({ title: e.target.value })}
                      placeholder="Ej: Evaluación Módulo 1: Cifrado y NOM-024"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Aprobación Mínima (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={activeQuizConfig.passingScore}
                      onChange={(e) => updateActiveQuizConfig({ passingScore: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Límite de Tiempo (Minutos)</label>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={activeQuizConfig.timeLimitMinutes}
                      onChange={(e) => updateActiveQuizConfig({ timeLimitMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Questions Builder */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Award className="w-4 h-4 text-[#BC955C]" />
                      <span>Banco de Reactivos del Módulo ({activeQuizConfig.questions.length})</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddQuestionToActiveQuiz}
                      className="px-3 py-1.5 bg-[#006657] hover:bg-[#004d41] text-white font-bold rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Añadir Pregunta</span>
                    </button>
                  </div>

                  {activeQuizConfig.questions.map((q, qIdx) => (
                    <div key={q.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-slate-800">Reactivo {qIdx + 1}</span>
                        <div className="flex items-center gap-2">
                          <select
                            value={q.type}
                            onChange={(e) => {
                              const updated = activeQuizConfig.questions.map(item => 
                                item.id === q.id ? { ...item, type: e.target.value as QuestionType } : item
                              );
                              updateActiveQuizConfig({ questions: updated });
                            }}
                            className="text-xs px-2 py-1 rounded border border-slate-300 bg-white"
                          >
                            <option value="single_choice">Opción Múltiple (Única)</option>
                            <option value="true_false">Verdadero / Falso</option>
                            <option value="fill_blank">Completar Espacio en Blanco</option>
                          </select>

                          <div className="flex items-center gap-1 text-xs">
                            <input
                              type="number"
                              value={q.points}
                              onChange={(e) => {
                                const updated = activeQuizConfig.questions.map(item => 
                                  item.id === q.id ? { ...item, points: Number(e.target.value) } : item
                                );
                                updateActiveQuizConfig({ questions: updated });
                              }}
                              className="w-14 px-2 py-1 text-xs border border-slate-300 rounded font-mono text-center"
                            />
                            <span className="text-slate-500 font-mono">pts</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const filtered = activeQuizConfig.questions.filter(item => item.id !== q.id);
                              updateActiveQuizConfig({ questions: filtered });
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Eliminar pregunta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={q.text}
                        onChange={(e) => {
                          const updated = activeQuizConfig.questions.map(item => 
                            item.id === q.id ? { ...item, text: e.target.value } : item
                          );
                          updateActiveQuizConfig({ questions: updated });
                        }}
                        placeholder="Escribe el enunciado de la pregunta..."
                        className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
                      />

                      {/* Options or Fill blank */}
                      {q.type === 'fill_blank' ? (
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Respuesta Correcta Esperada:</label>
                          <input
                            type="text"
                            value={q.fillBlankAnswer || ''}
                            onChange={(e) => {
                              const updated = activeQuizConfig.questions.map(item => 
                                item.id === q.id ? { ...item, fillBlankAnswer: e.target.value } : item
                              );
                              updateActiveQuizConfig({ questions: updated });
                            }}
                            placeholder="Ej: clave secreta"
                            className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white font-mono"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-semibold text-slate-500">
                            Opciones de Respuesta (Marca el radio de la opción correcta):
                          </span>
                          {q.options?.map((opt, optIdx) => (
                            <div key={opt.id} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={opt.isCorrect}
                                onChange={() => {
                                  const updatedOptions = q.options?.map(o => ({
                                    ...o,
                                    isCorrect: o.id === opt.id
                                  }));
                                  const updated = activeQuizConfig.questions.map(item => 
                                    item.id === q.id ? { ...item, options: updatedOptions } : item
                                  );
                                  updateActiveQuizConfig({ questions: updated });
                                }}
                                className="w-4 h-4 text-[#006657] focus:ring-[#006657]"
                              />
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => {
                                  const updatedOptions = q.options?.map(o => 
                                    o.id === opt.id ? { ...o, text: e.target.value } : o
                                  );
                                  const updated = activeQuizConfig.questions.map(item => 
                                    item.id === q.id ? { ...item, options: updatedOptions } : item
                                  );
                                  updateActiveQuizConfig({ questions: updated });
                                }}
                                placeholder={`Opción ${optIdx + 1}`}
                                className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Explanation */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Retroalimentación Pedagógica IMSS:
                        </label>
                        <textarea
                          rows={2}
                          value={q.explanation}
                          onChange={(e) => {
                            const updated = activeQuizConfig.questions.map(item => 
                              item.id === q.id ? { ...item, explanation: e.target.value } : item
                            );
                            updateActiveQuizConfig({ questions: updated });
                          }}
                          placeholder="Explica por qué esta respuesta es la correcta y la justificación técnica..."
                          className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 space-y-2 bg-white rounded-lg border border-slate-200">
                <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-medium">Este módulo no tiene una evaluación activa actualmente.</p>
                <button
                  type="button"
                  onClick={() => updateActiveQuizConfig({ enabled: true })}
                  className="px-4 py-2 bg-[#006657] hover:bg-[#004d41] text-white rounded-lg text-xs font-bold transition-colors"
                >
                  + Habilitar Evaluación para este Módulo
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Save Bar */}
      <div className="flex justify-end gap-3 pb-8">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#006657] hover:bg-[#004d41] text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-2 border border-[#BC955C]/40"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Curso y Evaluaciones por Módulo</span>
        </button>
      </div>

    </div>
  );
};
