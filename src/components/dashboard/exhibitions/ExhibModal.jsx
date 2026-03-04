"use client";

import {
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Select,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageUp } from "lucide-react";
import { createExhibition, updateExhibition } from "@/utils/api/dashboard/exhibitions";
import { DatePickerInput } from "@mantine/dates";

export default function ExhibModal({
  opened,
  onClose,
  exhibition,
  onSuccess,
}) {
  const isEdit = !!exhibition;
  const [preview, setPreview] = useState(null);
const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
      name:"",
      date: null,
      description: "",
      description_en: "",
      photo: null,
    },

   validate: {
      name: (value) =>
        !value ? "Name (ID) wajib diisi" : null,

      name_en: (value) =>
        !value ? "Name wajib (EN) diisi" : null,

      date: (value) =>
        !value ? "Date wajib diisi" : null,

      description: (value) =>
        !value ? "Description (Indonesia) wajib diisi" : null,
      description_en: (value) =>
        !value ? "Description (English) wajib diisi" : null,
    },
  });

  // ================= SET DATA WHEN EDIT =================
  useEffect(() => {
    if (opened && exhibition) {
      form.setValues({
        name: exhibition.name || "",
        name_en: exhibition.name_en || "",
        date: exhibition.date || null,
        description: exhibition.description || "",
        description_en: exhibition.description_en || "",
        photo: exhibition.photo || "",
      });

      if (exhibition.photo) {
        setPreview(exhibition.photo);
      }
    }

    if (opened && !exhibition) {
      form.reset();
      setPreview(null);
    }
  }, [exhibition, opened]);

  // ================= SUBMIT =================
  const handleSubmit = async (values) => {
    try {
      nprogress.start();
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("name_en", values.name_en);
      formData.append("description", values.description);
      formData.append("description_en", values.description_en);
      formData.append("date", values.date);
    
      if (values.photo) {
        formData.append("photo", values.photo);
      }

      if (isEdit) {
        await updateExhibition(exhibition.id, formData);
      } else {
        await createExhibition(formData);
      }

      notifications.show({
        title: "Berhasil",
        message: isEdit
          ? "Exhibition berhasil diupdate"
          : "Exhibition berhasil dibuat",
        color: "green",
      });

      await onSuccess();
      onClose();
      form.reset();
      setPreview(null);

    } catch (err) {
      notifications.show({
        title: "Gagal",
        message:
          err?.response?.data?.message || "Terjadi kesalahan",
        color: "red",
      });
    } finally {
      nprogress.complete();
      setLoading(false);

    }
  };
  

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Edit Exhibition" : "Create Exhibition"}
      centered
      size="lg"
      radius="xl"
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">

        <TextInput
          label="Exhibition Name (Indonesia)"
          {...form.getInputProps("name")}
        />

        <TextInput
          label="Exhibition Name (English)"
          {...form.getInputProps("name_en")}
        />

        <DatePickerInput 
        label="Exhibition Date"
        {...form.getInputProps("date")}
        />

        <Textarea
          label="Description (Indonesia)"
          autosize
          minRows={3}
          {...form.getInputProps("description")}
        />
        <Textarea
          label="Description (English)"
          autosize
          minRows={3}
          {...form.getInputProps("description_en")}
        />

        {/* ================= PHOTO ================= */}
        <div className="flex flex-col gap-3">
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
            className="w-full h-[200px] border-2 border-dashed border-gray-300 rounded-xl flex justify-center items-center overflow-hidden cursor-pointer hover:bg-gray-50 transition relative"
          >
            {!preview ? (
              <div className="flex flex-col items-center text-center text-gray-600">
                <ImageUp
                  width={50}
                  height={50}
                  color="#1c7ed6"
                />
                <p className="mt-2 text-sm font-medium">
                  Klik atau tarik gambar
                </p>
              </div>
            ) : (
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover rounded-xl"
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
              Hapus Gambar
            </Button>
          )}
        </div>

        <Button type="submit" disabled={!form.isValid()} loading={loading} fullWidth radius="xl">
          {isEdit ? "Update Exhibition" : "Create Exhibition"}
        </Button>
      </form>
    </Modal>
  );
}