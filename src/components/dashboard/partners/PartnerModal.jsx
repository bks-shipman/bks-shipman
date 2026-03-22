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
import { createPartner, updatePartner} from "@/utils/api/dashboard/partners";
import { DatePickerInput } from "@mantine/dates";

export default function PartnerModal({
  opened,
  onClose,
  partner,
  onSuccess,
}) {
  const isEdit = !!partner;
  const [preview, setPreview] = useState(null);
const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
      photo: null,
    },

   validate: {
      name: (value) =>
        !value ? "Name wajib diisi" : null,
    },
  });

  // ================= SET DATA WHEN EDIT =================
  useEffect(() => {
    if (opened && partner) {
      form.setValues({
        name: partner.name || "",
        photo: partner.photo || "",
      });

      if (partner.photo) {
        setPreview(partner.photo);
      }
    }

    if (opened && !partner) {
      form.reset();
      setPreview(null);
    }
  }, [partner, opened]);

  // ================= SUBMIT =================
  const handleSubmit = async (values) => {
    try {
      nprogress.start();
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      if (values.photo) {
        formData.append("photo", values.photo);
      }

      if (isEdit) {
        await updatePartner(partner.id, formData);
      } else {
        await createPartner(formData);
      }

      notifications.show({
        title: "Berhasil",
        message: isEdit
          ? "partner berhasil diupdate"
          : "partner berhasil dibuat",
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
      title={isEdit ? "Edit Partner" : "Create Partner"}
      centered
      size="lg"
      radius="xl"
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">

        <TextInput
          label="Partner Name"
          {...form.getInputProps("name")}
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
          {isEdit ? "Update partner" : "Create partner"}
        </Button>
      </form>
    </Modal>
  );
}