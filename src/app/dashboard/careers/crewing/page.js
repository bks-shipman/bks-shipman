"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
    TextInput,
    Button,
    Box,
    Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";
import Loading from "@/components/Loading";

import {
    Mail,
    Phone,
    MapPin,
    Link as LinkIcon,
    Linkedin,
    Music2,
    Facebook,
    Instagram,
    CheckCircle2,
    Share2,
    Building2,
} from "lucide-react";
import { getUser } from "@/utils/auth";
import { getCrewingData, updateCrewing } from "@/utils/api/dashboard/crewing";

// ================= FETCHER =================
const fetcher = async () => {
    return await getCrewingData();
};

export default function Crewing() {
    const user = getUser();
    const [isAdmin, setIsAdmin] = useState(true);

    useEffect(() => {
        if (user?.role === "ADMIN") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [user]);
    const { data, error, isLoading, mutate } = useSWR(
        "crewing",
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    const [actionLoading, setActionLoading] = useState(false);

    const form = useForm({
        initialValues: {
            email: "",
            phone: "",
            phone_code: "",
        },
    });

    // ================= SET DATA =================
    useEffect(() => {
        if (data) {
            form.setValues({
                email: data.email || "",
                phone: data.phone || "",
                phone_code: data.phone_code || "",
            });
        }
    }, [data]);

    // ================= SUBMIT =================
    const handleSubmit = async (values) => {
        try {
            setActionLoading(true);
            nprogress.start();

            await updateCrewing({
                email: values.email,
                phone: values.phone,
                phone_code: values.phone_code,
            });

            notifications.show({
                title: "Berhasil",
                message: "Crewing berhasil diperbarui.",
                color: "green",
            });

            mutate();
        } catch (err) {
            notifications.show({
                title: "Gagal Update",
                message:
                    err.response?.data?.message || "Terjadi kesalahan.",
                color: "red",
            });
        } finally {
            setActionLoading(false);
            nprogress.complete();
        }
    };

    if (isLoading) return <Loading />;

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
        <div className="space-y-12 animate-in fade-in duration-500">
            <header>
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2 dark:text-slate-100">
                    Crewing Info
                </h1>
                <p className="text-slate-500">
                    Define the contact information for crewing-related inquiries, including phone and email details.
                </p>
            </header>

            <Box
                component="form"
                onSubmit={form.onSubmit(handleSubmit)}
                className=""
            >
                <div className="space-y-10 w-full flex flex-col justify-center max-w-3xl mx-auto pb-12">
                    <div className="bg-white dark:bg-[#161b2b] p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-xl space-y-8">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <Share2 className="w-5 h-5 text-blue-600" /> Connections
                        </h3>

                        <div className="gap-6">
                            <TextInput
                                label="Phone Code"
                                leftSection={<Phone size={14} />}
                                placeholder="+62"
                                readOnly={!isAdmin}
                                {...form.getInputProps("phone_code")}
                            />

                            <TextInput
                                label="Phone Number"
                                leftSection={<Phone size={14} />}
                                readOnly={!isAdmin}
                                {...form.getInputProps("phone")}
                            />

                            <TextInput
                                label="Public Email"
                                leftSection={<Mail size={14} />}
                                readOnly={!isAdmin}
                                {...form.getInputProps("email")}
                            />
                        </div>
                    </div>
                    {/* ================= CONNECTIONS ================= */}
                    {user?.role === "ADMIN" && (
                        <Button
                            type="submit"
                            size="lg"
                            radius="xl"
                            loading={actionLoading}
                            leftSection={<CheckCircle2 size={18} />}
                            className="w-fit! mx-auto"
                        >
                            Save Crewing Data
                        </Button>
                    )}
                </div>
            </Box>
        </div>
    );
}