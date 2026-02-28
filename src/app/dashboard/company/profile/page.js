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
} from "lucide-react";

// ================= FETCHER =================
const fetcher = async () => {
    return await getCompanyData();
};

export default function Company() {
    const { data, error, isLoading, mutate } = useSWR(
        "company",
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    const [actionLoading, setActionLoading] = useState(false);

    const form = useForm({
        initialValues: {
            address: "",
            email: "",
            gmapsUrl: "",
            phone: "",
            phone_code: "",
            linkedin: "",
            tiktok: "",
            facebook: "",
            instagram: "",
        },
    });

    // ================= SET DATA =================
    useEffect(() => {
        if (data) {
            form.setValues({
                address: data.address || "",
                email: data.email || "",
                gmapsUrl: data.gmapsUrl || "",
                phone: data.phone || "",
                phone_code: data.phone_code || "",
                linkedin: data.linkedin || "",
                tiktok: data.tiktok || "",
                facebook: data.facebook || "",
                instagram: data.instagram || "",
            });
        }
    }, [data]);

    // ================= SUBMIT =================
    const handleSubmit = async (values) => {
        try {
            setActionLoading(true);
            nprogress.start();

            await updateCompany({
                address: values.address,
                email: values.email,
                gmapsUrl: values.gmapsUrl,
                name: "BKS SHIPMAN",
                phone: values.phone,
                phone_code: values.phone_code,
                linkedin: values.linkedin,
                tiktok: values.tiktok,
                facebook: values.facebook,
                instagram: values.instagram,
            });

            notifications.show({
                title: "Berhasil",
                message: "Company berhasil diperbarui.",
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
                    Company Info
                </h1>
                <p className="text-slate-500">
                    Define core brand identity and communication channels.
                </p>
            </header>

            <Box
                component="form"
                onSubmit={form.onSubmit(handleSubmit)}
                className=""
            >
                <div className="space-y-10 w-full flex flex-col justify-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        <div className="bg-white dark:bg-[#161b2b] p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-xl space-y-8">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <Share2 className="w-5 h-5 text-blue-600" /> Connections
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextInput
                                    label="Phone Code"
                                    leftSection={<Phone size={14} />}
                                    placeholder="+62"
                                    {...form.getInputProps("phone_code")}
                                />

                                <TextInput
                                    label="Phone Number"
                                    leftSection={<Phone size={14} />}
                                    {...form.getInputProps("phone")}
                                />

                                <TextInput
                                    label="Public Email"
                                    leftSection={<Mail size={14} />}
                                    {...form.getInputProps("email")}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Social Media Links
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <TextInput
                                        placeholder="Linkedin Link"
                                        leftSection={<Linkedin size={14} />}
                                        {...form.getInputProps("linkedin")}
                                    />

                                    <TextInput
                                        placeholder="TikTok Link"
                                        leftSection={<Music2 size={14} />}
                                        {...form.getInputProps("tiktok")}
                                    />

                                    <TextInput
                                        placeholder="Facebook Link"
                                        leftSection={<Facebook size={14} />}
                                        {...form.getInputProps("facebook")}
                                    />

                                    <TextInput
                                        placeholder="Instagram Link"
                                        leftSection={<Instagram size={14} />}
                                        {...form.getInputProps("instagram")}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ================= ADDRESS BOX ================= */}
                        <div className="bg-white dark:bg-[#161b2b] p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-xl space-y-8">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <Building2 className="w-5 h-5 text-blue-600" /> Address
                            </h3>

                            <Textarea
                                label="Company Address"
                                placeholder="Enter full company address"
                                leftSection={<MapPin size={14} />}
                                autosize
                                {...form.getInputProps("address")}
                            />

                            <TextInput
                                label="Google Maps URL"
                                placeholder="https://maps.google.com/..."
                                leftSection={<LinkIcon size={14} />}
                                {...form.getInputProps("gmapsUrl")}
                            />
                        </div>
                    </div>
                    {/* ================= CONNECTIONS ================= */}

                    <Button
                        type="submit"
                        size="lg"
                        radius="xl"
                        loading={actionLoading}
                        leftSection={<CheckCircle2 size={18} />}
                        className="w-fit! mx-auto"
                    >
                        Save Company Data
                    </Button>
                </div>
            </Box>
        </div>
    );
}