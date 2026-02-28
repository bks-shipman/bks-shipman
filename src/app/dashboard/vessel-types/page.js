"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Edit2, Trash2, Check, X, Anchor, Plus } from "lucide-react";
import { useForm } from "@mantine/form";
import { TextInput, Button, Box, Text } from "@mantine/core";
import {
    getVesselTypeData,
    createVesselType,
    updateVesselTypes,
    deleteVesselTypes,
} from "@/utils/api/dashboard/vesselTypes";
import Loading from "@/components/Loading";
import { nprogress } from "@mantine/nprogress";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { getUser } from "@/utils/auth";

const fetcher = async () => {
    return await getVesselTypeData();
};

export default function VesselTypes() {
    const user = getUser();
    const { data, error, isLoading, mutate } = useSWR(
        "vessel-types",
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    const [editingId, setEditingId] = useState(null);
    const [editingValue, setEditingValue] = useState("");
    const [editError, setEditError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const isEditing = editingId !== null;

    const form = useForm({
        initialValues: {
            name: "",
        },
        validate: {
            name: (v) => (!v ? "Tipe wajib diisi" : null),
        },
    });

    // ================= CREATE =================
    const handleAddType = async (values) => {
        try {
            setActionLoading(true);
            nprogress.start();

            await createVesselType({
                name: values.name,
            });

            notifications.show({
                title: "Berhasil",
                message: "Vessel type berhasil ditambahkan.",
                color: "green",
            });

            form.reset();
            mutate();
        } catch (err) {
            notifications.show({
                title: "Gagal",
                message: err.response?.data?.message || "Terjadi kesalahan.",
                color: "red",
            });
        } finally {
            setActionLoading(false);
            nprogress.complete();
        }
    };

    // ================= EDIT =================
    const startEditing = (vesselType) => {
        setEditingId(vesselType.id);
        setEditingValue(vesselType.name);
        setEditError("");
    };

    const saveEdit = async () => {
        if (!editingValue.trim()) {
            setEditError("Nama tidak boleh kosong");
            return;
        }

        try {
            setActionLoading(true);
            nprogress.start();

            await updateVesselTypes(editingId, {
                name: editingValue,
            });

            notifications.show({
                title: "Data Diperbarui",
                message: "Vessel type berhasil diperbarui.",
                color: "green",
            });

            setEditingId(null);
            setEditingValue("");
            setEditError("");
            mutate();
        } catch (err) {
            notifications.show({
                title: "Gagal Update",
                message: err.response?.data?.message || "Terjadi kesalahan.",
                color: "red",
            });
        } finally {
            setActionLoading(false);
            nprogress.complete();
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingValue("");
        setEditError("");
    };

    const openDeleteConfirm = (id, name) => {
        modals.openConfirmModal({
            title: "Konfirmasi Hapus",
            centered: true,
            children: (
                <Text size="sm">
                    Apakah kamu yakin ingin menghapus{" "}
                    <strong>
                        {`${name}`}
                    </strong>
                    ?
                </Text>
            ),
            labels: { confirm: "Ya", cancel: "Tidak" },
            confirmProps: { color: "red" },
            onConfirm: () => handleDelete(id),
        });
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        try {
            setActionLoading(true);
            nprogress.start();

            await deleteVesselTypes(id);

            notifications.show({
                title: "Data Dihapus",
                message: "Vessel type berhasil dihapus.",
                color: "green",
            });

            mutate();
        } catch (err) {
            notifications.show({
                title: "Gagal Hapus",
                message: err.response?.data?.message || "Terjadi kesalahan.",
                color: "red",
            });
        } finally {
            setActionLoading(false);
            nprogress.complete();
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
            <header>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2 dark:text-slate-100">
                    Vessel Classifications
                </h1>
                <p className="text-slate-500 text-sm md:text-base">
                    Manage and refine the standardized categories for your fleet assets.
                </p>
            </header>

            <div className="bg-white dark:bg-[#161b2b] dark:border-slate-800/50 p-6 md:p-10 rounded-[2rem] border border-slate-100 shadow-xl mx-auto max-w-4xl w-full mb-12">

                {/* ================= CREATE FORM ================= */}
                <Box
                    component="form"
                    onSubmit={form.onSubmit(handleAddType)}
                    className="flex flex-col sm:flex-row gap-4 mb-8"
                >
                    {user?.role === "ADMIN" && (
                        <>
                            <TextInput
                                placeholder="New vessel type name"
                                {...form.getInputProps("name")}
                                disabled={isEditing}
                                className="grow"
                            />

                            <Button
                                type="submit"
                                radius="xl"
                                size="md"
                                leftSection={<Plus />}
                                loading={actionLoading}
                                disabled={isEditing}
                            >
                                Add Type
                            </Button>
                        </>
                    )}
                </Box>

                {/* ================= LIST ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data?.map((t) => (
                        <div
                            key={t.id}
                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#222a42] rounded-2xl group transition-all"
                        >
                            {editingId === t.id ? (
                                <div className="flex items-center gap-3 w-full">
                                    <TextInput
                                        value={editingValue}
                                        onChange={(e) => {
                                            setEditingValue(e.target.value);
                                            setEditError("");
                                        }}
                                        error={editError}
                                        className="flex-grow"
                                        size="xs"
                                    />

                                    <Button
                                        size="xs"
                                        color="green"
                                        onClick={saveEdit}
                                        loading={actionLoading}
                                    >
                                        <Check size={14} />
                                    </Button>

                                    <Button
                                        size="xs"
                                        color="gray"
                                        variant="light"
                                        onClick={cancelEdit}
                                        disabled={actionLoading}
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3 text-sm">
                                        <Anchor className="w-4 h-4 text-blue-500" />
                                        {t.name}
                                    </span>
                                    {user?.role === "ADMIN" && (
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <Button
                                                size="xs"
                                                variant="subtle"
                                                disabled={isEditing}
                                                onClick={() => startEditing(t)}
                                            >
                                                <Edit2 size={14} />
                                            </Button>

                                            <Button
                                                size="xs"
                                                color="red"
                                                variant="subtle"
                                                disabled={isEditing}
                                                onClick={() => openDeleteConfirm(t.id, t.name)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}