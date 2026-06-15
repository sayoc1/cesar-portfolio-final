import React from 'react';
import { useLang, translations } from '../i18n.jsx';

export default function Projects() {
  const { lang } = useLang();
  const t = translations[lang].projects;

  return (
    <section className="mt-32" id="projects">
      <div className="space-y-4 mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-primary-container">{t.title}</p>
        <h2 className="text-4xl font-bold text-white sm:text-5xl">{t.heading}</h2>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {t.items.map((project, index) => (
          <div key={index} className="glass-card rounded-[2rem] p-8 border border-white/10 flex flex-col h-full glow-hover transition-all duration-300">
            <div className="mb-6">
               <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary-container">
                    {
                      index === 0 ? 'badge' : 
                      index === 1 ? 'lan' : 
                      index === 2 ? 'shopping_cart' : 
                      'terminal'
                    }
                  </span>
               </div>
               <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
               <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                 {project.description}
               </p>
            </div>
            
            <div className="mt-auto">
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tech.map(tech => (
                  <span key={tech} className="px-3 py-1 text-[10px] rounded-full bg-white/5 border border-white/10 text-primary-container font-mono">{tech}</span>
                ))}
              </div>
              <a 
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl border border-primary-container/30 text-primary-container font-bold text-sm hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 text-center"
              >
                {t.viewProject}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}