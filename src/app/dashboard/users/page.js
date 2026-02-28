"use client";

import React, { useState } from 'react'
import { deleteUser, getUsersData, suspendUsers } from '@/utils/api/dashboard/users';
import useSWR from 'swr';
import CreateView from '@/components/dashboard/users/CreateView';
import TableView from '@/components/dashboard/users/TableView';
import { List, UserPlus } from 'lucide-react';
import { Button, Group, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { nprogress } from '@mantine/nprogress';
import { modals } from '@mantine/modals';
import UserModal from '@/components/dashboard/users/UserModal';
import SuspendModal from '@/components/dashboard/users/SuspendModal';
import Loading from '@/components/Loading';

const fetcher = async () => {
    return await getUsersData();
};
export default function Users() {
    const [view, setView] = useState("add");
    const [modalOpened, setModalOpened] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [suspendModalOpen, setSuspendModalOpen] = useState(false);
    const [userToSuspend, setUserToSuspend] = useState(null);
    const { data, error, isLoading, mutate } = useSWR(
        'users',
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

    const openSuspendConfirm = (user) => {
        setUserToSuspend(user);
        setSuspendModalOpen(true);
    };

    const handleSuspend = async (id, password) => {
        try {
            nprogress.start();

            const res = await suspendUsers(id, {
                password: password,
            });

            notifications.show({
                title: "Berhasil",
                message: res?.message || "Berhasil mengubah status user",
                color: "green",
            });

            await mutate();
        } catch (err) {
            notifications.show({
                title: "Gagal",
                message:
                    err?.response?.data?.message ||
                    "Terjadi kesalahan",
                color: "red",
            });
        } finally {
            nprogress.complete();
        }
    };

    const handleDeleteMany = async (ids) => {
        try {
            const idArray = Array.isArray(ids) ? ids : [ids];

            const res = await deleteUser(idArray); // simpan response
            nprogress.start()
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
    console.log(selectedUser);



    const handleEdit = (user) => {
        setSelectedUser(user);
        setModalOpened(true);
    };


    return (
        <div className="w-full space-y-8 md:space-y-10">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 lg:mb-12">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2 dark:text-slate-100">User Access Control</h1>
                    <p className="text-slate-500 text-sm md:text-base">Manage internal staff accounts and access levels.</p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-full md:w-fit">
                    <button
                        onClick={() => setView('add')}
                        className={`cursor-pointer flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'add' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-900'
                            }`}
                    >
                        <UserPlus className="w-4 h-4" /> Add User
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`cursor-pointer flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-900'
                            }`}
                    >
                        <List className="w-4 h-4" /> View List
                    </button>
                </div>
            </header>

            {/* Dynamic Content */}
            {view === "list" &&
                <div className="max-w-6xl mx-auto pb-12">
                    <TableView users={data} onSuspend={openSuspendConfirm} onDeleteMany={openDeleteConfirm} />
                </div>
            }
            {view === "add" && (
                <div className="max-w-4xl mx-auto pb-12">
                    <CreateView onSuccess={async () => {
                        await mutate();
                        setView("list");
                    }} />
                </div>
            )}
            <UserModal
                opened={modalOpened}
                onClose={() => {
                    setModalOpened(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                onSuccess={async () => {
                    await mutate();
                }}
            />
            <SuspendModal
                opened={suspendModalOpen}
                onClose={() => {
                    setSuspendModalOpen(false);
                    setSelectedUser(null);
                }}
                user={userToSuspend}
                onSuspend={handleSuspend}
                onSuccess={async () => {
                    await mutate();
                }}
            />
        </div>
    );
}
