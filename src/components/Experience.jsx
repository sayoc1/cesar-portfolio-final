import React from 'react';
import { useLang, translations } from '../i18n.jsx';

export default function Experience() {
  const { lang } = useLang();
  const t = translations[lang].experience;

  return (
    <section className="mt-28" id="experience">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-[#00FF43]">{t.title}</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">{t.heading}</h2>
        <p className="max-w-3xl text-[#C6C6C6]">{t.paragraph}</p>
      </div>

      <div className="relative mt-12 pl-6 md:pl-16">
        <div className="absolute left-3 top-4 bottom-0 w-px bg-white/10" />
        <div className="space-y-8">
          {t.items.map((exp) => (
            <div key={exp.title} className="relative">
              <div className="absolute -left-7 top-4 h-5 w-5 rounded-full bg-[#00FF43] ring-4 ring-[#00FF43]/15" />
              <div className="glass-card rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_-45px_rgba(0,255,67,0.35)] backdrop-blur-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                    <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-[#8FD9A5]">en {exp.company}</p>
                  </div>
                  <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#C6C6C6]">{exp.period}</span>
                </div>
                <ul className="mt-6 space-y-3 text-[#C6C6C6] text-sm leading-7">
                  {exp.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#00FF43]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
