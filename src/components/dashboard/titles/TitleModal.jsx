"use client";

import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";
import { createTitle, updateTitle } from "@/utils/api/dashboard/titles";
import { useEffect, useState } from "react";

const SECTION_OPTIONS = [
  { value: "HERO", label: "Hero Section" },
  { value: "SERVICES", label: "Services Section" },
  { value: "VM", label: "Vision Mission" },
  { value: "GALLERY", label: "Gallery" },
  { value: "COREVALUES", label: "Core Values" },
  { value: "ABOUTUS", label: "About Us" },
  { value: "VESSELS", label: "Vessels" },
  { value: "EXHIBITIONS", label: "Exhibitions" },
  { value: "CAREERS", label: "Careers" },
  { value: "CERTIFICATES", label: "Certificates" },
  { value: "PARTNERS", label: "Partners" },
];

export default function TitleModal({
  opened,
  onClose,
  title,
  onSuccess,
  existingTypes = [], // kirim dari parent
}) {
  const isEdit = !!title;
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      title_en: "",
      title2: "",
      title2_en: "",
      subtitle: "",
      subtitle_en: "",
      type: "",
      tag: "",
      tag_en: "",
    },

    validate: {
      type: (value) => (!value ? "Section wajib dipilih" : null),

      title: (value, values) => {
        if (values.type === "HERO" && !value)
          return "Title wajib untuk HERO";
        return null;
      },

      subtitle: (value, values) => {
        if (values.type === "HERO" && !value)
          return "Subtitle wajib untuk HERO";
        return null;
      },
    },
  });

  // ================= SET DATA =================
  useEffect(() => {
    if (opened && title) {
      form.setValues({
        title: title.title || "",
        title_en: title.title_en || "",
        title2: title.title2 || "",
        title2_en: title.title2_en || "",
        subtitle: title.subtitle || "",
        subtitle_en: title.subtitle_en || "",
        type: title.type || "",
        tag: title.tag || "", 
        tag_en: title.tag_en || "", 
      });
    }

    if (opened && !title) {
      form.reset();
    }
  }, [title, opened]);

  // ================= SUBMIT =================
  const handleSubmit = async (values) => {
    try {
      nprogress.start();
      setLoading(true);

      if (isEdit) {
        await updateTitle(title.id, values);
      } else {
        await createTitle(values);
      }

      notifications.show({
        title: "Berhasil",
        message: isEdit
          ? "Title berhasil diupdate"
          : "Title berhasil dibuat",
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

  // Disable option jika sudah ada
  const sectionData = SECTION_OPTIONS.map((section) => ({
    ...section,
    disabled:
      !isEdit && existingTypes.includes(section.value),
  }));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Edit Title" : "Create Title"}
      centered
      size="lg"
      radius="xl"
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">

        {/* SECTION SELECT */}
        <Select
          label="Section"
          data={sectionData}
          disabled={isEdit}
          {...form.getInputProps("type")}
        />

        {/* CONDITIONAL FIELDS */}

        <TextInput
          label="First Title (Indonesia)"
          {...form.getInputProps("title")}
        />
        <TextInput
          label="First Title (English)"
          {...form.getInputProps("title_en")}
        />
        {(form.values.type === "HERO" ||
          form.values.type === "SERVICES" ||
          form.values.type === "VM") && (
            <>
            <TextInput
              label="Second Title (Indonesia)"
              {...form.getInputProps("title2")}
              />
            <TextInput
              label="Second Title (English)"
              {...form.getInputProps("title2_en")}
              />
            </>
        )}

        {(form.values.type === "HERO" || form.values.type === "CAREERS" || form.values.type === "SERVICES" || form.values.type === "ABOUTUS" || form.values.type === "VESSELS" || form.values.type === "EXHIBITIONS" || form.values.type === "CERTIFICATES" || form.values.type === "PARTNERS") && (
          <>
          <Textarea
            label="Subtitle (Indonesia)"
            autosize
            minRows={3}
            {...form.getInputProps("subtitle")}
          />
          <Textarea
            label="Subtitle (English)"
            autosize
            minRows={3}
            {...form.getInputProps("subtitle_en")}
          />
          </>
        )}

        {(form.values.type === "SERVICES" ||
          form.values.type === "COREVALUES" || form.values.type === "HERO" || form.values.type === "VM" || form.values.type === "GALLERY" || form.values.type === "CERTIFICATES" || form.values.type === "PARTNERS") && (
            <>
          <TextInput
            label="Tag (Indonesia)"
            {...form.getInputProps("tag")}
          />
          <TextInput
            label="Tag (English)"
            {...form.getInputProps("tag_en")}
          />
            </>
        )}

        <Button
          type="submit"
          loading={loading}
          fullWidth
          radius="xl"
        >
          {isEdit ? "Update Title" : "Create Title"}
        </Button>
      </form>
    </Modal>
  );
}