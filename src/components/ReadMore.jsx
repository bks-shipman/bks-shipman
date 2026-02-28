'use client';

import { useState } from 'react';

export default function ReadMore({
  text,
  className = 'text-slate-400 leading-relaxed text-sm transition-all duration-500',
  wordLimit = 40,
  buttonColor = 'text-blue-400 hover:text-blue-300',
}) {
  const [expanded, setExpanded] = useState(false);

  const words = text.split(' ');
  const isTruncated = words.length > wordLimit;

  const displayedText = expanded
    ? text
    : words.slice(0, wordLimit).join(' ') + (isTruncated ? '...' : '');

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
          {expanded ? 'Tutup' : 'Baca lebih lanjut'}
        </button>
      )}
    </div>
  );
}
