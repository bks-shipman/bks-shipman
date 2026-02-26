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
const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
    },

    validate: {
      title: (value) =>
        !value ? "Title wajib diisi" : null,

      description: (value) =>
        !value ? "Description wajib diisi" : null,
    },
  });

  // ================= SET DATA WHEN EDIT =================
  useEffect(() => {
    if (opened && career) {
      form.setValues({
        title: career.title || "",
        description: career.description || "",
      });
    }

    if (opened && !career) {
      form.reset();
    }
  }, [career, opened]);

  // ================= SUBMIT =================
  const handleSubmit = async (values) => {
    try {
      nprogress.start();
      setLoading(true);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);      

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
          label="Description"
          autosize
          minRows={3}
          {...form.getInputProps("description")}
        />


        <Button type="submit" disabled={!form.isValid()} loading={loading} fullWidth radius="xl">
          {isEdit ? "Update Career" : "Create Career"}
        </Button>
      </form>
    </Modal>
  );
}