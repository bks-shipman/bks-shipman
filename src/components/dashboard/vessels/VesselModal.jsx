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
import { createVessels, updateVessels } from "@/utils/api/dashboard/vessels";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageUp } from "lucide-react";

export default function VesselModal({
  opened,
  onClose,
  vessel,
  types = [],
  onSuccess,
}) {
  const isEdit = !!vessel;
  const [preview, setPreview] = useState(null);
const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      description_en: "",
      imo: "",
      year: "",
      country: "",
      vesselTypeId: "",
      photo: null,
    },

    validate: {
      name: (value) =>
        value.trim().length < 2 ? "Name minimal 2 karakter" : null,

      vesselTypeId: (value) =>
        !value ? "Vessel type wajib dipilih" : null,
    },
  });

  // ================= SET DATA WHEN EDIT =================
  useEffect(() => {
    if (opened && vessel) {
      form.setValues({
        name: vessel.name || "",
        description: vessel.description || "",
        description_en: vessel.description_en || "",
        imo: vessel.imo || "",
        year: vessel.year || "",
        country: vessel.country || "",
        vesselTypeId: vessel.vesselTypeId?.toString() || "",
        photo: vessel.photo || "",
      });

      if (vessel.photo) {
        setPreview(vessel.photo);
      }
    }

    if (opened && !vessel) {
      form.reset();
      setPreview(null);
    }
  }, [vessel, opened]);

  // ================= SUBMIT =================
  const handleSubmit = async (values) => {
    try {
      nprogress.start();
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("description_en", values.description_en);
      formData.append("imo", values.imo);
      formData.append("year", values.year);
      formData.append("country", values.country);
      formData.append("vesselTypeId", values.vesselTypeId);

      if (values.photo) {
        formData.append("photo", values.photo);
      }

      if (isEdit) {
        await updateVessels(vessel.id, formData);
      } else {
        await createVessels(formData);
      }

      notifications.show({
        title: "Berhasil",
        message: isEdit
          ? "Vessel berhasil diupdate"
          : "Vessel berhasil dibuat",
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
      title={isEdit ? "Edit Vessel" : "Create Vessel"}
      centered
      size="lg"
      radius="xl"
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">

        <TextInput
          label="Vessel Name"
          {...form.getInputProps("name")}
        />

        <Select
          label="Vessel Type"
          placeholder="Pilih vessel type"
          data={types.map((type) => ({
            value: type.id.toString(),
            label: type.name,
          }))}
          {...form.getInputProps("vesselTypeId")}
        />

        <TextInput
          label="Country"
          {...form.getInputProps("country")}
        />

        <TextInput
          label="IMO"
          {...form.getInputProps("imo")}
        />

        <NumberInput
          label="Year"
          hideControls
          {...form.getInputProps("year")}
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
            className="w-full h-50 border-2 border-dashed border-gray-300 rounded-xl flex justify-center items-center overflow-hidden cursor-pointer hover:bg-gray-50 transition relative"
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
          {isEdit ? "Update Vessel" : "Create Vessel"}
        </Button>
      </form>
    </Modal>
  );
}