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

const fetcher = async () => {
    return await getExhibitionPage();
};

export default function Exhibitions() {
    const { data, error, isLoading } = useSWR(
        'exhibition-page',
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    console.log(data);



    const titleExhibition = data?.titles;
    const exhibitions = data?.exhibitions;
    const formattedDate = (dateStr) => {
        return dayjs(dateStr).format('MMMM, DD YYYY');
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-slate-500 font-semibold text-lg">
                    Loading About Page...
                </p>
            </div>
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
                title={titleExhibition?.title}
                subtitle={titleExhibition?.subtitle}
                imageUrl="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920"
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
            <section className="space-y-0">
                {exhibitions?.map((ex, idx) => (
                    <div
                        key={ex.id}
                        className={`group relative flex flex-col md:flex-row min-h-150 overflow-hidden border-b border-slate-100 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                        {/* Image Section */}
                        <div className="md:w-1/2 relative overflow-hidden bg-slate-200">
                            <Image
                                src={ex?.photo || null}
                                alt={ex?.name}
                                className="w-full h-full min-h-60 object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                                width={600}
                                height={400}
                            />
                            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-all duration-700" />

                            {/* Floating Date Plate */}
                            <div className={`absolute top-2 md:top-12 ${idx % 2 !== 0 ? 'left-2 md:left-12' : 'right-2 md:right-12'} p-6 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl text-white shadow-2xl animate-in zoom-in duration-700`}>
                                <div className="flex items-center gap-3 mb-1">
                                    <Calendar className="w-4 h-4 text-blue-400" />
                                    <span className="text-[10px] font-medium font-poppins uppercase tracking-[0.2em]">{formattedDate(ex?.date)}</span>
                                </div>
                                <div className="h-0.5 w-12 bg-blue-600 rounded-full" />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="md:w-1/2 flex items-center p-12 lg:p-24 bg-white relative z-10">
                            <div className="max-w-lg">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="w-8 h-[1px] bg-blue-600"></span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Event Profile {String(idx + 1).padStart(2, '0')}</span>
                                </div>

                                <h4 className="text-4xl lg:text-5xl font-serif font-bold text-slate-950 mb-8 leading-tight group-hover:text-blue-600 transition-colors duration-500">
                                    {ex?.name}
                                </h4>

                                <ReadMore
                                    text={ex?.description}
                                    wordLimit={12}
                                    className='text-slate-500 text-lg leading-relaxed mb-12 font-light opacity-80 group-hover:opacity-100 transition-all'
                                    buttonColor="text-blue-400 hover:text-blue-600"
                                />

                                {/* <button
                                    onClick={() => setSelectedExhibition(ex)}
                                    className="inline-flex items-center gap-4 text-slate-900 font-bold uppercase tracking-[0.2em] text-[10px] group/link pb-2 border-b-2 border-slate-900/10 hover:border-blue-600 transition-all duration-500"
                                >
                                    View Full Dossier <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
                                </button> */}
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Detailed Dossier Modal */}


            {/* Footer CTA */}
            {/* <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-10 leading-tight">Ready to shape the future of maritime?</h2>
                    <p className="text-slate-400 text-xl mb-12 font-light leading-relaxed">
                        Our strategic partnerships are the backbone of our operational success. Join us at our next major engagement.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <button className="px-12 py-5 bg-white text-slate-950 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-2xl">
                            Request Partner Access
                        </button>
                        <button className="px-12 py-5 border border-white/20 hover:bg-white/5 rounded-full font-bold transition-all">
                            View Past Engagements
                        </button>
                    </div>
                </div>
            </section> */}
        </div>
    );
}