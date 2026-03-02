'use client';

import Link from 'next/link';
import { Ship, Mail, Phone, MapPin, Facebook, Linkedin, Instagram, Music2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getFooterPage } from '@/utils/api/footer';
import useSWR from 'swr';
import Loading from './Loading';

const fetcher = async () => {
  return await getFooterPage();
}
export default function Footer() {
  const [year, setYear] = useState('')
  useEffect(() => {
  setYear(new Date().getFullYear());
}, []);

const { data, error, isLoading } = useSWR(
    'footer-page',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );
if (isLoading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-bold">
          Failed to load data.
        </p>
      </div>
    );
  }

  console.log(data);
  
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src={"/logo.png"} alt='logo' width={40} height={40} />
              <span className="text-xl font-serif font-bold text-white">BKS SHIPMAN</span>
            </Link>
            <p className="text-slate-400">Leading the way in global ship management with a commitment to safety and innovation.</p>
            <div className="flex space-x-4 pt-2">
              <Link href={data?.company?.linkedin || "#"} className="hover:text-blue-400"><Linkedin className="w-5 h-5" /></Link>
              <Link href={data?.company?.instagram || "#"} className="hover:text-blue-400"><Instagram className="w-5 h-5" /></Link>
              <Link href={data?.company?.facebook || "#"} className="hover:text-blue-400"><Facebook className="w-5 h-5" /></Link>
              <Link href={data?.company?.tiktok || "#"} className="hover:text-blue-400"><Music2 className="w-5 h-5" /></Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/vessels" className="hover:text-white">Our Fleet</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/exhibitions" className="hover:text-white">Exhibitions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">Services</h4>
            <ul className="space-y-3">
              <li className="hover:text-white cursor-pointer">Technical Management</li>
              <li className="hover:text-white cursor-pointer">Crew Management</li>
              <li className="hover:text-white cursor-pointer">Commercial Operations</li>
              <li className="hover:text-white cursor-pointer">HSEQ Services</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">Contact Us</h4>
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
          <p>© {year} BKS SHIPMAN. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}