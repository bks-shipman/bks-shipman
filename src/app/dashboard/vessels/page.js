"use client";

import TableView from '@/components/dashboard/vessels/TableView';
import Loading from '@/components/Loading';
import { deleteVessels, getVesselsData } from '@/utils/api/dashboard/vessels';
// Import fungsi API Page Config dan axiosInstance
import { getPageStatus, updatePageVisibility } from '@/utils/api/dashboard/pageConfig';
import axiosInstance from '@/utils/axios';

import { Text, Switch, Group, Paper } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { nprogress } from '@mantine/nprogress';
import useSWR from 'swr';
import VesselModal from "@/components/dashboard/vessels/VesselModal";
import { useState } from "react";
import { Anchor, Eye, EyeOff } from 'lucide-react';
import { getUser } from '@/utils/auth';

// Fetcher Utama Data Vessel
const fetcher = async () => {
    return await getVesselsData();
};

// Fetcher Config menggunakan axiosInstance agar Auth token otomatis terbawa
const configFetcher = async () => {
    return await getPageStatus("VESSELS")
};

export default function Vessels() {
    const [opened, setOpened] = useState(false);
    const [selectedVessel, setSelectedVessel] = useState(null);
    const user = getUser();
    const isAdmin = user?.role === "ADMIN";

    // 1. SWR untuk Data Vessels
    const { data, error, isLoading, mutate } = useSWR('vessels', fetcher);

    // 2. SWR untuk Config Visibility
    const { data: config, mutate: mutateConfig } = useSWR(
        'page-status/VESSELS',
        configFetcher
    );

    // Fungsi Toggle Visibility
    const handleToggleVisibility = async (val) => {
        try {
            nprogress.start();

            // Gunakan fungsi API yang sudah dibuat (Otomatis panggil axiosInstance.patch)
            await updatePageVisibility('VESSELS', val);

            notifications.show({
                title: "Berhasil",
                message: `Halaman Vessels sekarang ${val ? 'Aktif (Muncul)' : 'Nonaktif (Tersembunyi)'}`,
                color: "green",
            });

            await mutateConfig();
        } catch (err) {
            notifications.show({
                title: "Gagal",
                message: "Gagal memperbarui status visibilitas",
                color: "red",
            });
        } finally {
            nprogress.complete();
        }
    };

    // Handler CRUD
    const handleCreate = () => {
        setSelectedVessel(null);
        setOpened(true);
    };

    const handleEdit = (vessel) => {
        setSelectedVessel(vessel);
        setOpened(true);
    };

    const openDeleteConfirm = (ids) => {
        modals.openConfirmModal({
            title: "Konfirmasi Hapus",
            centered: true,
            children: (
                <Text size="sm">
                    Apakah kamu yakin ingin menghapus{" "}
                    <strong>{Array.isArray(ids) ? `${ids.length} data` : "data ini"}</strong>?
                </Text>
            ),
            labels: { confirm: "Ya", cancel: "Tidak" },
            confirmProps: { color: "red" },
            onConfirm: () => handleDeleteMany(ids),
        });
    };

    const handleDeleteMany = async (ids) => {
        try {
            nprogress.start();
            const idArray = Array.isArray(ids) ? ids : [ids];
            const res = await deleteVessels(idArray);
            notifications.show({
                title: "Berhasil",
                message: res?.message || "Data dihapus",
                color: "green",
            });
        } catch (err) {
            notifications.show({
                title: "Gagal",
                message: "Terjadi kesalahan saat menghapus",
                color: "red",
            });
        } finally {
            nprogress.complete();
            await mutate();
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className="w-full space-y-8 md:space-y-10">
            {/* --- Visibility Toggle Card --- */}
            {isAdmin && (
                <Paper withBorder p="md" radius="xl" className="bg-blue-50/30 border-blue-100 dark:bg-slate-900/50 dark:border-slate-800 shadow-sm">
                    <Group justify="space-between">
                        <Group>
                            <div className={`p-3 rounded-2xl transition-colors ${config?.isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                                {config?.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                            </div>
                            <div>
                                <Text fw={800} size="sm" className="tracking-tight text-slate-900 dark:text-white">Landing Page Visibility</Text>
                                <Text size="xs" className="text-slate-500">Kontrol menu Fleet di website utama.</Text>
                            </div>
                        </Group>
                        <Switch
                            size="lg"
                            color="blue"
                            onLabel="ON"
                            offLabel="OFF"
                            checked={config?.isActive ?? true}
                            onChange={(event) => handleToggleVisibility(event.currentTarget.checked)}
                            className="cursor-pointer"
                        />
                    </Group>
                </Paper>
            )}

            {/* Header Content */}
            <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Vessels Management
                    </h1>
                    <p className="text-slate-500 text-sm">Update and manage your fleet inventory.</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xl shadow-blue-200 dark:shadow-none cursor-pointer"
                    >
                        <Anchor className="w-4 h-4" /> Add Vessel
                    </button>
                )}
            </header>

            <div className="max-w-7xl mx-auto pb-12">
                <TableView
                    vessels={data?.vessels}
                    onDeleteMany={openDeleteConfirm}
                    onEdit={handleEdit}
                    isAdmin={user?.role}
                />
            </div>

            <VesselModal
                opened={opened}
                onClose={() => setOpened(false)}
                vessel={selectedVessel}
                types={data?.types}
                onSuccess={mutate}
            />
        </div>
    );
}