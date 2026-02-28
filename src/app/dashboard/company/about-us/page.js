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
    getCompanyData,
    updateCompany,
} from "@/utils/api/dashboard/company";

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
    Info,
} from "lucide-react";
import { getAboutUs, updateAboutUs } from "@/utils/api/dashboard/aboutUs";

// ================= FETCHER =================
const fetcher = async () => {
    return await getAboutUs();
};

export default function AboutUs() {
    const { data, error, isLoading, mutate } = useSWR(
        "about-us",
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    const [actionLoading, setActionLoading] = useState(false);

    const form = useForm({
        initialValues: {
            description: ""
        },
        validateInputOnChange: true,
        validateInputOnBlur: true,

        validate: {
            description: (value) =>
                !value
                    ? "Deskripsi harus diisi"
                    : null,
        }
    });

    // ================= SET DATA =================
    useEffect(() => {
        if (data) {
            form.setValues({
                description: data.description || ""
            });
        }
    }, [data]);

    // ================= SUBMIT =================
    const handleSubmit = async (values) => {
        try {
            setActionLoading(true);
            nprogress.start();

            await updateAboutUs({
                description: values.description,
            });

            notifications.show({
                title: "Berhasil",
                message: "About Us berhasil diperbarui.",
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
                    Company About
                </h1>
                <p className="text-slate-500">
                    Define what's company about.
                </p>
            </header>

            <Box
                component="form"
                onSubmit={form.onSubmit(handleSubmit)}
                className=""
            >
                <div className="space-y-10 w-full flex flex-col justify-center max-w-4xl mx-auto pb-12">
                    <div className="bg-white dark:bg-[#161b2b] p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-xl space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <Info className="w-5 h-5 text-blue-600" /> About Us
                        </h3>

                        <Textarea
                            label="Company Description"
                            autosize
                            minRows={4}
                            {...form.getInputProps("description")}
                        />
                    </div>
                    {/* ================= CONNECTIONS ================= */}

                    <Button
                        type="submit"
                        size="lg"
                        radius="xl"
                        loading={actionLoading}
                        disabled={!form.isValid()}
                        leftSection={<CheckCircle2 size={18} />}
                        className="w-fit! mx-auto"
                    >
                        Save About Us Data
                    </Button>
                </div>
            </Box>
        </div>
    );
}