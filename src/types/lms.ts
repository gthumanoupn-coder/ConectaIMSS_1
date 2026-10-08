export type UserRole = 'admin' | 'profesor' | 'alumno';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  status: 'active' | 'suspended';
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  enrolledCourseIds: string[];
  createdAt: string;
  lastLogin: string;
}

export type LessonType = 'video' | 'audio' | 'document' | 'interactive';

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  durationMinutes: number;
  content: string; // rich text or notes
  mediaUrl?: string;
  mediaFileName?: string;
  mediaFileSize?: string;
  attachments: Attachment[];
  completedByStudentIds: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  quizId?: string;
}

export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'fill_blank';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  fillBlankAnswer?: string; // correct answer for fill_blank
  points: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  passingScore: number; // percentage, e.g. 70
  timeLimitMinutes: number;
  questions: Question[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  answers: Record<string, any>; // questionId -> answer
}

export interface CalendarEvent {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: 'exam' | 'live_session' | 'deadline' | 'workshop';
  locationUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructorId: string;
  instructorName: string;
  instructorRole: string;
  category: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  coverImage: string;
  durationHours: number;
  published: boolean;
  modules: Module[];
  enrolledStudentIds: string[];
  calendarEvents: CalendarEvent[];
  updatedAt: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'reminder' | 'grade' | 'course_update' | 'security';
  courseId?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'alert';
}

export interface SecurityConfig {
  encryptionEnabled: boolean;
  cipherAlgorithm: string; // e.g. 'AES-256-GCM'
  keyRotationDate: string;
  enforce2FA: boolean;
  sslTlsVersion: string;
  dataAtRestEncrypted: boolean;
  dataTransitEncrypted: boolean;
}

export interface OnPremiseConfig {
  serverHost: string;
  port: number;
  databaseEngine: 'sqlite_local' | 'postgres_onprem' | 'mariadb_local';
  databasePath: string;
  cloudSyncEnabled: boolean;
  cloudProvider: 'aws_s3' | 'google_cloud_storage' | 'azure_blob' | 'local_volume';
  cloudBucket: string;
  lastBackupAt: string;
  maxUploadSizeMB: number;
}

export type ForumCategory = 'duda' | 'discusion' | 'material' | 'caso_clinico';

export interface ForumAttachment {
  id: string;
  name: string;
  size: string;
  url: string;
  type: 'pdf' | 'document' | 'image' | 'link';
}

export interface ForumReply {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  content: string;
  createdAt: string;
  attachments?: ForumAttachment[];
  likes: string[];
  isInstructorAnswer?: boolean;
}

export interface ForumThread {
  id: string;
  courseId: string;
  moduleId?: string;
  moduleTitle?: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  createdAt: string;
  category: ForumCategory;
  pinned?: boolean;
  resolved?: boolean;
  likes: string[];
  replies: ForumReply[];
  attachments?: ForumAttachment[];
}

export type CertificateBorderFamily = 'classic-double' | 'ornate-gold' | 'modern-clean' | 'medical-emerald' | 'executive-navy' | 'minimalist';
export type CertificateFontFamily = 'serif' | 'sans' | 'mono';
export type CertificateSealType = 'imss-gold' | 'digital-hologram' | 'cupn-shield' | 'nom024-badge' | 'none';

export interface CertificateSigner {
  id: string;
  name: string;
  title: string;
  department: string;
  signatureStyle: 'calligraphy-1' | 'calligraphy-2' | 'calligraphy-3' | 'calligraphy-4' | 'seal';
  signatureImageUrl?: string;
  enabled: boolean;
}

export interface CertificateTemplate {
  id: string;
  templatePreset: string;
  institutionName: string;
  coordinationName: string;
  platformName: string;
  slogan: string;
  showLogo: boolean;
  logoVariant: 'official' | 'gold' | 'white' | 'dark';
  logoSize: 'sm' | 'md' | 'lg' | 'xl';
  documentTypeTitle: string;
  introductoryText: string;
  studentHonorPrefix?: string;
  accreditationClause: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  borderFamily: CertificateBorderFamily;
  fontFamily: CertificateFontFamily;
  sealType: CertificateSealType;
  showWatermark: boolean;
  watermarkOpacity: number;
  showScoreBox: boolean;
  scoreBoxStyle: 'boxed' | 'pill' | 'minimal';
  showQrCode: boolean;
  qrFolioPrefix: string;
  showCryptographicHash: boolean;
  securityHashPrefix: string;
  cityAndDateText: string;
  signers: CertificateSigner[];
  lastModifiedAt?: string;
}

