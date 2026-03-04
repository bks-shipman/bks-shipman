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
    Info,
    Target,
} from "lucide-react";
import { getMission, updateMission } from "@/utils/api/dashboard/mission";

// ================= FETCHER =================
const fetcher = async () => {
    return await getMission();
};

export default function Mission({role}) {
    const { data, error, isLoading, mutate } = useSWR(
        "mission",
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    const [actionLoading, setActionLoading] = useState(false);

    const form = useForm({
        initialValues: {
            description: "",
            description_en: ""
        },
        validateInputOnChange: true,
        validateInputOnBlur: true,

        validate: {
            description: (value) =>
                !value
                    ? "Deskripsi (Indonesia) harus diisi"
                    : null,
            description_en: (value) =>
                !value
                    ? "Deskripsi (English) harus diisi"
                    : null,
            
        }
    });

    // ================= SET DATA =================
    useEffect(() => {
        if (data) {
            form.setValues({
                description: data.description || "",
                description_en: data.description_en || ""
            });
        }
    }, [data]);

    // ================= SUBMIT =================
    const handleSubmit = async (values) => {
        try {
            setActionLoading(true);
            nprogress.start();

            await updateMission({
                description: values.description,
                description_en: values.description_en
            });

            notifications.show({
                title: "Berhasil",
                message: "Mission berhasil diperbarui.",
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
            <Box
                component="form"
                onSubmit={form.onSubmit(handleSubmit)}
                className=""
            >
                <div className="space-y-10 w-full flex flex-col justify-center max-w-4xl mx-auto pb-12">
                    <div className="bg-white dark:bg-[#161b2b]
dark:border-slate-800/50 p-12 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <Target className="w-5 h-5 text-blue-600" /> Mission
                        </h3>
                        {role === "ADMIN" ? (
                            <>
                            <Textarea
                            label="Company Mission (Indonesia)"
                            autosize
                            minRows={4}
                            {...form.getInputProps("description")}
                            />
                            <Textarea
                            label="Company Mission (English)"
                            autosize
                            minRows={4}
                            {...form.getInputProps("description_en")}
                            />
                            </>
                        ) : (
                            <p>
                                {data?.description}
                            </p>
                        )}
                    </div>
                    {/* ================= CONNECTIONS ================= */}

                    {role === "ADMIN" && (
                        <Button
                        type="submit"
                        size="lg"
                        radius="xl"
                        loading={actionLoading}
                        disabled={!form.isValid()}
                        leftSection={<CheckCircle2 size={18} />}
                        className="w-fit! mx-auto"
                        >
                        Save Mission Data
                    </Button>
                    )}
                </div>
            </Box>
        </div>
    );
}