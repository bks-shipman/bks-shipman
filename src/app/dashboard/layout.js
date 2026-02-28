"use client"
import { AppShell, Loader } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'
import Sidebar from '@/components/dashboard/Sidebar'
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import Head from "next/head";
import { usePathname } from 'next/navigation'
import { useAuthGuard } from '@/hooks/useAuthGuard'
// import { useAuth } from "@/utils/useAuth";

export default function Dashboard({ children, title }) {
    const authorized = useAuthGuard();

    const [opened, { toggle }] = useDisclosure();
    const pathname = usePathname();

    if (!authorized) return null;
    // const { user, loading } = useAuth("admin");

    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             <Loader color="red" />
    //         </div>
    //     );
    // }

    console.log(opened);


    const pageTitle = {
        "/dashboard": "Dashboard",
        "/dashboard/company": "Company",
        "/dashboard/users": "User",
        // "/admin/driver": "Driver",
        // "/admin/sij": "Surat Izin Jalan",
        // "/admin/order": "Riwayat Ritase",
    }[pathname] || "BKS SHIPMAN";
    return (
        <AppShell
            padding="md"
            withBorder={false}
            transitionDuration={400}
            navbar={{
                width: 256,
                breakpoint: "sm",
                collapsed: { mobile: !opened, desktop: opened },
            }}
        >

            <AppShell.Navbar
                // transitionDuration={"2000ms"}
                visibleFrom="sm"
                withBorder={false}

            >
                <Sidebar />
            </AppShell.Navbar>

            <AppShell.Main className="bg-slate-100 dark:bg-[#0b0f1a] p-6">
                <Head title={pageTitle} />
                <div className="w-full h-16 bg-white dark:bg-[#161b2b] dark:border-amber-50 rounded-xl !shadow-normal flex justify-between items-center mb-5 transition duration-200 py-4">
                    <DashboardNavbar
                        toggle={toggle}
                        opened={opened}
                    />
                </div>
                {/* <h1 className="text-xl font-medium mb-5">{pageTitle}</h1> */}
                <div className='overflow-auto'>
                    {children}
                </div>
            </AppShell.Main>
        </AppShell>
    )
}
