'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ship, Menu, X, Globe } from 'lucide-react'; // Tambahkan Globe
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageProvider'; // Import hook bahasa

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Panggil state dan fungsi dari Context
  const { lang, toggleLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Contoh: Jika kamu ingin translate menu navbar juga
  const navLinks = [
    { name: lang === 'id' ? 'Beranda' : 'Home', path: '/' },
    { name: lang === 'id' ? 'Tentang' : 'About', path: '/about' },
    { name: lang === 'id' ? 'Armada' : 'Fleet', path: '/vessels' },
    { name: lang === 'id' ? 'Karir' : 'Careers', path: '/careers' },
    { name: 'Exhibitions', path: '/exhibitions' }, // Nama event biasanya tetap
  ];

  const activeLinkClass = "text-blue-600 font-bold border-b-2 border-blue-600 pb-1";
  const idleLinkClass = "text-slate-500 hover:text-blue-600 transition-all duration-300 font-medium pb-1 border-b-2 border-transparent";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm py-4 border-b border-slate-100' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1 group">
            <div className={`rounded-xl transition-colors`}>
              <Image src={"/logo.png"} alt='logo' width={40} height={40} />
            </div>
            <span className={`text-xl font-serif font-black tracking-tighter ${isScrolled ? 'text-slate-900' : 'text-white'}`}>BKS Shipmanagement</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
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
          <div className="md:hidden flex items-center gap-4">
            {/* Tombol Bahasa Mobile */}
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
              className={`p-2 rounded-lg transition-colors ${isScrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="px-4 pt-2 pb-8 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
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