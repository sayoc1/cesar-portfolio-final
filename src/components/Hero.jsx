﻿import React from 'react';
import { useLang, translations } from '../i18n.jsx';
import Terminal from './Terminal';
import fotoCesar from '../../img/foto-cesar.jpeg';

export default function Hero() {
  const { lang } = useLang();
  const t = translations[lang].hero;

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center items-center text-center pt-10" id="home">
        <div className="inline-block bg-primary-container/10 border border-primary-container/20 rounded-full px-4 py-1.5 mb-8">
          <span className="font-label-sm text-label-sm text-primary-container uppercase tracking-widest">{t.badge}</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6">{t.greeting} <span className="text-primary-container">{t.name}</span></h1>
        <h2 className="text-xl md:text-3xl font-medium text-on-surface-variant mb-10">{t.subtitle}</h2>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-on-surface-variant/80 mb-12 leading-relaxed">
          {t.paragraph}
        </p>

        <div className="w-full mb-12 transform hover:scale-[1.01] transition-all duration-700 ease-out">
          <Terminal />
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <a className="bg-primary-container text-on-primary-container font-semibold px-10 py-4 rounded-lg transition-transform active:scale-95 hover:shadow-[0_0_20px_-5px_rgba(0,255,67,0.6)] text-center" href="#experience">{t.viewWork}</a>
          <a className="border border-outline-variant text-on-surface px-10 py-4 rounded-lg transition-all hover:bg-surface-variant/20 hover:border-primary-container active:scale-95 text-center" href="https://mail.google.com/mail/?view=cm&fs=1&to=vermilion.onnn@gmail.com" target="_blank" rel="noopener noreferrer">{t.contact}</a>
        </div>
      </section>

      {/* About Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center bg-surface-container-lowest/30 p-8 rounded-[2rem] border border-outline-variant/10">
        <div className="space-y-8">
          <h3 className="font-headline-lg text-headline-lg text-primary-container">{t.aboutTitle}</h3>
          <div className="space-y-4 font-body-md text-body-md text-on-surface-variant">
            <p>
              {t.aboutP1}
            </p>
            <p>
              {t.aboutP2}
            </p>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-primary-container/5 blur-3xl rounded-full"></div>
          <div className="w-72 h-72 rounded-[2rem] overflow-hidden border-2 border-primary-container/30 relative z-10">
             <img alt="César" className="w-full h-full object-cover" src={fotoCesar} />
          </div>
        </div>
      </section>
    </div>
  );
}