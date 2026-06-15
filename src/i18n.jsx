import React, { createContext, useContext, useState } from 'react';

const translations = {
  es: {
    nav: { home: 'INICIO', experience: 'EXPERIENCIA', education: 'ESTUDIOS', projects: 'PROYECTOS', skills: 'HABILIDADES', contact: 'CONTACTO' },
    hero: {
      badge: 'Si lo puedes soñar lo puedes programar',
      greeting: '¡Hola! , Soy',
      name: 'César',
      subtitle: 'Software Developer | Fullstack & Backend Architect',
      paragraph: 'Enfocado en crear interfaces de usuario dinámicas, rápidas e intuitivas. Experto en el desarrollo frontend moderno con React y Tailwind CSS. Comprometido con la creación de experiencias web de alto rendimiento, escalables y visualmente impactantes.',
      viewWork: 'Ver Mi Trabajo',
      contact: 'Gmail',
      aboutTitle: 'Sobre Mí',
      aboutP1: 'Desarrollador Fullstack apasionado por la ingeniería de software y la eficiencia operativa. Mi enfoque combina la creación de interfaces modernas y dinámicas con React, con el desarrollo de backends robustos y escalables utilizando Java, PHP y Python.',
      aboutP2: 'Cuento con una sólida experiencia resolviendo problemas complejos mediante arquitecturas limpias y seguras. Mi stack técnico incluye HTML, CSS, JavaScript, React, Vue.js, Git, Docker y MySQL. También he usado COBOL en entornos bancarios, y estoy comprometido con la excelencia técnica y el desarrollo de soluciones digitales que optimizan procesos y elevan la experiencia del usuario.',
    },
    experience: {
      title: 'Experiencia',
      heading: 'Trayectoria profesional en sistemas y soporte crítico.',
      paragraph: 'Trabajo orientado a mantener operaciones estables en entornos financieros, con especialidad en backend bancario e infraestructura de alto rendimiento.',
      items: [
        {
          title: 'Técnico Especializado en Sistemas Bancarios',
          company: 'Banco Agrícola de Venezuela',
          period: '2024 - Actualidad',
          points: [
            'Mantenimiento de servidores bancarios críticos y AS/400.',
            'Ejecución de cierres operativos y optimización de programas COBOL.',
            'Resolución de incidencias de red y soporte técnico.'
          ]
        },
        {
          title: 'Soporte Técnico e Infraestructura',
          company: 'Wiken-Cop',
          period: '2016 - 2025',
          points: [
            'Diagnóstico y resolución de problemas de hardware/software.',
            'Elaboración de informes de gestión tecnológica.',
            'Despliegue de equipos críticos a nivel nacional.'
          ]
        }
      ]
    },
    education: {
      title: 'Educación y Certificados',
      heading: 'Formación académica y certificaciones.',
      viewCertificate: 'Ver Certificado',
      items: [
        {
          title: 'Oracle Next Education',
          institution: 'Alura Latam / Oracle',
          date: '2024',
          type: 'Certificación',
          certificate: '/certificados/oracle-next-education.png',
          preview: '/certificados/oracle-next-education.png',
          description: 'Certificado completado, confirmando la finalización del curso Oracle Next Education.'
        },
        {
          title: 'Fundamentos de la Programación',
          institution: 'Microsoft',
          date: '2023',
          type: 'Certificación',
          certificate: '/certificados/microsoft-certificado.png',
          preview: '/certificados/microsoft-certificado.png'
        },
        {
          title: 'Lógica de Programación',
          institution: 'Alura',
          date: '2023',
          type: 'Certificación',
          certificate: '/certificados/logica-programacion.pdf',
          preview: '/certificados/logica-programacion-preview.png'
        },
        {
          title: 'Spring Boot (Seguridad & Buenas Prácticas)',
          institution: 'Alura',
          date: '2024',
          type: 'Certificación',
          certificate: '/certificados/springboot-security.pdf',
          preview: '/certificados/springboot-security-preview.png'
        },
        {
          title: 'Creando tu primera API (Java)',
          institution: 'Alura',
          date: '2023',
          type: 'Certificación',
          certificate: '/certificados/java-api.pdf',
          preview: '/certificados/java-api-preview.png'
        },
        {
          title: 'Git y GitHub (Control de versiones)',
          institution: 'Alura',
          date: '2023',
          type: 'Certificación',
          certificate: '/certificados/git-github.pdf',
          preview: '/certificados/git-github-preview.png'
        }
      ]
    },
    projects: {
      title: 'Proyectos Destacados',
      heading: 'Soluciones técnicas y desarrollo a medida.',
      viewProject: 'Ver Proyecto',
      items: [
        {
          title: 'Gestión de Guardias - Banco Agrícola de Venezuela',
          description: 'Plataforma robusta para el registro de entrada y salida de operadores. Control de asistencia y reportes en tiempo real para entornos de misión crítica.',
          tech: ['PHP', 'MySQL', 'JavaScript'],
          link: '/portal_turno_v2/index.html',
        },
        {
          title: 'Monitor de Estado de IP',
          description: 'Herramienta de monitoreo automatizado para infraestructuras de red. Detecta caídas y estados de latencia en servidores bancarios y terminales.',
          tech: ['Python', 'Django', 'Network APIs'],
          link: '/monitor_infra/index.html',
        },
        {
          title: 'Landing Page Vans x DC',
          description: 'Diseño y desarrollo de una página de aterrizaje de alta conversión para la colaboración exclusiva de Vans x DC Shoes.',
          tech: ['React', 'Tailwind CSS', 'Framer Motion'],
          link: '/vans-dc-landing/index.html',
        },
        {
          title: 'NotifiSync Backend',
          description: 'Motor de sincronización para gestión de notificaciones masivas en tiempo real. Optimizado para baja latencia y alta disponibilidad en servicios críticos.',
          tech: ['Node.js', 'Express', 'WebSockets'],
          link: '/notifisync-backend/index.html',
        }
      ]
    },
    techstack: {
      title: 'Stack Técnico',
      heading: 'Dominio de tecnologías modernas y sistemas críticos.',
      paragraph: 'Un stack tecnológico versátil diseñado para la construcción de sistemas escalables. Mi enfoque integra el desarrollo de interfaces modernas de alto rendimiento con una lógica de backend robusta, garantizando siempre la eficiencia, la seguridad y la mantenibilidad del código en cada proyecto.',
      frontend: 'Frontend',
      backend: 'Backend',
      devops: 'DevOps & Herramientas',
    },
    contact: {
      title: 'Contacto',
      email: 'Gmail',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      phone: 'Teléfono',
      send: 'Enviar mensaje',
      cv: 'Descargar Currículum',
      talkTitle: '¿Hablamos?',
      talkParagraph: '¿Buscas un desarrollador con experiencia en sistemas financieros y tecnologías modernas? Estoy listo para colaborar.',
      contactMe: 'Contacta conmigo',
    },
  },
  en: {
    nav: { home: 'HOME', experience: 'EXPERIENCE', education: 'EDUCATION', projects: 'PROJECTS', skills: 'SKILLS', contact: 'CONTACT' },
    hero: {
      badge: 'If you can dream it you can program it',
      greeting: "Hi! , I'm",
      name: 'César',
      subtitle: 'Software Developer | Fullstack & Backend Architect',
      paragraph: 'Focused on building high-performance applications using Java, PHP, and Python. Skilled in version control, Docker deployment, and MySQL database management. Committed to code quality and stability in banking systems.',
      viewWork: 'View My Work',
      contact: 'Gmail',
      aboutTitle: 'About Me',
      aboutP1: 'Fullstack developer passionate about software engineering and operational efficiency. Skilled at building modern interfaces with React and powerful backends in Java and PHP. With a strong foundation in banking systems and professional methodologies, I specialize in transforming complex problems into scalable, secure, and maintainable applications.',
      aboutP2: 'I work with technologies such as HTML, CSS, JavaScript, React, Vue.js, Git, GitHub, Docker, MySQL, and PHP. On the backend, I also build reliable Python solutions to support critical business processes.',
    },
    experience: {
      title: 'Experience',
      heading: 'Professional career in systems and critical support.',
      paragraph: 'Work oriented towards maintaining stable operations in financial environments, specializing in banking backend.',
      items: [
        {
          title: 'Banking Systems Specialist',
          company: 'Agricultural Bank of Venezuela',
          period: '2024 - Present',
          points: [
            'Maintenance of critical banking servers and AS/400 systems.',
            'Execution of operational closings and COBOL optimization.',
            'Network incident resolution and technical support.'
          ]
        },
        {
          title: 'Technical Support & Infrastructure',
          company: 'Wiken-Cop',
          period: '2016 - 2025',
          points: [
            'Hardware/software troubleshooting and diagnosis.',
            'Management of technological infrastructure reports.',
            'Deployment of critical equipment nationwide.'
          ]
        }
      ]
    },
    education: {
      title: 'Education & Certificates',
      heading: 'Academic background and certifications.',
      viewCertificate: 'View Certificate',
      items: [
        {
          title: 'Oracle Next Education',
          institution: 'Alura Latam / Oracle',
          date: '2024',
          type: 'Certification',
          certificate: '/certificados/oracle-next-education.png',
          preview: '/certificados/oracle-next-education.png',
          description: 'Completed certification proving the Oracle Next Education course has been finished.'
        },
        {
          title: 'Foundations of Programming',
          institution: 'Microsoft',
          date: '2023',
          type: 'Certification',
          certificate: '/certificados/microsoft-certificado.png',
          preview: '/certificados/microsoft-certificado.png'
        },
        {
          title: 'Programming Logic',
          institution: 'Alura',
          date: '2023',
          type: 'Certification',
          certificate: '/certificados/logica-programacion.pdf',
          preview: '/certificados/logica-programacion-preview.png'
        }
      ]
    },
    projects: {
      title: 'Featured Projects',
      heading: 'Technical solutions and custom development.',
      viewProject: 'View Project',
      items: [
        {
          title: 'Guard Management System - Banco Agrícola de Venezuela',
          description: 'Robust platform for operator check-in and check-out. Attendance control and real-time reporting for mission-critical environments.',
          tech: ['PHP', 'MySQL', 'JavaScript'],
          link: '/portal_turno_v2/index.html',
        },
        {
          title: 'IP Status Monitor',
          description: 'Automated monitoring tool for network infrastructures. Detects outages and latency status in banking servers and terminals.',
          tech: ['Python', 'Django', 'Network APIs'],
          link: '/monitor_infra/index.html',
        },
        {
          title: 'Vans x DC Landing Page',
          description: 'Design and development of a high-conversion landing page for the exclusive Vans x DC Shoes collaboration.',
          tech: ['React', 'Tailwind CSS', 'Framer Motion'],
          link: '/vans-dc-landing/index.html',
        },
        {
          title: 'NotifiSync Backend',
          description: 'Synchronization engine for real-time notification management. Optimized for low latency and high availability in critical services.',
          tech: ['Node.js', 'Express', 'WebSockets'],
          link: '/notifisync-backend/index.html',
        }
      ]
    },
    techstack: {
      title: 'Technical Stack',
      heading: 'Mastery of modern technologies and critical systems.',
      paragraph: 'A versatile toolkit ranging from current web development to the robustness of banking architecture.',
      frontend: 'Frontend',
      backend: 'Backend',
      devops: 'DevOps & Tools',
    },
    contact: {
      title: 'Contact',
      email: 'Gmail',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      phone: 'Phone',
      send: 'Send Message',
      cv: 'Download CV',
      talkTitle: "Let's Talk",
      talkParagraph: 'Looking for a developer with experience in financial systems and modern technologies? I am ready to collaborate.',
      contactMe: 'Contact me',
    },
  },
};

const LanguageContext = createContext({ lang: 'es', setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es');

  // AGREGA 'translations' AL VALUE AQUÍ:
  return (
    <LanguageContext.Provider value={{ lang, setLang, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

export { translations };
export default translations;
