import React from 'react';
import { useLang, translations } from '../i18n.jsx';
import CertificateCarousel from './CertificateCarousel';

export default function Education() {
  const { lang } = useLang();
  const t = translations[lang].education;

  return (
    <section className="mt-32" id="education">
      <div className="space-y-4 mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-primary-container">{t.title}</p>
        <h2 className="text-4xl font-bold text-white sm:text-5xl">{t.heading}</h2>
      </div>

      <div className="grid gap-6">
        <div className="glass-card rounded-[2rem] p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4 text-primary-container">Certificados</h3>
          <CertificateCarousel items={t.items.filter(item => item.type && item.type.toLowerCase().includes('cert'))} />
        </div>
      </div>
    </section>
  );
}