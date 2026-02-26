'use client';

import Hero from '@/components/Hero';
import { JOBS } from '@/lib/constants';
import { Mail, Phone, MapPin, ArrowRight, MessageSquare, Send } from 'lucide-react';
import useSWR from 'swr';
import { getCareerPage } from '@/utils/api/careerPage';

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

    console.log(data);

    const titleCareer = data?.titles;
    const career = data?.career;
    const phone = data?.phone;
    const phoneCode = data?.phoneCode;
    const email = data?.email;
    const address = data?.address;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-slate-500 font-semibold text-lg">
                    Loading Career Page...
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
        <div className="pb-24">
            <Hero
                title={titleCareer?.title}
                subtitle={titleCareer?.subtitle}
                imageUrl="https://images.unsplash.com/photo-1524522173746-f628baad3644?auto=format&fit=crop&q=80&w=1920"
            />

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Left Section: Contact Info */}
                    <div className="lg:col-span-4">
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

                                <a href="mailto:careers@oceanicblue.com" className="group flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl transition-all">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Inquiry</span>
                                        <span className="text-slate-900 font-bold text-lg">{email}</span>
                                    </div>
                                </a>

                                <div className="flex items-center gap-6 p-6 bg-slate-900 text-white rounded-3xl">
                                    <div className="p-2 rounded-2xl bg-white/10 flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Location</span>
                                        <span className="font-bold text-sm">{address}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-slate-200">
                                <div className="flex items-center gap-4 text-slate-400">
                                    <MessageSquare className="w-5 h-5" />
                                    <span className="text-sm font-medium">Typical response time: <span className="text-slate-900">24-48 Hours</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Vacancies */}
                    <div className="lg:col-span-8">
                        <div className={`space-y-8 transition-all duration-1000 delay-300`}>
                            <div className="flex items-end justify-between mb-12">
                                <h3 className="text-5xl font-serif font-bold text-slate-950">Active Vacancies</h3>
                                <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">{career?.length} Opportunities</span>
                            </div>

                            {career?.map((job, idx) => (
                                <div
                                    key={job.id}
                                    style={{ transitionDelay: `${idx * 150}ms` }}
                                    className="group bg-white p-10 md:p-14 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-600/10 transition-all duration-500"
                                >
                                    <div className="flex flex-col gap-10">
                                        <div>
                                            <h4 className="text-3xl font-serif font-bold text-slate-950 mb-6 group-hover:text-blue-600 transition-colors">
                                                {job.title}
                                            </h4>
                                            <div className="h-1 w-20 bg-blue-600 mb-8 rounded-full"></div>
                                            <p className="text-slate-500 text-lg leading-relaxed font-light italic">
                                                {job.description}
                                            </p>
                                        </div>

                                        {/* <div className="flex flex-wrap items-center justify-between gap-8 pt-10 border-t border-slate-50">
                                            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                                                <Send className="w-4 h-4" /> Ready to Apply?
                                            </div>
                                            <button className="inline-flex items-center gap-4 px-10 py-5 bg-slate-950 hover:bg-blue-600 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-xl">
                                                Apply Now <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div> */}
                                    </div>
                                </div>
                            ))}

                            {/* General Application CTA
                            <div className="p-12 bg-blue-600 rounded-[3rem] text-white text-center shadow-2xl shadow-blue-600/20">
                                <h4 className="text-3xl font-serif font-bold mb-6">Unsolicited Application</h4>
                                <p className="text-blue-100 mb-10 max-w-xl mx-auto leading-relaxed">
                                    Don't see a specific fit for your expertise? Our fleet is growing and we are always looking for visionary maritime professionals.
                                </p>
                                <button className="px-12 py-5 bg-white text-blue-600 rounded-full font-bold hover:bg-slate-900 hover:text-white transition-all transform hover:scale-105">
                                    Submit General Interest
                                </button>
                            </div> */}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}