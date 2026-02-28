"use client";

import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";
import {
  User,
  Mail,
  Lock,
  CheckCircle2,
} from "lucide-react";

import { createUser } from "@/utils/api/dashboard/users";

export default function CreateView({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
  initialValues: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },

  validateInputOnChange: true,
  validateInputOnBlur: true,

  validate: {
    name: (value) =>
      value.trim().length < 2
        ? "Nama minimal 2 karakter"
        : null,

    email: (value) =>
      /^\S+@\S+\.\S+$/.test(value)
        ? null
        : "Format email tidak valid",

    password: (value) =>
      value.length < 6
        ? "Password minimal 6 karakter"
        : null,

    confirmPassword: (value, values) => {
      if (!value) return "Konfirmasi password wajib diisi";
      if (value !== values.password)
        return "Password tidak sama";
      return null;
    },
  },
});

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      nprogress.start();

      await createUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      notifications.show({
        title: "Berhasil",
        message: "User berhasil dibuat.",
        color: "green",
      });

      form.reset();

      if (onSuccess) {
        await onSuccess();
        }
    } catch (err) {
      notifications.show({
        title: "Gagal Membuat User",
        message:
          err.response?.data?.message ||
          "Terjadi kesalahan.",
        color: "red",
      });
    } finally {
      setLoading(false);
      nprogress.complete();
    }
  };

  return (
    
      <Box
        component="form"
        onSubmit={form.onSubmit(handleSubmit)}
        className="bg-white dark:bg-[#161b2b] p-8 md:p-12 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-xl space-y-6"
      >
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Create New User
        </h3>

        <div className="flex flex-col justify-center space-y-6">
        <TextInput
          label="Full Name"
          placeholder="Ex: John Doe"
          leftSection={<User size={14} />}
          {...form.getInputProps("name")}
        />

        <TextInput
          label="Email Address"
          placeholder="Ex: name@email.com"
          leftSection={<Mail size={14} />}
          {...form.getInputProps("email")}
        />

        <PasswordInput
          label="Password"
          placeholder="Minimal 6 karakter"
          leftSection={<Lock size={14} />}
          {...form.getInputProps("password")}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Ulangi password"
          leftSection={<Lock size={14} />}
          {...form.getInputProps("confirmPassword")}
        />

        <Button
          type="submit"
          size="md"
          radius="xl"
          disabled={!form.isValid()}
          loading={loading}
          leftSection={<CheckCircle2 size={16} />}
          className="w-fit! mx-auto"
        >
          Create User
        </Button>
        </div>
      </Box>

  );
}