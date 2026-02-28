'use client';

import Hero from '@/components/Hero';
import Image from 'next/image';
import { getAboutPage } from '@/utils/api/aboutPage';
import useSWR from 'swr';
import Loading from '@/components/Loading';
import { MotionWrapper } from '@/components/MotionWrapper';

const fetcher = async () => {
    return await getAboutPage();
};

export default function About() {

    const { data, error, isLoading } = useSWR(
        'about-page',
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    const titleAboutUs = data?.titles;
    const aboutUs = data?.aboutUs;

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
        <div className="pb-20 bg-white">
            <Hero
                title={titleAboutUs?.title}
                subtitle={titleAboutUs?.subtitle}
                imageUrl="https://bks-shipman.com/images/576/22219807/crew-Mtf7_GJIQLNzvsJu_HJ0jA.jpg"
            />

            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 font-poppins">
                    <div>
                        <MotionWrapper animation="slideInUp" duration={1} delay={0.3}>
                            <h2 className="text-blue-600 text-2xl font-bold uppercase mb-4">
                                About BKS SHIPMAN
                            </h2>
                        </MotionWrapper>

                        <div className="space-y-6 text-slate-600">
                            <MotionWrapper animation="slideInUp" duration={1} delay={0.3}>
                                <p className='text-lg'>{aboutUs?.description}</p>
                            </MotionWrapper>
                        </div>
                    </div>

                    <div className="relative">
                        <Image
                            src="/logo.png"
                            width={800}
                            height={500}
                            className="rounded-2xl shadow-2xl object-cover"
                            alt="about us"
                        />

                        {/* <div className="absolute bottom-10 -left-10 bg-white p-8 rounded-2xl shadow-xl max-w-xs">
                            <span className="block text-4xl font-bold text-blue-600 mb-1">
                                25+
                            </span>
                            <span className="text-slate-600 font-medium">
                                Years of Excellence
                            </span>
                        </div> */}
                    </div>
                </div>
            </section>

            {/* <section className="bg-slate-900 py-24 text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-6xl font-serif font-bold text-blue-400 mb-2">
                                200+
                            </div>
                            <div className="text-slate-400 uppercase text-sm">
                                Vessels Managed
                            </div>
                        </div>
                        <div>
                            <div className="text-6xl font-serif font-bold text-blue-400 mb-2">
                                4,500+
                            </div>
                            <div className="text-slate-400 uppercase text-sm">
                                Seafarers
                            </div>
                        </div>
                        <div>
                            <div className="text-6xl font-serif font-bold text-blue-400 mb-2">
                                45
                            </div>
                            <div className="text-slate-400 uppercase text-sm">
                                Nationalities
                            </div>
                        </div>
                        <div>
                            <div className="text-6xl font-serif font-bold text-blue-400 mb-2">
                                0
                            </div>
                            <div className="text-slate-400 uppercase text-sm">
                                Major Incidents
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
        </div>
    );
}
