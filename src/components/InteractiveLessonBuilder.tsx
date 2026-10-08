import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Upload, 
  Video, 
  Volume2, 
  FileText, 
  Image as ImageIcon, 
  Award, 
  Plus, 
  Trash2, 
  Eye, 
  HelpCircle, 
  Clock, 
  Paperclip, 
  Sparkles,
  Layers,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { Course, Module, Lesson, LessonType, Quiz, Question, QuestionType, User } from '../types/lms';

interface InteractiveLessonBuilderProps {
  course: Course;
  currentUser: User;
  onSaveLessonWithQuiz: (moduleId: string, lesson: Lesson, newQuiz?: Quiz) => void;
  onBack: () => void;
}

export const InteractiveLessonBuilder: React.FC<InteractiveLessonBuilderProps> = ({
  course,
  currentUser,
  onSaveLessonWithQuiz,
  onBack
}) => {
  // Wizard steps: 1: Metadatos, 2: Multimedia, 3: Contenido Explicativo, 4: Evaluación Automática
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedModuleId, setSelectedModuleId] = useState<string>(course.modules[0]?.id || '');
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Paso 1: Metadatos
  const [title, setTitle] = useState('');
  const [lessonType, setLessonType] = useState<LessonType>('video');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);

  // Paso 2: Multimedia
  const [mediaFile, setMediaFile] = useState<{
    url: string;
    name: string;
    size: string;
    type: string;
  } | null>(null);

  const [attachments, setAttachments] = useState<{
    id: string;
    name: string;
    size: string;
    type: string;
    url: string;
  }[]>([]);

  // Paso 3: Texto Explicativo
  const [explanatoryContent, setExplanatoryContent] = useState(
    `### Objetivos de la Lección\n1. Comprender los conceptos esenciales del tema tratado.\n2. Analizar casos prácticos aplicados a la empresa.\n\n### Conceptos Clave\nAquí se detalla la explicación técnica que los alumnos estudiarán junto al material multimedia adjunto.`
  );

  // Paso 4: Evaluación Automática Integrada
  const [includeQuiz, setIncludeQuiz] = useState<boolean>(true);
  const [quizPassingScore, setQuizPassingScore] = useState<number>(70);
  const [quizTimeMinutes, setQuizTimeMinutes] = useState<number>(10);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: `q-${Date.now()}-1`,
      text: '¿Cuál es el propósito primordial de este módulo?',
      type: 'single_choice',
      points: 50,
      options: [
        { id: 'opt-1', text: 'Optimizar la seguridad y desempeño en el entorno productivo', isCorrect: true },
        { id: 'opt-2', text: 'Deshabilitar todas las auditorías del servidor local', isCorrect: false },
        { id: 'opt-3', text: 'Eliminar las copias de seguridad de datos', isCorrect: false }
      ],
      explanation: 'La arquitectura busca garantizar disponibilidad, confidencialidad y alto desempeño.'
    },
    {
      id: `q-${Date.now()}-2`,
      text: 'Indica el término técnico principal analizado en esta lección:',
      type: 'fill_blank',
      points: 50,
      fillBlankAnswer: 'cifrado',
      explanation: 'El cifrado robusto asegura la protección en reposo y en tránsito.'
    }
  ]);

  // Handle Media File Upload
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaFile({
            url: event.target.result as string,
            name: file.name,
            size: sizeMB,
            type: file.type
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Attachment Upload
  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newAtt = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type || 'application/octet-stream',
        url: '#'
      };
      setAttachments([...attachments, newAtt]);
    }
  };

  // Add Question
  const handleAddQuestion = (type: QuestionType) => {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      text: type === 'true_false' ? '¿El siguiente enunciado es Verdadero o Falso?' :
            type === 'fill_blank' ? 'Escribe la respuesta correcta a la siguiente premisa:' :
            'Selecciona la alternativa correcta:',
      type,
      points: 25,
      options: type === 'true_false' ? [
        { id: 'tf-1', text: 'Verdadero', isCorrect: true },
        { id: 'tf-2', text: 'Falso', isCorrect: false }
      ] : type === 'single_choice' ? [
        { id: `opt-1-${Date.now()}`, text: 'Opción A (Respuesta correcta)', isCorrect: true },
        { id: `opt-2-${Date.now()}`, text: 'Opción B (Distractor)', isCorrect: false }
      ] : undefined,
      fillBlankAnswer: type === 'fill_blank' ? 'término clave' : undefined,
      explanation: 'Explicación detallada de la respuesta correcta para el estudiante.'
    };
    setQuestions([...questions, newQ]);
  };

  const handleFinish = () => {
    if (!title.trim()) {
      alert('Por favor indica un título para la nueva lección.');
      setCurrentStep(1);
      return;
    }

    const lessonId = `les-${Date.now()}`;
    const newLesson: Lesson = {
      id: lessonId,
      title,
      type: lessonType,
      durationMinutes,
      content: explanatoryContent,
      mediaUrl: mediaFile?.url,
      mediaFileName: mediaFile?.name,
      mediaFileSize: mediaFile?.size,
      attachments,
      completedByStudentIds: []
    };

    let newQuiz: Quiz | undefined = undefined;
    if (includeQuiz && questions.length > 0) {
      newQuiz = {
        id: `quiz-${Date.now()}`,
        courseId: course.id,
        moduleId: selectedModuleId,
        title: `Evaluación: ${title}`,
        description: `Prueba automática de comprensión para la lección "${title}".`,
        passingScore: quizPassingScore,
        timeLimitMinutes: quizTimeMinutes,
        questions
      };
    }

    onSaveLessonWithQuiz(selectedModuleId, newLesson, newQuiz);
  };

  const steps = [
    { number: 1, title: 'Estructura & Tipo', desc: 'Metadatos básicos' },
    { number: 2, title: 'Archivos Multimedia', desc: 'Video, audio o PDF' },
    { number: 3, title: 'Texto Explicativo', desc: 'Contenido teórico' },
    { number: 4, title: 'Evaluación Automática', desc: 'Quizzes y rúbricas' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Flujo de Creación de Contenido Interactivo IMSS
            </h1>
            <p className="text-xs text-slate-500">
              Curso: <strong className="text-[#006657]">{course.title}</strong> &bull; Paso guiado para docentes y coordinadores
            </p>
          </div>
        </div>

        <button
          onClick={() => setPreviewMode(!previewMode)}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto border ${
            previewMode 
              ? 'bg-[#006657] text-white border-[#006657]' 
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{previewMode ? 'Volver al Editor' : 'Vista Previa de Alumno'}</span>
        </button>
      </div>

      {/* Step Indicator Progress Bar */}
      {!previewMode && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {steps.map(s => {
              const isCurrent = currentStep === s.number;
              const isCompleted = currentStep > s.number;

              return (
                <button
                  key={s.number}
                  onClick={() => setCurrentStep(s.number)}
                  className={`p-3 rounded-lg text-left transition-all border ${
                    isCurrent
                      ? 'border-[#006657] bg-[#e6f0ee] text-[#006657] ring-1 ring-[#006657]'
                      : isCompleted
                      ? 'border-slate-200 bg-[#FAF5ED] text-slate-700 hover:bg-slate-100'
                      : 'border-transparent text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-5 h-5 rounded-full text-xs font-mono font-bold flex items-center justify-center ${
                      isCompleted ? 'bg-[#BC955C] text-white' :
                      isCurrent ? 'bg-[#006657] text-white' :
                      'bg-slate-200 text-slate-500'
                    }`}>
                      {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.number}
                    </span>
                    <span className="text-xs font-bold truncate">{s.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{s.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Wizard Body or Live Preview */}
      {previewMode ? (
        /* Preview as Student */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Estás viendo la lección exactamente como la experimentará el estudiante en la plataforma.</span>
          </div>

          <div>
            <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{lessonType.toUpperCase()} &bull; {durationMinutes} MINUTOS</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{title || 'Título de la Lección sin definir'}</h2>
          </div>

          {/* Media Preview */}
          {mediaFile ? (
            <div className="rounded-xl overflow-hidden bg-slate-950 p-2 border border-slate-800">
              {lessonType === 'video' ? (
                <video src={mediaFile.url} controls className="w-full max-h-96 object-contain mx-auto rounded" />
              ) : lessonType === 'audio' ? (
                <div className="p-6">
                  <p className="text-white text-xs font-mono mb-2">{mediaFile.name}</p>
                  <audio src={mediaFile.url} controls className="w-full" />
                </div>
              ) : (
                <div className="p-6 text-center text-white text-xs">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
                  <p>{mediaFile.name} ({mediaFile.size})</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 bg-slate-100 rounded-xl text-center text-xs text-slate-500">
              No has subido un archivo multimedia para esta lección todavía.
            </div>
          )}

          {/* Text Content */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 prose prose-slate text-xs sm:text-sm whitespace-pre-wrap">
            {explanatoryContent}
          </div>

          {/* Attached Quiz Info */}
          {includeQuiz && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <h4 className="text-xs font-bold text-amber-900 uppercase">Evaluación Automática Adjunta</h4>
              <p className="text-xs text-amber-800 mt-1">
                {questions.length} preguntas configuradas &bull; Mínimo de aprobación: {quizPassingScore}% &bull; Tiempo: {quizTimeMinutes} min.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Wizard Steps */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          
          {/* PASO 1: Estructura y Metadatos */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Paso 1: Estructura & Metadatos de la Lección
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define el módulo de destino, título y formato multimedia prioritario
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Módulo del Curso</label>
                <select
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  {course.modules.map(mod => (
                    <option key={mod.id} value={mod.id}>
                      Módulo {mod.order}: {mod.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título de la Lección *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Hardening Criptográfico y Gestión de Certificados SSL"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Formato Principal de Contenido</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLessonType('video')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        lessonType === 'video' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>Video MP4</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLessonType('audio')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        lessonType === 'audio' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Audio / Podcast</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLessonType('document')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        lessonType === 'document' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Documento PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLessonType('interactive')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        lessonType === 'interactive' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Interactivo</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duración Estimada de Aprendizaje</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="5"
                      max="180"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-24 px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono text-center"
                    />
                    <span className="text-xs text-slate-500">minutos lectivos</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Recomendado: 10 a 25 min para microaprendizaje móvil efectivo.</p>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: Subida y Gestión de Archivos Multimedia */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Paso 2: Subida de Archivos Multimedia (Video, Audio, Imágenes)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Los archivos se alojan en el servidor local de la empresa con respaldo opcional en la nube
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center bg-indigo-50/30 hover:bg-indigo-50/50 transition-colors flex flex-col items-center justify-center">
                <Upload className="w-10 h-10 text-indigo-500 mb-2" />
                <h3 className="text-xs font-bold text-slate-800">
                  Selecciona o arrastra el archivo multimedia principal
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Formatos aceptados: MP4, WebM (video) &bull; MP3, WAV (audio) &bull; PDF, PNG, JPG (documentos)
                </p>

                <label className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
                  <span>Explorar Archivos en tu Computadora</span>
                  <input
                    type="file"
                    accept="video/*,audio/*,application/pdf,image/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploaded Media Summary Card */}
              {mediaFile && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{mediaFile.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {mediaFile.size} &bull; {mediaFile.type || 'Multimedia local'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setMediaFile(null)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    title="Eliminar archivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Supplementary Attachments (PDFs, Templates, Slides) */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Archivos Descargables Adjuntos ({attachments.length})</span>
                  <label className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Guía en PDF o Diapositiva</span>
                    <input
                      type="file"
                      accept="application/pdf,image/*,.docx,.xlsx"
                      onChange={handleAttachmentUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {attachments.map(att => (
                  <div key={att.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-800">{att.name}</span>
                      <span className="text-slate-400 font-mono">({att.size})</span>
                    </div>
                    <button
                      onClick={() => setAttachments(attachments.filter(a => a.id !== att.id))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 3: Texto Explicativo & Contenido */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Paso 3: Texto Explicativo y Notas Didácticas
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Redacta los objetivos, explicaciones técnicas, notas destacadas y comandos
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cuerpo Explicativo de la Lección
                </label>
                <textarea
                  rows={8}
                  value={explanatoryContent}
                  onChange={(e) => setExplanatoryContent(e.target.value)}
                  placeholder="Redacta la guía para los estudiantes..."
                  className="w-full px-4 py-3 text-xs sm:text-sm font-mono leading-relaxed rounded-xl border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Consejos de formato pedagógico:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-500">
                  <li>Usa <code>### Título</code> para crear subtítulos temáticos claros.</li>
                  <li>Usa <code>&gt; Nota importante</code> para generar cajas destacadas para el estudiante.</li>
                  <li>Usa <code>```código```</code> para bloques de configuración técnica o comandos.</li>
                </ul>
              </div>
            </div>
          )}

          {/* PASO 4: Evaluaciones Automáticas */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Paso 4: Evaluaciones Automáticas de Aprendizaje
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Calificación instantánea con retroalimentación y registro en el panel de analíticas
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeQuiz}
                    onChange={(e) => setIncludeQuiz(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-800">Adjuntar Evaluación</span>
                </label>
              </div>

              {includeQuiz && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Puntaje Mínimo de Aprobación (%)</label>
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={quizPassingScore}
                        onChange={(e) => setQuizPassingScore(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Límite de Tiempo (Minutos)</label>
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={quizTimeMinutes}
                        onChange={(e) => setQuizTimeMinutes(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                      />
                    </div>
                  </div>

                  {/* Add Question Selector */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-slate-700">Preguntas Configuradas ({questions.length})</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAddQuestion('single_choice')}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold"
                      >
                        + Opción Múltiple
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddQuestion('true_false')}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold"
                      >
                        + V / F
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddQuestion('fill_blank')}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold"
                      >
                        + Respuesta Corta
                      </button>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-4">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-700">
                            Pregunta #{idx + 1} &bull; {q.type === 'single_choice' ? 'Opción Múltiple' : q.type === 'true_false' ? 'Verdadero/Falso' : 'Respuesta Corta'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuestions(questions.filter(item => item.id !== q.id))}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={q.text}
                          onChange={(e) => {
                            setQuestions(questions.map(item => item.id === q.id ? { ...item, text: e.target.value } : item));
                          }}
                          placeholder="Enunciado de la pregunta..."
                          className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                        />

                        {/* Options */}
                        {q.options && (
                          <div className="space-y-1.5 pl-2">
                            {q.options.map(opt => (
                              <div key={opt.id} className="flex items-center gap-2 text-xs">
                                <input
                                  type="radio"
                                  name={`builder-correct-${q.id}`}
                                  checked={opt.isCorrect}
                                  onChange={() => {
                                    const updatedOpts = q.options?.map(o => ({ ...o, isCorrect: o.id === opt.id }));
                                    setQuestions(questions.map(item => item.id === q.id ? { ...item, options: updatedOpts } : item));
                                  }}
                                  className="w-4 h-4 text-emerald-600"
                                />
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => {
                                    const updatedOpts = q.options?.map(o => o.id === opt.id ? { ...o, text: e.target.value } : o);
                                    setQuestions(questions.map(item => item.id === q.id ? { ...item, options: updatedOpts } : item));
                                  }}
                                  className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {q.type === 'fill_blank' && (
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Palabra o Respuesta Exacta:</label>
                            <input
                              type="text"
                              value={q.fillBlankAnswer || ''}
                              onChange={(e) => {
                                setQuestions(questions.map(item => item.id === q.id ? { ...item, fillBlankAnswer: e.target.value } : item));
                              }}
                              className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 bg-white"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Explicación Pedagógica Inmediata:</label>
                          <input
                            type="text"
                            value={q.explanation}
                            onChange={(e) => {
                              setQuestions(questions.map(item => item.id === q.id ? { ...item, explanation: e.target.value } : item));
                            }}
                            className="w-full px-3 py-1 text-xs rounded border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 ${
                currentStep === 1 ? 'opacity-40 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Paso Anterior
            </button>

            <div className="flex items-center gap-3">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                  className="px-5 py-2 bg-[#006657] hover:bg-[#004d41] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Siguiente Paso</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-6 py-2 bg-[#006657] hover:bg-[#004d41] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors border border-[#BC955C]"
                >
                  <Check className="w-4 h-4" />
                  <span>Publicar Lección en Servidor IMSS</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
