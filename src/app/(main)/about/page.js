'use client';

import Hero from '@/components/Hero';
import Image from 'next/image';
import { getAboutPage } from '@/utils/api/aboutPage';
import useSWR from 'swr';
import Loading from '@/components/Loading';
import { MotionWrapper } from '@/components/MotionWrapper';
import { Award } from 'lucide-react'; // Tambahkan icon jika ingin lebih manis
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
    const aboutUs = data?.aboutUs;
    // Asumsi data sertifikat dari API dimasukkan ke variabel ini
    const certificates = data?.certificates || [];

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
        <div className="bg-white">
            <Hero
                title={lang === "id" ? titleAboutUs?.title : titleAboutUs?.title_en}
                subtitle={lang === "id" ? titleAboutUs?.subtitle : titleAboutUs?.subtitle_en}
                imageUrl="https://bks-shipman.com/images/576/22219807/crew-Mtf7_GJIQLNzvsJu_HJ0jA.jpg"
            />

            {/* About Section */}
            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 font-poppins items-center">
                    <div>
                        <MotionWrapper animation="slideInLeft" duration={1} delay={0.3}>
                            <h2 className="text-blue-600 text-sm tracking-[0.3em] font-bold uppercase mb-4">
                                {lang === "id" ? "Tentang BKS Shipmanagementagement" : "About BKS Shipmanagementagement"}

                            </h2>
                        </MotionWrapper>

                        <div className="space-y-6 text-slate-600">
                            <MotionWrapper animation="slideInUp" duration={1} delay={0.4}>
                                <p className='text-lg whitespace-pre-line leading-relaxed font-light'>
                                    {lang === "id" ? aboutUs?.description : aboutUs?.description_en}
                                </p>
                            </MotionWrapper>
                        </div>
                    </div>

                    <div className="relative h-full min-h-[400px] md:min-h-[500px]">
                        <MotionWrapper animation="scaleIn" duration={1} delay={0.5}>
                            <Image
                                src="/logo.png"
                                fill
                                className="rounded-[3rem] shadow-2xl object-cover"
                                alt="About BKS Shipmanagement"
                            />
                            {/* Opsional: Overlay gradient agar gambar lebih menyatu */}
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
                                    <Award className="w-4 h-4" /> {titleCertificates?.tag || "CERTIFICATES"}
                                </div>
                            </MotionWrapper>
                            <MotionWrapper animation="slideInDown" duration={1} delay={0.3}>
                                <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                                    {titleCertificates?.title || "Our Certificates"}
                                </h3>
                                <p className="text-slate-500 text-lg font-light leading-relaxed">
                                    {titleCertificates?.subtitle || "Showcasing our commitment to excellence and compliance in the maritime industry."}
                                </p>
                            </MotionWrapper>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 md:gap-12">
                            {certificates.map((cert, idx) => (
                                <MotionWrapper key={cert.id || idx} animation="slideInUp" duration={1} delay={0.2 + (idx * 0.1)}>
                                    {/* Outer Card: Desain bersih dan elegan */}
                                    <div className="group bg-white dark:bg-[#161b2b] rounded-3xl border border-slate-100 dark:border-slate-800 p-4 md:p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:shadow-blue-900/5 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden">

                                        {/* PERBAIKAN UTAMA DI SINI:
                    Hapus 'relative' dan biarkan Image yang menentukan tinggi container ini 
                */}
                                        <div className="w-full mb-6 bg-slate-50 dark:bg-[#1e2439] rounded-2xl border border-slate-100 dark:border-slate-800/50 p-4 flex items-center justify-center">
                                            <Image
                                                src={cert.file || cert.photo}
                                                alt={cert.name}
                                                // Ganti 'fill' dengan pengaturan dinamis ini:
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                style={{ width: '100%', height: 'auto' }}
                                                // Tambahkan bayangan langsung ke kertas sertifikatnya
                                                className="object-contain drop-shadow-xl group-hover:scale-[1.02] transition-transform duration-700"
                                                priority
                                            />
                                        </div>

                                        {/* Title Container */}
                                        <div className="px-2 pb-2 flex-grow flex items-start justify-start flex-col">
                                            <h4 className="text-slate-800 dark:text-slate-100 font-bold text-base leading-relaxed group-hover:text-blue-600 transition-colors duration-300">
                                                {cert.name}
                                            </h4>

                                            {/* Garis animasi di bawah judul */}
                                            <div className="w-0 h-0.5 bg-blue-600 mt-4 group-hover:w-16 transition-all duration-500 ease-out"></div>
                                        </div>

                                    </div>
                                </MotionWrapper>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}