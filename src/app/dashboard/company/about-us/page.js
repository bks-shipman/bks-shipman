"use client";

import React, { use, useState } from 'react'
import { deleteUser, getUsersData, suspendUsers } from '@/utils/api/dashboard/users';
import useSWR from 'swr';
import CreateView from '@/components/dashboard/users/CreateView';
import { File, Info, List, UserPlus } from 'lucide-react';
import { Button, Group, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { nprogress } from '@mantine/nprogress';
import { modals } from '@mantine/modals';
import UserModal from '@/components/dashboard/users/UserModal';
import SuspendModal from '@/components/dashboard/users/SuspendModal';
import Loading from '@/components/Loading';
import AboutUs from '@/components/dashboard/about-us/AboutUs';
import TableView from '@/components/dashboard/certificates/TableView';

export default function About() {
    const [view, setView] = useState("about");

    return (
        <div className="w-full space-y-8 md:space-y-10">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-end gap-6 mb-8 lg:mb-12">

                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-full md:w-fit">
                    <button
                        onClick={() => setView('about')}
                        className={`cursor-pointer flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'about' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-900'
                            }`}
                    >
                        <Info className="w-4 h-4" /> About Us
                    </button>
                    <button
                        onClick={() => setView('certificate')}
                        className={`cursor-pointer flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'certificate' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-900'
                            }`}
                    >
                        <File className="w-4 h-4" /> Certificates
                    </button>
                </div>
            </header>

            {/* Dynamic Content */}
            <>
                {view === "about" &&
                    <div className="max-w-6xl mx-auto pb-12">
                        <AboutUs />
                    </div>
                }
                {view === "certificate" && (
                    <div className="max-w-6xl mx-auto pb-12">
                        <TableView />
                    </div>
                )}
            </>

        </div>
    );
}
