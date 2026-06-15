import React from 'react';
import { useLang, translations } from '../i18n.jsx';

const stacksTemplate = [
  {
    key: 'frontend',
    icon: 'code',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
  {
    key: 'backend',
    icon: 'storage',
    skills: ['Java', 'Spring Boot', 'Python', 'Django', 'COBOL'],
  },
  {
    key: 'devops',
    icon: 'terminal',
    skills: ['Git & GitHub', 'Docker', 'MySQL'],
  },
];
export default function TechStack() {
  const { lang } = useLang();
  const t = translations[lang].techstack;

  return (
    <section className="mt-28" id="skills">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-[#00FF43]">{t.title}</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">{t.heading}</h2>
        <p className="max-w-3xl text-[#b9ccb2]">{t.paragraph}</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {stacksTemplate.map((stack) => (
          <div key={stack.key} className="glass-card rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_90px_-45px_rgba(0,255,67,0.25)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#00FF43]/30">
            <div className="flex items-center gap-4 pb-6 text-white">
              <span className="material-symbols-outlined text-[#00FF43]">{stack.icon}</span>
              <h3 className="text-lg font-semibold uppercase tracking-[0.15em]">{translations[lang].techstack[stack.key]}</h3>
            </div> 
            <div className="flex flex-wrap gap-3"> 
              {stack.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#C6C6C6]">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
