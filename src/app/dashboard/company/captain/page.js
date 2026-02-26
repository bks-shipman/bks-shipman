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
    HardHat,
    ImageUp,
} from "lucide-react";
import { getAboutUs, updateAboutUs } from "@/utils/api/dashboard/aboutUs";
import { getCaptain, updateCaptain } from "@/utils/api/dashboard/captain";
import Image from "next/image";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

// ================= FETCHER =================
const fetcher = async () => {
    return await getCaptain();
};

export default function AboutUs() {
    const [preview, setPreview] = useState(null);
    const { data, error, isLoading, mutate } = useSWR(
        "captain",
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    const [actionLoading, setActionLoading] = useState(false);

    const form = useForm({
        initialValues: {
            name: "",
            quote: "",
            photo: null
        },
        validateInputOnChange: true,
        validateInputOnBlur: true,

        validate: {
            name: (value) =>
                !value
                    ? "Nama harus diisi"
                    : null,
            quote: (value) =>
                !value
                    ? "Quote harus diisi"
                    : null,
        }
    });

    // ================= SET DATA =================
    useEffect(() => {
        if (data) {
            form.setValues({
                name: data.name || "",
                quote: data.quote || "",
                photo: data.photo || "",
            });
            if (data.photo) {
                setPreview(data.photo);
            }
        }
    }, [data]);

    // ================= SUBMIT =================
    const handleSubmit = async (values) => {
        try {
            setActionLoading(true);
            nprogress.start();

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("quote", values.quote);

            console.log(formData);


            if (values.photo) {
                formData.append("photo", values.photo);
            }

            await updateCaptain(formData);

            notifications.show({
                title: "Berhasil",
                message: "Captain berhasil diperbarui.",
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
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                    Captain Data
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
                <div className="space-y-10 w-full flex flex-col justify-center max-w-4xl mx-auto pb-12">
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <HardHat className="w-5 h-5 text-blue-600" /> Captain Data
                        </h3>
                        <div className="flex flex-col items-center justify-center gap-4 ">
                            <Dropzone
                                accept={IMAGE_MIME_TYPE}
                                multiple={false}
                                onDrop={(files) => {
                                    const file = files[0];
                                    if (file) {
                                        form.setFieldValue("photo", file);
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="relative w-full h-[200px] rounded-full border-4 border-blue-500 flex justify-center items-center overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                                {!preview ? (
                                    <div className="flex flex-col items-center text-center text-gray-600">
                                        <ImageUp width={60} height={60} color="#1c7ed6" />
                                        <p className="mt-2 text-xs font-medium">
                                            Upload Foto
                                        </p>
                                    </div>
                                ) : (
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </Dropzone>

                            {preview && (
                                <Button
                                    size="xs"
                                    variant="light"
                                    color="red"
                                    onClick={() => {
                                        setPreview(null);
                                        form.setFieldValue("photo", null);
                                    }}
                                >
                                    Hapus Foto
                                </Button>
                            )}
                        </div>
                        <TextInput
                            label="Captain Name"
                            {...form.getInputProps("name")}
                        />
                        <Textarea
                            label="Captain Quote"
                            autosize
                            minRows={4}
                            {...form.getInputProps("quote")}
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
                        Save Captain Data
                    </Button>
                </div>
            </Box>
        </div>
    );
}