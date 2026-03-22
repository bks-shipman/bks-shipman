'use client';

import Hero from '@/components/Hero';
import Image from 'next/image';
import { getAboutPage } from '@/utils/api/aboutPage';
import useSWR from 'swr';
import Loading from '@/components/Loading';
import { MotionWrapper } from '@/components/MotionWrapper';
import { Award, Briefcase } from 'lucide-react'; // Tambahkan icon Briefcase untuk Partner
import { useLanguage } from '@/context/LanguageProvider';

const fetcher = async () => {
    return await getAboutPage();
};

export default function About() {
    const { lang } = useLanguage();
    const { data, error, isLoading } = useSWR(
        'about-page',
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    const titleAboutUs = data?.aboutTitles;
    const titleCertificates = data?.certificateTitles;
    const titlePartners = data?.partnerTitles;
    const aboutUs = data?.aboutUs;
    const certificates = data?.certificates || [];
    const partners = data?.partners || [];

    if (isLoading) return <Loading />;

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 font-bold">Failed to load data.</p>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <Hero
                title={lang === "id" ? titleAboutUs?.title : titleAboutUs?.title_en}
                subtitle={lang === "id" ? titleAboutUs?.subtitle : titleAboutUs?.subtitle_en}
                imageUrl="https://bks-shipman.com/images/576/22219807/crew-Mtf7_GJIQLNzvsJu_HJ0jA.jpg"
            />

            {/* About Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 font-poppins items-center">
                    <div>
                        <MotionWrapper animation="slideInLeft" duration={1} delay={0.3}>
                            <h2 className="text-blue-600 text-xl lg:text-2xl font-poppins font-bold uppercase mb-4">
                                {lang === "id" ? "Tentang BKS Shipmanagement" : "About BKS Shipmanagement"}
                            </h2>
                        </MotionWrapper>

                        <div className="space-y-6 text-slate-600">
                            <MotionWrapper animation="slideInUp" duration={1} delay={0.4}>
                                <p className='text-md lg:text-lg whitespace-pre-line leading-relaxed font-light'>
                                    {lang === "id" ? aboutUs?.description : aboutUs?.description_en}
                                </p>
                            </MotionWrapper>
                        </div>
                    </div>

                    <div className="relative h-full min-h-[300px] md:min-h-100 lg:min-h-[500px]">
                        <MotionWrapper animation="scaleIn" duration={1} delay={0.5}>
                            <Image
                                src="/logo.png"
                                fill
                                className="rounded-[3rem] shadow-2xl object-contain"
                                alt="About BKS Shipmanagement"
                            />
                            <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_0_50px_rgba(0,0,0,0.1)]"></div>
                        </MotionWrapper>
                    </div>
                </div>
            </section>

            {/* Certificates Section */}
            {certificates && certificates.length > 0 && (
                <section className="py-32 bg-slate-50 relative overflow-hidden border-t border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-20 max-w-2xl mx-auto">
                            <MotionWrapper animation="slideInDown" duration={1} delay={0.2}>
                                <div className="inline-flex items-center justify-center gap-2 mb-4 text-blue-600 font-bold tracking-[0.3em] uppercase text-xs">
                                    <Award className="w-4 h-4" /> {lang === "id" ? titleCertificates?.tag : titleCertificates?.tag_en}
                                </div>
                            </MotionWrapper>
                            <MotionWrapper animation="slideInDown" duration={1} delay={0.3}>
                                <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                                    {lang === "id" ? titleCertificates?.title : titleCertificates?.title_en}
                                </h3>
                                <p className="text-slate-500 text-lg font-light leading-relaxed">
                                    {lang === "id" ? titleCertificates?.subtitle : titleCertificates?.subtitle_en}
                                </p>
                            </MotionWrapper>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 md:gap-12">
                            {certificates.map((cert, idx) => (
                                <MotionWrapper key={cert.id || idx} animation="slideInUp" duration={1} delay={0.2 + (idx * 0.1)}>
                                    <div className="group bg-white dark:bg-[#161b2b] rounded-3xl border border-slate-100 dark:border-slate-800 p-4 md:p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:shadow-blue-900/5 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden">
                                        <div className="w-full mb-6 bg-slate-50 dark:bg-[#1e2439] rounded-2xl border border-slate-100 dark:border-slate-800/50 p-4 flex items-center justify-center">
                                            <Image
                                                src={cert.file || cert.photo}
                                                alt={cert.name}
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                style={{ width: '100%', height: 'auto' }}
                                                className="object-contain drop-shadow-xl group-hover:scale-[1.02] transition-transform duration-700"
                                            />
                                        </div>

                                        <div className="px-2 pb-2 flex-grow flex items-start justify-start flex-col">
                                            <h4 className="text-slate-800 dark:text-slate-100 font-bold text-base leading-relaxed group-hover:text-blue-600 transition-colors duration-300">
                                                {cert.name}
                                            </h4>
                                            <div className="w-0 h-0.5 bg-blue-600 mt-4 group-hover:w-16 transition-all duration-500 ease-out"></div>
                                        </div>
                                    </div>
                                </MotionWrapper>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- NEW: Partners Section --- */}
            {partners && partners.length > 0 && (
                <section className="py-24 md:py-32 bg-white relative overflow-hidden border-t border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                        {/* Header Section Partner */}
                        <div className="text-center mb-16 md:mb-24 max-w-2xl mx-auto">
                            <MotionWrapper animation="slideInDown" duration={1} delay={0.2}>
                                <div className="inline-flex items-center justify-center gap-2 mb-4 text-blue-600 font-bold tracking-[0.3em] uppercase text-xs">
                                    <Briefcase className="w-4 h-4" /> {lang === "id" ? titlePartners?.tag : titlePartners?.tag_en}
                                </div>
                            </MotionWrapper>
                            <MotionWrapper animation="slideInDown" duration={1} delay={0.3}>
                                <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                                    {lang === "id" ? titlePartners?.title : titlePartners?.title_en}
                                </h3>
                                <p className="text-slate-500 text-lg font-light leading-relaxed">
                                    {lang === "id" ? titlePartners?.subtitle : titlePartners?.subtitle_en}
                                </p>
                            </MotionWrapper>
                        </div>

                        {/* Grid Logo Partners - Diubah jadi Flex Wrap agar auto-center */}
                        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
                            {partners.map((partner, idx) => (
                                <MotionWrapper
                                    key={partner.id || idx}
                                    animation="scaleIn"
                                    duration={0.8}
                                    delay={0.1 + (idx * 0.05)}
                                >
                                    {/* Box Partner: Ukuran di-fix-kan agar simetris dan rapi */}
                                    <div className="group relative bg-white hover:bg-white border border-slate-100 rounded-3xl flex items-center justify-center transition-all duration-500 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 cursor-pointer overflow-hidden w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 p-6">

                                        {/* Image Container: Pakai fill agar menjaga rasio logo asli */}
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={partner.photo}
                                                alt={partner.name}
                                                fill
                                                className="object-contain opacity-100 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        </div>

                                        {/* Overlay Nama Partner (Muncul saat hover) */}
                                        <div className="absolute inset-0 bg-blue-900/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 z-10">
                                            <span className="text-white font-bold text-xs sm:text-sm md:text-base tracking-widest uppercase text-center px-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                {partner.name}
                                            </span>
                                        </div>
                                    </div>
                                </MotionWrapper>
                            ))}
                        </div>

                    </div>
                </section>
            )}
            {/* --- END: Partners Section --- */}

        </div>
    );
}