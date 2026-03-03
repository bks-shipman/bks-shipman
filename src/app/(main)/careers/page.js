'use client';

import Hero from '@/components/Hero';
import { JOBS } from '@/lib/constants';
import { Mail, Phone, MapPin, ArrowRight, MessageSquare, Send, CheckCircle2, CircleSmall } from 'lucide-react';
import useSWR from 'swr';
import { getCareerPage } from '@/utils/api/careerPage';
import Loading from '@/components/Loading';
import { MotionWrapper } from '@/components/MotionWrapper';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const fetcher = async () => {
    return await getCareerPage();
};

export default function Careers() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50; // Jarak minimal untuk dianggap sebagai swipe
    const { data, error, isLoading } = useSWR(
        'career-page',
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );
    const titleCareer = data?.titles;
    const career = data?.career;
    const phone = data?.phone;
    const phoneCode = data?.phoneCode;
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const email = data?.email;

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
    const openGallery = (idx) => setSelectedImage(idx);
    const nextImage = () => setSelectedImage(prev => prev !== null ? (prev + 1) % career.length : null);
    const prevImage = () => setSelectedImage(prev => prev !== null ? (prev - 1 + career.length) % career.length : null);
    const onTouchStart = (e) => {
        setTouchEnd(null); // Reset end position
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextImage();
        } else if (isRightSwipe) {
            prevImage();
        }
    };

    const handleDragEnd = (event, info) => {
        const swipeThreshold = 50; // Jarak minimal swipe dalam pixel
        if (info.offset.x < -swipeThreshold) {
            nextImage(); // Swipe ke kiri -> Gambar selanjutnya
        } else if (info.offset.x > swipeThreshold) {
            prevImage(); // Swipe ke kanan -> Gambar sebelumnya
        }
    };
    return (
        <div className="pb-24 bg-white">
            <Hero
                title={titleCareer?.title}
                subtitle={titleCareer?.subtitle}
                imageUrl="/career.jpeg"
            />

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Left Section: Contact Info */}
                    <div className="lg:col-span-4">
                        <MotionWrapper animation="slideInLeft" duration={1} delay={0.3}>
                            <div className={`sticky top-32 space-y-10 transition-all duration-1000 '}`}>
                                <div>
                                    <h2 className="text-blue-600 font-bold tracking-[0.3em] uppercase mb-4 text-xs">Recruitment Center</h2>
                                    <h3 className="text-4xl font-serif font-bold text-slate-900 mb-6">Contact Our Team</h3>
                                    <p className="text-slate-500 leading-relaxed mb-8">
                                        Have questions about a role or your application? Our global talent acquisition team is available for direct inquiries.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <a href={`https://wa.me/${phoneCode}${cleanPhone}`} className="group flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl transition-all">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Direct Line</span>
                                            <span className="text-slate-900 font-bold text-lg">+{phoneCode} {phone}</span>
                                        </div>
                                    </a>

                                    <Link href={`mailto:${email}`} className="group flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl transition-all">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Inquiry</span>
                                            <span className="block text-slate-900 font-bold text-lg break-all">{email}</span>
                                        </div>
                                    </Link>
                                </div>

                                <div className="pt-10 border-t border-slate-200">
                                    <div className="flex items-center gap-4 text-slate-400">
                                        <MessageSquare className="w-5 h-5" />
                                        <span className="text-sm font-medium">Typical response time: <span className="text-slate-900">24-48 Hours</span></span>
                                    </div>
                                </div>
                            </div>
                        </MotionWrapper>
                    </div>

                    {/* Right Section: Vacancies */}
                    <div className="lg:col-span-8">
                        <MotionWrapper animation="slideInRight" duration={1} delay={0.3}>
                            <div className={`space-y-12 transition-all duration-1000 delay-300`}>
                                <div className="flex items-end justify-between flex-wrap mb-12">
                                    <h3 className="text-5xl font-serif font-bold text-slate-950">Active Vacancies</h3>
                                    <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">{career?.length} Opportunities</span>
                                </div>

                                <MotionWrapper animation="scaleIn" duration={1} delay={0.8}>
                                    {career?.map((job, idx) => {
                                        // Membersihkan dan memecah string menjadi array berdasarkan koma
                                        const positionsList = job.positions ? job.positions.split(',').map(item => item.trim()).filter(Boolean) : [];
                                        const requirementsList = job.requirements ? job.requirements.split(',').map(item => item.trim()).filter(Boolean) : [];

                                        return (
                                            <div
                                                key={job.id}
                                                style={{ transitionDelay: `${idx * 150}ms` }}
                                                // 1. UBAH DI SINI: flex-col (HP) jadi md:flex-row (Desktop)
                                                className="group bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-600/20 transition-all duration-500 overflow-hidden mb-12 flex flex-col md:flex-row"
                                            >
                                                {/* Photo Section (Kiri pada Desktop) */}
                                                {job.photo && (
                                                    <>
                                                        <div className="relative hidden w-full md:w-5/12 shrink-0 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 p-8 md:p-4 md:flex items-center justify-center">
                                                            <Image
                                                                src={job.photo}
                                                                alt={job.title}
                                                                width={0}
                                                                height={0}
                                                                onClick={() => openGallery(idx)}
                                                                sizes="(max-width: 768px) 100vw, 40vw"
                                                                style={{ width: '100%', height: 'auto' }}
                                                                // Tambahkan rounded dan shadow agar poster terlihat menonjol
                                                                className="rounded-2xl shadow-lg group-hover:scale-[1.02] transition-transform duration-700 cursor-pointer"
                                                            />
                                                        </div>
                                                        <div className="relative w-full md:hidden overflow-hidden bg-slate-50 border-b border-slate-100">
                                                            <Image
                                                                src={job.photo}
                                                                alt={job.title}
                                                                width={0}
                                                                height={0}
                                                                onClick={() => openGallery(idx)}
                                                                sizes="100vw"
                                                                style={{ width: '100%', height: 'auto' }} // Ini kunci agar rasionya utuh
                                                                className="group-hover:scale-[1.02] transition-transform duration-700 cursor-pointer"
                                                            />
                                                            <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* Content Section (Kanan pada Desktop) */}
                                                {/* 3. UBAH DI SINI: Gunakan flex-1 agar teks mengisi sisa ruang yang ada */}
                                                <div className="flex-1 p-10 md:p-12 lg:p-14 flex flex-col gap-10 relative bg-white justify-center">
                                                    {/* Title */}
                                                    <div>
                                                        <h4 className="text-3xl md:text-4xl font-serif font-bold text-slate-950 mb-6 group-hover:text-blue-600 transition-colors">
                                                            {job.title}
                                                        </h4>
                                                        <div className="h-1.5 w-20 bg-blue-600 mb-2 rounded-full"></div>
                                                    </div>

                                                    {/* Lists Grid */}
                                                    {/* 4. UBAH DI SINI: Jadi xl:grid-cols-2 agar teks tidak terlalu berdempetan saat bersanding dengan foto */}
                                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                                                        {/* Positions */}
                                                        {positionsList.length > 0 && (
                                                            <div>
                                                                <h5 className="text-sm font-semibold tracking-[0.2em] uppercase text-slate-600 mb-6 flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                                                    Available Positions
                                                                </h5>
                                                                <ul className="space-y-3">
                                                                    {positionsList.map((pos, i) => (
                                                                        <li key={i} className="flex items-start gap-3">
                                                                            <CircleSmall className="w-6 h-6 text-blue-600 shrink-0 mt-0" />
                                                                            <span className="text-slate-800 font-semibold leading-relaxed">{pos}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Requirements */}
                                                        {requirementsList.length > 0 && (
                                                            <div>
                                                                <h5 className="text-sm font-semibold tracking-[0.2em] uppercase text-slate-600 mb-6 flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                                    Requirements
                                                                </h5>
                                                                <ul className="space-y-4">
                                                                    {requirementsList.map((req, i) => (
                                                                        <li key={i} className="flex items-start gap-3">
                                                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                                            <span className="text-slate-600 leading-relaxed text-sm">{req}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </MotionWrapper>
                            </div>
                        </MotionWrapper>
                        {selectedImage !== null && (
                            <div
                                className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-12 animate-in fade-in duration-500"
                                // Tambahkan 3 baris di bawah ini
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                            >
                                {/* Tombol Close */}
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="cursor-pointer absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-110"
                                >
                                    <X className="w-10 h-10" />
                                </button>

                                {/* Tombol Prev (Sembunyikan di Mobile jika ingin clean, karena sudah ada swipe) */}
                                <button
                                    onClick={prevImage}
                                    className="md:flex absolute left-8 top-1/2 -translate-y-1/2 p-4 bg-black/60 hover:bg-black/70 cursor-pointer rounded-full text-white transition-colors z-110"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>

                                <div className="max-w-5xl w-full relative flex flex-col items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={selectedImage}
                                            drag="x"
                                            dragConstraints={{ left: 0, right: 0 }}
                                            dragElastic={0.7}
                                            onDragEnd={handleDragEnd}
                                            initial={{ opacity: 0, scale: 0.95, x: 50 }}
                                            animate={{ opacity: 1, scale: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, x: -50 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="w-full flex flex-col items-center cursor-grab active:cursor-grabbing touch-none"
                                        >

                                            {/* PERBAIKAN UTAMA DI SINI */}
                                            {/* Kita hapus aspect-ratio dan gunakan tinggi maksimal berdasarkan layar (vh) */}
                                            <div className="relative w-full h-[60vh] md:h-[90vh] flex items-center justify-center">
                                                <Image
                                                    fill // Biarkan Next.js yang menghitung dimensinya
                                                    src={career[selectedImage]?.photo}
                                                    alt={career[selectedImage]?.title}
                                                    // Gunakan object-contain agar gambar UTUH 100% tidak ada yang dipotong
                                                    className="object-contain pointer-events-none drop-shadow-2xl rounded-xl"
                                                    priority
                                                />

                                                {/* Indikator Angka */}
                                                <div className="absolute top-0 right-4 md:right-0 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-white/80 text-[10px] font-black tracking-widest z-10">
                                                    {selectedImage + 1} / {career.length}
                                                </div>
                                            </div>

                                            {/* Caption Teks */}
                                            {/* <div className="mt-8 text-center max-w-2xl px-4 pointer-events-none">
                                                <h2 className="text-white text-3xl md:text-4xl font-serif font-bold mb-4 tracking-tight leading-tight">
                                                    {career[selectedImage]?.title}
                                                </h2>
                                                <div className="h-1.5 w-16 bg-blue-600 mx-auto rounded-full shadow-lg shadow-blue-600/50"></div>
                                            </div> */}

                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Tombol Next */}
                                <button
                                    onClick={nextImage}
                                    className="md:flex absolute right-8 top-1/2 -translate-y-1/2 p-4 bg-black/60 hover:bg-black/70 cursor-pointer rounded-full text-white transition-colors z-110"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </div>
                        )}
                    </div>

                </div >
            </section >
        </div >
    );
}