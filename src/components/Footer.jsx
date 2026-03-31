'use client';

import Link from 'next/link';
import { Ship, Mail, Phone, MapPin, Facebook, Linkedin, Instagram, Music2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getFooterPage } from '@/utils/api/footer';
import useSWR from 'swr';
import Loading from './Loading';
import { useLanguage } from '@/context/LanguageProvider';
import axiosInstance from '@/utils/axios'; // Tambahkan ini untuk SWR Page Config

// Fetcher untuk Footer Data
const fetcher = async () => {
  return await getFooterPage();
}

// Fetcher untuk Page Configs (Berbagi cache dengan Navbar)
const configFetcher = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

export default function Footer() {
  const { lang } = useLanguage();
  const [year, setYear] = useState('');
  
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // 1. Ambil Data Footer
  const { data, error, isLoading } = useSWR(
    'footer-page',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  // 2. Ambil Data Visibilitas Halaman
  const { data: configs } = useSWR('/page-configs', configFetcher);

  // 3. Ekstrak Status Masing-Masing Halaman (Default: true jika belum loading)
  const isVesselsActive = configs ? configs.find(c => c.key === 'VESSELS')?.isActive !== false : true;
  const isCareersActive = configs ? configs.find(c => c.key === 'CAREERS')?.isActive !== false : true;
  const isExhibitionsActive = configs ? configs.find(c => c.key === 'EXHIBITIONS')?.isActive !== false : true;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-bold">Failed to load data.</p>
      </div>
    );
  }

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Kolom kita ubah jadi dinamis, kalau isVesselsActive false, kolomnya jadi 3 (lg:grid-cols-3) */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isVesselsActive ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-12 mb-12 transition-all duration-500`}>
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src={"/logo.png"} alt='logo' width={40} height={40} />
              <span className="text-xl font-serif font-bold text-white">BKS Shipmanagement</span>
            </Link>
            <p className="text-slate-400">{lang === "id" ? "Memimpin dalam manajemen kapal global dengan komitmen terhadap keselamatan dan inovasi." : "Leading the way in global ship management with a commitment to safety and innovation."}</p>
            <div className="flex space-x-4 pt-2">
              <Link href={data?.company?.linkedin || "#"} className="hover:text-blue-400"><Linkedin className="w-5 h-5" /></Link>
              <Link href={data?.company?.instagram || "#"} className="hover:text-blue-400"><Instagram className="w-5 h-5" /></Link>
              <Link href={data?.company?.facebook || "#"} className="hover:text-blue-400"><Facebook className="w-5 h-5" /></Link>
              <Link href={data?.company?.tiktok || "#"} className="hover:text-blue-400"><Music2 className="w-5 h-5" /></Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">{lang == "id" ? "Tautan Cepat" : "Quick Links"}</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-white">{lang === 'id' ? 'Tentang Kami' : 'About Us'}</Link></li>
              
              {/* Sembunyikan link Armada Kami jika status OFF */}
              {isVesselsActive && (
                <li><Link href="/vessels" className="hover:text-white">{lang === "id" ? "Armada Kami" : "Our Fleet"}</Link></li>
              )}
              
              {/* Sembunyikan link Karir jika status OFF */}
              {isCareersActive && (
                <li><Link href="/careers" className="hover:text-white">{lang === "id" ? "Karir" : "Careers"}</Link></li>
              )}
              
              {/* Sembunyikan link Exhibitions jika status OFF */}
              {isExhibitionsActive && (
                <li><Link href="/exhibitions" className="hover:text-white">{lang === "id" ? "Pameran" : "Exhibitions"}</Link></li>
              )}
            </ul>
          </div>

          {/* Sembunyikan seluruh div Tipe Mesin jika Vessels status OFF */}
          {isVesselsActive && (
            <div>
              <h4 className="text-lg font-bold text-white mb-6">{lang === "id" ? "Tipe Mesin" : "Vessel Type"}</h4>
              <ul className="space-y-3">
                {data?.vesselType.map((type, idx) => (
                  <li key={idx} className="hover:text-white cursor-pointer capitalize">
                    <Link href={`/vessels?type=${type.name}`}>{type?.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-lg font-bold text-white mb-6">{lang === "id" ? "Hubungi Kami" : "Contact Us"}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
                <span><Link href={data?.company?.gmapsUrl || "#"}>{data?.company?.address}</Link></span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>+{data?.company?.phone_code} {data?.company?.phone || ""}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>{data?.company?.email || "contact@oceanicblue.com"}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {year} BKS Shipmanagement. {lang === "id" ? "Semua hak dilindungi undang-undang" : "All rights reserved"}.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-300">{lang === "id" ? "Kebijakan Privasi" : "Privacy Policy"}</a>
            <a href="#" className="hover:text-slate-300">{lang === "id" ? "Ketentuan Layanan" : "Terms of Service"}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}