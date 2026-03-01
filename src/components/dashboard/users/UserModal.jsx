"use client";

import { Modal, TextInput, PasswordInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";
import { createUser, updateUser } from "@/utils/api/dashboard/users";

export default function UserModal({
  opened,
  onClose,
  user,
  onSuccess,
}) {
  const isEdit = !!user;

  const form = useForm({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    },
  });

  const handleSubmit = async (values) => {
    try {
      nprogress.start();

      if (isEdit) {
        await updateUser(user.id, values);
      } else {
        await createUser(values);
      }

      notifications.show({
        title: "Berhasil",
        message: isEdit
          ? "User berhasil diupdate"
          : "User berhasil dibuat",
        color: "green",
      });

      onSuccess();
      onClose();
      form.reset();

    } catch (err) {
      notifications.show({
        title: "Gagal",
        message: err?.response?.data?.message || "Terjadi kesalahan",
        color: "red",
      });
    } finally {
      nprogress.complete();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Edit User" : "Create User"}
      centered
      size="md"
      radius="xl"
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
        <TextInput
          label="Full Name"
          {...form.getInputProps("name")}
        />

        <TextInput
          label="Email"
          {...form.getInputProps("email")}
        />

        {!isEdit && (
          <PasswordInput
            label="Password"
            {...form.getInputProps("password")}
          />
        )}

        <Button type="submit" fullWidth radius="xl">
          {isEdit ? "Update User" : "Create User"}
        </Button>
      </form>
    </Modal>
  );
}