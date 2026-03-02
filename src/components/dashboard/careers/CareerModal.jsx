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
      positions: "",
      requirements: "",
      photo: null,

    },

    validate: {
      title: (value) =>
        !value ? "Title wajib diisi" : null,

      positions: (value) =>
        !value ? "Positions wajib diisi" : null,

      requirements: (value) =>
        !value ? "Requirements wajib diisi" : null,
    },
  });

  // ================= SET DATA WHEN EDIT =================
  useEffect(() => {
    if (opened && career) {
      form.setValues({
        title: career.title || "",
        positions: career.positions || "",
        requirements: career.requirements || "",
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
      formData.append("positions", values.positions);
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
          label="Title"
          {...form.getInputProps("title")}
        />

        <Textarea
          label="Positions"
          autosize
          minRows={3}
          {...form.getInputProps("positions")}
        />

        <Textarea
          label="Requirements"
          autosize
          minRows={3}
          {...form.getInputProps("requirements")}
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