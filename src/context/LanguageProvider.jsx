// file: context/LanguageContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Buat context
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('id'); // Default bahasa Indonesia

  // Saat komponen dimuat, cek apakah user sebelumnya sudah pilih bahasa
  useEffect(() => {
    const savedLang = localStorage.getItem('bks_lang');
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  // Fungsi untuk mengganti bahasa
  const toggleLanguage = () => {
    const newLang = lang === 'id' ? 'en' : 'id';
    setLang(newLang);
    localStorage.setItem('bks_lang', newLang); // Simpan pilihan ke local storage
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook agar gampang dipanggil di komponen lain
export const useLanguage = () => useContext(LanguageContext);