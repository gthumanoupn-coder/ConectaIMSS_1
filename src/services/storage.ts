import { Course, Quiz, User, PushNotification, AuditLogItem, SecurityConfig, OnPremiseConfig, QuizAttempt, CalendarEvent, ForumThread, CertificateTemplate } from '../types/lms';
import { 
  INITIAL_USERS, 
  INITIAL_COURSES, 
  INITIAL_QUIZZES, 
  INITIAL_QUIZ_ATTEMPTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_SECURITY_CONFIG, 
  INITIAL_ONPREMISE_CONFIG,
  INITIAL_FORUM_THREADS,
  INITIAL_CERTIFICATE_TEMPLATE
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'cupn_conecta_users',
  COURSES: 'cupn_conecta_courses',
  QUIZZES: 'cupn_conecta_quizzes',
  ATTEMPTS: 'cupn_conecta_attempts',
  NOTIFS: 'cupn_conecta_notifications',
  AUDIT: 'cupn_conecta_audit_logs',
  SECURITY: 'cupn_conecta_security',
  ONPREMISE: 'cupn_conecta_onpremise',
  CURRENT_USER_ID: 'cupn_conecta_current_user_id',
  FORUM_THREADS: 'cupn_conecta_forum_threads',
  CERTIFICATE_TEMPLATE: 'cupn_conecta_cert_template',
};

export const StorageService = {
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },
  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCourses(): Course[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COURSES);
      if (!data) return INITIAL_COURSES;
      const stored = JSON.parse(data) as Course[];
      // Keep modules and quizId synced from INITIAL_COURSES for initial courses
      return stored.map(c => {
        const init = INITIAL_COURSES.find(ic => ic.id === c.id);
        if (!init) return c;
        const mergedModules = init.modules.map(initMod => {
          const existingMod = c.modules.find(m => m.id === initMod.id);
          if (existingMod) {
            return {
              ...existingMod,
              quizId: existingMod.quizId || initMod.quizId
            };
          }
          return initMod;
        });
        return {
          ...c,
          modules: mergedModules.length >= c.modules.length ? mergedModules : c.modules
        };
      });
    } catch {
      return INITIAL_COURSES;
    }
  },
  saveCourses(courses: Course[]): void {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },

  getQuizzes(): Quiz[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZZES);
      if (!data) return INITIAL_QUIZZES;
      const stored = JSON.parse(data) as Quiz[];
      const merged = [...stored];
      for (const initQ of INITIAL_QUIZZES) {
        if (!merged.some(q => q.id === initQ.id)) {
          merged.push(initQ);
        }
      }
      return merged;
    } catch {
      return INITIAL_QUIZZES;
    }
  },
  saveQuizzes(quizzes: Quiz[]): void {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  },

  getQuizAttempts(): QuizAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return data ? JSON.parse(data) : INITIAL_QUIZ_ATTEMPTS;
    } catch {
      return INITIAL_QUIZ_ATTEMPTS;
    }
  },
  saveQuizAttempts(attempts: QuizAttempt[]): void {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  },

  getNotifications(): PushNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },
  saveNotifications(notifs: PushNotification[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifs));
  },

  getAuditLogs(): AuditLogItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },
  saveAuditLogs(logs: AuditLogItem[]): void {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs));
  },

  getForumThreads(): ForumThread[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FORUM_THREADS);
      if (!data) return INITIAL_FORUM_THREADS;
      const stored = JSON.parse(data) as ForumThread[];
      const merged = [...stored];
      for (const initT of INITIAL_FORUM_THREADS) {
        if (!merged.some(t => t.id === initT.id)) {
          merged.push(initT);
        }
      }
      return merged;
    } catch {
      return INITIAL_FORUM_THREADS;
    }
  },
  saveForumThreads(threads: ForumThread[]): void {
    localStorage.setItem(STORAGE_KEYS.FORUM_THREADS, JSON.stringify(threads));
  },

  getSecurityConfig(): SecurityConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SECURITY);
      return data ? JSON.parse(data) : INITIAL_SECURITY_CONFIG;
    } catch {
      return INITIAL_SECURITY_CONFIG;
    }
  },
  saveSecurityConfig(sec: SecurityConfig): void {
    localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(sec));
  },

  getOnPremiseConfig(): OnPremiseConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ONPREMISE);
      return data ? JSON.parse(data) : INITIAL_ONPREMISE_CONFIG;
    } catch {
      return INITIAL_ONPREMISE_CONFIG;
    }
  },
  saveOnPremiseConfig(cfg: OnPremiseConfig): void {
    localStorage.setItem(STORAGE_KEYS.ONPREMISE, JSON.stringify(cfg));
  },

  getCertificateTemplate(): CertificateTemplate {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CERTIFICATE_TEMPLATE);
      return data ? JSON.parse(data) : INITIAL_CERTIFICATE_TEMPLATE;
    } catch {
      return INITIAL_CERTIFICATE_TEMPLATE;
    }
  },
  saveCertificateTemplate(template: CertificateTemplate): void {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATE_TEMPLATE, JSON.stringify(template));
  },

  getCurrentUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-admin-1';
  },
  setCurrentUserId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
  },

  resetToInitialData(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.QUIZZES);
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
    localStorage.removeItem(STORAGE_KEYS.SECURITY);
    localStorage.removeItem(STORAGE_KEYS.ONPREMISE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATE_TEMPLATE);
  }
};

// Utilities for CSV, Calendar and Data Export
export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const escapeCell = (cell: string | number) => {
    const str = String(cell ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCell).join(',');
  const rowLines = rows.map(row => row.map(escapeCell).join(','));
  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportFullBackupJSON(): void {
  const payload = {
    app: 'CUPN Conecta - IMSS Coordinación de Unidades de Primer Nivel',
    slogan: 'Conectando conocimiento, fortaleciendo servicios.',
    exportDate: new Date().toISOString(),
    version: '2.5.0-onpremise',
    users: StorageService.getUsers(),
    courses: StorageService.getCourses(),
    quizzes: StorageService.getQuizzes(),
    quizAttempts: StorageService.getQuizAttempts(),
    notifications: StorageService.getNotifications(),
    auditLogs: StorageService.getAuditLogs(),
    securityConfig: StorageService.getSecurityConfig(),
    onPremiseConfig: StorageService.getOnPremiseConfig(),
    certificateTemplate: StorageService.getCertificateTemplate()
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `cupn_conecta_backup_${dateStr}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate standard RFC 5545 iCalendar (.ics) file
export function generateICSFile(events: CalendarEvent[]): void {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const formatDateTime = (dateStr: string, timeStr: string) => {
    // dateStr: YYYY-MM-DD, timeStr: HH:mm
    const [y, m, d] = dateStr.split('-');
    const [hh, mm] = (timeStr || '09:00').split(':');
    return `${y}${pad(Number(m))}${pad(Number(d))}T${pad(Number(hh))}${pad(Number(mm))}00`;
  };

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CUPN Conecta IMSS Primer Nivel//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:CUPN Conecta - Agenda Académica IMSS'
  ];

  events.forEach(ev => {
    const dtStart = formatDateTime(ev.date, ev.startTime);
    const dtEnd = formatDateTime(ev.date, ev.endTime || ev.startTime);
    lines.push(
      'BEGIN:VEVENT',
      `UID:${ev.id}@cupn.imss.gob.mx`,
      `DTSTAMP:${formatDateTime(new Date().toISOString().slice(0, 10), '00:00')}Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${ev.title.replace(/[,;]/g, ' ')}`,
      `DESCRIPTION:${(ev.description || '').replace(/\n/g, '\\n')}`,
      `LOCATION:${ev.locationUrl || 'Plataforma Virtual CUPN Conecta IMSS'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  const icsData = lines.join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'cupn_conecta_eventos_academicos.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Google Calendar URL Generator
export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const cleanDate = event.date.replace(/-/g, '');
  const start = `${cleanDate}T${event.startTime.replace(':', '')}00`;
  const end = `${cleanDate}T${(event.endTime || event.startTime).replace(':', '')}00`;
  const text = encodeURIComponent(event.title);
  const details = encodeURIComponent(`${event.description || ''}\n\nCurso: ${event.courseTitle}\nCUPN Conecta - Conectando conocimiento, fortaleciendo servicios.`);
  const location = encodeURIComponent(event.locationUrl || 'Campus Virtual CUPN Conecta IMSS');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
}

// Outlook Web Calendar URL Generator
export function getOutlookCalendarUrl(event: CalendarEvent): string {
  const start = `${event.date}T${event.startTime}:00`;
  const end = `${event.date}T${event.endTime || event.startTime}:00`;
  const subject = encodeURIComponent(event.title);
  const body = encodeURIComponent(`${event.description || ''}\n\nCurso: ${event.courseTitle}\nCUPN Conecta - Conectando conocimiento, fortaleciendo servicios.`);
  const location = encodeURIComponent(event.locationUrl || 'Campus Virtual CUPN Conecta IMSS');

  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${subject}&body=${body}&startdt=${start}&enddt=${end}&location=${location}&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent`;
}

// Push Notifications Web API helper
export async function triggerPushNotification(title: string, body: string): Promise<boolean> {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
        return true;
      } catch {
        return false;
      }
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(title, { body });
        return true;
      }
    }
  }
  return false;
}
