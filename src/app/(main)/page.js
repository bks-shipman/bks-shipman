'use client';

import { useEffect, useState, useRef } from 'react';
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
import { MotionWrapper, StaggerContainer } from '@/components/MotionWrapper';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/context/LanguageProvider';

const HERO_VIDEOS = [
  '/video/vid-1.mp4',
  '/video/vid-2.mp4',
  '/video/vid-3.mp4',
  '/video/vid-4.mp4',
  '/video/vid-5.mp4'
];


const fetcher = async () => {
  return await getLandingPage();
}
export default function Home() {
  const { lang } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef([]);

  useEffect(() => {
    HERO_VIDEOS.forEach((_, idx) => {
      const vid = videoRefs.current[idx];
      if (vid) {
        if (idx === currentVideoIndex) {
          vid.currentTime = 0;
          vid.play().catch((err) => console.log("Autoplay failed:", err));
        } else {
          vid.pause();
        }
      }
    });
  }, [currentVideoIndex]);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
  };

  const minSwipeDistance = 50;
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
  const careersCount = data?.careersCount || 0;

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

  // console.log(gallery);



  return (
    <div className="bg-white selection:bg-blue-600 selection:text-white w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-slate-950">
        {/* Background Video Slider */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          {/* Subtle dark overlay to make text pop */}
          <div className="absolute inset-0 bg-slate-950/75 z-10"></div>
          {HERO_VIDEOS.map((src, index) => (
            <video
              key={index}
              ref={(el) => { videoRefs.current[index] = el; }}
              src={src}
              autoPlay={index === 0}
              muted
              playsInline
              preload="auto"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${currentVideoIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              onEnded={handleVideoEnded}
            />
          ))}
        </div>

        {/* Decorative Background Blobs */}
        <div className="absolute top-0 right-0 w-[40vw] h-[50vh] bg-red-600/5 rounded-bl-full z-5 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-blue-800/5 rounded-full z-5 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl w-full pt-10 lg:pt-0">
            <MotionWrapper animation="slideInDown" duration={1} delay={0.2}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-left-4 duration-1000">
                <Zap className="w-3.5 h-3.5" /> {lang === "id" ? titleHero?.tag : titleHero?.tag_en}
              </div>
            </MotionWrapper>

            <MotionWrapper animation="slideInLeft" duration={1} delay={0.3}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 lg:mb-8 leading-[1.15]">
                {lang === "id" ? titleHero?.title : titleHero?.title_en} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">{lang === "id" ? titleHero?.title2 : titleHero?.title2_en}</span>
              </h1>
            </MotionWrapper>
            {/* 
            <MotionWrapper animation="slideInUp" duration={1} delay={0.5}>
              <p className="text-base w-full md:text-lg text-slate-300/90 mb-10 leading-relaxed font-light text-center lg:max-w-2xl mx-auto whitespace-pre-line">
                {lang === "id" ? titleHero?.subtitle : titleHero?.subtitle_en}
              </p>
            </MotionWrapper> */}

            <MotionWrapper animation="slideInUp" duration={1} delay={0.6}>
              <div className="flex flex-wrap gap-4 justify-center mb-12 lg:mb-16">
                {/* <Link href="/vessels">
                  <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-blue-600/20 flex items-center gap-2 cursor-pointer">
                    {lang === "id" ? "Jelajahi Armada" : "Explore Fleet"} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link> */}
                <Link href="/about" className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-full font-bold transition-all backdrop-blur-md cursor-pointer text-base">
                  {lang === "id" ? "Cerita Kami" : "Our Story"}
                </Link>
              </div>
            </MotionWrapper>

            {/* Data Statistik */}
            {/* <MotionWrapper animation="slideInUp" duration={1} delay={0.7}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-white mb-1">
                    <Counter end={vesselsCount} suffix="+" />
                  </div>
                  <div className="text-slate-300 text-[9px] uppercase tracking-widest font-bold">
                    {lang === "id" ? "Kapal Dikelola" : "Vessels Managed"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-white mb-1">
                    <Counter end={99.8} suffix="%" />
                  </div>
                  <div className="text-slate-300 text-[9px] uppercase tracking-widest font-bold">
                    {lang === "id" ? "Keandalan" : "Reliability"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-white mb-1">
                    <Counter end={exhibitionsCount} suffix="+" />
                  </div>
                  <div className="text-slate-300 text-[9px] uppercase tracking-widest font-bold">
                    {lang === "id" ? "Exhibition" : "Exhibitions"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-white mb-1">
                    <Counter end={careersCount} suffix="" />
                  </div>
                  <div className="text-slate-300 text-[9px] uppercase tracking-widest font-bold">
                    {lang === "id" ? "Lowongan" : "Job Openings"}
                  </div>
                </div>
              </div>
            </MotionWrapper> */}
          </div>
        </div>

        {/* Video Slider Dots Indicator */}
        <div className="absolute bottom-10 right-4 sm:right-8 lg:right-16 z-20 flex items-center gap-3">
          {HERO_VIDEOS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideoIndex(index)}
              className={`group relative h-2.5 rounded-full transition-all duration-500 cursor-pointer ${currentVideoIndex === index ? 'w-8 bg-blue-500' : 'w-2.5 bg-white/30 hover:bg-white/50'
                }`}
              aria-label={`Go to video ${index + 1}`}
            >
              {currentVideoIndex === index && (
                <span className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Services Section - Redesigned for Scalability (No Icons) */}
      {services && services.length > 0 && (
        <section className="py-32 relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-16 lg:mb-24 text-center max-w-3xl mx-auto">
              <MotionWrapper animation="slideInDown" duration={1} delay={0.3}>
                <h2 className="text-blue-600 font-bold tracking-[0.3em] uppercase mb-4 text-xs">{lang === "id" ? titleServices?.tag : titleServices?.tag_en}</h2>
              </MotionWrapper>
              <MotionWrapper animation="slideInUp" duration={1} delay={0.3}>
                <h3 className="text-2xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                  {lang === "id" ? titleServices?.title : titleServices?.title_en}
                </h3>
              </MotionWrapper>
              <MotionWrapper animation="slideInUp" duration={1} delay={0.4}>
                <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
                  {lang === "id" ? titleServices?.subtitle : titleServices?.subtitle_en}
                </p>
              </MotionWrapper>
            </div>

            <StaggerContainer className="grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((s, idx) => (
                <div key={idx} className="group p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                  {/* Top Bar Accent */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 group-hover:bg-blue-600 transition-colors duration-500" />

                  <div className="relative z-10 flex flex-col flex-grow">
                    <span className="inline-block self-start px-3 py-1 bg-slate-50 border border-slate-200 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg mb-6 group-hover:border-blue-600/30 group-hover:text-blue-600 transition-all">
                      service {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h4 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {lang === "id" ? s.title : s.title_en}
                    </h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-4">
                      {lang === "id" ? s.description : s.description_en}
                    </p>
                  </div>

                  <div className="relative z-10 mt-auto">
                    <Link href={`/services/${s.id}`}>
                      <button className="px-3 py-2 bg-blue-500 hover:bg-blue-400 text-white text-[10px] rounded-lg transition-all duration-300 cursor-pointer">
                        {lang === "id" ? "Temukan Lebih Banyak" : "Discover More"}
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )
      }

      {/* Vision/Mission Section - Restored with Icons */}
      {/* <section className="py-32 bg-slate-950 text-white relative">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-48 right-0 w-80 h-80 bg-cyan-400 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div>
                <MotionWrapper animation="slideInDown" duration={1} delay={0.3}>
                  <h2 className="text-blue-400 font-bold tracking-[0.3em] uppercase mb-6 text-xs">
                    {lang === "id" ? titleVM?.tag : titleVM?.tag_en}
                  </h2>
                </MotionWrapper>
                <MotionWrapper animation="slideInLeft" duration={1} delay={0.3}>
                  <h3 className="text-[30px] md:text-6xl font-serif font-bold leading-tight">
                    {lang === "id" ? titleVM?.title : titleVM?.title_en} <br />
                    <span className="italic text-slate-500">{lang === "id" ? titleVM?.title2 : titleVM?.title2_en}</span>
                  </h3>
                </MotionWrapper>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <MotionWrapper animation="scaleIn" duration={1} delay={0.3}>
                  <div className="group">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-8 group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                      <Eye className="w-7 h-7 text-cyan-400 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-2xl font-bold mb-4">{lang === "id" ? "Visi Kami" : "The Vision"}</h4>
                    {lang === "id" ?
                      <ReadMore
                        text={vision ? vision.description : ''}
                        wordLimit={45}
                        buttonColor="text-blue-400 hover:text-blue-300"
                      /> :
                      <ReadMore
                        text={vision ? vision.description_en : ''}
                        wordLimit={45}
                        buttonColor="text-blue-400 hover:text-blue-300"
                      />
                    }

                  </div>
                </MotionWrapper>
                <MotionWrapper animation="scaleIn" duration={1} delay={0.3}>
                  <div className="group">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                      <Target className="w-7 h-7 text-blue-400 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-2xl font-bold mb-4">{lang === "id" ? "Misi Kami" : "The Mission"}</h4>
                    {lang === "id" ?
                      <ReadMore
                        text={mission ? mission.description : ''}
                        wordLimit={45}
                        buttonColor="text-blue-400 hover:text-blue-300"
                      /> :
                      <ReadMore
                        text={mission ? mission.description_en : ''}
                        wordLimit={45}
                        buttonColor="text-blue-400 hover:text-blue-300"
                      />
                    }
                  </div>
                </MotionWrapper>

              </div>
            </div>
            {captain && (
              <div className="relative pb-30">
                <MotionWrapper animation="flipIn" duration={1} delay={0.3}>
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
                </MotionWrapper>
                <MotionWrapper animation="rotateIn" duration={1} delay={0.3}>
                  <div className="absolute -left-4 -bottom-8 md:-bottom-10 md:-left-10 bg-white p-6 md:p-12 rounded-4xl shadow-2xl max-w-2xs md:max-w-md lg:max-w-lg">
                    <p className="text-slate-900 font-serif font-bold text-base md:text-lg lg:text-2xl mb-4 italic leading-tight">"{lang === "id" ? captain?.quote : captain?.quote_en}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">CEO</div>
                      <div>
                        <p className="text-slate-900 font-bold text-sm tracking-tight">{captain?.name}</p>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Chief Executive Officer</p>
                      </div>
                    </div>
                  </div>
                </MotionWrapper>
              </div>
            )}
          </div>
        </div>
      </section> */}

      {/* Gallery Section */}
      {gallery && gallery.length > 2 && (
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <MotionWrapper animation="slideInDown" duration={1} delay={0.3}>
                <h2 className="text-blue-600 font-bold tracking-[0.3em] uppercase mb-4 text-xs">{lang === "id" ? titleGallery?.tag : titleGallery?.tag_en}</h2>
              </MotionWrapper>
              <MotionWrapper animation="slideInDown" duration={1} delay={0.3}>
                <h3 className="text-2xl md:text-5xl font-serif font-bold text-slate-900">{lang === "id" ? titleGallery?.title : titleGallery?.title_en}</h3>
              </MotionWrapper>
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
                <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center">
                  <Image
                    fill // Biarkan Next.js yang menghitung dimensinya
                    src={gallery[selectedImage]?.photo}
                    alt={gallery[selectedImage]?.name}
                    // Gunakan object-contain agar gambar UTUH 100% tidak ada yang dipotong
                    className="object-contain pointer-events-none drop-shadow-2xl rounded-xl"
                    priority
                  />

                  {/* Indikator Angka */}
                  <div className="absolute top-0 right-4 md:right-0 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-white/80 text-[10px] font-black tracking-widest z-10">
                    {selectedImage + 1} / {gallery.length}
                  </div>
                </div>

                {/* Caption Teks */}
                <div className="mt-8 text-center max-w-2xl px-4 pointer-events-none">
                  <h2 className="text-white text-3xl md:text-4xl font-serif font-bold mb-4 tracking-tight leading-tight">
                    <Link
                      href={`/${gallery[selectedImage]?.type}s`}
                      className="hover:underline pointer-events-auto cursor-pointer"
                    >
                      {gallery[selectedImage]?.name}
                    </Link>
                  </h2>
                  <div className="h-1.5 w-16 bg-blue-600 mx-auto rounded-full shadow-lg shadow-blue-600/50"></div>
                </div>

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

      {/* Core Values Section - Scalable and Icon-Free */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <MotionWrapper animation="slideInDown" duration={1} delay={0.3}>
              <h2 className="text-blue-600 font-bold tracking-[0.3em] uppercase mb-4 text-xs">{lang === "id" ? titleCoreValues?.tag : titleCoreValues?.tag_en}</h2>
            </MotionWrapper>
            <MotionWrapper animation="slideInDown" duration={1} delay={0.3}>
              <h3 className="text-2xl md:text-5xl font-serif font-bold text-slate-900 mb-6">{lang === "id" ? titleCoreValues?.title : titleCoreValues?.title_en}</h3>
            </MotionWrapper>
            <MotionWrapper animation="slideInDown" duration={1} delay={0.3}>
              <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
                {lang === "id" ? titleCoreValues?.subtitle : titleCoreValues?.subtitle_en}
              </p>
            </MotionWrapper>
          </div>

          <StaggerContainer className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-center'>
            {coreValues?.map((val, i) => (
              <div
                key={i}
                className="bg-white p-8 group border border-slate-100 rounded-2xl hover:bg-blue-600 transition-all duration-300 flex items-center shadow-sm hover:shadow-xl hover:shadow-blue-600/20"
              >
                {/* Visual Accent (Left Border) */}
                <div className="w-1.5 h-8 bg-blue-600 rounded-full mr-6 group-hover:bg-white group-hover:h-12 transition-all duration-300"></div>

                <h4 className="text-lg font-bold text-slate-900 group-hover:text-white transition-colors duration-300 leading-tight">
                  {lang === "id" ? val.title : val.title_en}
                </h4>
              </div>
            ))}
          </StaggerContainer>

          <div className="mt-20 text-center">
            <Link href="/about" className="inline-flex items-center gap-3 text-slate-900 font-bold tracking-widest uppercase text-[10px] hover:text-blue-600 transition-colors">
              {lang === "id" ? "Baca filosofi maritim kami selengkapnya." : "Read our full maritime philosophy"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}