"use client";

import React, { useState } from "react";
import {
  PasswordInput,
  Button,
  Box,
  Stack,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";
import { Lock, Key } from "lucide-react";
import { modals } from "@mantine/modals";
import { changePassword } from "@/utils/api/dashboard/users";
import { logoutUser } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function PasswordModal({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validateInputOnChange: true,

    validate: {
      currentPassword: (value) =>
        !value ? "Harap isi password anda" : null,

      newPassword: (value) =>
        value.length < 6
          ? "Password minimal 6 karakter"
          : null,

      confirmPassword: (value, values) => {
        if (!value) return "Konfirmasi password wajib diisi";
        if (value !== values.newPassword)
          return "Password tidak sama";
        return null;
      },
    },
  });
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      nprogress.start();

      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      notifications.show({
        title: "Berhasil",
        message: "Password berhasil diubah",
        color: "green",
      });

      form.reset();
      modals.closeAll();

      if (onSuccess) {
        await onSuccess();
      }

    } catch (err) {
      notifications.show({
        title: "Gagal Ganti Password",
        message:
          err?.response.data.message ||
          "Terjadi kesalahan.",
        color: "red",
      });
    } finally {
      setLoading(false);
      nprogress.complete();
      logoutUser();
    router.push("/login");
    }
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>

        <PasswordInput
          label="Current Password"
          leftSection={<Lock size={14} />}
          {...form.getInputProps("currentPassword")}
        />

        <PasswordInput
          label="New Password"
          leftSection={<Lock size={14} />}
          {...form.getInputProps("newPassword")}
        />

        <PasswordInput
          label="Confirm Password"
          leftSection={<Lock size={14} />}
          {...form.getInputProps("confirmPassword")}
        />

        <Button
          type="submit"
          radius="xl"
          loading={loading}
          disabled={!form.isValid()}
          leftSection={<Key size={16} />}
          fullWidth
        >
          Change Password
        </Button>

      </Stack>
    </Box>
  );
}