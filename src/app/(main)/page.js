'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, X, ChevronLeft, ChevronRight,
  Zap, Target, Eye
} from 'lucide-react';
import { GALLERY } from '@/lib/constants';
import Hero from '@/components/Hero';
import ReadMore from '@/components/ReadMore';
import Image from 'next/image';
import { getLandingPage } from '@/utils/api/landingPage';
import useSWR from 'swr';
import Counter from '@/components/Counter';
import Loading from '@/components/Loading';

const fetcher = async () => {
  return await getLandingPage();
}
export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const { data, error, isLoading } = useSWR(
    'landing-page',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const mission = data?.missions;
  const vision = data?.vision;
  const captain = data?.captain;
  const services = data?.services || [];
  const coreValues = data?.coreValues || [];
  const titleHero = data?.titleHero;
  const titleServices = data?.titleServices;
  const titleVM = data?.titleVM;
  const titleGallery = data?.titleGallery;
  const titleCoreValues = data?.titleCoreValues;
  const gallery = data?.gallery || [];
  const vesselsCount = data?.vesselsCount || 0;
  const exhibitionsCount = data?.exhibitionsCount || 0;

  console.log(data);


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
  const nextImage = () => setSelectedImage(prev => prev !== null ? (prev + 1) % gallery.length : null);
  const prevImage = () => setSelectedImage(prev => prev !== null ? (prev - 1 + gallery.length) % gallery.length : null);

  return (
    <div className="bg-white selection:bg-blue-600 selection:text-white w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-40 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <Image
            fill={true}
            src="https://images.unsplash.com/photo-1524522173746-f628baad3644?auhref=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-50 scale-105"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-left-4 duration-1000">
              <Zap className="w-3.5 h-3.5" /> {titleHero?.tag}
            </div>
            <h1 className="text-[40px] md:text-8xl font-serif font-bold text-white mb-8 leading-[1.05] animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {titleHero?.title} <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">{titleHero?.title2}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300/90 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 font-light">
              {titleHero?.subtitle}
            </p>
            <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 pb-20">
              <Link href="/vessels" >
                <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-blue-600/20 flex items-center gap-2">
                  Explore Fleet <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/about" className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-full font-bold transition-all backdrop-blur-md">
                Our Story
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 right-12 hidden xl:block animate-in fade-in slide-in-from-right-12 duration-1000 delay-500">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] grid grid-cols-2 gap-x-16 gap-y-10 min-w-112.5">
            <div>
              <div className="text-5xl font-serif font-bold text-white mb-2"><Counter end={vesselsCount} suffix="+" /></div>
              <div className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Vessels Managed</div>
            </div>
            <div>
              <div className="text-5xl font-serif font-bold text-white mb-2"><Counter end={99.8} suffix="%" /></div>
              <div className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Technical Reliability</div>
            </div>
            <div>
              <div className="text-5xl font-serif font-bold text-white mb-2"><Counter end={exhibitionsCount} suffix="+" /></div>
              <div className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Exhibitions Managed</div>
            </div>
            <div>
              <div className="text-5xl font-serif font-bold text-white mb-2"><Counter end={0} suffix="" /></div>
              <div className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">HSEQ Deviations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Redesigned for Scalability (No Icons) */}
      {services && services.length > 0 && (
        <section className="py-32 relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-24">
              <h2 className="text-blue-600 font-bold tracking-[0.3em] uppercase mb-4 text-xs">Our Services</h2>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <h3 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 max-w-2xl leading-tight">
                  {titleServices?.title}
                </h3>
                <p className="text-slate-500 text-lg max-w-sm leading-relaxed">
                  {titleServices?.subtitle}
                </p>
              </div>
            </div>

            <div className="grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((s, idx) => (
                <div key={idx} className="group p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-700 relative overflow-hidden flex flex-col min-h-100">
                  {/* Dynamic Watermark Number */}
                  <div className="text-8xl font-black font-serif text-slate-400/50 absolute top-6 right-8 group-hover:text-blue-600/50 transition-colors duration-500">
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  <div className="relative z-10 mt-auto">
                    <span className="inline-block px-3 py-1 bg-white border border-slate-200 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg mb-6 group-hover:border-blue-600/30 group-hover:text-blue-600 transition-all">
                      service
                    </span>
                    <h4 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{s.title}</h4>
                    <ReadMore
                      text={s.description}
                      wordLimit={12}
                      buttonColor="text-blue-400 hover:text-blue-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
      }

      {/* Vision/Mission Section - Restored with Icons */}
      <section className="py-32 bg-slate-950 text-white relative">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-48 right-0 w-80 h-80 bg-cyan-400 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-blue-400 font-bold tracking-[0.3em] uppercase mb-6 text-xs">
                  {titleVM?.tag}
                </h2>
                <h3 className="text-[40px] md:text-7xl font-serif font-bold leading-tight">
                  {titleVM?.title} <br />
                  <span className="italic text-slate-500">{titleVM?.title2}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="group">
                  {/* Restored Icon for Mission */}
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                    <Target className="w-7 h-7 text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">The Mission</h4>
                  <ReadMore
                    text={mission ? mission.description : ''}
                    wordLimit={45}
                    buttonColor="text-blue-400 hover:text-blue-300"
                  />
                </div>
                <div className="group">
                  {/* Restored Icon for Vision */}
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-8 group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                    <Eye className="w-7 h-7 text-cyan-400 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">The Vision</h4>
                  <ReadMore
                    text={vision ? vision.description : ''}
                    wordLimit={12}
                    buttonColor="text-cyan-400 hover:text-cyan-300"
                  />

                </div>
              </div>
            </div>
            {captain && (
              <div className="relative">
                <div className="aspect-4/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
                  <Image
                    src={captain?.photo || ""}
                    width={1000}
                    height={2000}
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                    alt="Vessel Detail"
                  />
                  <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply"></div>
                </div>
                <div className="absolute -left-4 -bottom-8 md:-bottom-10 md:-left-10 bg-white p-6 md:p-12 rounded-4xl shadow-2xl max-w-2xs md:max-w-sm">
                  <p className="text-slate-900 font-serif font-bold text-lg md:text-2xl mb-4 italic leading-tight">"{captain?.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">CEO</div>
                    <div>
                      <p className="text-slate-900 font-bold text-sm tracking-tight">Capt. {captain?.name}</p>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Chief Executive Officer</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {gallery && gallery.length > 2 && (
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-blue-600 font-bold tracking-[0.3em] uppercase mb-4 text-xs">{titleGallery?.tag}</h2>
              <h3 className="text-5xl font-serif font-bold text-slate-900">{titleGallery?.title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-175">
              <div
                className="md:col-span-7 group relative overflow-hidden rounded-[2.5rem] cursor-pointer"
                onClick={() => openGallery(0)}
              >
                <Image
                  src={gallery[0]?.photo}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  alt="Gallery 1"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-12 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <span className="block text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{gallery[0]?.type}</span>
                    <span className="text-white text-3xl font-serif font-bold">{gallery[0]?.name}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col gap-6">
                <div
                  className="h-1/2 group relative overflow-hidden rounded-[2.5rem] cursor-pointer"
                  onClick={() => openGallery(1)}
                >
                  <Image
                    src={gallery[1]?.photo || ""}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    alt="Gallery 2"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    <div className="text-center p-6 border border-white/20 rounded-2xl backdrop-blur-sm">
                      <span className="text-white font-bold tracking-widest uppercase text-xs">{gallery[1]?.name}</span>
                    </div>
                  </div>
                </div>
                <div
                  className="h-1/2 group relative overflow-hidden rounded-[2.5rem] cursor-pointer"
                  onClick={() => openGallery(2)}
                >
                  <Image
                    src={gallery[2]?.photo || ""}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    alt="Gallery 3"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    <div className="text-center p-6 border border-white/20 rounded-2xl backdrop-blur-sm">
                      <span className="text-white font-bold tracking-widest uppercase text-xs">{gallery[2]?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal - Updated with Black Blurred Background */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-12 animate-in fade-in duration-500">
          <button
            onClick={() => setSelectedImage(null)}
            className="cursor-pointer absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-110"
          >
            <X className="w-10 h-10" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-8 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors z-110"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="max-w-6xl w-full flex flex-col items-center relative">
            <Image
              width={600}
              height={400}
              src={gallery[selectedImage]?.photo}
              alt={gallery[selectedImage]?.name}
              className="max-w-full max-h-[75vh] object-contain rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500"
            />
            <div className="mt-12 text-center max-w-2xl px-4">
              <p className="text-white text-4xl font-serif font-bold mb-6 tracking-tight drop-shadow-sm leading-tight">
                {gallery[selectedImage]?.name}
              </p>
              <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
            </div>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-8 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors z-110"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* Core Values Section - Scalable and Icon-Free */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-blue-600 font-bold tracking-[0.3em] uppercase mb-4 text-xs">{titleCoreValues?.tag}</h2>
            <h3 className="text-5xl font-serif font-bold text-slate-900 mb-6">{titleCoreValues?.title}</h3>
            <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
              {titleCoreValues?.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-center">
            {coreValues?.map((val, i) => (
              <div
                key={i}
                className="bg-white p-8 group border border-slate-100 rounded-2xl hover:bg-blue-600 transition-all duration-300 flex items-center shadow-sm hover:shadow-xl hover:shadow-blue-600/20"
              >
                {/* Visual Accent (Left Border) */}
                <div className="w-1.5 h-8 bg-blue-600 rounded-full mr-6 group-hover:bg-white group-hover:h-12 transition-all duration-300"></div>

                <h4 className="text-lg font-bold text-slate-900 group-hover:text-white transition-colors duration-300 leading-tight">
                  {val.title}
                </h4>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link href="/about" className="inline-flex items-center gap-3 text-slate-900 font-bold tracking-widest uppercase text-[10px] hover:text-blue-600 transition-colors">
              Read our full maritime philosophy <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}