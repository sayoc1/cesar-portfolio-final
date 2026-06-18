import React from 'react';
import { useLang, translations } from '../i18n.jsx';

export default function TechAndContact() {
  const { lang } = useLang();
  const t = translations[lang].contact;
  const ts = translations[lang].techstack;

  return (
    <section id="contact" className="py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{ts.title}</h2>
          <p className="mt-3 text-sm text-on-surface-variant max-w-2xl mx-auto">{ts.paragraph}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 grid gap-6 md:grid-cols-2">
            <div className="glass-card rounded-[2rem] p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-3 text-primary-container">{ts.frontend}</h3>
              <p className="text-sm text-gray-300 mb-4">{lang === 'es' ? 'Desarrollo de interfaces modernas y dinámicas con enfoque en UX.' : 'Development of modern and dynamic interfaces with focus on UX.'}</p>
              <ul className="flex flex-wrap gap-2">
                {['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js'].map(s => (
                  <li key={s} className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-on-surface-variant">{s}</li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-[2rem] p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-3 text-primary-container">{ts.backend}</h3>
              <p className="text-sm text-gray-300 mb-4">{lang === 'es' ? 'Soluciones robustas y escalables para el procesamiento de datos.' : 'Robust and scalable solutions for data processing.'}</p>
              <ul className="flex flex-wrap gap-2">
                {['PHP', 'Laravel', 'Python'].map(s => (
                  <li key={s} className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-on-surface-variant">{s}</li>
                ))}
              </ul>
            </div>
            <div className="glass-card rounded-[2rem] p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-3 text-primary-container">{lang === 'es' ? 'Base de Datos' : 'Database'}</h3>
              <p className="text-sm text-gray-300 mb-4">{lang === 'es' ? 'Gestión eficiente de datos y modelado relacional.' : 'Efficient data management and relational modeling.'}</p>
              <ul className="flex flex-wrap gap-2">
                {['MySQL'].map(s => (
                  <li key={s} className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-on-surface-variant">{s}</li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-[2rem] p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-3 text-primary-container">{ts.devops}</h3>
              <p className="text-sm text-gray-300 mb-4">{lang === 'es' ? 'Herramientas esenciales para el control y despliegue de software.' : 'Essential tools for software control and deployment.'}</p>
              <ul className="flex flex-wrap gap-2">
                {['Git', 'GitHub', 'Docker'].map(s => (
                  <li key={s} className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-on-surface-variant">{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="glass-card rounded-[2rem] p-8 flex flex-col justify-between border border-primary-container/20">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">{t.title}</h3>

              <div className="space-y-6">
                <div>
                  <p className="text-xs text-primary-container uppercase tracking-widest mb-1">{t.email}</p>
                  <a className="text-sm text-on-surface font-medium hover:text-primary-container transition-colors" href="https://mail.google.com/mail/?view=cm&fs=1&to=vermilion.onnn@gmail.com" target="_blank" rel="noopener noreferrer">vermilion.onnn@gmail.com</a>
                </div>
                <div>
                  <p className="text-xs text-primary-container uppercase tracking-widest mb-1">{t.linkedin}</p>
                  <a className="text-sm text-on-surface font-medium underline hover:text-primary-container transition-colors" href="https://www.linkedin.com/in/cesaralejandro-adrian-bb3b41271/" target="_blank" rel="noopener noreferrer">Ver perfil</a>
                </div>
                <div>
                  <p className="text-xs text-primary-container uppercase tracking-widest mb-1">{t.github}</p>
                  <a className="text-sm text-on-surface font-medium underline hover:text-primary-container transition-colors" href="https://github.com/sayoc1" target="_blank" rel="noopener noreferrer">github.com/sayoc1</a>
                </div>
                <div>
                  <p className="text-xs text-primary-container uppercase tracking-widest mb-1">{t.phone}</p>
                  <a className="text-sm text-on-surface font-medium underline hover:text-primary-container transition-colors" href="tel:+584246006027">+584246006027</a>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=vermilion.onnn@gmail.com" target="_blank" rel="noopener noreferrer" className="bg-primary-container text-on-primary-container font-bold px-6 py-3 rounded-xl text-center active:scale-95 transition-transform">{t.send}</a>
              <a
                href="/cesar%20adrian%20frontend.pdf"
                download="cesar adrian frontend.pdf"
                className="border border-outline-variant text-on-surface px-6 py-3 rounded-xl text-center hover:bg-white/5 transition-colors"
              >
                {t.cv}
              </a>
            </div>
          </aside>
        </div>

        <div className="mt-16 glass-card rounded-[2rem] border border-white/10 p-10 text-center">
          <h3 className="text-2xl font-semibold text-white">{t.talkTitle}</h3>
          <p className="mt-3 text-sm text-on-surface-variant max-w-2xl mx-auto">{t.talkParagraph}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a href="https://wa.me/584246006027" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-primary-container px-10 py-4 text-sm font-bold text-on-primary-container transition-transform active:scale-95 hover:shadow-[0_0_30px_-10px_rgba(0,255,67,0.5)]">{t.contactMe}</a>
          </div>
        </div>
      </div>
    </section>
  );
}