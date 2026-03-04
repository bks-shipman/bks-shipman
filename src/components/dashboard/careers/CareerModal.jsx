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
import { createService, updateService } from "@/utils/api/dashboard/services";
import { createCareer, updateCareer } from "@/utils/api/dashboard/careers";
import { title } from "motion/react-client";

export default function CareerModal({
  opened,
  onClose,
  career,
  onSuccess,
}) {
  const isEdit = !!career;
  const [preview, setPreview] = useState(null);
const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      title: "",
      title_en: "",
      positions: "",
      positions_en: "",
      requirements: "",
      requirements_en: "",
      photo: null,

    },

    validate: {
      title: (value) =>
        !value ? "Title wajib diisi" : null,

      title_en: (value) =>
        !value ? "Title (English) wajib diisi" : null,

      positions: (value) =>
        !value ? "Positions wajib diisi" : null,

      positions_en: (value) =>
        !value ? "Positions (English) wajib diisi" : null,

      requirements: (value) =>
        !value ? "Requirements wajib diisi" : null,
      requirements_en: (value) =>
        !value ? "Requirements (English) wajib diisi" : null,
    },
  });

  // ================= SET DATA WHEN EDIT =================
  useEffect(() => {
    if (opened && career) {
      form.setValues({
        title: career.title || "",
        title_en: career.title_en || "",
        positions: career.positions || "",
        positions_en: career.positions_en || "",
        requirements: career.requirements || "",
        requirements_en: career.requirements_en || "",
        photo: career.photo || "",
      });
       if (career.photo) {
        setPreview(career.photo);
      }
    }

    if (opened && !career) {
      form.reset();
      setPreview(null);
    }
  }, [career, opened]);

  // ================= SUBMIT =================
  const handleSubmit = async (values) => {
    try {
      nprogress.start();
      setLoading(true);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("title_en", values.title_en);
      formData.append("positions", values.positions);
      formData.append("positions_en", values.positions_en);
      formData.append("requirements_en", values.requirements_en);
      formData.append("requirements", values.requirements);

      if (values.photo) {
        formData.append("photo", values.photo);
      }

      if (isEdit) {
        await updateCareer(career.id, formData);
      } else {
        await createCareer(formData);
      }

      notifications.show({
        title: "Berhasil",
        message: isEdit
          ? "Career berhasil diupdate"
          : "Career berhasil dibuat",
        color: "green",
      });

      await onSuccess();
      onClose();
      form.reset();

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
      title={isEdit ? "Edit Career" : "Create Career"}
      centered
      size="lg"
      radius="xl"
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">

        <TextInput
          label="Title (Indonesia)"
          {...form.getInputProps("title")}
        />

        <TextInput
          label="Title (English)"
          {...form.getInputProps("title_en")}
        />

        <Textarea
          label="Positions (Indonesia)"
          autosize
          minRows={3}
          {...form.getInputProps("positions")}
        />

        <Textarea
          label="Positions (English)"
          autosize
          minRows={3}
          {...form.getInputProps("positions_en")}
        />

        <Textarea
          label="Requirements (Indonesia)"
          autosize
          minRows={3}
          {...form.getInputProps("requirements")}
        />

        <Textarea
          label="Requirements (English)"
          autosize
          minRows={3}
          {...form.getInputProps("requirements_en")}
        />

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
          {isEdit ? "Update Career" : "Create Career"}
        </Button>
      </form>
    </Modal>
  );
}