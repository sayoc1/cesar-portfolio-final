import React, { createContext, useContext, useState } from 'react';

const translations = {
  es: {
    nav: { home: 'INICIO', experience: 'EXPERIENCIA', education: 'ESTUDIOS', projects: 'PROYECTOS', skills: 'HABILIDADES', contact: 'CONTACTO' },
    hero: {
      badge: 'Si lo puedes soñar lo puedes programar',
      greeting: '¡Hola! , Soy',
      name: 'César Alejandro',
      subtitle: 'Frontend Developer',
      paragraph: 'Creo interfaces interactivas y escalables, transformando ideas en MVPs y productos SaaS mediante React y Vue.js.',
      viewWork: 'Ver Mi Trabajo',
      contact: 'Gmail',
      aboutTitle: 'Sobre Mí',
      aboutP1: 'Soy un Desarrollador Frontend enfocado en el ecosistema moderno de JavaScript. Me especializo en construir aplicaciones web dinámicas con React y Vue.js, priorizando el rendimiento en el navegador, la arquitectura limpia de componentes y experiencias de usuario excepcionales.',
      aboutP2: 'Mi background en el sector bancario me ha dado una alta disciplina para asegurar que la lógica en el cliente sea óptima, consuma APIs de forma eficiente y mantenga la fluidez ante flujos de datos masivos.',
    },
    experience: {
      title: 'Experiencia',
      heading: 'Experiencia Profesional (Trayecto Técnico)',
      paragraph: 'Especialista en el desarrollo de interfaces modernas y escalables, con un fuerte enfoque en la optimización del rendimiento y la experiencia del usuario en el sector financiero.',
      items: [
        {
          title: 'Frontend Developer',
          company: 'Banco Agrícola de Venezuela',
          period: 'Agosto 2023 – Marzo 2026',
          points: [
            'Desarrollo End-to-End del Sistema de Gestión de Guardias: Lideré la arquitectura del frontend y el diseño de la interfaz de usuario para una solución web modular interna; implementé componentes dinámicos e intuitivos que automatizaron la asignación de roles técnicos, eliminando procesos manuales.',
            'Consumo de APIs y Renderizado Eficiente: Diseñé e integré la lógica de consumo para microservicios y APIs REST de conciliación de datos financieros, optimizando la velocidad de carga de la interfaz, el manejo de estados complejos y asegurando la integridad de los flujos de información en tiempo real.',
            'Construcción de Interfaces Transaccionales (MVPs): Conceptualicé y maqueté interfaces web dinámicas de alta disponibilidad utilizando React, Vue.js y Tailwind CSS, garantizando un diseño responsivo adaptado a flujos operativos exigentes.',
            'Control de Versiones y Despliegue Estándar: Autogestioné todo el ciclo de vida del frontend utilizando Git y GitHub para el control de versiones, implementando contenedores con Docker para asegurar entornos de ejecución limpios y replicables en producción.'
          ]
        },
        {
          title: 'Frontend Developer (Anteriormente Specialist)',
          company: 'Banco Agrícola de Venezuela',
          period: 'Agosto 2021 – Agosto 2023',
          points: [
            'Optimización del Rendimiento del Lado del Cliente (Client-Side): Reestructuré interfaces heredadas aplicando principios de código limpio y optimización lógica, logrando flujos web mucho más rápidos ante escenarios de alta concurrencia.',
            'Diseño Orientado a Datos: Colaboré estrechamente con el equipo de bases de datos para estructurar el renderizado dinámico de grandes volúmenes de paquetes informáticos, reduciendo la latencia de pintado de tablas y reportes interactivos complejos en pantalla.',
            'Tolerancia a Fallos en Interfaz: Desarrollé componentes frontend modulares bajo metodologías de tolerancia a fallos, implementando un control avanzado de excepciones visuales para que el usuario nunca experimente pantallas congeladas ante caídas del servidor.'
          ]
        },
        {
          title: 'Frontend Web Developer (Remoto)',
          company: 'Wikencop',
          period: 'Marzo 2016 – Septiembre 2024',
          points: [
            'Desarrollo y Soporte de Plataformas Corporativas: Dirigí de manera autónoma y 100% remota la evolución de interfaces en portales internos de la compañía, resolviendo de manera integral incidencias visuales críticas y adaptando los flujos funcionales.',
            'Análisis de Métricas Web y UX: Evalué de forma constante el rendimiento técnico de los componentes distribuidos en el navegador para elaborar mejoras de usabilidad (UI/UX), reduciendo tiempos de interacción del cliente.',
            'Evolución Tecnológica y consistencia: Mantuve un compromiso continuo de más de 8 años adaptando interfaces clásicas a metodologías y herramientas modernas de JavaScript (ES6+), asegurando estándares web actualizados.'
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
      name: 'César Alejandro',
      subtitle: 'Frontend Developer',
      paragraph: 'I build interactive and scalable interfaces, transforming ideas into MVPs and SaaS products using React and Vue.js.',
      viewWork: 'View My Work',
      contact: 'Gmail',
      aboutTitle: 'About Me',
      aboutP1: 'I am a Frontend Developer focused on the modern JavaScript ecosystem. I specialize in building dynamic web applications with React and Vue.js, prioritizing browser performance, clean component architecture, and exceptional user experiences.',
      aboutP2: 'My background in the banking sector has given me the discipline to ensure client-side logic is optimal, consumes APIs efficiently, and maintains responsiveness under heavy data loads.',
    },
    experience: {
      title: 'Experience',
      heading: 'Professional Experience (Technical Journey)',
      paragraph: 'Specialist in developing modern, scalable interfaces with a strong focus on performance optimization and user experience within the financial sector.',
      items: [
        {
          title: 'Frontend Developer',
          company: 'Agricultural Bank of Venezuela',
          period: 'August 2023 – March 2026',
          points: [
            'End-to-End Development of the Guard Management System: Led frontend architecture and UI design for a modular internal web solution; implemented intuitive dynamic components that automated technical role assignment, eliminating manual processes.',
            'API Consumption and Efficient Rendering: Designed and integrated consumption logic for microservices and financial data reconciliation REST APIs, optimizing interface load speed, complex state management, and ensuring real-time data flow integrity.',
            'Transactional Interface Construction (MVPs): Conceptualized and prototyped high-availability dynamic web interfaces using React, Vue.js, and Tailwind CSS, guaranteeing responsive design adapted to demanding operational flows.',
            'Version Control and Standard Deployment: Self-managed the full frontend lifecycle using Git and GitHub for version control, implementing Docker containers to ensure clean and replicable execution environments in production.'
          ]
        },
        {
          title: 'Frontend Developer (Formerly Specialist)',
          company: 'Agricultural Bank of Venezuela',
          period: 'August 2021 – August 2023',
          points: [
            'Client-Side Performance Optimization: Restructured legacy interfaces applying clean code principles and logic optimization, achieving significantly faster web flows in high-concurrency scenarios.',
            'Data-Oriented Design: Collaborated closely with the database team to structure dynamic rendering of large data volumes, reducing paint latency for complex interactive tables and reports.',
            'Interface Fault Tolerance: Developed modular frontend components using fault-tolerant methodologies, implementing advanced visual exception handling to prevent frozen screens during server outages.'
          ]
        },
        {
          title: 'Frontend Web Developer (Remote)',
          company: 'Wikencop',
          period: 'March 2016 – September 2024',
          points: [
            'Development and Support of Corporate Platforms: Managed the evolution of internal portal interfaces autonomously and 100% remotely, resolving critical visual incidents and adapting functional flows.',
            'Web Metrics and UX Analysis: Constantly evaluated technical performance of browser-distributed components to develop UI/UX improvements, reducing customer interaction times.',
            'Technological Evolution and Consistency: Maintained a continuous 8-year commitment adapting legacy interfaces to modern JavaScript (ES6+) methodologies and tools, ensuring up-to-date web standards.'
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
