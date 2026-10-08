import { Course, Quiz, User, PushNotification, AuditLogItem, SecurityConfig, OnPremiseConfig, QuizAttempt, ForumThread, CertificateTemplate } from '../types/lms';

// High-fidelity course cover images
import cloudArchCover from '../assets/images/course_cloud_arch_1790804896840.jpg';
import dataScienceCover from '../assets/images/course_data_science_1790804907072.jpg';
import cybersecurityCover from '../assets/images/course_cybersecurity_1790804916910.jpg';
import multimediaCover from '../assets/images/course_multimedia_design_1790804928061.jpg';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Ing. Mateo Arismendi',
    email: 'mateo.arismendi@imss.gob.mx',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Coordinación de Tecnologías de la Información IMSS',
    status: 'active',
    twoFactorEnabled: true,
    twoFactorSecret: 'JBSWY3DPEHPK3PXP',
    enrolledCourseIds: [],
    createdAt: '2026-01-15',
    lastLogin: '2026-10-01 07:15'
  },
  {
    id: 'user-prof-1',
    name: 'Dra. Gabriela Solís',
    email: 'gabriela.solis@imss.gob.mx',
    role: 'profesor',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Coordinación de Educación en Salud IMSS',
    status: 'active',
    twoFactorEnabled: true,
    twoFactorSecret: 'GEZDGNBVGY3TQOJQ',
    enrolledCourseIds: ['course-sec-01', 'course-cloud-02'],
    createdAt: '2026-02-01',
    lastLogin: '2026-10-01 06:45'
  },
  {
    id: 'user-prof-2',
    name: 'Dr. Carlos Valenzuela',
    email: 'carlos.valenzuela@imss.gob.mx',
    role: 'profesor',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&h=256&q=80',
    department: 'División de Epidemiología & Telemedicina IMSS',
    status: 'active',
    twoFactorEnabled: false,
    twoFactorSecret: 'MYJVKZ3CMF2GS3DH',
    enrolledCourseIds: ['course-cloud-02', 'course-ds-03'],
    createdAt: '2026-02-10',
    lastLogin: '2026-09-30 18:30'
  },
  {
    id: 'user-alum-1',
    name: 'Dra. Sofía Navarro Cruz',
    email: 'sofia.navarro@alumnos.imss.gob.mx',
    role: 'alumno',
    avatar: 'https://images.unsplash.com/photo-1594824813576-96a99281a8b9?auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Residencia Médica Familiar HGZ No. 1 IMSS',
    status: 'active',
    twoFactorEnabled: true,
    twoFactorSecret: 'KRSXG5CTMVRXEZLU',
    enrolledCourseIds: ['course-sec-01', 'course-cloud-02', 'course-media-04'],
    createdAt: '2026-03-01',
    lastLogin: '2026-10-01 07:10'
  },
  {
    id: 'user-alum-2',
    name: 'Lic. Diego Morales Silva',
    email: 'diego.morales@alumnos.imss.gob.mx',
    role: 'alumno',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Jefatura de Enfermería Quirúrgica UMAE IMSS',
    status: 'active',
    twoFactorEnabled: false,
    enrolledCourseIds: ['course-sec-01', 'course-ds-03'],
    createdAt: '2026-03-05',
    lastLogin: '2026-09-29 14:15'
  },
  {
    id: 'user-alum-3',
    name: 'Dra. Camila Peña Rojas',
    email: 'camila.pena@alumnos.imss.gob.mx',
    role: 'alumno',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Unidad de Medicina Continua y Calidad IMSS',
    status: 'active',
    twoFactorEnabled: true,
    twoFactorSecret: 'NVQWS3BOMNXW24DF',
    enrolledCourseIds: ['course-media-04', 'course-cloud-02'],
    createdAt: '2026-03-12',
    lastLogin: '2026-10-01 06:05'
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-sec-01',
    courseId: 'course-sec-01',
    moduleId: 'mod-sec-01',
    title: 'Evaluación Oficial IMSS: Cifrado de Datos Clínicos y Control 2FA (NOM-024)',
    description: 'Examen con corrección automática instantánea sobre custodia de expedientes clínicos electrónicos, cifrado AES-256 y protocolos TOTP.',
    passingScore: 70,
    timeLimitMinutes: 15,
    questions: [
      {
        id: 'q-sec-1',
        text: 'Conforme a la NOM-024-SSA3 y el estándar institucional IMSS, ¿cuál es el algoritmo de cifrado simétrico obligatorio para resguardar expedientes clínicos electrónicos en reposo?',
        type: 'single_choice',
        points: 25,
        options: [
          { id: 'opt-1', text: 'AES de 64 bits sin autenticación', isCorrect: false },
          { id: 'opt-2', text: 'AES-256 bits en modo GCM con vector de inicialización', isCorrect: true },
          { id: 'opt-3', text: 'DES de 56 bits legacy', isCorrect: false },
          { id: 'opt-4', text: 'MD5 con sal corta de 8 bits', isCorrect: false }
        ],
        explanation: 'AES-256 en modo GCM asegura tanto la confidencialidad total como la verificación de integridad criptográfica de los expedientes clínicos en servidores locales hospitalarios.'
      },
      {
        id: 'q-sec-2',
        text: 'En el acceso seguro al sistema de capacitación e-learning del IMSS, ¿qué elemento secreto se combina con la marca de tiempo para generar el token TOTP de 6 dígitos?',
        type: 'fill_blank',
        points: 25,
        fillBlankAnswer: 'clave secreta',
        explanation: 'El protocolo TOTP (RFC 6238) computa un hash HMAC combinando la "clave secreta" del usuario con el contador de tiempo de 30 segundos.'
      },
      {
        id: 'q-sec-3',
        text: '¿Verdadero o Falso? El cifrado TLS 1.3 durante la transmisión exime a la unidad hospitalaria de cifrar los discos duros locales donde se almacenan las evaluaciones.',
        type: 'true_false',
        points: 25,
        options: [
          { id: 'tf-1', text: 'Verdadero (TLS cubre reposo y tránsito)', isCorrect: false },
          { id: 'tf-2', text: 'Falso (TLS solo protege el tránsito de datos por la red)', isCorrect: true }
        ],
        explanation: 'TLS 1.3 protege el tránsito por la red institucional. En reposo, los servidores locales del IMSS requieren cifrado AES-256 a nivel de base de datos o almacenamiento físico.'
      },
      {
        id: 'q-sec-4',
        text: 'Selecciona las medidas institucionales obligatorias para el personal con privilegios en plataformas e-learning IMSS:',
        type: 'multiple_choice',
        points: 25,
        options: [
          { id: 'mc-1', text: 'Exigir autenticación de doble factor (2FA con TOTP)', isCorrect: true },
          { id: 'mc-2', text: 'Auditoría en tiempo real con registro de dirección IP y fecha', isCorrect: true },
          { id: 'mc-3', text: 'Compartir contraseñas con colegas de guardia', isCorrect: false },
          { id: 'mc-4', text: 'Bloqueo automático de cuenta ante intentos de fuerza bruta', isCorrect: true }
        ],
        explanation: 'Las políticas de seguridad del IMSS exigen 2FA obligatorio, auditoría inmutable de accesos y bloqueo por intentos fallidos para prevenir suplantación de identidad.'
      }
    ]
  },
  {
    id: 'quiz-cloud-01',
    courseId: 'course-cloud-02',
    moduleId: 'mod-cloud-01',
    title: 'Evaluación: Servidores Locales Hospitalarios y Respaldo Híbrido',
    description: 'Mide competencias sobre orquestación de Docker local, persistencia y exportación de respaldos en unidades médicas del IMSS.',
    passingScore: 75,
    timeLimitMinutes: 20,
    questions: [
      {
        id: 'q-cloud-1',
        text: '¿Qué mecanismo en Docker Compose garantiza que la información académica persista al reiniciar el servidor físico de la delegación o HGZ?',
        type: 'single_choice',
        points: 30,
        options: [
          { id: 'qc-1', text: 'Volúmenes persistentes nombrados (named volumes) o mapeo local', isCorrect: true },
          { id: 'qc-2', text: 'Reinicio automático sin almacenamiento montado', isCorrect: false },
          { id: 'qc-3', text: 'Memoria RAM volátil temporal (tmpfs)', isCorrect: false }
        ],
        explanation: 'Los volúmenes persistentes desacoplan los datos del ciclo de vida del contenedor para asegurar cero pérdida de notas o cursos.'
      },
      {
        id: 'q-cloud-2',
        text: 'Escribe el formato universal de archivo de calendario (.ics) utilizado para sincronizar sesiones clínicas y exámenes con Outlook o Google Calendar:',
        type: 'fill_blank',
        points: 35,
        fillBlankAnswer: 'icalendar',
        explanation: 'El estándar iCalendar (RFC 5545) genera archivos .ics compatibles universalmente con cualquier cliente de correo o calendario.'
      },
      {
        id: 'q-cloud-3',
        text: '¿Verdadero o Falso? El servidor local del hospital puede replicar copias de seguridad cifradas a la nube institucional sin abrir puertos de entrada en la red interna.',
        type: 'true_false',
        points: 35,
        options: [
          { id: 'tf-c1', text: 'Verdadero (Emplea conexiones salientes seguras vía HTTPS)', isCorrect: true },
          { id: 'tf-c2', text: 'Falso (Requiere IP pública con puertos abiertos hacia internet)', isCorrect: false }
        ],
        explanation: 'La sincronización saliente hacia S3/GCS por HTTPS mantiene el servidor local de la unidad médica aislado de ataques externos.'
      }
    ]
  },
  {
    id: 'quiz-sec-02',
    courseId: 'course-sec-01',
    moduleId: 'mod-sec-02',
    title: 'Evaluación Módulo 2: Ciberseguridad Hospitalaria y Auditoría de Acceso IMSS',
    description: 'Evaluación técnica sobre bitácoras inmutables, detección de intrusiones y prevención de fugas de expedientes clínicos.',
    passingScore: 70,
    timeLimitMinutes: 15,
    questions: [
      {
        id: 'q-sec2-1',
        text: '¿Cuál es la función primordial de la bitácora de auditoría inmutable en el servidor local de la unidad médica?',
        type: 'single_choice',
        points: 50,
        options: [
          { id: 'sb-1', text: 'Registrar de forma no modificable cada inicio de sesión, cambio de rol y consulta de expediente con IP y fecha', isCorrect: true },
          { id: 'sb-2', text: 'Almacenar contraseñas en texto claro para recuperación rápida', isCorrect: false },
          { id: 'sb-3', text: 'Desactivar las alertas de seguridad ante múltiples intentos fallidos', isCorrect: false }
        ],
        explanation: 'Las bitácoras inmutables garantizan no repudio y trazabilidad forense ante incidentes de seguridad conforme a normativas del IMSS.'
      },
      {
        id: 'q-sec2-2',
        text: '¿Verdadero o Falso? El aislamiento de red interna (VLAN hospitalaria) previene que accesos indebidos desde internet alcancen las bases de datos de capacitación y salud.',
        type: 'true_false',
        points: 50,
        options: [
          { id: 'tf-sec2-1', text: 'Verdadero (Segmentación de red como defensa en profundidad)', isCorrect: true },
          { id: 'tf-sec2-2', text: 'Falso (Las VLAN no aportan seguridad de red)', isCorrect: false }
        ],
        explanation: 'La segmentación de red evita el movimiento lateral de amenazas en la intranet delegacional.'
      }
    ]
  },
  {
    id: 'quiz-cloud-02',
    courseId: 'course-cloud-02',
    moduleId: 'mod-cloud-02',
    title: 'Evaluación Módulo 2: Continuidad Operativa y Respaldos Cifrados en Hospitales',
    description: 'Evaluación sobre planes de contingencia ante caídas de enlace, snapshots en caliente y restauración de fábrica.',
    passingScore: 70,
    timeLimitMinutes: 15,
    questions: [
      {
        id: 'q-c2-1',
        text: 'Al exportar una copia de seguridad del servidor local hospitalario, ¿por qué debe generarse con formato JSON estructurado y validación de hash?',
        type: 'single_choice',
        points: 50,
        options: [
          { id: 'cb-1', text: 'Para asegurar portabilidad total e integridad verificable durante la restauración en otra unidad médica', isCorrect: true },
          { id: 'cb-2', text: 'Para aumentar innecesariamente el peso del archivo', isCorrect: false }
        ],
        explanation: 'La portabilidad completa permite reconstruir el estado académico y configuraciones en cualquier servidor on-premise en minutos.'
      },
      {
        id: 'q-c2-2',
        text: '¿Verdadero o Falso? El sistema local de CUPN Conecta puede operar de manera autónoma sin internet durante turnos nocturnos o contingencias de enlace.',
        type: 'true_false',
        points: 50,
        options: [
          { id: 'tf-c2-1', text: 'Verdadero (Arquitectura local autoritativa y autónoma)', isCorrect: true },
          { id: 'tf-c2-2', text: 'Falso (Se bloquea si se interrumpe la conexión WAN)', isCorrect: false }
        ],
        explanation: 'El diseño on-premise hospeda cursos, videos y evaluaciones localmente garantizando disponibilidad clínica permanente.'
      }
    ]
  },
  {
    id: 'quiz-media-01',
    courseId: 'course-media-04',
    moduleId: 'mod-media-01',
    title: 'Evaluación Módulo 1: Formatos Multimedia Clínicos y Accesibilidad Móvil',
    description: 'Mide conocimientos sobre estándares de video, compresión optimizada y entrega responsiva para personal de guardias.',
    passingScore: 70,
    timeLimitMinutes: 15,
    questions: [
      {
        id: 'q-m1-1',
        text: '¿Cuál es el códec y contenedor estándar recomendado para videos didácticos de salud visualizados en teléfonos móviles de guardias?',
        type: 'single_choice',
        points: 50,
        options: [
          { id: 'mb-1', text: 'MP4 con códec H.264 y audio AAC por su compatibilidad universal nativa', isCorrect: true },
          { id: 'mb-2', text: 'Archivos AVI sin comprimir de más de 2GB', isCorrect: false },
          { id: 'mb-3', text: 'Formatos Flash obsoletos', isCorrect: false }
        ],
        explanation: 'MP4 con H.264 asegura bajo consumo de batería, carga rápida y compatibilidad total con iOS y Android.'
      },
      {
        id: 'q-m1-2',
        text: '¿Verdadero o Falso? Añadir subtítulos y texto explicativo a las lecciones en video permite el aprendizaje en áreas de terapia intensiva donde no se puede activar audio con volumen alto.',
        type: 'true_false',
        points: 50,
        options: [
          { id: 'tf-m1', text: 'Verdadero (Accesibilidad operativa en entornos hospitalarios)', isCorrect: true },
          { id: 'tf-m2', text: 'Falso (El audio con altavoz es obligatorio)', isCorrect: false }
        ],
        explanation: 'El texto didáctico sincronizado permite que el personal en guardias hospitalarias aprenda sin perturbar el descanso o tratamiento de los pacientes.'
      }
    ]
  },
  {
    id: 'quiz-ds-01',
    courseId: 'course-ds-03',
    moduleId: 'mod-ds-01',
    title: 'Evaluación Módulo 1: Analítica y Reportes de Rendimiento Académico IMSS',
    description: 'Evaluación sobre cálculo de métricas clave, tasas de aprobación y exportación para auditorías de la Dirección Médica.',
    passingScore: 70,
    timeLimitMinutes: 15,
    questions: [
      {
        id: 'q-ds1-1',
        text: 'Para exportar datos a Microsoft Excel sin alteración de caracteres en español (como tildes o la letra ñ), ¿qué codificación se implementa?',
        type: 'single_choice',
        points: 50,
        options: [
          { id: 'ds-1', text: 'UTF-8 con Byte Order Mark (BOM)', isCorrect: true },
          { id: 'ds-2', text: 'ASCII puro de 7 bits', isCorrect: false }
        ],
        explanation: 'El BOM UTF-8 (\\uFEFF) le indica a Excel y herramientas de hoja de cálculo que interpreten correctamente caracteres ortográficos del idioma español.'
      },
      {
        id: 'q-ds1-2',
        text: '¿Verdadero o Falso? El cálculo del promedio global pondera las calificaciones obtenidas en las evaluaciones automáticas de cada módulo.',
        type: 'true_false',
        points: 50,
        options: [
          { id: 'tf-ds1', text: 'Verdadero (Cada evaluación de módulo suma al desempeño consolidado)', isCorrect: true },
          { id: 'tf-ds2', text: 'Falso (Solo cuenta la última pregunta del curso)', isCorrect: false }
        ],
        explanation: 'El monitoreo por estudiante y módulo ofrece una radiografía precisa de las competencias clínicas adquiridas.'
      }
    ]
  },
  {
    id: 'quiz-media-02',
    courseId: 'course-media-04',
    moduleId: 'mod-media-02',
    title: 'Evaluación Módulo 2: Producción de Cápsulas Didácticas y Guías Clínicas Auditivas',
    description: 'Evaluación de competencias sobre estructuración de podcasts médicos, microaprendizaje hospitalario y pautas pedagógicas.',
    passingScore: 75,
    timeLimitMinutes: 15,
    questions: [
      {
        id: 'q-m2-1',
        text: 'En el diseño de cápsulas auditivas (podcasts) para personal médico en áreas críticas, ¿cuál es la duración recomendada para maximizar la retención cognitiva?',
        type: 'single_choice',
        points: 50,
        options: [
          { id: 'qm2-1', text: 'De 5 a 12 minutos (píldoras formativas de microaprendizaje)', isCorrect: true },
          { id: 'qm2-2', text: 'Más de 3 horas continuas sin pausas', isCorrect: false },
          { id: 'qm2-3', text: 'Grabaciones de baja fidelidad con ruido de fondo hospitalario', isCorrect: false }
        ],
        explanation: 'Las píldoras de 5 a 12 minutos permiten al personal de guardia repasar protocolos sin generar fatiga mental.'
      },
      {
        id: 'q-m2-2',
        text: '¿Verdadero o Falso? Los módulos de telemedicina deben incluir transcripciones textuales completas para cumplir con las pautas de accesibilidad e inclusión institucional.',
        type: 'true_false',
        points: 50,
        options: [
          { id: 'tf-m2-1', text: 'Verdadero (Garantiza accesibilidad universal y estudio en áreas silenciosas)', isCorrect: true },
          { id: 'tf-m2-2', text: 'Falso (El audio es suficiente)', isCorrect: false }
        ],
        explanation: 'Las transcripciones permiten consultar dosis y contraindicaciones de manera rápida y accesible para todo el personal.'
      }
    ]
  },
  {
    id: 'quiz-ds-02',
    courseId: 'course-ds-03',
    moduleId: 'mod-ds-02',
    title: 'Evaluación Módulo 2: Auditoría Delegacional y Exportación a Formatos Institucionales',
    description: 'Evaluación sobre cumplimiento de normativas de auditoría, trazabilidad de calificaciones y generación de constancias.',
    passingScore: 70,
    timeLimitMinutes: 15,
    questions: [
      {
        id: 'q-ds2-1',
        text: '¿Qué información debe contener obligatoriamente el reporte de auditoría delegacional remitido a la Dirección de Prestaciones Médicas del IMSS?',
        type: 'single_choice',
        points: 50,
        options: [
          { id: 'qds2-1', text: 'Matrícula del alumno, puntaje por módulo, porcentaje global, fecha, hora y validez criptográfica', isCorrect: true },
          { id: 'qds2-2', text: 'Únicamente el nombre de pila sin marca de tiempo ni registro de intentos', isCorrect: false }
        ],
        explanation: 'La trazabilidad formal requiere matrícula, desglose por módulo y sello de tiempo para tener validez ante comités de certificación médica.'
      },
      {
        id: 'q-ds2-2',
        text: '¿Verdadero o Falso? El personal puede volver a presentar la evaluación de un módulo si no alcanzó la nota aprobatoria mínima requerida.',
        type: 'true_false',
        points: 50,
        options: [
          { id: 'tf-ds2-1', text: 'Verdadero (El sistema registra los reintentos y mantiene el mejor resultado en la bitácora)', isCorrect: true },
          { id: 'tf-ds2-2', text: 'Falso (Solo se permite un único intento de por vida)', isCorrect: false }
        ],
        explanation: 'El modelo formativo institucional de CUPN Conecta fomenta el reaprendizaje y la mejora continua mediante reintentos supervisados.'
      }
    ]
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-sec-01',
    title: 'Seguridad en Datos Médicos, Cifrado AES-256 y Cumplimiento NOM-024',
    slug: 'seguridad-datos-medicos-nom024',
    description: 'Protocolos de protección de información clínica, expedientes electrónicos, custodia de credenciales, autenticación de dos factores (2FA) y auditoría institucional en el IMSS.',
    instructorId: 'user-prof-1',
    instructorName: 'Dra. Gabriela Solís',
    instructorRole: 'Coordinación de Educación en Salud IMSS',
    category: 'Ciberseguridad & Normatividad',
    level: 'Intermedio',
    coverImage: cybersecurityCover,
    durationHours: 35,
    published: true,
    updatedAt: '2026-09-30',
    enrolledStudentIds: ['user-alum-1', 'user-alum-2'],
    calendarEvents: [
      {
        id: 'cal-sec-01',
        courseId: 'course-sec-01',
        courseTitle: 'Seguridad en Datos Médicos IMSS',
        title: 'Sesión Clínica Magistral: Implementación de 2FA y Llaves TOTP',
        description: 'Capacitación en vivo para personal médico y administrativo sobre prevención de accesos no autorizados.',
        date: '2026-10-06',
        startTime: '09:00',
        endTime: '10:30',
        type: 'live_session',
        locationUrl: 'https://telemedicina.imss.gob.mx/sala/seguridad-salud'
      },
      {
        id: 'cal-sec-02',
        courseId: 'course-sec-01',
        courseTitle: 'Seguridad en Datos Médicos IMSS',
        title: 'Examen de Acreditación Oficial NOM-024',
        description: 'Evaluación cronometrada obligatoria con generación instantánea de constancia institucional.',
        date: '2026-10-15',
        startTime: '11:00',
        endTime: '12:00',
        type: 'exam'
      }
    ],
    modules: [
      {
        id: 'mod-sec-01',
        title: 'Módulo 1: Fundamentos de Criptografía y Expediente Clínico Electrónico',
        description: 'Arquitectura AES-256-GCM, derivación de llaves y almacenamiento en unidades hospitalarias.',
        order: 1,
        quizId: 'quiz-sec-01',
        lessons: [
          {
            id: 'les-sec-101',
            title: '1.1 Protección Criptográfica en Servidores Locales Hospitalarios',
            type: 'video',
            durationMinutes: 18,
            mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            mediaFileName: 'leccion_cifrado_expediente_imss.mp4',
            mediaFileSize: '48.2 MB',
            content: `### Marco Normativo y Directrices IMSS
1. La Norma Oficial Mexicana NOM-024-SSA3 establece la obligatoriedad de garantizar la integridad y confidencialidad de la información en salud.
2. Cada servidor local de las Unidades de Medicina Familiar (UMF) y Hospitales Generales de Zona (HGZ) implementa cifrado AES-256-GCM.
3. Se auditan accesos con marca de tiempo precisa y firma electrónica.

> **Regla de Oro**: Ningún expediente clínico o calificación de personal de salud se guarda en texto plano en la base de datos local.`,
            attachments: [
              {
                id: 'att-sec-1',
                name: 'Guia_IMSS_Cifrado_Datos_Clinicos.pdf',
                size: '2.4 MB',
                type: 'application/pdf',
                url: '#'
              }
            ],
            completedByStudentIds: ['user-alum-1', 'user-alum-2']
          },
          {
            id: 'les-sec-102',
            title: '1.2 Configuración del Segundo Factor de Autenticación (2FA / TOTP)',
            type: 'interactive',
            durationMinutes: 20,
            content: `### Protocolo Institucional de Doble Factor
Para acceder a los módulos de gestión y evaluación docente en el IMSS, se requiere validar un token dinámico de 6 dígitos:
- Algoritmo TOTP estándar RFC 6238.
- Clave secreta almacenada de forma segura en la aplicación móvil de cada colaborador.
- Rotación de llaves semestral auditada.`,
            attachments: [],
            completedByStudentIds: ['user-alum-1']
          }
        ]
      },
      {
        id: 'mod-sec-02',
        title: 'Módulo 2: Ciberseguridad Hospitalaria y Auditoría de Acceso IMSS',
        description: 'Monitoreo de tráfico local, bitácoras inmutables y prevención de incidentes en UMF y HGZ.',
        order: 2,
        quizId: 'quiz-sec-02',
        lessons: [
          {
            id: 'les-sec-201',
            title: '2.1 Detección de Accesos Irregulares y Trazabilidad Forense',
            type: 'video',
            durationMinutes: 20,
            mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            mediaFileName: 'auditoria_ciberseguridad_imss.mp4',
            mediaFileSize: '42.1 MB',
            content: `### Principios de Auditoría Delegacional
1. Cada interacción con expedientes clínicos o evaluaciones académicas genera una entrada inmutable con dirección IP, actor y marca de tiempo.
2. Los sistemas locales alertan en tiempo real ante patrones de acceso fuera de los turnos hospitalarios habituales.
3. Se verifica la rotación periódica de secretos criptográficos.`,
            attachments: [],
            completedByStudentIds: ['user-alum-1']
          }
        ]
      }
    ]
  },
  {
    id: 'course-cloud-02',
    title: 'Despliegue On-Premise en Hospitales y Unidades Médicas IMSS',
    slug: 'despliegue-on-premise-imss-docker',
    description: 'Instalación y administración de plataformas de capacitación sobre servidores locales en hospitales del IMSS con replicación a la nube institucional.',
    instructorId: 'user-prof-2',
    instructorName: 'Dr. Carlos Valenzuela',
    instructorRole: 'División de Epidemiología & Telemedicina IMSS',
    category: 'Infraestructura & Servidores',
    level: 'Avanzado',
    coverImage: cloudArchCover,
    durationHours: 40,
    published: true,
    updatedAt: '2026-09-28',
    enrolledStudentIds: ['user-alum-1', 'user-alum-3'],
    calendarEvents: [
      {
        id: 'cal-cloud-01',
        courseId: 'course-cloud-02',
        courseTitle: 'Despliegue On-Premise IMSS',
        title: 'Taller Técnico: Orquestación con Docker Compose en HGZ',
        description: 'Levantamiento de instancias locales con base de datos PostgreSQL persistente y respaldo automático.',
        date: '2026-10-10',
        startTime: '16:00',
        endTime: '18:00',
        type: 'workshop',
        locationUrl: 'https://telemedicina.imss.gob.mx/sala/taller-devops'
      }
    ],
    modules: [
      {
        id: 'mod-cloud-01',
        title: 'Módulo 1: Contenedores y Almacenamiento Local en Intranet Hospitalaria',
        description: 'Volúmenes locales, redes aisladas y seguridad en servidores físicos de delegaciones.',
        order: 1,
        quizId: 'quiz-cloud-01',
        lessons: [
          {
            id: 'les-cloud-101',
            title: '1.1 Estructura del Servidor On-Premise IMSS con Docker',
            type: 'document',
            durationMinutes: 22,
            content: `### Arquitectura de Despliegue Local Hospitalario
El sistema se ejecuta en la intranet física del hospital o clínica para brindar velocidad instantánea sin dependencia de conectividad externa constante.`,
            attachments: [
              {
                id: 'att-cloud-1',
                name: 'docker-compose.imss-hospital.yml',
                size: '3.1 KB',
                type: 'text/yaml',
                url: '#'
              }
            ],
            completedByStudentIds: ['user-alum-1', 'user-alum-3']
          }
        ]
      },
      {
        id: 'mod-cloud-02',
        title: 'Módulo 2: Continuidad Operativa y Respaldos Cifrados en Hospitales',
        description: 'Planes de contingencia ante cortes de enlace, snapshots en caliente y restauración de fábrica.',
        order: 2,
        quizId: 'quiz-cloud-02',
        lessons: [
          {
            id: 'les-cloud-201',
            title: '2.1 Estrategias de Backup y Replicación Híbrida',
            type: 'document',
            durationMinutes: 25,
            content: `### Respaldo y Recuperación Rápida
Los datos de calificaciones, alumnos y cursos se exportan diariamente en snapshots JSON cifrados que permiten reinstalar el sistema en servidores de reserva en menos de 5 minutos.`,
            attachments: [],
            completedByStudentIds: ['user-alum-1']
          }
        ]
      }
    ]
  },
  {
    id: 'course-media-04',
    title: 'Producción de Contenidos Multimedia para Telemedicina y Educación en Salud',
    slug: 'multimedia-telemedicina-imss',
    description: 'Metodologías didácticas para crear cápsulas de video médico, guías clínicas auditivas y recursos interactivos de alta calidad para personal de salud.',
    instructorId: 'user-prof-1',
    instructorName: 'Dra. Gabriela Solís',
    instructorRole: 'Coordinación de Educación en Salud IMSS',
    category: 'Educación Médica & Multimedia',
    level: 'Principiante',
    coverImage: multimediaCover,
    durationHours: 30,
    published: true,
    updatedAt: '2026-09-29',
    enrolledStudentIds: ['user-alum-1', 'user-alum-3'],
    calendarEvents: [],
    modules: [
      {
        id: 'mod-media-01',
        title: 'Módulo 1: Formatos de Video y Audio Optimizados para Dispositivos Móviles',
        description: 'Compresión sin pérdida y visualización fluida de material clínico en turnos operativos.',
        order: 1,
        quizId: 'quiz-media-01',
        lessons: [
          {
            id: 'les-media-101',
            title: '1.1 Formatos Web y Accesibilidad para el Personal IMSS',
            type: 'video',
            durationMinutes: 16,
            mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            mediaFileName: 'guia_multimedia_salud.mp4',
            mediaFileSize: '35.4 MB',
            content: `El personal médico y de enfermería requiere consultar contenidos formativos en teléfonos móviles y tabletas durante sus guardias.
- Videos en MP4/H.264 fluidos sin almacenamiento en búfer.
- Audios en MP3 con explicaciones farmacológicas breves.
- Documentos PDF descargables para consulta offline en áreas quirúrgicas.`,
            attachments: [],
            completedByStudentIds: ['user-alum-1']
          }
        ]
      },
      {
        id: 'mod-media-02',
        title: 'Módulo 2: Producción de Cápsulas Didácticas y Guías Clínicas Auditivas',
        description: 'Estructuración de microaprendizaje hospitalario, grabación de voz didáctica y pautas pedagógicas.',
        order: 2,
        quizId: 'quiz-media-02',
        lessons: [
          {
            id: 'les-media-201',
            title: '2.1 Grabación de Píldoras Formativas de Salud y Transcripción Inclusiva',
            type: 'audio',
            durationMinutes: 14,
            mediaUrl: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
            mediaFileName: 'capsula_auditiva_protocolo.mp3',
            mediaFileSize: '12.8 MB',
            content: `### Producción Sonora Institucional
1. Mantener las cápsulas auditivas en el rango de 5 a 12 minutos para evitar la sobrecarga cognitiva en turnos hospitalarios.
2. Añadir transcripciones textuales completas que permitan la consulta rápida en áreas estériles o quirúrgicas.
3. Evaluar el impacto formativo con la evaluación oficial de cada módulo.`,
            attachments: [],
            completedByStudentIds: ['user-alum-1']
          }
        ]
      }
    ]
  },
  {
    id: 'course-ds-03',
    title: 'Analítica de Rendimiento y Reportes Académicos Delegacionales IMSS',
    slug: 'analitica-reportes-imss',
    description: 'Gestión y exportación de reportes de capacitación a formatos CSV y PDF para auditorías de la Dirección de Prestaciones Médicas.',
    instructorId: 'user-prof-2',
    instructorName: 'Dr. Carlos Valenzuela',
    instructorRole: 'División de Epidemiología & Telemedicina IMSS',
    category: 'Analítica & Gestión',
    level: 'Intermedio',
    coverImage: dataScienceCover,
    durationHours: 25,
    published: true,
    updatedAt: '2026-09-22',
    enrolledStudentIds: ['user-alum-2'],
    calendarEvents: [],
    modules: [
      {
        id: 'mod-ds-01',
        title: 'Módulo 1: Trazabilidad y Cumplimiento Académico',
        description: 'Tablas de evaluación, cálculo de promedios ponderados y descarga de auditoría.',
        order: 1,
        quizId: 'quiz-ds-01',
        lessons: [
          {
            id: 'les-ds-101',
            title: '1.1 Generación y Exportación de Registros a CSV y PDF',
            type: 'document',
            durationMinutes: 18,
            content: `### Portabilidad y Descarga de Expedientes Formativos
El sistema permite descargar con un solo clic el padrón completo de personal capacitado en formatos CSV (compatible con Excel institucional) y PDF oficial con membrete del IMSS.`,
            attachments: [],
            completedByStudentIds: ['user-alum-2']
          }
        ]
      },
      {
        id: 'mod-ds-02',
        title: 'Módulo 2: Auditoría Delegacional y Exportación a Formatos Institucionales',
        description: 'Cumplimiento normativo, validación de firmas digitales y consolidado de notas por unidad médica.',
        order: 2,
        quizId: 'quiz-ds-02',
        lessons: [
          {
            id: 'les-ds-201',
            title: '2.1 Tableros de Mando y Desglose de Evaluaciones por Módulo',
            type: 'document',
            durationMinutes: 20,
            content: `### Validación de Indicadores Institucionales
El seguimiento módulo a módulo garantiza que los jefes de enseñanza médica puedan identificar brechas de conocimiento específicas en farmacología, normatividad o protocolos clínicos antes de emitir las acreditaciones oficiales.`,
            attachments: [],
            completedByStudentIds: ['user-alum-2']
          }
        ]
      }
    ]
  }
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'att-imss-001',
    quizId: 'quiz-sec-01',
    quizTitle: 'Evaluación Oficial IMSS: Cifrado de Datos Clínicos y Control 2FA (NOM-024)',
    courseId: 'course-sec-01',
    courseTitle: 'Seguridad en Datos Médicos, Cifrado AES-256 y Cumplimiento NOM-024',
    studentId: 'user-alum-1',
    studentName: 'Dra. Sofía Navarro Cruz',
    studentEmail: 'sofia.navarro@alumnos.imss.gob.mx',
    score: 100,
    maxScore: 100,
    percentage: 100,
    passed: true,
    completedAt: '2026-09-30 16:30',
    answers: {
      'q-sec-1': 'opt-2',
      'q-sec-2': 'clave secreta',
      'q-sec-3': 'tf-2',
      'q-sec-4': ['mc-1', 'mc-2', 'mc-4']
    }
  },
  {
    id: 'att-imss-002',
    quizId: 'quiz-cloud-01',
    quizTitle: 'Evaluación: Servidores Locales Hospitalarios y Respaldo Híbrido',
    courseId: 'course-cloud-02',
    courseTitle: 'Despliegue On-Premise en Hospitales y Unidades Médicas IMSS',
    studentId: 'user-alum-1',
    studentName: 'Dra. Sofía Navarro Cruz',
    studentEmail: 'sofia.navarro@alumnos.imss.gob.mx',
    score: 65,
    maxScore: 100,
    percentage: 65,
    passed: false,
    completedAt: '2026-09-29 11:20',
    answers: {
      'q-cloud-1': 'qc-1',
      'q-cloud-2': 'xml',
      'q-cloud-3': 'tf-c1'
    }
  },
  {
    id: 'att-imss-003',
    quizId: 'quiz-sec-01',
    quizTitle: 'Evaluación Oficial IMSS: Cifrado de Datos Clínicos y Control 2FA (NOM-024)',
    courseId: 'course-sec-01',
    courseTitle: 'Seguridad en Datos Médicos, Cifrado AES-256 y Cumplimiento NOM-024',
    studentId: 'user-alum-2',
    studentName: 'Lic. Diego Morales Silva',
    studentEmail: 'diego.morales@alumnos.imss.gob.mx',
    score: 75,
    maxScore: 100,
    percentage: 75,
    passed: true,
    completedAt: '2026-09-28 14:15',
    answers: {
      'q-sec-1': 'opt-2',
      'q-sec-2': 'clave secreta',
      'q-sec-3': 'tf-2',
      'q-sec-4': ['mc-1', 'mc-2', 'mc-4']
    }
  },
  {
    id: 'att-imss-004',
    quizId: 'quiz-sec-02',
    quizTitle: 'Evaluación Módulo 2: Ciberseguridad Hospitalaria y Auditoría de Acceso IMSS',
    courseId: 'course-sec-01',
    courseTitle: 'Seguridad en Datos Médicos, Cifrado AES-256 y Cumplimiento NOM-024',
    studentId: 'user-alum-1',
    studentName: 'Dra. Sofía Navarro Cruz',
    studentEmail: 'sofia.navarro@alumnos.imss.gob.mx',
    score: 100,
    maxScore: 100,
    percentage: 100,
    passed: true,
    completedAt: '2026-10-01 07:15',
    answers: {
      'q-sec2-1': 'sb-1',
      'q-sec2-2': 'tf-sec2-1'
    }
  }
];

export const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif-imss-1',
    title: 'Aviso IMSS: Examen de Acreditación Próximo',
    message: 'La evaluación de Seguridad en Datos Médicos NOM-024 vence en 48 horas. Recuerda completar tus módulos.',
    date: 'Hace 2 horas',
    read: false,
    type: 'reminder',
    courseId: 'course-sec-01'
  },
  {
    id: 'notif-imss-2',
    title: 'Constancia Acreditada por Educación en Salud',
    message: 'Has obtenido 100% en la evaluación. Tu constancia oficial IMSS está disponible para descarga e impresión.',
    date: 'Ayer, 18:24',
    read: false,
    type: 'grade',
    courseId: 'course-sec-01'
  },
  {
    id: 'notif-imss-3',
    title: 'Cifrado Institucional Verificado (AES-256)',
    message: 'El servidor local de la unidad médica ha completado la rotación de claves criptográficas bajo estándar FIPS.',
    date: 'Hace 3 días',
    read: true,
    type: 'security'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-imss-101',
    timestamp: '2026-10-01 07:15:20',
    actorEmail: 'mateo.arismendi@imss.gob.mx',
    actorRole: 'admin',
    action: 'Verificación 2FA Exitosa',
    details: 'Token TOTP validado desde red delegacional IMSS',
    ipAddress: '10.24.120.14 (Red Hospitalaria)',
    status: 'success'
  },
  {
    id: 'log-imss-102',
    timestamp: '2026-10-01 06:50:11',
    actorEmail: 'sofia.navarro@alumnos.imss.gob.mx',
    actorRole: 'alumno',
    action: 'Evaluación Automática Calificada',
    details: 'Examen quiz-sec-01 acreditado con 100% de efectividad',
    ipAddress: '10.24.120.88',
    status: 'success'
  },
  {
    id: 'log-imss-103',
    timestamp: '2026-09-30 22:15:00',
    actorEmail: 'system.cron@imss.gob.mx',
    actorRole: 'admin',
    action: 'Respaldo Local Realizado',
    details: 'Snapshot completo de base de datos hospitalaria cifrada con AES-256',
    ipAddress: '127.0.0.1 (Localhost)',
    status: 'success'
  }
];

export const INITIAL_SECURITY_CONFIG: SecurityConfig = {
  encryptionEnabled: true,
  cipherAlgorithm: 'AES-256-GCM (Cumplimiento NOM-024 / NIST)',
  keyRotationDate: '2026-10-01 (Próxima: 2026-12-31)',
  enforce2FA: true,
  sslTlsVersion: 'TLS 1.3 con Perfect Forward Secrecy',
  dataAtRestEncrypted: true,
  dataTransitEncrypted: true
};

export const INITIAL_ONPREMISE_CONFIG: OnPremiseConfig = {
  serverHost: 'srv-lms.hospital-imss.gob.mx',
  port: 3000,
  databaseEngine: 'postgres_onprem',
  databasePath: '/var/lib/imss-lms/data/db.sqlite',
  cloudSyncEnabled: true,
  cloudProvider: 'aws_s3',
  cloudBucket: 's3://imss-educacion-salud-backups',
  lastBackupAt: '2026-10-01 04:00 AM',
  maxUploadSizeMB: 500
};

export const INITIAL_FORUM_THREADS: ForumThread[] = [
  {
    id: 'thread-sec-01',
    courseId: 'course-sec-01',
    moduleId: 'mod-sec-01',
    moduleTitle: 'Módulo 1: Fundamentos de Cifrado y Autenticación en Sistemas de Salud',
    title: '📌 [Material Oficial] Guía de Cumplimiento Técnico de la NOM-024-SSA3-2012 para Sistemas de Salud IMSS',
    content: 'Estimados médicos residentes, directores de unidad y personal de enfermería:\n\nLes comparto la guía complementaria aprobada por la Coordinación de Unidades de Primer Nivel para la homologación de sistemas de información clínica. Es indispensable revisar las secciones 4 y 7 relativas al cifrado de llaves simétricas y el resguardo de trazas de auditoría antes de presentar la evaluación del Módulo 1.',
    authorId: 'user-prof-1',
    authorName: 'Dra. Gabriela Solís',
    authorRole: 'profesor',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&h=256&q=80',
    createdAt: '2026-09-29 09:30',
    category: 'material',
    pinned: true,
    resolved: true,
    likes: ['user-alum-1', 'user-alum-3', 'user-admin-1'],
    attachments: [
      {
        id: 'att-for-01',
        name: 'Guia_Tecnica_NOM024_IMSS_CUPN_2026.pdf',
        size: '3.8 MB',
        type: 'pdf',
        url: '#'
      },
      {
        id: 'att-for-02',
        name: 'Matriz_Riesgos_Criptografia_Hospitalaria.xlsx',
        size: '1.2 MB',
        type: 'document',
        url: '#'
      }
    ],
    replies: [
      {
        id: 'rep-sec-01-1',
        threadId: 'thread-sec-01',
        authorId: 'user-alum-1',
        authorName: 'Dra. Sofía Navarro Cruz',
        authorRole: 'alumno',
        authorAvatar: 'https://images.unsplash.com/photo-1594824813576-96a99281a8b9?auto=format&fit=crop&w=256&h=256&q=80',
        content: 'Muchas gracias Dra. Gabriela por el material. En la UMF 14 ya estamos implementando el flujo de doble factor para la firma digital de notas de contrarreferencia.',
        createdAt: '2026-09-29 11:15',
        likes: ['user-prof-1']
      },
      {
        id: 'rep-sec-01-2',
        threadId: 'thread-sec-01',
        authorId: 'user-prof-1',
        authorName: 'Dra. Gabriela Solís',
        authorRole: 'profesor',
        authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&h=256&q=80',
        content: 'Excelente iniciativa Dra. Sofía. Recuerden verificar que el servidor local de la UMF sincronice la hora contra el servidor NTP delegacional para que las marcas de tiempo tengan plena validez jurídica.',
        createdAt: '2026-09-29 14:02',
        likes: ['user-alum-1', 'user-admin-1'],
        isInstructorAnswer: true
      }
    ]
  },
  {
    id: 'thread-sec-02',
    courseId: 'course-sec-01',
    moduleId: 'mod-sec-01',
    moduleTitle: 'Módulo 1: Fundamentos de Cifrado y Autenticación en Sistemas de Salud',
    title: '¿En qué casos de emergencia hospitalaria se puede utilizar el código de contingencia para 2FA?',
    content: 'Colegas y docentes, durante una guardia nocturna en área de urgencias pediátricas se presentó una caída temporal de la señal de red móvil, impidiendo recibir el SMS del token. ¿El protocolo IMSS autoriza la clave de contingencia física bajo custodia del jefe de guardia?',
    authorId: 'user-alum-1',
    authorName: 'Dra. Sofía Navarro Cruz',
    authorRole: 'alumno',
    authorAvatar: 'https://images.unsplash.com/photo-1594824813576-96a99281a8b9?auto=format&fit=crop&w=256&h=256&q=80',
    createdAt: '2026-09-30 21:40',
    category: 'duda',
    pinned: false,
    resolved: true,
    likes: ['user-alum-2', 'user-alum-3'],
    attachments: [],
    replies: [
      {
        id: 'rep-sec-02-1',
        threadId: 'thread-sec-02',
        authorId: 'user-prof-1',
        authorName: 'Dra. Gabriela Solís',
        authorRole: 'profesor',
        authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&h=256&q=80',
        content: 'Correcto Dra. Sofía. El protocolo de contingencia CUPN contempla "Emergency Bypass Codes" precargados en la caja fuerte de la subdirección médica. Toda activación genera un registro de auditoría automático (log nivel ALERT) que debe firmarse al relevo matutino.',
        createdAt: '2026-09-30 22:10',
        likes: ['user-alum-1'],
        isInstructorAnswer: true
      },
      {
        id: 'rep-sec-02-2',
        threadId: 'thread-sec-02',
        authorId: 'user-admin-1',
        authorName: 'Ing. Mateo Arismendi',
        authorRole: 'admin',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        content: 'Adicionalmente, en la pestaña de Seguridad del sistema local, se habilitó el token de contingencia TOTP sin conexión a internet mediante la app Google Authenticator instalada en los celulares de guardia.',
        createdAt: '2026-09-30 22:45',
        likes: ['user-alum-1', 'user-prof-1']
      }
    ]
  },
  {
    id: 'thread-sec-03',
    courseId: 'course-sec-01',
    moduleId: 'mod-sec-02',
    moduleTitle: 'Módulo 2: Ciberseguridad Hospitalaria y Auditoría de Acceso',
    title: 'Caso Práctico: Desconexión de sesiones huérfanas en estaciones de enfermería compartidas',
    content: 'Planteo este debate: En los puestos de enfermería de hospitalización, el personal rota rápidamente entre pacientes y suele dejar abierta la sesión clínica. ¿Qué tiempo de inactividad es el estándar recomendado para el cierre forzoso sin perjudicar la fluidez de las tomas de signos vitales?',
    authorId: 'user-alum-3',
    authorName: 'Lic. Diego Morales',
    authorRole: 'alumno',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    createdAt: '2026-10-01 10:15',
    category: 'caso_clinico',
    pinned: false,
    resolved: false,
    likes: ['user-alum-1', 'user-prof-1'],
    attachments: [],
    replies: [
      {
        id: 'rep-sec-03-1',
        threadId: 'thread-sec-03',
        authorId: 'user-prof-1',
        authorName: 'Dra. Gabriela Solís',
        authorRole: 'profesor',
        authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&h=256&q=80',
        content: 'El estándar institucional IMSS estipula 5 minutos de inactividad en estaciones clínicas asistenciales y bloqueo inmediato al extraer la tarjeta inteligente o credencial con chip RFID.',
        createdAt: '2026-10-01 11:05',
        likes: ['user-alum-3'],
        isInstructorAnswer: true
      }
    ]
  },
  {
    id: 'thread-cloud-01',
    courseId: 'course-cloud-02',
    moduleId: 'mod-cloud-01',
    moduleTitle: 'Módulo 1: Implementación Local y Arquitectura On-Premise',
    title: '📌 [Material Complementario] Script de Respaldo Automatizado en BASH para Servidor Hospitalario',
    content: 'Comparto con los ingenieros y personal de soporte biomédico el script institucional de verificación de sumas de verificación (checksum SHA-256) antes de la subida programada a la nube del IMSS.',
    authorId: 'user-admin-1',
    authorName: 'Ing. Mateo Arismendi',
    authorRole: 'admin',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    createdAt: '2026-09-25 12:00',
    category: 'material',
    pinned: true,
    resolved: true,
    likes: ['user-prof-2', 'user-alum-2'],
    attachments: [
      {
        id: 'att-c01',
        name: 'backup_imss_onprem_script.sh',
        size: '14.2 KB',
        type: 'document',
        url: '#'
      }
    ],
    replies: []
  },
  {
    id: 'thread-media-01',
    courseId: 'course-media-04',
    moduleId: 'mod-media-01',
    moduleTitle: 'Módulo 1: Formatos de Video y Audio Optimizados para Dispositivos Móviles',
    title: 'Plantilla de Guion Técnico para Cápsulas de Telemedicina en Guardias Médicas',
    content: 'Comparto una plantilla en formato PDF estructurada en: Introducción (30 seg), Procedimiento Clínico (3 min), Advertencias / Contraindicaciones (1 min) y Pregunta de autoevaluación (30 seg).',
    authorId: 'user-prof-1',
    authorName: 'Dra. Gabriela Solís',
    authorRole: 'profesor',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&h=256&q=80',
    createdAt: '2026-09-28 16:30',
    category: 'material',
    pinned: true,
    resolved: true,
    likes: ['user-alum-1', 'user-alum-3'],
    attachments: [
      {
        id: 'att-m01',
        name: 'Plantilla_Guion_Capsula_Salud_IMSS.pdf',
        size: '1.5 MB',
        type: 'pdf',
        url: '#'
      }
    ],
    replies: []
  },
  {
    id: 'thread-ds-01',
    courseId: 'course-ds-03',
    moduleId: 'mod-ds-01',
    moduleTitle: 'Módulo 1: Trazabilidad y Cumplimiento Académico',
    title: 'Duda sobre codificación UTF-8 con BOM al abrir reportes en Excel institucional',
    content: 'Al abrir el CSV exportado en Microsoft Excel 2016 en las computadoras de la delegación, ¿se requieren pasos manuales para visualizar acentos y caracteres especiales en nombres de alumnos?',
    authorId: 'user-alum-2',
    authorName: 'Dra. Camila Peña',
    authorRole: 'alumno',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    createdAt: '2026-09-27 15:20',
    category: 'duda',
    pinned: false,
    resolved: true,
    likes: ['user-prof-2'],
    attachments: [],
    replies: [
      {
        id: 'rep-ds-01',
        threadId: 'thread-ds-01',
        authorId: 'user-prof-2',
        authorName: 'Dr. Carlos Valenzuela',
        authorRole: 'profesor',
        authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&h=256&q=80',
        content: 'Hola Dra. Camila. El sistema CUPN Conecta ahora antepone automáticamente el Byte Order Mark UTF-8 (\\uFEFF) en todas las exportaciones CSV, por lo que Excel detecta el juego de caracteres en español directamente sin necesidad de importar como texto.',
        createdAt: '2026-09-27 16:45',
        likes: ['user-alum-2'],
        isInstructorAnswer: true
      }
    ]
  }
];

export const INITIAL_CERTIFICATE_TEMPLATE: CertificateTemplate = {
  id: 'tmpl-official-imss-01',
  templatePreset: 'imss-tradicional',
  institutionName: 'INSTITUTO MEXICANO DEL SEGURO SOCIAL',
  coordinationName: 'Coordinación de Unidades de Primer Nivel (CUPN)',
  platformName: 'CUPN Conecta',
  slogan: '"Conectando conocimiento, fortaleciendo servicios."',
  showLogo: true,
  logoVariant: 'official',
  logoSize: 'xl',
  documentTypeTitle: 'CONSTANCIA DE ACREDITACIÓN ACADÉMICA',
  introductoryText: 'La Coordinación de Unidades de Primer Nivel del IMSS, a través de la plataforma CUPN Conecta, otorga la presente a:',
  studentHonorPrefix: '',
  accreditationClause: 'Por haber cumplido y acreditado satisfactoriamente los objetivos de capacitación, evaluación automática y competencias clínicas del programa:',
  primaryColor: '#006657', // Verde IMSS oficial
  accentColor: '#BC955C', // Oro distintivo IMSS
  backgroundColor: '#FAF9F6', // Pergamino oficial
  borderFamily: 'classic-double',
  fontFamily: 'serif',
  sealType: 'imss-gold',
  showWatermark: true,
  watermarkOpacity: 0.08,
  showScoreBox: true,
  scoreBoxStyle: 'boxed',
  showQrCode: true,
  qrFolioPrefix: 'CUPN-',
  showCryptographicHash: true,
  securityHashPrefix: 'IMSS-NOM024-SHA256',
  cityAndDateText: 'Ciudad de México, D.F.',
  signers: [
    {
      id: 'sig-1',
      name: 'Dra. Gabriela Solís',
      title: 'Coordinación de Unidades de Primer Nivel',
      department: 'Dirección Médica IMSS',
      signatureStyle: 'calligraphy-1',
      enabled: true
    },
    {
      id: 'sig-2',
      name: 'Ing. Mateo Arismendi',
      title: 'Administración Tecnológica',
      department: 'CUPN Conecta & Dirección de Innovación Digital',
      signatureStyle: 'calligraphy-2',
      enabled: true
    },
    {
      id: 'sig-3',
      name: 'Dr. Roberto Alarcón Velasco',
      title: 'Dirección de Educación en Salud',
      department: 'Consejo Técnico Institucional',
      signatureStyle: 'calligraphy-3',
      enabled: false
    }
  ],
  lastModifiedAt: '2026-10-01'
};

