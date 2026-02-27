"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Loading() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);  // Start fade out
      
      const hideTimer = setTimeout(() => {
        setLoading(false);  // Completely hide
      }, 300);  // Fade out duration
      
      return () => clearTimeout(hideTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center 
        bg-gradient-to-br from-indigo-50 via-teal-50 to-white transition-all duration-500 
        ease-out pointer-events-none
        ${fadeOut ? "opacity-0" : "opacity-100"}
        ${!loading ? "hidden" : ""}
      `}
    >
      <div className="relative">
        {/* Lingkaran Berdenyut */}
        <div className="absolute inset-0 bg-teal-200 rounded-full blur-xl opacity-50 animate-ping"></div>
        <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
        
        {/* Logo Utama */}
        <div className="relative bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-2xl animate-bounce">
           <Image
            width={72}
            height={72} 
            src="/logo.png" 
            alt="BKS SHIPMAN Logo" 
            className="w-full h-full object-contain drop-shadow-sm"
            />
        </div>
      </div>
    </div>
  );
}