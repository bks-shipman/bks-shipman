'use client';

import { useLanguage } from '@/context/LanguageProvider';
import { useState } from 'react';

export default function ReadMore({
  text,
  className = 'text-slate-400 leading-relaxed text-sm transition-all duration-500',
  wordLimit = 40,
  buttonColor = 'text-blue-400 hover:text-blue-300',
}) {
  const [expanded, setExpanded] = useState(false);
const {lang} = useLanguage();
  const words = text.split(' ');
  const isTruncated = words.length > wordLimit;

  const displayedText = expanded
    ? text
    : words.slice(0, wordLimit).join(' ') + (isTruncated ? '...' : '');

  const close = lang === "id" ? "Tutup" : "Close"
  const read = lang === "id" ? "Baca lebih lanjut" : "Read more"

  return (
    <div>
      <p
        className={` ${className} ${
          expanded ? 'max-h-250' : 'max-h-30 overflow-hidden'
        }`}
      >
        {displayedText}
      </p>

      {isTruncated && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`mt-4 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${buttonColor}`}
        >
          {expanded ? close : read}
        </button>
      )}
    </div>
  );
}
