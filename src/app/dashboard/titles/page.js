"use client";


import Loading from '@/components/Loading';
import { Text, Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { nprogress } from '@mantine/nprogress';
import useSWR from 'swr';
import { useState } from "react";
import { Captions, UserPlus } from 'lucide-react';
import { deleteCareer, getCareer } from '@/utils/api/dashboard/careers';
import { deleteTitle, getTitle } from '@/utils/api/dashboard/titles';
import TableView from '@/components/dashboard/titles/TableView';
import TitleModal from '@/components/dashboard/titles/TitleModal';

const fetcher = async () => {
    return await getTitle();
};
export default function Titles() {
    const [opened, setOpened] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const allSections = [
        "HERO",
        "SERVICES",
        "VM",
        "GALLERY",
        "COREVALUES",
        "ABOUTUS",
        "VESSELS",
        "EXHIBITIONS",
        "CAREERS",
    ];
    const { data, error, isLoading, mutate } = useSWR(
        'titles',
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

    const usedTypes = data?.map((item) => item.type) || [];

    const isAllSectionUsed =
        allSections.every((section) => usedTypes.includes(section));

    const handleCreate = () => {
        setSelectedTitle(null);
        setOpened(true);
    };

    const handleEdit = (title) => {
        setSelectedTitle(title);
        setOpened(true);
    };
    console.log(data);


    const openDeleteConfirm = (ids) => {
        modals.openConfirmModal({
            title: "Konfirmasi Hapus",
            centered: true,
            children: (
                <Text size="sm">
                    Apakah kamu yakin ingin menghapus{" "}
                    <strong>
                        {Array.isArray(ids) ? `${ids.length} data terpilih` : "data ini"}
                    </strong>
                    ?
                </Text>
            ),
            labels: { confirm: "Ya", cancel: "Tidak" },
            confirmProps: { color: "red" },
            onConfirm: () => handleDeleteMany(ids),
        });
    };

    const handleDeleteMany = async (ids) => {
        try {
            nprogress.start()
            const idArray = Array.isArray(ids) ? ids : [ids];

            const res = await deleteTitle(idArray); // simpan response
            notifications.show({
                title: "Berhasil",
                message: res?.message || "Berhasil menghapus data",
                color: "green",
            });

        } catch (err) {
            console.log(err);

            notifications.show({
                title: "Gagal",
                message:
                    err?.response?.data?.message ||
                    "Terjadi Kesalahan Saat Menghapus Data",
                color: "red",
            });
        } finally {
            nprogress.complete()
            await mutate();
        }
    };

    // ================= STATES =================
    if (isLoading) return <Loading />;

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 font-bold">Failed to load data.</p>
            </div>
        );
    }
    return (
        <div className="w-full space-y-8 md:space-y-10">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 lg:mb-12">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2 dark:text-slate-100">
                        Titles Management
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base">Manage the titles for each section in the website.</p>
                </div>
                <button
                    onClick={handleCreate}
                    disabled={isAllSectionUsed}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all 
                        ${isAllSectionUsed
                            ? "opacity-0"
                            : "bg-blue-600 hover:bg-blue-700 opacity-100 text-white shadow-lg shadow-blue-200"
                        }`}
                >
                    <Captions className="w-4 h-4" /> Add Title
                </button>
            </header>
            <div className="max-w-6xl mx-auto pb-12">
                <TableView
                    titles={data}
                    onDeleteMany={openDeleteConfirm}
                    onEdit={handleEdit}
                />
            </div>
            <TitleModal
                opened={opened}
                onClose={() => setOpened(false)}
                title={selectedTitle}
                onSuccess={mutate}
                existingTypes={usedTypes}
            />
        </div>
    )
}
