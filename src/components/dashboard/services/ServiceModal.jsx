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

export default function ServiceModal({
  opened,
  onClose,
  service,
  onSuccess,
}) {
  const isEdit = !!service;
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
    if (opened && service) {
      form.setValues({
        title: service.title || "",
        description: service.description || "",
      });
    }

    if (opened && !service) {
      form.reset();
    }
  }, [service, opened]);

  // ================= SUBMIT =================
  const handleSubmit = async (values) => {
    try {
      nprogress.start();
      setLoading(true);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);      

      if (isEdit) {
        await updateService(service.id, formData);
      } else {
        await createService(formData);
      }

      notifications.show({
        title: "Berhasil",
        message: isEdit
          ? "Service berhasil diupdate"
          : "Service berhasil dibuat",
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
      title={isEdit ? "Edit Service" : "Create Service"}
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
          {isEdit ? "Update Service" : "Create Service"}
        </Button>
      </form>
    </Modal>
  );
}