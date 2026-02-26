"use client";

import React, { useState } from "react";
import {
  Modal,
  PasswordInput,
  Button,
  Stack,
  Text,
} from "@mantine/core";
import { Lock, ShieldAlert } from "lucide-react";
import { notifications } from "@mantine/notifications";

export default function SuspendModal({
  opened,
  onClose,
  user,
  onSuspend,
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!password) {
      setError("Password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onSuspend(user.id, password);

      setPassword("");
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Verifikasi Admin"
      centered
      radius="xl"
    >
      <Stack>
        <Text size="sm" c="dimmed">
          Untuk suspend user{" "}
          <strong>{user?.name}</strong>,
          masukkan password admin Anda.
        </Text>

        <PasswordInput
          label="Password Admin"
          placeholder="Masukkan password"
          leftSection={<Lock size={14} />}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          error={error}
        />

        <Button
          color="red"
          fullWidth
          loading={loading}
          leftSection={<ShieldAlert size={16} />}
          onClick={handleSubmit}
        >
          Konfirmasi Suspend
        </Button>
      </Stack>
    </Modal>
  );
}