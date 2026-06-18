import React, { useState, useEffect } from 'react';

export default function Terminal() {
  const [text, setText] = useState('');
  const lines = [
    "> initializing cesar-portfolio...",
    "> loading fullstack_modules...",
    "> backend: php/laravel active",
    "> status: system_online_ "
  ];
  const fullText = lines.join('\n');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-[#0d0d0d]/80 rounded-xl border border-[#00FF43]/20 shadow-[0_0_40px_-10px_rgba(0,255,67,0.15)] overflow-hidden font-mono text-xs md:text-sm text-left backdrop-blur-md">
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/40"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/40"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/40"></div>
        </div>
        <div className="flex-1 text-center">
          <span className="text-on-surface-variant/30 text-[9px] uppercase tracking-[0.3em]">bash — zsh</span>
        </div>
      </div>
      <div className="p-5 h-32 md:h-40 overflow-hidden whitespace-pre-line text-[#00FF43]/90">
        {text}
        <span className="inline-block w-1.5 h-4 ml-1 bg-[#00FF43] animate-pulse align-middle"></span>
      </div>
    </div>
  );
}