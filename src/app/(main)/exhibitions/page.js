'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import { EXHIBITIONS } from '@/lib/constants';
import { Calendar, X, MapPin, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import ReadMore from '@/components/ReadMore';
import useSWR from 'swr';
import { getExhibitionPage } from '@/utils/api/exhibitionPage';
import dayjs from 'dayjs';
import Image from 'next/image';
import Loading from '@/components/Loading';
import { MotionWrapper } from '@/components/MotionWrapper';
import { useLanguage } from '@/context/LanguageProvider';
const fetcher = async () => {
    return await getExhibitionPage();
};

export default function Exhibitions() {
    const { lang } = useLanguage();
    const { data, error, isLoading } = useSWR(
        'exhibition-page',
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    const titleExhibition = data?.titles;
    const exhibitions = data?.exhibitions;
    const formattedDate = (dateStr) => {
        return dayjs(dateStr).format('MMMM, DD YYYY');
    }

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

    return (
        <div className="pb-0 bg-white">
            <Hero
                title={lang === "id" ? titleExhibition?.title : titleExhibition?.title_en}
                subtitle={lang === "id" ? titleExhibition?.subtitle : titleExhibition?.subtitle_en}
                imageUrl="/exhibition.jpeg"
            />

            {/* Intro Context */}
            {/* <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-blue-600 font-bold tracking-[0.4em] uppercase mb-6 text-[10px]">Operational Calendar</h2>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8 max-w-3xl mx-auto leading-tight">
                    Where Technical Excellence Meets Strategic Collaboration
                </h3>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed font-light">
                    From high-stakes ship inspections to industry-defining summits, we maintain a constant presence at the forefront of the maritime world.
                </p>
            </section> */}

            {/* Alternating Immersive Layout (By Turns) */}
            <section className="space-y-0 overflow-hidden">
                {exhibitions?.map((ex, idx) => {
                    // Tentukan baris ganjil atau genap
                    const isReversed = idx % 2 !== 0;

                    return (
                        <MotionWrapper
                            key={ex.id || idx}
                            animation={isReversed ? "slideInRight" : "slideInLeft"}
                            duration={0.8}
                        >
                            <div
                                className={`group relative flex flex-col md:flex-row min-h-150 overflow-hidden border-b border-slate-100 ${isReversed ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* --- BAGIAN GAMBAR --- */}
                                <div
                                    className="md:w-1/2 relative overflow-hidden bg-slate-200"
                                >
                                    <Image
                                        src={ex?.photo}
                                        alt={ex?.name}
                                        className="w-full h-full min-h-60 object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                                        width={800}
                                        height={600}
                                    />

                                    {/* Overlay Overlay */}
                                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-all duration-700" />

                                    {/* Floating Date Plate - Muncul dengan Pop In & Delay */}
                                    <MotionWrapper
                                        animation="popIn"
                                        delay={0.5}
                                        className={`absolute top-6 md:top-12 ${isReversed ? 'left-6 md:left-12' : 'right-6 md:right-12'}`}
                                    >
                                        <div className="p-6 bg-black/40 backdrop-blur-2xl border border-black/20 rounded-3xl text-white shadow-2xl">
                                            <div className="flex items-center gap-3 mb-1">
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                                                    {formattedDate(ex?.date)}
                                                </span>
                                            </div>
                                            <div className="h-0.5 w-12 bg-blue-600 rounded-full" />
                                        </div>
                                    </MotionWrapper>
                                </div>

                                {/* --- BAGIAN KONTEN --- */}
                                <div className="md:w-1/2 flex items-center p-12 lg:p-24 bg-white relative z-10 transition-colors duration-500">
                                    <div
                                        className="max-w-lg"
                                    >
                                        <div className="flex items-center gap-3 mb-8">
                                            <span className="w-8 h-px bg-blue-600"></span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                                                {lang === "id" ? "Profil Acara" : "Event Profile"} {String(idx + 1).padStart(2, '0')}
                                            </span>
                                        </div>

                                        <h4 className="text-4xl lg:text-5xl font-serif font-bold text-slate-950 mb-8 leading-tight group-hover:text-blue-600 transition-colors duration-500">
                                            {lang === "id" ? ex?.name : ex?.name_en}
                                        </h4>

                                        <ReadMore
                                            text={lang === "id" ? ex?.description : ex?.description_en}
                                            wordLimit={20}
                                            className='text-slate-500 text-lg leading-relaxed mb-12 font-light opacity-80 group-hover:opacity-100 transition-all whitespace-pre-line'
                                            buttonColor="text-blue-500 hover:text-blue-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </MotionWrapper>
                    );
                })}
            </section>
        </div>
    );
}