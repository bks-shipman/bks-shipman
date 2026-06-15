'use client';

import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { getServiceById } from '@/utils/api/services';
import Hero from '@/components/Hero';
import Loading from '@/components/Loading';
import { MotionWrapper } from '@/components/MotionWrapper';
import { useLanguage } from '@/context/LanguageProvider';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetailPage() {
  const { lang } = useLanguage();
  const { id } = useParams();
  const router = useRouter();

  const { data: service, error, isLoading } = useSWR(
    id ? `service-${id}` : null,
    async () => {
      return await getServiceById(id);
    },
    {
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          {lang === "id" ? "Layanan tidak ditemukan" : "Service not found"}
        </h2>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {lang === "id" ? "Kembali ke Beranda" : "Back to Home"}
        </Link>
      </div>
    );
  }

  const title = lang === "id" ? service.title : service.title_en;
  const description = lang === "id" ? service.description : service.description_en;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <Hero
        title={title}
        subtitle={lang === "id" ? "Layanan Maritim Kami" : "Our Maritime Service"}
        imageUrl="/exhibition.jpeg"
      />

      {/* Description Section */}
      <section className="py-24 relative overflow-hidden bg-white">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl pointer-events-none opacity-40"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-50 rounded-full blur-3xl pointer-events-none opacity-40"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <MotionWrapper animation="slideInUp" duration={0.8} delay={0.2}>
            {/* Back Button */}
            <div className="mb-12">
              <button
                onClick={() => router.back()}
                className="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold tracking-widest uppercase text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {lang === "id" ? "Kembali" : "Back"}
              </button>
            </div>
          </MotionWrapper>

          {/* Premium Description Box */}
          <MotionWrapper animation="scaleIn" duration={0.8} delay={0.3}>
            <div className="p-10 md:p-16 bg-slate-50 border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-100/50 relative overflow-hidden">
              {/* Premium Top Line Accent */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-cyan-400"></div>

              <div className="flex items-center gap-3 mb-8">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                  {lang === "id" ? "Deskripsi Layanan" : "Service Description"}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                {title}
              </h2>

              <div className="text-slate-600 text-lg md:text-xl leading-relaxed whitespace-pre-line font-light">
                {description}
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>
    </div>
  );
}
