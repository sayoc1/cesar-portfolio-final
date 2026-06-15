import React from 'react';
import { useLang, translations } from '../i18n.jsx';
import fotoCesar from '../../img/foto-cesar.jpeg';

export default function Navbar() {
  const { lang, setLang } = useLang();
  const t = translations[lang].nav;

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-outline-variant/30 top-0 sticky z-50">
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto w-full">
        <a href="#home" className="flex items-center gap-4 hover:opacity-80 transition-all active:scale-95 transform cursor-pointer">
          <span className="material-symbols-outlined text-primary-container">computer</span>
          <span className="text-2xl font-bold tracking-tight text-on-background uppercase">ASH.DEV</span>
        </a>

        <nav className="hidden md:flex gap-8 items-center font-space text-sm font-medium">
          <a className="nav-underline text-on-surface-variant hover:text-on-surface transition-colors duration-200" href="#home">{t.home}</a>
          <a className="nav-underline text-on-surface-variant hover:text-on-surface transition-colors duration-200" href="#experience">{t.experience}</a>
          <a className="nav-underline text-on-surface-variant hover:text-on-surface transition-colors duration-200" href="#education">{t.education}</a>
          <a className="nav-underline text-on-surface-variant hover:text-on-surface transition-colors duration-200" href="#projects">{t.projects}</a>
          <a className="nav-underline text-on-surface-variant hover:text-on-surface transition-colors duration-200" href="#skills">{t.skills}</a>
          <a className="nav-underline text-on-surface-variant hover:text-on-surface transition-colors duration-200" href="#contact">{t.contact}</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 border border-outline-variant/30 px-1 py-1 rounded-sm hover:border-primary-container transition-colors">
            <button type="button" onClick={() => setLang('es')} className={`px-2 py-0.5 text-[10px] cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 ${lang === 'es' ? 'text-primary-container font-bold bg-primary-container/15 rounded-sm shadow-[0_0_10px_rgba(0,255,67,0.2)]' : 'text-on-surface-variant hover:text-on-surface'}`}>ES</button>
            <span className="text-outline-variant text-[10px]">/</span>
            <button type="button" onClick={() => setLang('en')} className={`px-2 py-0.5 text-[10px] cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 ${lang === 'en' ? 'text-primary-container font-bold bg-primary-container/15 rounded-sm shadow-[0_0_10px_rgba(0,255,67,0.2)]' : 'text-on-surface-variant hover:text-on-surface'}`}>EN</button>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-primary-container/30">
            <img src={fotoCesar} alt="César" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
