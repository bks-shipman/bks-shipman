'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ship, Menu, X, Globe } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageProvider';
import useSWR from 'swr';
import axiosInstance from '@/utils/axios'; // Pastikan path ini benar

// Fetcher untuk mengambil semua status halaman dari public API
const fetcher = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  const { lang, toggleLanguage } = useLanguage();

  // Ambil semua data PageConfig dari Backend (Nembak ke public route)
  const { data: configs } = useSWR('/page-configs', fetcher);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. Definisikan Link beserta Enum Key-nya
  // 2. Filter langsung berdasarkan data dari Backend
  const navLinks = [
    { name: lang === 'id' ? 'Beranda' : 'Home', path: '/' },
    { name: lang === 'id' ? 'Tentang' : 'About', path: '/about' },
    { name: lang === 'id' ? 'Armada' : 'Fleet', path: '/vessels', enumKey: 'VESSELS' },
    { name: lang === 'id' ? 'Karir' : 'Careers', path: '/careers', enumKey: 'CAREERS' },
    { name: lang === 'id' ? 'Pameran': 'Exhibitions', path: '/exhibitions', enumKey: 'EXHIBITIONS' },
  ].filter(link => {
    // Jika link tidak punya enumKey (seperti Home/About), selalu tampilkan
    if (!link.enumKey) return true;

    // Jika data dari BE belum termuat, default-nya kita tampilkan saja dulu biar gak kedip
    if (!configs) return true;

    // Cari status konfigurasi yang sesuai dengan enumKey
    const pageConfig = configs.find(c => c.key === link.enumKey);

    // Jika ada datanya dan isActive false, sembunyikan. Selain itu, tampilkan.
    return pageConfig?.isActive !== false;
  });

  const activeLinkClass = "text-blue-600 font-bold border-b-2 border-blue-600 pb-1";
  const idleLinkClass = "text-slate-500 hover:text-blue-600 transition-all duration-300 font-medium pb-1 border-b-2 border-transparent";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm py-4 border-b border-slate-100' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" onClick={() => window.scrollTo(0,0)} className="flex items-center gap-1 group">
            <div className={`rounded-xl transition-colors`}>
              <Image src={"/logo.png"} alt='logo' width={40} height={40} />
            </div>
            <span className={`text-xs md:text-lg lg:text-xl font-serif font-black tracking-tighter ${isScrolled ? 'text-slate-900' : 'text-white'}`}>BKS Shipmanagement</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => window.scrollTo(0,0)}
                className={`text-[13px] uppercase tracking-[0.2em] ${pathname === link.path ? activeLinkClass : (isScrolled ? idleLinkClass : 'text-slate-300 hover:text-white transition-colors font-medium')}`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Tombol Bahasa Desktop */}
            <button 
              onClick={toggleLanguage}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                isScrolled 
                ? 'border-slate-200 hover:border-blue-600 text-slate-600 hover:text-blue-600' 
                : 'border-white/30 hover:border-white text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">{lang}</span>
            </button>
          </div>

          {/* Mobile Menu & Language Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
                isScrolled 
                ? 'border-slate-200 text-slate-600' 
                : 'border-white/30 text-white'
              }`}
            >
              <span className="text-[10px] font-bold uppercase">{lang}</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${isScrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="px-4 pt-2 pb-8 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => {
                  setIsOpen(false);
                  window.scrollTo(0,0);
                }}
                className={`block px-4 py-5 text-sm font-bold font-poppins tracking-widest uppercase rounded-2xl ${pathname === link.path ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}