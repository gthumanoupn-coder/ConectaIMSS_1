import React, { useState } from 'react';
import { 
  Award, 
  Palette, 
  Save, 
  RotateCcw, 
  Printer, 
  Eye, 
  Sliders, 
  FileText, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  Building, 
  QrCode, 
  Maximize2, 
  Minimize2,
  Undo2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { 
  CertificateTemplate, 
  CertificateSigner, 
  CertificateBorderFamily, 
  CertificateFontFamily, 
  CertificateSealType,
  QuizAttempt,
  User,
  Course
} from '../types/lms';
import { INITIAL_CERTIFICATE_TEMPLATE } from '../data/initialData';
import { CertificateDocument } from './CertificateDocument';

interface CertificateDesignerProps {
  initialTemplate: CertificateTemplate;
  users: User[];
  courses: Course[];
  quizAttempts: QuizAttempt[];
  onSaveTemplate: (template: CertificateTemplate) => void;
  onLogAudit: (action: string, details: string, status: 'success' | 'warning' | 'alert') => void;
  showToast: (msg: string) => void;
}

export const CertificateDesigner: React.FC<CertificateDesignerProps> = ({
  initialTemplate,
  users,
  courses,
  quizAttempts,
  onSaveTemplate,
  onLogAudit,
  showToast
}) => {
  const [template, setTemplate] = useState<CertificateTemplate>(initialTemplate);
  const [activeEditorTab, setActiveEditorTab] = useState<'presets' | 'content' | 'appearance' | 'signers' | 'security'>('presets');
  const [isFullscreenPreview, setIsFullscreenPreview] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Demo preview selector
  const availableStudents = users.filter(u => u.role === 'alumno');
  const [previewStudentId, setPreviewStudentId] = useState<string>(availableStudents[0]?.id || 'user-alum-1');
  const [previewCourseId, setPreviewCourseId] = useState<string>(courses[0]?.id || 'course-arch-01');

  const selectedStudent = users.find(u => u.id === previewStudentId) || availableStudents[0] || {
    id: 'demo-student',
    name: 'Dr. Carlos Mendoza Ruiz',
    email: 'carlos.mendoza@imss.gob.mx'
  };

  const selectedCourse = courses.find(c => c.id === previewCourseId) || courses[0] || {
    id: 'demo-course',
    title: 'Arquitectura y Mantenimiento de Servidores Locales de Unidades Médicas'
  };

  // Mock attempt for live preview
  const previewAttempt: QuizAttempt = {
    id: 'preview-cert-84920',
    quizId: 'quiz-preview',
    quizTitle: 'Evaluación de Certificación de Competencias',
    courseId: selectedCourse.id,
    courseTitle: selectedCourse.title,
    studentId: selectedStudent.id,
    studentName: selectedStudent.name,
    studentEmail: selectedStudent.email,
    score: 95,
    maxScore: 100,
    percentage: 95,
    passed: true,
    completedAt: '08 de Octubre de 2026',
    answers: {}
  };

  // Template Presets
  const presets = [
    {
      id: 'imss-tradicional',
      name: 'Institucional IMSS Tradicional',
      description: 'Verde IMSS #006657 con filete dorado #BC955C, marco doble y sello oficial de la CUPN.',
      previewColor: '#006657',
      accentColor: '#BC955C',
      bgColor: '#FAF9F6',
      borderFamily: 'classic-double' as CertificateBorderFamily,
      fontFamily: 'serif' as CertificateFontFamily,
      sealType: 'imss-gold' as CertificateSealType,
      docTitle: 'CONSTANCIA DE ACREDITACIÓN ACADÉMICA'
    },
    {
      id: 'excelencia-clinica',
      name: 'Excelencia Quirúrgica y Clínica',
      description: 'Azul Marino Ejecutivo #0C2340 con acento dorado #D4AF37 y marco orlado solemne.',
      previewColor: '#0C2340',
      accentColor: '#D4AF37',
      bgColor: '#FFFFFF',
      borderFamily: 'ornate-gold' as CertificateBorderFamily,
      fontFamily: 'serif' as CertificateFontFamily,
      sealType: 'digital-hologram' as CertificateSealType,
      docTitle: 'DIPLOMA DE EXCELENCIA CLÍNICA'
    },
    {
      id: 'cupn-tecnologico',
      name: 'Acreditación Tecnológica CUPN',
      description: 'Esmeralda tecnológico #047857 con borde moderno geométrico y sello de salud digital.',
      previewColor: '#047857',
      accentColor: '#0284C7',
      bgColor: '#F8FAFC',
      borderFamily: 'modern-clean' as CertificateBorderFamily,
      fontFamily: 'sans' as CertificateFontFamily,
      sealType: 'cupn-shield' as CertificateSealType,
      docTitle: 'CERTIFICADO DE CAPACITACIÓN DIGITAL'
    },
    {
      id: 'oro-honor',
      name: 'Reconocimiento al Mérito Institucional',
      description: 'Borgoña Institucional #621132 con oro cálido #C5A059 y distinción de honor médico.',
      previewColor: '#621132',
      accentColor: '#C5A059',
      bgColor: '#FAF5EE',
      borderFamily: 'ornate-gold' as CertificateBorderFamily,
      fontFamily: 'serif' as CertificateFontFamily,
      sealType: 'nom024-badge' as CertificateSealType,
      docTitle: 'RECONOCIMIENTO AL MÉRITO EN SALUD'
    },
    {
      id: 'minimal-salud',
      name: 'Distinción Médica Minimalista',
      description: 'Grafito contemporáneo #1E293B con sutil ribete verde IMSS y diseño limpio.',
      previewColor: '#1E293B',
      accentColor: '#006657',
      bgColor: '#FFFFFF',
      borderFamily: 'minimalist' as CertificateBorderFamily,
      fontFamily: 'sans' as CertificateFontFamily,
      sealType: 'imss-gold' as CertificateSealType,
      docTitle: 'CONSTANCIA OFICIAL DE PARTICIPACIÓN'
    }
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setTemplate(prev => ({
      ...prev,
      templatePreset: preset.id,
      primaryColor: preset.previewColor,
      accentColor: preset.accentColor,
      backgroundColor: preset.bgColor,
      borderFamily: preset.borderFamily,
      fontFamily: preset.fontFamily,
      sealType: preset.sealType,
      documentTypeTitle: preset.docTitle
    }));
    setHasUnsavedChanges(true);
    showToast(`Plantilla "${preset.name}" aplicada a la previsualización.`);
  };

  const updateField = <K extends keyof CertificateTemplate>(key: K, value: CertificateTemplate[K]) => {
    setTemplate(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleUpdateSigner = (index: number, updatedFields: Partial<CertificateSigner>) => {
    const updatedSigners = [...template.signers];
    updatedSigners[index] = { ...updatedSigners[index], ...updatedFields };
    setTemplate(prev => ({ ...prev, signers: updatedSigners }));
    setHasUnsavedChanges(true);
  };

  const handleAddSigner = () => {
    if (template.signers.length >= 3) {
      showToast('El formato oficial admite un máximo de 3 autoridades firmantes simultáneas.');
      return;
    }
    const newSigner: CertificateSigner = {
      id: `sig-${Date.now()}`,
      name: 'Dr. Autoridad Médica',
      title: 'Jefatura de Servicios de Educación Médica',
      department: 'Delegación Regional IMSS',
      signatureStyle: 'calligraphy-3',
      enabled: true
    };
    setTemplate(prev => ({
      ...prev,
      signers: [...prev.signers, newSigner]
    }));
    setHasUnsavedChanges(true);
    showToast('Nueva autoridad firmante añadida.');
  };

  const handleRemoveSigner = (index: number) => {
    if (template.signers.length <= 1) {
      showToast('Debe existir al menos una autoridad institucional firmante en el documento.');
      return;
    }
    const updatedSigners = template.signers.filter((_, i) => i !== index);
    setTemplate(prev => ({ ...prev, signers: updatedSigners }));
    setHasUnsavedChanges(true);
    showToast('Firmante removido.');
  };

  const handleSave = () => {
    const savedTemplate: CertificateTemplate = {
      ...template,
      lastModifiedAt: new Date().toISOString().slice(0, 10)
    };
    onSaveTemplate(savedTemplate);
    setTemplate(savedTemplate);
    setHasUnsavedChanges(false);
    showToast('¡Diseño oficial de diplomas y reconocimientos guardado con éxito!');
    onLogAudit(
      'Edición de Diseño de Diplomas',
      `El administrador actualizó el diseño oficial (${template.documentTypeTitle}) con plantilla ${template.templatePreset}`,
      'success'
    );
  };

  const handleResetToDefault = () => {
    if (window.confirm('¿Deseas restablecer el diseño del diploma a los valores institucionales estándar de la CUPN IMSS?')) {
      setTemplate(INITIAL_CERTIFICATE_TEMPLATE);
      onSaveTemplate(INITIAL_CERTIFICATE_TEMPLATE);
      setHasUnsavedChanges(false);
      showToast('Diseño restablecido a la plantilla IMSS tradicional por defecto.');
      onLogAudit(
        'Restablecimiento de Plantilla de Diploma',
        'Se restableció el diseño del diploma al formato original de la plataforma',
        'warning'
      );
    }
  };

  const handlePrintTest = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Module Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#006657]/10 text-[#006657]">
              <Award className="w-5 h-5 text-[#006657]" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Módulo de Diseño de Diplomas & Reconocimientos
            </h1>
            {hasUnsavedChanges && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                Cambios pendientes de guardar
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Personaliza el membrete institucional, títulos de acreditación, paleta de colores, marco heráldico, autoridades firmantes y sellos NOM-024 de todas las constancias emitidas a los alumnos de la plataforma.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetToDefault}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Restablecer plantilla inicial de fábrica"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <button
            onClick={handlePrintTest}
            className="px-3.5 py-2 bg-[#FAF5ED] hover:bg-[#e6f0ee] text-[#006657] border border-[#BC955C]/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Probar vista previa de impresión o exportar PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>

          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs ${
              hasUnsavedChanges
                ? 'bg-[#006657] hover:bg-[#004d41] text-white ring-2 ring-[#006657]/30'
                : 'bg-[#006657] hover:bg-[#004d41] text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Guardar Diseño Oficial</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Controls & Settings (7 cols) */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-4">
          
          {/* Editor Sub-Tabs Navigation */}
          <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveEditorTab('presets')}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                activeEditorTab === 'presets'
                  ? 'bg-[#006657] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plantillas</span>
            </button>

            <button
              onClick={() => setActiveEditorTab('content')}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                activeEditorTab === 'content'
                  ? 'bg-[#006657] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Textos</span>
            </button>

            <button
              onClick={() => setActiveEditorTab('appearance')}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                activeEditorTab === 'appearance'
                  ? 'bg-[#006657] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Estilo & Borde</span>
            </button>

            <button
              onClick={() => setActiveEditorTab('signers')}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                activeEditorTab === 'signers'
                  ? 'bg-[#006657] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Firmas ({template.signers.filter(s => s.enabled).length})</span>
            </button>

            <button
              onClick={() => setActiveEditorTab('security')}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                activeEditorTab === 'security'
                  ? 'bg-[#006657] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Seguridad</span>
            </button>
          </div>

          {/* TAB 1: PRESETS */}
          {activeEditorTab === 'presets' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#BC955C]" />
                  <span>Estilos de Plantillas Preconfiguradas</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecciona una plantilla base aprobada institucionalmente y adáptala a las necesidades del curso o especialidad.
                </p>
              </div>

              <div className="space-y-3">
                {presets.map(p => {
                  const isSelected = template.templatePreset === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => applyPreset(p)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-[#006657] bg-[#e6f0ee]/40 ring-1 ring-[#006657]'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Color Palette Pill Preview */}
                      <div className="w-10 h-10 rounded-lg shrink-0 flex flex-col overflow-hidden border border-slate-200 shadow-2xs">
                        <div className="h-1/2 w-full" style={{ backgroundColor: p.previewColor }} />
                        <div className="h-1/2 w-full" style={{ backgroundColor: p.accentColor }} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-slate-900">{p.name}</h3>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-[#006657] flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-[#006657]/30">
                              <Check className="w-3 h-3" /> Activa
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">{p.description}</p>
                        <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded">{p.docTitle}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TEXTOS & MEMBRETE */}
          {activeEditorTab === 'content' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#006657]" />
                  <span>Membrete & Textos Institucionales</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define los títulos oficiales, dependencias convocantes y redacción legal del documento.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Institución Emisora
                  </label>
                  <input
                    type="text"
                    value={template.institutionName}
                    onChange={(e) => updateField('institutionName', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#006657]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Coordinación o Dependencia Médica
                  </label>
                  <input
                    type="text"
                    value={template.coordinationName}
                    onChange={(e) => updateField('coordinationName', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#006657]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre del Sistema / Plataforma
                    </label>
                    <input
                      type="text"
                      value={template.platformName}
                      onChange={(e) => updateField('platformName', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#006657]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Lema Institucional
                    </label>
                    <input
                      type="text"
                      value={template.slogan}
                      onChange={(e) => updateField('slogan', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#006657]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo de Documento / Título Principal
                  </label>
                  <div className="flex gap-2 mb-2">
                    {['CONSTANCIA DE ACREDITACIÓN ACADÉMICA', 'DIPLOMA DE EXCELENCIA', 'RECONOCIMIENTO AL MÉRITO'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => updateField('documentTypeTitle', t)}
                        className={`text-[10px] px-2 py-1 rounded border font-mono transition-colors ${
                          template.documentTypeTitle === t
                            ? 'bg-[#006657] text-white border-[#006657]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {t.slice(0, 20)}...
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={template.documentTypeTitle}
                    onChange={(e) => updateField('documentTypeTitle', e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#006657]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Texto Introductorio
                  </label>
                  <textarea
                    rows={2}
                    value={template.introductoryText}
                    onChange={(e) => updateField('introductoryText', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#006657]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cláusula de Acreditación / Texto del Reconocimiento
                  </label>
                  <textarea
                    rows={2}
                    value={template.accreditationClause}
                    onChange={(e) => updateField('accreditationClause', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#006657]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Prefijo de Honor al Alumno (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Al C. / A la Dra. / A:"
                      value={template.studentHonorPrefix || ''}
                      onChange={(e) => updateField('studentHonorPrefix', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#006657]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ciudad y Lugar de Emisión
                    </label>
                    <input
                      type="text"
                      value={template.cityAndDateText}
                      onChange={(e) => updateField('cityAndDateText', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#006657]"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: ESTILO & BORDE */}
          {activeEditorTab === 'appearance' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#006657]" />
                  <span>Paleta de Colores, Marco & Tipografía</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ajusta los colores primarios, texturas de fondo, marcos orlados y tipografía oficial.
                </p>
              </div>

              {/* Color Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Color Primario
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={template.primaryColor}
                      onChange={(e) => updateField('primaryColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={template.primaryColor}
                      onChange={(e) => updateField('primaryColor', e.target.value)}
                      className="w-full text-xs font-mono px-2 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Color Acento / Dorado
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={template.accentColor}
                      onChange={(e) => updateField('accentColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={template.accentColor}
                      onChange={(e) => updateField('accentColor', e.target.value)}
                      className="w-full text-xs font-mono px-2 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Color de Fondo
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={template.backgroundColor}
                      onChange={(e) => updateField('backgroundColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={template.backgroundColor}
                      onChange={(e) => updateField('backgroundColor', e.target.value)}
                      className="w-full text-xs font-mono px-2 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Border Styles */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Familia de Marco y Orla
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'classic-double', label: 'Doble Filete IMSS' },
                    { id: 'ornate-gold', label: 'Orlado Dorado Solemne' },
                    { id: 'modern-clean', label: 'Moderno Tecnológico' },
                    { id: 'medical-emerald', label: 'Clínico Esmeralda' },
                    { id: 'executive-navy', label: 'Diplomático Ejecutivo' },
                    { id: 'minimalist', label: 'Minimalista Fino' },
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => updateField('borderFamily', b.id as CertificateBorderFamily)}
                      className={`text-xs p-2 rounded-lg border text-left transition-all ${
                        template.borderFamily === b.id
                          ? 'border-[#006657] bg-[#e6f0ee] text-[#006657] font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tipografía del Documento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'serif', label: 'Serif Solemne (Clásica)' },
                    { id: 'sans', label: 'Sans-Serif (Institucional)' },
                    { id: 'mono', label: 'Monospace (Tecnológica)' },
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => updateField('fontFamily', f.id as CertificateFontFamily)}
                      className={`text-xs p-2 rounded-lg border text-center transition-all ${
                        template.fontFamily === f.id
                          ? 'border-[#006657] bg-[#e6f0ee] text-[#006657] font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo & Watermark Toggles */}
              <div className="border-t border-slate-100 pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Mostrar Logotipo Oficial IMSS</p>
                    <p className="text-[11px] text-slate-500">Emblema de la madre y el niño con águila mexicana</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.showLogo}
                      onChange={(e) => updateField('showLogo', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006657]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Marca de Agua de Fondo</p>
                    <p className="text-[11px] text-slate-500">Escudo IMSS en transparencia central</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.showWatermark}
                      onChange={(e) => updateField('showWatermark', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006657]"></div>
                  </label>
                </div>

                {template.showWatermark && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Opacidad de la Marca de Agua</span>
                      <span className="font-mono">{Math.round((template.watermarkOpacity || 0.08) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.02"
                      max="0.25"
                      step="0.01"
                      value={template.watermarkOpacity || 0.08}
                      onChange={(e) => updateField('watermarkOpacity', parseFloat(e.target.value))}
                      className="w-full accent-[#006657]"
                    />
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: AUTORIDADES FIRMANTES */}
          {activeEditorTab === 'signers' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#006657]" />
                    <span>Autoridades Firmantes Oficiales</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configura hasta 3 firmas con rúbricas caligráficas o sellos electrónicos.
                  </p>
                </div>

                {template.signers.length < 3 && (
                  <button
                    onClick={handleAddSigner}
                    className="px-2.5 py-1.5 bg-[#FAF5ED] hover:bg-[#e6f0ee] text-[#006657] border border-[#BC955C]/40 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Firma</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {template.signers.map((signer, index) => (
                  <div 
                    key={signer.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#006657] text-white text-[10px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {signer.name || `Autoridad ${index + 1}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-[11px] text-slate-600 flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={signer.enabled}
                            onChange={(e) => handleUpdateSigner(index, { enabled: e.target.checked })}
                            className="rounded text-[#006657]"
                          />
                          <span>Activa</span>
                        </label>

                        {template.signers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSigner(index)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Eliminar firmante"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                          Nombre Completo y Grado
                        </label>
                        <input
                          type="text"
                          value={signer.name}
                          onChange={(e) => handleUpdateSigner(index, { name: e.target.value })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#006657]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                          Cargo Institucional
                        </label>
                        <input
                          type="text"
                          value={signer.title}
                          onChange={(e) => handleUpdateSigner(index, { title: e.target.value })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#006657]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                          Dependencia o Coordinación
                        </label>
                        <input
                          type="text"
                          value={signer.department}
                          onChange={(e) => handleUpdateSigner(index, { department: e.target.value })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#006657]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                          Estilo de Firma / Rúbrica
                        </label>
                        <select
                          value={signer.signatureStyle}
                          onChange={(e) => handleUpdateSigner(index, { signatureStyle: e.target.value as any })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#006657]"
                        >
                          <option value="calligraphy-1">Rúbrica Caligráfica 1 (Curva Tradicional)</option>
                          <option value="calligraphy-2">Rúbrica Caligráfica 2 (Trazo Dinámico)</option>
                          <option value="calligraphy-3">Rúbrica Caligráfica 3 (Trazo Recto Clínico)</option>
                          <option value="calligraphy-4">Rúbrica Caligráfica 4 (Solemne Clásica)</option>
                          <option value="seal">Sello Digital Electrónico NOM-024</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SEGURIDAD & NOM-024 */}
          {activeEditorTab === 'security' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#006657]" />
                  <span>Seguridad, Sellos y Validez NOM-024</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configura los mecanismos de autenticación y verificación curricular.
                </p>
              </div>

              {/* Sello Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tipo de Sello Oficial / Holograma
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'imss-gold', label: 'Sello Dorado Oficial IMSS' },
                    { id: 'digital-hologram', label: 'Holograma Digital NOM-024' },
                    { id: 'cupn-shield', label: 'Escudo CUPN Primer Nivel' },
                    { id: 'nom024-badge', label: 'Badge Acreditación Médica' },
                    { id: 'none', label: 'Sin Sello Adicional' },
                  ].map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => updateField('sealType', s.id as CertificateSealType)}
                      className={`text-xs p-2 rounded-lg border text-left transition-all ${
                        template.sealType === s.id
                          ? 'border-[#006657] bg-[#e6f0ee] text-[#006657] font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR and Folio Options */}
              <div className="border-t border-slate-100 pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Mostrar Código QR con Folio</p>
                    <p className="text-[11px] text-slate-500">Permite verificación óptica en ventanilla o auditoría</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.showQrCode}
                      onChange={(e) => updateField('showQrCode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006657]"></div>
                  </label>
                </div>

                {template.showQrCode && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Prefijo del Folio Oficial
                    </label>
                    <input
                      type="text"
                      value={template.qrFolioPrefix || 'CUPN-'}
                      onChange={(e) => updateField('qrFolioPrefix', e.target.value)}
                      className="w-full text-xs font-mono px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#006657]"
                    />
                  </div>
                )}
              </div>

              {/* Score Box Options */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Mostrar Desglose de Calificación y Puntaje</p>
                  <p className="text-[11px] text-slate-500">Muestra porcentaje obtenido, puntaje y estado Acreditado</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={template.showScoreBox}
                    onChange={(e) => updateField('showScoreBox', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006657]"></div>
                </label>
              </div>

              {/* Cryptographic Hash Options */}
              <div className="border-t border-slate-100 pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Firma Criptográfica SHA-256 en el Pie</p>
                    <p className="text-[11px] text-slate-500">Cadena de autenticidad para cotejo de expedientes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.showCryptographicHash}
                      onChange={(e) => updateField('showCryptographicHash', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006657]"></div>
                  </label>
                </div>

                {template.showCryptographicHash && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Prefijo Legal de Hash
                    </label>
                    <input
                      type="text"
                      value={template.securityHashPrefix || 'IMSS-NOM024-SHA256'}
                      onChange={(e) => updateField('securityHashPrefix', e.target.value)}
                      className="w-full text-xs font-mono px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#006657]"
                    />
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Live Interactive Preview (5-7 cols) */}
        <div className={`lg:col-span-6 xl:col-span-7 space-y-4 ${isFullscreenPreview ? 'fixed inset-0 z-50 bg-black/80 p-4 sm:p-8 flex flex-col justify-center overflow-y-auto' : ''}`}>
          
          {/* Preview Toolbar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#006657]" />
              <span className="text-xs font-bold text-slate-900">Previsualización Interactiva en Tiempo Real</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#e6f0ee] text-[#006657] font-semibold">
                En vivo
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Student selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500">Alumno:</span>
                <select
                  value={previewStudentId}
                  onChange={(e) => setPreviewStudentId(e.target.value)}
                  className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-hidden"
                >
                  {availableStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Course selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500">Curso:</span>
                <select
                  value={previewCourseId}
                  onChange={(e) => setPreviewCourseId(e.target.value)}
                  className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-hidden max-w-[140px] truncate"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Fullscreen toggle button */}
              <button
                onClick={() => setIsFullscreenPreview(!isFullscreenPreview)}
                className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                title={isFullscreenPreview ? 'Salir de pantalla completa' : 'Ver a pantalla completa'}
              >
                {isFullscreenPreview ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Actual Rendered Certificate Canvas */}
          <div className="bg-slate-100/80 p-3 sm:p-6 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
            <div className="w-full max-w-3xl transform transition-transform">
              <CertificateDocument
                attempt={previewAttempt}
                template={template}
                className="shadow-xl"
              />
            </div>
          </div>

          {/* Helper Card below Preview */}
          <div className="bg-[#FAF5ED] p-3.5 rounded-xl border border-[#DDC9A3] flex items-start gap-2.5 text-xs text-[#006657]">
            <Info className="w-4 h-4 shrink-0 text-[#BC955C] mt-0.5" />
            <div className="leading-relaxed">
              <strong>Impacto Institucional Automático:</strong> Al pulsar <em>"Guardar Diseño Oficial"</em>, todas las constancias generadas en evaluaciones pasadas y futuras adoptarán esta plantilla gráfica con validación de folio CUPN y firmas institucionales vigentes.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
