import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  ExternalLink, 
  Download, 
  Video, 
  AlertCircle, 
  Award, 
  Check, 
  Sparkles
} from 'lucide-react';
import { CalendarEvent, Course } from '../types/lms';
import { generateICSFile, getGoogleCalendarUrl, getOutlookCalendarUrl } from '../services/storage';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  courses
}) => {
  if (!isOpen) return null;

  // Aggregate all events
  const allEvents: CalendarEvent[] = courses.flatMap(c => c.calendarEvents || []);
  const [filterCourse, setFilterCourse] = useState('all');

  const filteredEvents = allEvents.filter(e => {
    return filterCourse === 'all' || e.courseId === filterCourse;
  });

  const handleDownloadICS = () => {
    generateICSFile(filteredEvents);
  };

  const getEventTypeBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam':
        return { label: 'Examen Oficial', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'live_session':
        return { label: 'Sesión en Vivo', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'deadline':
        return { label: 'Entrega Final', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'workshop':
        return { label: 'Taller Práctico', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Integración con Calendarios Externos
              </h2>
              <p className="text-xs text-slate-500">
                Sincroniza exámenes, clases en vivo y entregas con Google Calendar, Outlook y Apple Calendar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Filter and Global ICS Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Filtrar por Curso:</span>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">Todos los Cursos</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDownloadICS}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Archivo .ICS Universal</span>
          </button>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => {
              const badge = getEventTypeBadge(event.type);
              const googleUrl = getGoogleCalendarUrl(event);
              const outlookUrl = getOutlookCalendarUrl(event);

              return (
                <div
                  key={event.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{event.courseTitle}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
                    </div>

                    <div className="text-left sm:text-right font-mono text-xs text-slate-600 shrink-0">
                      <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                        <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{event.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Sync External Links */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400">Sincronizar:</span>
                    
                    <a
                      href={googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                      <span>Google Calendar</span>
                    </a>

                    <a
                      href={outlookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                      <span>Outlook Web</span>
                    </a>

                    <button
                      onClick={() => generateICSFile([event])}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3 h-3 text-slate-500" />
                      <span>Archivo .ICS</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center py-10 text-xs text-slate-400 italic">
              No hay eventos programados para los criterios seleccionados.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
          >
            Cerrar Calendario
          </button>
        </div>

      </div>
    </div>
  );
};
