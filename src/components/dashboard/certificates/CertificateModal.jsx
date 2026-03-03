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
import { createCertificates, updateCertificates } from "@/utils/api/dashboard/certificates";

export default function CertificateModal({
  opened,
  onClose,
  certificate,
  onSuccess,
}) {
  const isEdit = !!certificate;
  const [preview, setPreview] = useState(null);
const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
      file: null,
    },

    validate: {
      name: (value) =>
        value.trim().length < 2 ? "Name minimal 2 karakter" : null,
    },
  });

  // ================= SET DATA WHEN EDIT =================
  useEffect(() => {
    if (opened && certificate) {
      form.setValues({
        name: certificate.name || "",
        file: certificate.file || null,
      });

      if (certificate.file) {
        setPreview(certificate.file);
      }
    }

    if (opened && !certificate) {
      form.reset();
      setPreview(null);
    }
  }, [certificate, opened]);

  // ================= SUBMIT =================
  const handleSubmit = async (values) => {
    try {
      nprogress.start();
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);

      if (values.file) {
        formData.append("file", values.file);
      }

      if (isEdit) {
        await updateCertificates(certificate.id, formData);
      } else {
        await createCertificates(formData);
      }

      notifications.show({
        title: "Berhasil",
        message: isEdit
          ? "Certificate berhasil diupdate"
          : "Certificate berhasil dibuat",
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
      title={isEdit ? "Edit Certificate" : "Create Certificate"}
      centered
      size="lg"
      radius="xl"
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">

        <TextInput
          label="Certificate Name"
          {...form.getInputProps("name")}
        />

        
        {/* ================= PHOTO ================= */}
        <div className="flex flex-col gap-3">
          <Dropzone
            accept={[...IMAGE_MIME_TYPE, "application/pdf"]}
            multiple={false}
            onDrop={(files) => {
              const file = files[0];
              if (file) {
                form.setFieldValue("file", file);
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
                  Klik atau tarik file
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
                form.setFieldValue("file", null);
              }}
            >
              Hapus File
            </Button>
          )}
        </div>

        <Button type="submit" disabled={!form.isValid()} loading={loading} fullWidth radius="xl">
          {isEdit ? "Update Certificate" : "Create Certificate"}
        </Button>
      </form>
    </Modal>
  );
}