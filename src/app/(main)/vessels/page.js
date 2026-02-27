'use client';

import { useState, useMemo, useEffect } from 'react';
import Hero from '@/components/Hero';
import { VESSELS } from '@/lib/constants';
import { Search, Filter, X, ArrowRight, Anchor, Activity, Info, Users, Box, Ship, Calendar } from 'lucide-react';
import { getVesselPage } from '@/utils/api/vesselPage';
import useSWR from 'swr';
import Image from 'next/image';

const fetcher = async () => {
    return await getVesselPage();
}

export default function Vessels() {

    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVessel, setSelectedVessel] = useState(null);

    const { data, error, isLoading } = useSWR(
        'vessel-page',
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    console.log(data);


    const titleVessel = data?.titles;
    const vessels = data?.vessels;
    const vesselTypes = useMemo(() => {
        if (!vessels) return [];

        const types = vessels.map(v => v?.vesselType?.name);

        const uniqueTypes = [...new Set(types)];

        return ["All", ...uniqueTypes];
    }, [vessels]);

    const filteredVessels = useMemo(() => {
        return vessels?.filter(v => {
            const matchesType = filter === 'All' || v?.vesselType?.name === filter;
            const matchesSearch = v?.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [filter, searchTerm, vessels]);

    console.log(filter);

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
        <div className="pb-24 bg-slate-50/50">
            <Hero
                title={titleVessel?.title}
                subtitle={titleVessel?.subtitle}
                imageUrl="https://bks-SHIPMAN.com/images/960/22219804/FotoKapalRosaXVIII-2-NHgPrIzXBoxroGxGJTHupw.jpg"
            />

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {/* Command Bar: Filter & Search */}
                <div className="bg-white border border-slate-200 rounded-4xl p-4 md:p-6 mb-16 shadow-xl shadow-slate-200/50">
                    <div className="flex flex-col lg:flex-row gap-6 items-center">

                        {/* Search Input */}
                        <div className="relative w-full lg:w-96 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search fleet by name..."
                                className="w-full pl-14 pr-12 py-4 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-600/20 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-slate-500" />
                                </button>
                            )}
                        </div>

                        {/* Type Filters */}
                        <div className="flex flex-wrap gap-2 items-center flex-grow justify-center lg:justify-start">
                            <div className="hidden sm:flex items-center gap-2 text-slate-400 mr-2 font-bold text-[10px] uppercase tracking-[0.2em]">
                                <Filter className="w-3 h-3" /> Filter By
                            </div>
                            {vesselTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer duration-300 ${filter === type
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                                        : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-300 hover:text-slate-900'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Header */}
                <div className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="flex flex-col sm:flex-row md:items-center text-sm font-bold uppercase tracking-[0.3em]">
                        <span className="text-slate-400">
                            Fleet Directory
                        </span>

                        <span className="hidden sm:inline mx-2 text-slate-200">
                            |
                        </span>

                        <span className="text-slate-900">
                            {filteredVessels.length} Vessels Found
                        </span>
                    </h2>
                    {searchTerm && (
                        <div className="px-4 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                            Filtering for: "{searchTerm}"
                        </div>
                    )}
                </div>

                {/* Vessel Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredVessels.map((vessel) => (
                        <div key={vessel.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-700">
                            {/* Image Container */}
                            <div className="relative h-80 overflow-hidden cursor-pointer" onClick={() => setSelectedVessel(vessel)}>
                                <Image
                                    src={vessel?.photo || null}
                                    alt={vessel?.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                                    width={600}
                                    height={400}
                                />

                                {/* Modern Glass Label */}
                                <div className="absolute top-6 left-6 px-5 py-2.5 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.15em] shadow-xl">
                                    {vessel?.vesselType?.name}
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                                    <div className="flex items-center gap-3 text-white/80 text-xs font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <Anchor className="w-4 h-4 text-blue-400" /> IMO Registered
                                    </div>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-3xl font-serif font-bold text-slate-950 group-hover:text-blue-600 transition-colors duration-300">
                                        {vessel.name}
                                    </h3>
                                    {/* <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 uppercase tracking-tighter">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                                    </div> */}
                                </div>

                                <p className="text-slate-500 leading-relaxed mb-8 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                    {vessel.description}
                                </p>

                                <div className="pt-8 border-t border-slate-100 flex justify-between items-end">
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setSelectedVessel(vessel)}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 group/btn cursor-pointer"
                                        >
                                            <Info className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" /> View Specifications
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => setSelectedVessel(vessel)}
                                        className="relative h-14 w-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-600/30 cursor-pointer"
                                    >
                                        <ArrowRight className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1 group-hover:-rotate-12" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Vessel Details Modal */}
                {selectedVessel && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="bg-white rounded-[3rem] animate-in zoom-in-95 duration-500 relative max-w-5xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row h-auto max-h-[90vh]">

                            {/* Photo Section */}
                            <div className="md:w-1/2 relative min-h-[300px] md:h-auto">
                                <img
                                    src={selectedVessel.photo}
                                    alt={selectedVessel.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-10 left-10">
                                    <div className="px-4 py-2 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-xl inline-block">
                                        {selectedVessel.vesselType.name}
                                    </div>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="md:w-1/2 p-10 md:p-16 overflow-y-auto">
                                <button
                                    onClick={() => setSelectedVessel(null)}
                                    className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-full transition-all group z-10 cursor-pointer"
                                >
                                    <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
                                </button>

                                <div className="space-y-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Vessel Profile</span>
                                        </div>
                                        <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6 text-slate-950 leading-tight">
                                            {selectedVessel.name}
                                        </h2>
                                        <p className="text-slate-500 text-lg leading-relaxed font-light">
                                            {selectedVessel.description}
                                        </p>
                                    </div>

                                    {/* The technical specs requested: Built, IMO, Country */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-10 border-t border-b border-slate-100">
                                        <div className="space-y-2">
                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Year Built</span>
                                            <span className="text-xl font-bold text-slate-900">{selectedVessel.year}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">IMO Number</span>
                                            <span className="text-xl font-bold text-slate-900">{selectedVessel.imo}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Country</span>
                                            <span className="text-xl font-bold text-slate-900">{selectedVessel.country}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredVessels.length === 0 && (
                    <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
                        <div className="max-w-md mx-auto px-6">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                                <Search className="w-10 h-10" />
                            </div>
                            <h4 className="text-3xl font-serif font-bold text-slate-950 mb-4">Vessel Not Found</h4>
                            <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                                Our fleet radar couldn't locate "{searchTerm}". Please refine your search terms or select a different category.
                            </p>
                            <button
                                onClick={() => { setFilter('All'); setSearchTerm(''); }}
                                className="px-10 py-4 bg-slate-950 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-600 transition-all active:scale-95 cursor-pointer"
                            >
                                Clear All Search Parameters
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}