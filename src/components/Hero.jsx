'use client';

// components/Hero.jsx - Reusable hero section

export default function Hero({ title, subtitle, imageUrl, overlay = true }) {
  return (
    <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      {overlay && <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />}
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-slate-100 font-light">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}