"use client";
import React from 'react'
import useSWR from 'swr';
import { getDashboardPage } from '@/utils/api/dashboard/dashboard';
import { Ship, Users, Briefcase, Globe, AlertCircle } from 'lucide-react';
import Loading from '@/components/Loading';

const fetcher = async () => {
    return await getDashboardPage();
};
export default function Dashboard() {
    const { data, error, isLoading } = useSWR(
        'dashboard',
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );
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
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2 dark:text-slate-100">Operational Command</h1>
                    <p className="text-slate-500">Global fleet and enterprise status summary.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
                {[
                    { label: 'Total Vessels', value: data?.vesselsCount || 0, icon: Ship, color: 'text-blue-600' },
                    { label: 'Total Admins', value: data?.usersCount || 0, icon: Users, color: 'text-cyan-600' },
                    { label: 'Job Openings', value: data?.careersCount || 0, icon: Briefcase, color: 'text-green-600' },
                    { label: 'Exhibitions', value: data?.exhibitionsCounts || 0, icon: Globe, color: 'text-purple-600' },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white dark:bg-[#161b2b] p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 dark:shadow-slate-300 shadow-sm hover:shadow-xl dark:hover:shadow-md transition-all">
                            <Icon className={`w-8 h-8 ${stat.color} mb-6`} />
                            <span className="block text-[10px] font-black text-slate-700 dark:text-slate-100 uppercase tracking-widest mb-2">{stat.label}</span>
                            <span className="text-4xl font-bold text-slate-900 dark:text-slate-300 tracking-tight">{stat.value}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
