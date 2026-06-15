import React, { useState, useEffect } from 'react';

export default function CertificateCarousel({ items = [] }) {
  const [idx, setIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const timer = setInterval(() => triggerChange((idx + 1) % items.length), 9000);
    return () => clearInterval(timer);
  }, [items, idx]);

  if (!items || items.length === 0) return null;

  const current = items[idx];
  const isAvailable = current.certificate && current.certificate !== '#';

  const triggerChange = (newIdx) => {
    setIsFading(true);
    window.setTimeout(() => {
      setIdx(newIdx);
      setIsFading(false);
    }, 250);
  };

  const prev = () => triggerChange((idx - 1 + items.length) % items.length);
  const next = () => triggerChange((idx + 1) % items.length);

  const renderPdfPreview = (item) => {
    return (
      <div className="w-full aspect-[16/10] rounded-[2rem] bg-[#08101d] border border-white/10 p-8 text-left shadow-2xl">
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary-container/80">Certificado</p>
            <p className="mt-2 text-xl font-semibold text-white">{item.title}</p>
          </div>
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-container/15 text-primary-container">
            <span className="material-symbols-outlined">verified</span>
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-on-surface-variant/60">Institución</p>
            <p className="mt-2 text-base font-medium text-white">{item.institution}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-on-surface-variant/60">Año</p>
            <p className="mt-2 text-base font-medium text-white">{item.date || 'N/A'}</p>
          </div>
          <div className="rounded-2xl border border-primary-container/20 bg-white/5 p-4 text-sm leading-6 text-on-surface-variant/80">
            <p>Haz clic en "Ver Certificado" para abrir el documento completo y revisar el certificado real.</p>
          </div>
        </div>
      </div>
    );
  };

  const renderPreview = (item) => {
    const previewUrl = item?.preview || item?.certificate;
    if (!item || !previewUrl || previewUrl === '#') {
      return (
        <div className="w-full aspect-[16/10] rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-sm text-on-surface-variant/60 italic">
          Vista previa no disponible
        </div>
      );
    }

    if (previewUrl.match(/\.(svg|png|jpg|jpeg)$/i)) {
      return (
        <img
          src={previewUrl}
          alt={`Vista previa de ${item.title}`}
          className="w-full aspect-[16/10] rounded-[2rem] object-contain border border-white/10 bg-[#02070f] shadow-2xl"
        />
      );
    }

    if (previewUrl.match(/\.pdf$/i)) {
      return renderPdfPreview(item);
    }

    return (
      <div className="w-full aspect-[16/10] rounded-[2rem] bg-surface-variant/15 border border-white/10 flex items-center justify-center text-sm text-on-surface-variant">
        Vista previa no disponible
      </div>
    );
  };

  return (
    <div className="relative">
      <div className={`glass-card rounded-[2.5rem] border border-white/10 bg-[#02070f]/70 shadow-2xl p-6 md:p-10 transition-all duration-300 ${isFading ? 'opacity-60 scale-[0.995] blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr] items-start">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary-container/10 via-transparent to-cyan-500/5 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              {renderPreview(current)}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-container/20 bg-primary-container/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-container">
                {current.type || 'Certificación'}
              </span>

              <h3 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {current.title}
              </h3>

              <p className="mt-4 text-base font-medium text-on-surface-variant/80">
                {current.institution}
              </p>
              {current.date && (
                <p className="mt-1 text-sm text-on-surface-variant/60">
                  {current.date}
                </p>
              )}

              {current.description ? (
                <p className="mt-6 text-sm leading-7 text-on-surface-variant/75 border-l-2 border-primary-container/30 pl-4">
                  {current.description}
                </p>
              ) : (
                <p className="mt-6 text-sm leading-7 text-on-surface-variant/75">
                  Certificado profesional expuesto con vista previa y acceso directo para verificar su autenticidad.
                </p>
              )}
            </div>

            <div className="grid gap-4">
              <a
                href={isAvailable ? current.certificate : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-3.5 text-sm font-semibold uppercase transition ${isAvailable ? 'bg-primary-container text-on-primary-container shadow-[0_18px_50px_-30px_rgba(56,189,248,0.75)] hover:shadow-[0_20px_60px_-30px_rgba(56,189,248,0.85)]' : 'cursor-not-allowed bg-white/10 text-on-surface-variant/70'}`}
              >
                <span className="material-symbols-outlined text-base">open_in_new</span>
                Ver Certificado
              </a>

              <div className="grid gap-3 sm:grid-cols-2">
                <button onClick={prev} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Anterior
                </button>
                <button onClick={next} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Siguiente
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => triggerChange(i)}
                      className={`h-2 rounded-full transition-all ${i === idx ? 'w-8 bg-primary-container' : 'w-2 bg-white/15 hover:bg-white/30'}`}
                      aria-label={`Ir al certificado ${i + 1}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.18em] text-on-surface-variant/50">
                  {String(idx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
