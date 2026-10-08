import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Pin, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  FileText, 
  Paperclip, 
  Heart, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  Trash2, 
  X, 
  Upload, 
  Award, 
  Stethoscope, 
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';
import { Course, User, ForumThread, ForumReply, ForumAttachment, ForumCategory } from '../types/lms';

interface CourseForumProps {
  course: Course;
  currentUser: User;
  threads: ForumThread[];
  onSaveThread: (thread: ForumThread) => void;
  onUpdateThread: (thread: ForumThread) => void;
  onDeleteThread: (threadId: string) => void;
  initialModuleId?: string;
  onClose?: () => void;
}

export const CourseForum: React.FC<CourseForumProps> = ({
  course,
  currentUser,
  threads,
  onSaveThread,
  onUpdateThread,
  onDeleteThread,
  initialModuleId,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(initialModuleId || 'all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'resolved' | 'unresolved' | 'pinned'>('all');
  const [expandedThreadIds, setExpandedThreadIds] = useState<Record<string, boolean>>({});
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [replyAttachments, setReplyAttachments] = useState<Record<string, ForumAttachment[]>>({});
  const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  const handleDownloadResource = (name: string) => {
    setDownloadNotification(name);
    setTimeout(() => setDownloadNotification(null), 3500);
  };

  // Modal New Thread State
  const [isNewThreadOpen, setIsNewThreadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ForumCategory>('duda');
  const [newModuleId, setNewModuleId] = useState<string>(initialModuleId || '');
  const [newContent, setNewContent] = useState('');
  const [newAttachments, setNewAttachments] = useState<ForumAttachment[]>([]);
  const [attachmentNameInput, setAttachmentNameInput] = useState('');
  const [attachmentUrlInput, setAttachmentUrlInput] = useState('');

  // Course threads
  const courseThreads = threads.filter(t => t.courseId === course.id);

  // Filtering
  const filteredThreads = courseThreads.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.replies.some(r => r.content.toLowerCase().includes(searchTerm.toLowerCase()) || r.authorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesModule = selectedModuleId === 'all' || t.moduleId === selectedModuleId;
    
    let matchesStatus = true;
    if (statusFilter === 'resolved') matchesStatus = !!t.resolved;
    if (statusFilter === 'unresolved') matchesStatus = !t.resolved && t.category === 'duda';
    if (statusFilter === 'pinned') matchesStatus = !!t.pinned;

    return matchesSearch && matchesCategory && matchesModule && matchesStatus;
  }).sort((a, b) => {
    // Pinned first, then newest
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const toggleExpand = (threadId: string) => {
    setExpandedThreadIds(prev => ({ ...prev, [threadId]: !prev[threadId] }));
  };

  const handleToggleLikeThread = (thread: ForumThread) => {
    const hasLiked = thread.likes.includes(currentUser.id);
    const updatedLikes = hasLiked
      ? thread.likes.filter(id => id !== currentUser.id)
      : [...thread.likes, currentUser.id];
    
    onUpdateThread({ ...thread, likes: updatedLikes });
  };

  const handleToggleLikeReply = (thread: ForumThread, replyId: string) => {
    const updatedReplies = thread.replies.map(r => {
      if (r.id === replyId) {
        const hasLiked = r.likes.includes(currentUser.id);
        const likes = hasLiked 
          ? r.likes.filter(id => id !== currentUser.id) 
          : [...r.likes, currentUser.id];
        return { ...r, likes };
      }
      return r;
    });

    onUpdateThread({ ...thread, replies: updatedReplies });
  };

  const handleTogglePin = (thread: ForumThread) => {
    if (currentUser.role !== 'profesor' && currentUser.role !== 'admin') return;
    onUpdateThread({ ...thread, pinned: !thread.pinned });
  };

  const handleToggleResolved = (thread: ForumThread) => {
    onUpdateThread({ ...thread, resolved: !thread.resolved });
  };

  const handleToggleInstructorAnswer = (thread: ForumThread, replyId: string) => {
    if (currentUser.role !== 'profesor' && currentUser.role !== 'admin') return;
    const updatedReplies = thread.replies.map(r => {
      if (r.id === replyId) {
        return { ...r, isInstructorAnswer: !r.isInstructorAnswer };
      }
      return r;
    });
    onUpdateThread({ ...thread, replies: updatedReplies, resolved: true });
  };

  const handleSendReply = (thread: ForumThread) => {
    const text = (replyTexts[thread.id] || '').trim();
    if (!text) return;

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      threadId: thread.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      content: text,
      createdAt: new Date().toLocaleString('es-MX', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      attachments: replyAttachments[thread.id] || [],
      likes: [],
      isInstructorAnswer: currentUser.role === 'profesor'
    };

    const updatedReplies = [...thread.replies, newReply];
    onUpdateThread({ ...thread, replies: updatedReplies });

    // Reset reply input
    setReplyTexts(prev => ({ ...prev, [thread.id]: '' }));
    setReplyAttachments(prev => ({ ...prev, [thread.id]: [] }));
    setExpandedThreadIds(prev => ({ ...prev, [thread.id]: true }));
  };

  const handleAddLocalAttachmentToNewThread = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const att: ForumAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: sizeMB,
        url: URL.createObjectURL(file),
        type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'document'
      };
      setNewAttachments(prev => [...prev, att]);
    }
  };

  const handleAddUrlAttachment = () => {
    if (!attachmentNameInput.trim()) return;
    const att: ForumAttachment = {
      id: `att-${Date.now()}`,
      name: attachmentNameInput.trim(),
      size: 'Enlace web',
      url: attachmentUrlInput.trim() || '#',
      type: 'link'
    };
    setNewAttachments(prev => [...prev, att]);
    setAttachmentNameInput('');
    setAttachmentUrlInput('');
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const moduleObj = course.modules.find(m => m.id === newModuleId);

    const thread: ForumThread = {
      id: `thread-${Date.now()}`,
      courseId: course.id,
      moduleId: newModuleId || undefined,
      moduleTitle: moduleObj ? `Módulo ${moduleObj.order}: ${moduleObj.title}` : undefined,
      title: newTitle.trim(),
      content: newContent.trim(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      createdAt: new Date().toLocaleString('es-MX', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      category: newCategory,
      pinned: false,
      resolved: false,
      likes: [],
      replies: [],
      attachments: newAttachments
    };

    onSaveThread(thread);
    setIsNewThreadOpen(false);

    // Reset Form
    setNewTitle('');
    setNewContent('');
    setNewCategory('duda');
    setNewAttachments([]);
  };

  const categoryLabels: Record<ForumCategory, { label: string; icon: any; color: string }> = {
    duda: { label: 'Duda o Consulta', icon: HelpCircle, color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
    discusion: { label: 'Debate Clínico', icon: MessageSquare, color: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
    material: { label: 'Material Adicional', icon: Paperclip, color: 'bg-[#006657]/20 text-[#DDC9A3] border-[#BC955C]/40' },
    caso_clinico: { label: 'Caso Práctico IMSS', icon: Stethoscope, color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' }
  };

  const roleBadges: Record<string, { label: string; color: string }> = {
    admin: { label: 'Administrador CUPN', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    profesor: { label: 'Docente Titular', color: 'bg-[#006657] text-[#DDC9A3] border border-[#BC955C]/40' },
    alumno: { label: 'Personal en Capacitación', color: 'bg-slate-800 text-slate-300 border-slate-700' }
  };

  return (
    <div className="space-y-6">
      
      {/* Download Notification Banner */}
      {downloadNotification && (
        <div className="bg-[#006657] text-white border border-[#BC955C]/40 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-[#DDC9A3] shrink-0" />
            <span>Descargando recurso institucional: <strong>{downloadNotification}</strong></span>
          </div>
          <button onClick={() => setDownloadNotification(null)} className="text-white/70 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Forum Header Banner */}
      <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#006657]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-[#DDC9A3] uppercase tracking-wider bg-[#006657] px-2.5 py-0.5 rounded border border-[#BC955C]/40">
              Foro Académico &bull; IMSS CUPN
            </span>
            <span className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
              {course.title}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Foro de Discusión, Dudas Clínicas y Materiales Adicionales
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Espacio interactivo oficial para resolver inquietudes sobre protocolos médicos, debatir casos clínicos y descargar guías compartidas por docentes y compañeros.
          </p>

          <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#BC955C]" />
              <strong className="text-slate-200">{courseThreads.length}</strong> temas
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <strong className="text-slate-200">{courseThreads.filter(t => t.resolved).length}</strong> resueltas
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5 text-[#DDC9A3]" />
              <strong className="text-slate-200">
                {courseThreads.reduce((acc, t) => acc + (t.attachments?.length || 0), 0)}
              </strong> archivos compartidos
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto z-10 shrink-0">
          <button
            onClick={() => setIsNewThreadOpen(true)}
            className="px-4 py-2.5 bg-[#006657] hover:bg-[#004d41] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md border border-[#BC955C]/40 hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#DDC9A3]" />
            <span>Nueva Publicación / Duda</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Cerrar foro"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en temas, respuestas o autores del curso..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-[#006657]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Module Selector */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-hidden focus:border-[#006657]"
            >
              <option value="all">Todos los Módulos del Curso</option>
              {course.modules.map(mod => (
                <option key={mod.id} value={mod.id}>
                  Módulo {mod.order}: {mod.title.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-hidden focus:border-[#006657]"
            >
              <option value="all">Todos los Estados</option>
              <option value="resolved">Solo Dudas Resueltas</option>
              <option value="unresolved">Dudas Pendientes de Respuesta</option>
              <option value="pinned">Fijados por el Docente</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#006657] text-[#DDC9A3] border border-[#BC955C]/40'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Todos ({courseThreads.length})
          </button>

          {(['duda', 'discusion', 'material', 'caso_clinico'] as ForumCategory[]).map(catKey => {
            const conf = categoryLabels[catKey];
            const Icon = conf.icon;
            const count = courseThreads.filter(t => t.category === catKey).length;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-[#006657] text-[#DDC9A3] border border-[#BC955C]/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{conf.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        {filteredThreads.length > 0 ? (
          filteredThreads.map(thread => {
            const isExpanded = !!expandedThreadIds[thread.id];
            const catInfo = categoryLabels[thread.category];
            const CatIcon = catInfo.icon;
            const hasLiked = thread.likes.includes(currentUser.id);
            const isAuthor = thread.authorId === currentUser.id;
            const isTeacherOrAdmin = currentUser.role === 'profesor' || currentUser.role === 'admin';
            const authorRoleInfo = roleBadges[thread.authorRole] || roleBadges.alumno;
            const hasInstructorReply = thread.replies.some(r => r.isInstructorAnswer || r.authorRole === 'profesor');

            return (
              <div 
                key={thread.id} 
                className={`bg-slate-950 rounded-xl border transition-all ${
                  thread.pinned 
                    ? 'border-[#BC955C]/60 ring-1 ring-[#BC955C]/30 shadow-lg' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                
                {/* Pinned header banner */}
                {thread.pinned && (
                  <div className="bg-[#BC955C]/15 border-b border-[#BC955C]/30 px-4 py-1.5 text-xs text-[#DDC9A3] font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Pin className="w-3.5 h-3.5 rotate-45 text-[#BC955C]" />
                      <span>Publicación Fijada por la Coordinación Docente</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Prioridad Alta</span>
                  </div>
                )}

                <div className="p-4 sm:p-5 space-y-3.5">
                  
                  {/* Meta bar: Category, Module, Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${catInfo.color}`}>
                        <CatIcon className="w-3 h-3" />
                        <span>{catInfo.label}</span>
                      </span>

                      {thread.moduleTitle && (
                        <span className="text-[11px] text-[#DDC9A3] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-medium">
                          {thread.moduleTitle}
                        </span>
                      )}

                      {thread.resolved ? (
                        <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Resuelta</span>
                        </span>
                      ) : thread.category === 'duda' ? (
                        <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                          Pendiente de Respuesta
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{thread.createdAt}</span>

                      {/* Instructor Pin/Unpin */}
                      {isTeacherOrAdmin && (
                        <button
                          onClick={() => handleTogglePin(thread)}
                          className={`p-1 rounded hover:bg-slate-800 transition-colors ${thread.pinned ? 'text-[#BC955C]' : 'text-slate-500'}`}
                          title={thread.pinned ? 'Desfijar publicación' : 'Fijar al inicio del foro'}
                        >
                          <Pin className="w-3.5 h-3.5 rotate-45" />
                        </button>
                      )}

                      {/* Delete */}
                      {(isAuthor || isTeacherOrAdmin) && (
                        deletingThreadId === thread.id ? (
                          <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded text-[11px] text-rose-200 animate-in fade-in">
                            <span>¿Eliminar?</span>
                            <button
                              onClick={() => {
                                onDeleteThread(thread.id);
                                setDeletingThreadId(null);
                              }}
                              className="font-bold text-rose-300 hover:text-white underline ml-1"
                            >
                              Sí
                            </button>
                            <button
                              onClick={() => setDeletingThreadId(null)}
                              className="text-slate-400 hover:text-white ml-1"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingThreadId(thread.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-500 hover:bg-slate-800 transition-colors"
                            title="Eliminar tema"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Author Header */}
                  <div className="flex items-center gap-3">
                    <img 
                      src={thread.authorAvatar} 
                      alt="" 
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700 bg-slate-900" 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{thread.authorName}</span>
                        <span className={`text-[10px] px-2 py-0.2 rounded font-semibold ${authorRoleInfo.color}`}>
                          {authorRoleInfo.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Participante del curso
                      </span>
                    </div>
                  </div>

                  {/* Title & Body */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {thread.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {thread.content}
                    </p>
                  </div>

                  {/* Attachments (Shared Materials) */}
                  {thread.attachments && thread.attachments.length > 0 && (
                    <div className="pt-1 space-y-2">
                      <span className="text-[11px] font-semibold text-[#BC955C] flex items-center gap-1">
                        <Paperclip className="w-3 h-3" />
                        <span>Materiales y Archivos Adjuntos ({thread.attachments.length})</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {thread.attachments.map(att => (
                          <div 
                            key={att.id}
                            className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors text-xs"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <FileText className="w-4 h-4 text-[#BC955C] shrink-0" />
                              <div className="truncate">
                                <p className="font-semibold text-slate-200 truncate">{att.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{att.size} &bull; {att.type}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownloadResource(att.name)}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors shrink-0"
                              title="Descargar archivo"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Thread Action Controls */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleLikeThread(thread)}
                        className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                          hasLiked
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                        <span>{thread.likes.length > 0 ? thread.likes.length : 'Útil'}</span>
                      </button>

                      <button
                        onClick={() => toggleExpand(thread.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#006657]" />
                        <span>{thread.replies.length} respuestas</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {hasInstructorReply && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#DDC9A3] bg-[#006657]/30 border border-[#BC955C]/40 px-2 py-1 rounded-lg">
                          <Award className="w-3.5 h-3.5 text-[#BC955C]" />
                          <span>Respuesta del Docente</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Mark resolved button for author/instructor */}
                      {(isAuthor || isTeacherOrAdmin) && thread.category === 'duda' && (
                        <button
                          onClick={() => handleToggleResolved(thread)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                            thread.resolved 
                              ? 'bg-slate-800 text-slate-400 hover:text-white' 
                              : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/40'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{thread.resolved ? 'Reabrir duda' : 'Marcar como Resuelta'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => toggleExpand(thread.id)}
                        className="text-xs font-bold text-[#DDC9A3] hover:text-white transition-colors"
                      >
                        {isExpanded ? 'Ocultar Respuestas' : 'Responder al Tema'}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Expanded Replies Section */}
                {isExpanded && (
                  <div className="bg-slate-900/60 border-t border-slate-800 p-4 sm:p-5 space-y-4 animate-in fade-in duration-150">
                    
                    {/* Replies List */}
                    <div className="space-y-3">
                      {thread.replies.length > 0 ? (
                        thread.replies.map(reply => {
                          const replyHasLiked = reply.likes.includes(currentUser.id);
                          const isReplyAuthor = reply.authorId === currentUser.id;
                          const replyRole = roleBadges[reply.authorRole] || roleBadges.alumno;

                          return (
                            <div 
                              key={reply.id} 
                              className={`p-3.5 rounded-xl border transition-all ${
                                reply.isInstructorAnswer 
                                  ? 'bg-[#006657]/15 border-[#BC955C]/50 ring-1 ring-[#BC955C]/30 shadow-md' 
                                  : 'bg-slate-950 border-slate-800'
                              }`}
                            >
                              {reply.isInstructorAnswer && (
                                <div className="mb-2 pb-1.5 border-b border-[#BC955C]/30 flex items-center justify-between text-[11px] text-[#DDC9A3] font-bold">
                                  <span className="flex items-center gap-1">
                                    <Award className="w-3.5 h-3.5 text-[#BC955C]" />
                                    <span>Respuesta Oficial Institucional del Docente</span>
                                  </span>
                                  <span className="text-[10px] font-mono text-emerald-400">Verificado</span>
                                </div>
                              )}

                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <img 
                                    src={reply.authorAvatar} 
                                    alt="" 
                                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700 bg-slate-900" 
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-white">{reply.authorName}</span>
                                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${replyRole.color}`}>
                                        {replyRole.label}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono">{reply.createdAt}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {isTeacherOrAdmin && (
                                    <button
                                      onClick={() => handleToggleInstructorAnswer(thread, reply.id)}
                                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                                        reply.isInstructorAnswer 
                                          ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white' 
                                          : 'bg-[#006657] text-[#DDC9A3] border-[#BC955C]/40 hover:bg-[#004d41]'
                                      }`}
                                      title="Fijar como respuesta oficial del docente"
                                    >
                                      {reply.isInstructorAnswer ? 'Quitar Verificación' : 'Marcar como Respuesta Oficial'}
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleToggleLikeReply(thread, reply.id)}
                                    className={`p-1 rounded text-xs flex items-center gap-1 ${
                                      replyHasLiked 
                                        ? 'text-rose-400 font-bold' 
                                        : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                  >
                                    <Heart className={`w-3 h-3 ${replyHasLiked ? 'fill-current' : ''}`} />
                                    <span className="text-[11px]">{reply.likes.length > 0 ? reply.likes.length : ''}</span>
                                  </button>
                                </div>
                              </div>

                              <p className="mt-2 text-xs text-slate-300 leading-relaxed pl-9 whitespace-pre-line">
                                {reply.content}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-500 italic py-2 text-center">
                          Aún no hay respuestas en este tema. ¡Sé el primero en colaborar!
                        </p>
                      )}
                    </div>

                    {/* Quick Reply Form */}
                    <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-400">
                        Escribir una respuesta para este tema:
                      </label>
                      <div className="flex gap-2">
                        <textarea
                          rows={2}
                          value={replyTexts[thread.id] || ''}
                          onChange={(e) => setReplyTexts(prev => ({ ...prev, [thread.id]: e.target.value }))}
                          placeholder={`Responder como ${currentUser.name} (${currentUser.role === 'profesor' ? 'Docente' : 'Alumno'})...`}
                          className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-[#006657]"
                        />
                        <button
                          onClick={() => handleSendReply(thread)}
                          disabled={!replyTexts[thread.id]?.trim()}
                          className="px-4 bg-[#006657] hover:bg-[#004d41] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-sm border border-[#BC955C]/40"
                        >
                          <Send className="w-3.5 h-3.5 text-[#DDC9A3]" />
                          <span className="hidden sm:inline">Responder</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <MessageSquare className="w-6 h-6 text-[#BC955C]" />
            </div>
            <h3 className="text-sm font-bold text-white">No se encontraron temas en este criterio</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Sé el primero en publicar una duda o compartir material adicional para enriquecer la capacitación de tus colegas.
            </p>
            <button
              onClick={() => setIsNewThreadOpen(true)}
              className="px-4 py-2 bg-[#006657] hover:bg-[#004d41] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors border border-[#BC955C]/40"
            >
              <Plus className="w-3.5 h-3.5 text-[#DDC9A3]" />
              <span>Publicar Nuevo Tema en el Foro</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal: Create New Thread */}
      {isNewThreadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="bg-slate-950 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#BC955C]/40 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#BC955C]" />
                  <span>Publicar en el Foro del Curso</span>
                </h3>
                <span className="text-[11px] text-[#DDC9A3] font-medium">
                  {course.title}
                </span>
              </div>
              <button
                onClick={() => setIsNewThreadOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título de la Consulta, Debate o Material *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: ¿Cómo interpretar las marcas de tiempo en auditoría NOM-024?"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-[#006657]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Categoría de Publicación
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ForumCategory)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-hidden focus:border-[#006657]"
                  >
                    <option value="duda">❓ Duda / Pregunta Académica</option>
                    <option value="discusion">💬 Debate / Opinión Técnica</option>
                    <option value="material">📎 Compartir Material Adicional</option>
                    <option value="caso_clinico">🩺 Caso Práctico IMSS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Vincular a Módulo Específico
                  </label>
                  <select
                    value={newModuleId}
                    onChange={(e) => setNewModuleId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-hidden focus:border-[#006657]"
                  >
                    <option value="">General de Todo el Curso</option>
                    {course.modules.map(mod => (
                      <option key={mod.id} value={mod.id}>
                        Módulo {mod.order}: {mod.title.slice(0, 32)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Descripción Detallada o Explicación *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Detalla tu duda con referencias al protocolo, explica el caso práctico o resume el contenido del material complementario..."
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-[#006657] leading-relaxed"
                />
              </div>

              {/* Attachments Section */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-[#BC955C]" />
                    <span>Compartir Archivos o Materiales Adicionales</span>
                  </span>
                  <label className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-[#DDC9A3] text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1 transition-colors border border-slate-700">
                    <Upload className="w-3 h-3" />
                    <span>Subir Archivo Local</span>
                    <input
                      type="file"
                      onChange={handleAddLocalAttachmentToNewThread}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Optional Web Link Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={attachmentNameInput}
                    onChange={(e) => setAttachmentNameInput(e.target.value)}
                    placeholder="Nombre del recurso (Ej: Guía_Clínica_2026.pdf)..."
                    className="flex-1 px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-slate-300"
                  />
                  <input
                    type="url"
                    value={attachmentUrlInput}
                    onChange={(e) => setAttachmentUrlInput(e.target.value)}
                    placeholder="URL o enlace (opcional)..."
                    className="flex-1 px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlAttachment}
                    disabled={!attachmentNameInput.trim()}
                    className="px-3 py-1 bg-[#006657] text-white text-xs font-bold rounded disabled:opacity-40"
                  >
                    + Agregar
                  </button>
                </div>

                {/* List of Attachments to be added */}
                {newAttachments.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {newAttachments.map(att => (
                      <div 
                        key={att.id} 
                        className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-[#BC955C] shrink-0" />
                          <span className="text-slate-200 truncate">{att.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({att.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewAttachments(prev => prev.filter(a => a.id !== att.id))}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewThreadOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#006657] hover:bg-[#004d41] text-white rounded-lg transition-colors shadow-xs border border-[#BC955C]/40"
                >
                  Publicar en el Foro
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
