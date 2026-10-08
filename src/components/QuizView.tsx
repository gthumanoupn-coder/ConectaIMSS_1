import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Award, 
  RotateCcw, 
  ChevronRight,
  ShieldCheck,
  Check,
  FileCheck2
} from 'lucide-react';
import { Quiz, QuizAttempt, User, Course } from '../types/lms';

interface QuizViewProps {
  quiz: Quiz;
  course: Course;
  currentUser: User;
  onBack: () => void;
  onSaveAttempt: (attempt: QuizAttempt) => void;
  onOpenCertificate: (attempt: QuizAttempt) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  quiz,
  course,
  currentUser,
  onBack,
  onSaveAttempt,
  onOpenCertificate
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(quiz.timeLimitMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultAttempt, setResultAttempt] = useState<QuizAttempt | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const questions = quiz.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;

    if (currentQuestion.type === 'multiple_choice') {
      const currentList: string[] = answers[currentQuestion.id] || [];
      const updated = currentList.includes(optionId)
        ? currentList.filter(id => id !== optionId)
        : [...currentList, optionId];
      setAnswers({ ...answers, [currentQuestion.id]: updated });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: optionId });
    }
  };

  const handleFillBlankChange = (text: string) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [currentQuestion.id]: text });
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    // Automatic grading calculation
    let totalScore = 0;
    let maxPossibleScore = 0;

    questions.forEach(q => {
      maxPossibleScore += q.points;
      const userAns = answers[q.id];

      if (q.type === 'single_choice' || q.type === 'true_false') {
        const correctOpt = q.options?.find(o => o.isCorrect);
        if (correctOpt && userAns === correctOpt.id) {
          totalScore += q.points;
        }
      } else if (q.type === 'multiple_choice') {
        const correctOptIds = q.options?.filter(o => o.isCorrect).map(o => o.id) || [];
        const userOptIds: string[] = userAns || [];
        // Check if exact match
        const isExact = 
          correctOptIds.length === userOptIds.length &&
          correctOptIds.every(id => userOptIds.includes(id));
        if (isExact) {
          totalScore += q.points;
        }
      } else if (q.type === 'fill_blank') {
        const expected = (q.fillBlankAnswer || '').trim().toLowerCase();
        const actual = String(userAns || '').trim().toLowerCase();
        if (expected && actual === expected) {
          totalScore += q.points;
        }
      }
    });

    const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
    const passed = percentage >= quiz.passingScore;

    const attempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      courseId: course.id,
      courseTitle: course.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      score: totalScore,
      maxScore: maxPossibleScore,
      percentage,
      passed,
      completedAt: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
      answers
    };

    setResultAttempt(attempt);
    setIsSubmitted(true);
    onSaveAttempt(attempt);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      
      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Curso</span>
        </button>

        {!isSubmitted && (
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold ${
              timeLeftSeconds < 180 
                ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' 
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Aprobación: <strong className="font-mono text-slate-700">{quiz.passingScore}%</strong>
            </span>
          </div>
        )}
      </div>

      {/* When Quiz is In Progress */}
      {!isSubmitted && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          
          {/* Module & Quiz Context Header */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-[#BC955C] uppercase tracking-wider">
                {course.title}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-[11px] font-semibold text-[#006657] bg-[#e6f0ee] px-2 py-0.5 rounded">
                {(() => {
                  const mod = course.modules.find(m => m.id === quiz.moduleId);
                  return mod ? `Módulo ${mod.order}: ${mod.title}` : 'Evaluación de Módulo';
                })()}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {quiz.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {quiz.description}
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Pregunta <strong className="text-slate-900 font-mono">{currentQuestionIndex + 1}</strong> de <strong className="font-mono">{questions.length}</strong></span>
              <span>{currentQuestion.points} puntos</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#006657] rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="pt-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion.text}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {currentQuestion.type === 'single_choice' && 'Selecciona la única opción correcta.'}
              {currentQuestion.type === 'multiple_choice' && 'Selecciona todas las opciones válidas (puede haber más de una).'}
              {currentQuestion.type === 'true_false' && 'Indica si el postulado es Verdadero o Falso.'}
              {currentQuestion.type === 'fill_blank' && 'Escribe la respuesta en el campo de texto a continuación.'}
            </p>
          </div>

          {/* Question Options or Fill in Blank */}
          <div className="space-y-3 pt-2">
            {currentQuestion.type === 'fill_blank' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Escribe tu respuesta técnica:
                </label>
                <input
                  type="text"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleFillBlankChange(e.target.value)}
                  placeholder="Escribe aquí tu término o respuesta..."
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#006657] focus:outline-hidden"
                />
              </div>
            ) : (
              currentQuestion.options?.map((option) => {
                const isSelected = currentQuestion.type === 'multiple_choice'
                  ? (answers[currentQuestion.id] || []).includes(option.id)
                  : answers[currentQuestion.id] === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full flex items-start gap-3 p-3.5 sm:p-4 rounded-xl text-left border transition-all text-xs sm:text-sm ${
                      isSelected
                        ? 'border-[#006657] bg-[#e6f0ee] text-[#006657] font-medium ring-1 ring-[#006657]'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                      isSelected 
                        ? 'bg-[#006657] border-[#006657] text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="flex-1 leading-relaxed">{option.text}</span>
                  </button>
                );
              })
            )}
          </div>

          {/* Stepper Buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 transition-colors ${
                currentQuestionIndex === 0 
                  ? 'opacity-40 cursor-not-allowed text-slate-400' 
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Anterior
            </button>

            <div className="flex items-center gap-3">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 text-xs font-bold bg-[#006657] hover:bg-[#004d41] text-white rounded-lg transition-colors flex items-center gap-2 shadow-xs border border-[#BC955C]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finalizar y Calificar en Sistema IMSS</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Automated Results Screen */}
      {isSubmitted && resultAttempt && (
        <div className="space-y-6">
          
          {/* Banner Result */}
          <div className={`p-6 sm:p-8 rounded-xl border text-center ${
            resultAttempt.passed 
              ? 'bg-[#FAF5ED] border-[#BC955C] text-[#006657]' 
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 shadow-xs bg-white border border-[#BC955C]/40">
              {resultAttempt.passed ? (
                <Award className="w-8 h-8 text-[#006657]" />
              ) : (
                <AlertCircle className="w-8 h-8 text-rose-600" />
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold">
              {resultAttempt.passed ? '¡Acreditación Oficial IMSS Obtenida!' : 'Evaluación No Acreditada'}
            </h2>
            <p className="text-xs sm:text-sm mt-1 text-slate-600 max-w-md mx-auto">
              {resultAttempt.passed 
                ? 'Has superado el puntaje mínimo institucional establecido por la Coordinación de Educación en Salud.'
                : 'No alcanzaste el porcentaje de aprobación mínimo (requerido: ' + quiz.passingScore + '%). Revisa los contenidos clínicos e inténtalo nuevamente.'
              }
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="bg-white/80 backdrop-blur-xs px-4 py-2 rounded-lg border border-slate-200/60">
                <span className="text-xs text-slate-500 block">Calificación</span>
                <span className="text-xl font-mono font-bold text-[#006657]">
                  {resultAttempt.percentage}%
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs px-4 py-2 rounded-lg border border-slate-200/60">
                <span className="text-xs text-slate-500 block">Puntaje</span>
                <span className="text-xl font-mono font-bold text-slate-900">
                  {resultAttempt.score} / {resultAttempt.maxScore}
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs px-4 py-2 rounded-lg border border-slate-200/60">
                <span className="text-xs text-slate-500 block">Estado</span>
                <span className={`text-sm font-bold uppercase tracking-wider ${resultAttempt.passed ? 'text-[#006657]' : 'text-rose-700'}`}>
                  {resultAttempt.passed ? 'Acreditado' : 'Reprobado'}
                </span>
              </div>
            </div>

            {/* Actions for Certificate or Retry */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {resultAttempt.passed && (
                <button
                  onClick={() => onOpenCertificate(resultAttempt)}
                  className="px-5 py-2.5 bg-[#006657] hover:bg-[#004d41] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors border border-[#BC955C]"
                >
                  <FileCheck2 className="w-4 h-4 text-[#DDC9A3]" />
                  <span>Ver Constancia Oficial IMSS</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setAnswers({});
                  setCurrentQuestionIndex(0);
                  setTimeLeftSeconds(quiz.timeLimitMinutes * 60);
                }}
                className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reintentar Evaluación</span>
              </button>

              <button
                onClick={onBack}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Volver a la Lección
              </button>
            </div>
          </div>

          {/* Question-by-Question Review with Explanations */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Desglose y Retroalimentación Pedagógica
            </h3>

            <div className="space-y-6 divide-y divide-slate-100">
              {questions.map((q, idx) => {
                const userAns = resultAttempt.answers[q.id];
                let isCorrect = false;

                if (q.type === 'single_choice' || q.type === 'true_false') {
                  const correctOpt = q.options?.find(o => o.isCorrect);
                  isCorrect = Boolean(correctOpt && userAns === correctOpt.id);
                } else if (q.type === 'multiple_choice') {
                  const correctOptIds = q.options?.filter(o => o.isCorrect).map(o => o.id) || [];
                  const userOptIds: string[] = userAns || [];
                  isCorrect = correctOptIds.length === userOptIds.length && correctOptIds.every(id => userOptIds.includes(id));
                } else if (q.type === 'fill_blank') {
                  const expected = (q.fillBlankAnswer || '').trim().toLowerCase();
                  const actual = String(userAns || '').trim().toLowerCase();
                  isCorrect = expected === actual;
                }

                return (
                  <div key={q.id} className={idx > 0 ? 'pt-6' : ''}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>Pregunta {idx + 1}</span>
                          <span className={`font-mono font-semibold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isCorrect ? `+${q.points} pts` : '0 pts'}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                          {q.text}
                        </h4>

                        {/* Options Review */}
                        {q.options && (
                          <div className="mt-3 space-y-1.5">
                            {q.options.map(opt => {
                              const wasSelected = q.type === 'multiple_choice' 
                                ? (userAns || []).includes(opt.id)
                                : userAns === opt.id;

                              let optBg = 'bg-slate-50 text-slate-700 border-slate-200';
                              if (opt.isCorrect) {
                                optBg = 'bg-emerald-50 text-emerald-900 border-emerald-300 font-medium';
                              } else if (wasSelected && !opt.isCorrect) {
                                optBg = 'bg-rose-50 text-rose-900 border-rose-300 line-through';
                              }

                              return (
                                <div 
                                  key={opt.id}
                                  className={`px-3 py-2 rounded-lg text-xs border flex items-center justify-between ${optBg}`}
                                >
                                  <span>{opt.text}</span>
                                  {opt.isCorrect && (
                                    <span className="text-[10px] uppercase font-bold text-emerald-700">Respuesta Correcta</span>
                                  )}
                                  {wasSelected && !opt.isCorrect && (
                                    <span className="text-[10px] uppercase font-bold text-rose-700">Tu selección</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {q.type === 'fill_blank' && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                            <div>Tu respuesta: <strong className="font-mono text-slate-800">{userAns || '(En blanco)'}</strong></div>
                            <div>Respuesta esperada: <strong className="font-mono text-emerald-700">{q.fillBlankAnswer}</strong></div>
                          </div>
                        )}

                        {/* Pedagogical Explanation */}
                        {q.explanation && (
                          <div className="mt-3 p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs text-indigo-950 leading-relaxed">
                            <span className="font-bold text-indigo-900 block mb-0.5">Explicación Técnica:</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
