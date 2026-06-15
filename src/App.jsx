import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/hero';
import Experience from './components/Experience';
import TechStack from './components/TechStack';
import Education from './components/Education';
import Projects from './components/Projects';
import TechAndContact from './components/TechAndContact';
import { useLang } from './i18n.jsx';

export default function App() {
  const { lang } = useLang();

  useEffect(() => {
    // Esto cambia el título que aparece en la pestaña del navegador
    document.title = "Cesar Adrian | " + (lang === 'es' ? "Portafolio 💻" : "Portfolio 💻");
  }, [lang]);

  return (
    <div className="min-h-screen bg-[#080908] text-[#E5E2E1] selection:bg-[#00FF43]/20 selection:text-[#080908]">
      <Navbar />
      <main key={lang} className="max-w-7xl mx-auto px-6 pb-32 animate-fade-in">
        <Hero />
        <Experience />
        <Education />
        <Projects />
        <TechAndContact />
      </main>
    </div>
  );
}
