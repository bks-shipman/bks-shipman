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

const fetcher = async () => {
    return await getCareerPage();
};

export default function Careers() {
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

    return (
        <div className="pb-24 bg-white">
            <Hero
                title={titleCareer?.title}
                subtitle={titleCareer?.subtitle}
                imageUrl="https://images.unsplash.com/photo-1524522173746-f628baad3644?auto=format&fit=crop&q=80&w=1920"
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
                                    <a href="tel:+6567891234" className="group flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl transition-all">
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
                                                className="group bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-600/20 transition-all duration-500 overflow-hidden mb-12 flex flex-col"
                                            >
                                                {/* Photo Section */}
                                                {job.photo && (
                                                    <div className="relative w-full h-64 md:h-80 overflow-hidden bg-slate-100">
                                                        <Image
                                                            src={job.photo}
                                                            alt={job.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                    </div>
                                                )}

                                                {/* Content Section */}
                                                <div className="p-10 md:p-14 flex flex-col gap-10 relative bg-white">
                                                    {/* Title */}
                                                    <div>
                                                        <h4 className="text-3xl md:text-4xl font-serif font-bold text-slate-950 mb-6 group-hover:text-blue-600 transition-colors">
                                                            {job.title}
                                                        </h4>
                                                        <div className="h-1.5 w-20 bg-blue-600 mb-2 rounded-full"></div>
                                                    </div>

                                                    {/* Lists Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
                                                                            <CircleSmall className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
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
                    </div>

                </div >
            </section >
        </div >
    );
}