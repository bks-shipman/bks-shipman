'use client';

import { useEffect, useState, useRef } from 'react';
import { MotionWrapper } from "./MotionWrapper";

// components/Hero.jsx - Reusable hero section with optional video slider support

export default function Hero({ title, subtitle, imageUrl, videoUrls, overlay = true }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef([]);

  useEffect(() => {
    if (videoUrls && videoUrls.length > 0) {
      videoUrls.forEach((_, idx) => {
        const vid = videoRefs.current[idx];
        if (vid) {
          if (idx === currentVideoIndex) {
            vid.currentTime = 0;
            vid.play().catch((err) => console.log("Autoplay failed:", err));
          } else {
            vid.pause();
          }
        }
      });
    }
  }, [currentVideoIndex, videoUrls]);

  const handleVideoEnded = () => {
    if (videoUrls) {
      setCurrentVideoIndex((prev) => (prev + 1) % videoUrls.length);
    }
  };

  const hasVideos = videoUrls && videoUrls.length > 0;

  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {hasVideos ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          {videoUrls.map((src, index) => (
            <video
              key={index}
              ref={(el) => { videoRefs.current[index] = el; }}
              src={src}
              autoPlay={index === 0}
              muted
              playsInline
              preload="auto"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                currentVideoIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onEnded={handleVideoEnded}
            />
          ))}
        </div>
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105 z-0"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      
      {overlay && <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] z-5" />}
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <MotionWrapper animation="slideInUp" duration={1} delay={0.3}>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-[1.2]">
            {title}
          </h1>
        </MotionWrapper>
        {subtitle && (
          <MotionWrapper animation="slideInUp" duration={1} delay={0.3}>
            <p className="text-xl md:text-2xl text-slate-100 font-light">
              {subtitle}
            </p>
          </MotionWrapper>
        )}
      </div>
    </section>
  );
}