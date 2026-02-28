"use client";

import React, { useState } from 'react'

import { Eye, List, Target, UserPlus } from 'lucide-react';

import Vision from '@/components/dashboard/vision-mission/Vision';
import Mission from '@/components/dashboard/vision-mission/Mission';
import { getUser } from '@/utils/auth';

export default function Users() {
    const [view, setView] = useState("vision");
    const user = getUser();

    return (
        <div className="w-full space-y-8 md:space-y-10">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 lg:mb-12">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2 dark:text-slate-100">Company Vision & Mission</h1>
                    <p className="text-slate-500 text-sm md:text-base">
                        Define the company's core purpose, aspirations, and guiding principles.
                    </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex bg-white  p-1.5 rounded-2xl border border-slate-100 shadow-sm w-full md:w-fit">
                    <button
                        onClick={() => setView('vision')}
                        className={`cursor-pointer flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'vision' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-900'
                            }`}
                    >
                        <Eye className="w-4 h-4" /> Vision
                    </button>
                    <button
                        onClick={() => setView('mission')}
                        className={`cursor-pointer flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'mission' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-900'
                            }`}
                    >
                        <Target className="w-4 h-4" /> Mission
                    </button>
                </div>
            </header>

            {/* Dynamic Content */}
            {view === "vision" &&
                <Vision role={user?.role} />
            }
            {view === "mission" && (
                <Mission role={user?.role} />
            )}
        </div>
    );
}
