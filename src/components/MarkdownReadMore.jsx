'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function MarkdownReadMore({
  text,
  className = 'text-slate-400 leading-relaxed text-sm transition-all duration-500 whitespace-pre-line',
  wordLimit = 40, // Tetap kita pakai sebagai patokan untuk memunculkan tombol
  buttonColor = 'text-blue-400 hover:text-blue-300',
}) {
  const [expanded, setExpanded] = useState(false);

  // Jika tidak ada teks, jangan render
  if (!text) return null;

  // Cek apakah teks cukup panjang untuk memunculkan tombol (estimasi kasar dari wordLimit)
  const words = text.split(' ');
  const isTruncated = words.length > wordLimit;

  return (
    <div>
      {/* Gunakan div, bukan p. Karena ReactMarkdown akan membuat tag <p> sendiri di dalamnya.
        Kita ganti max-h dengan line-clamp agar mendapat efek "..." di akhir paragraf yang terpotong. 
        line-clamp-3 setara dengan sekitar 30-40 kata.
      */}
      <div
        className={`${className} ${
          expanded ? 'line-clamp-none' : 'line-clamp-3 overflow-hidden'
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {text}
        </ReactMarkdown>
      </div>

      {isTruncated && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // Mencegah klik bocor jika ini di dalam Card
            setExpanded(!expanded);
          }}
          className={`mt-4 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${buttonColor}`}
        >
          {expanded ? 'Tutup' : 'Baca lebih lanjut'}
        </button>
      )}
    </div>
  );
}