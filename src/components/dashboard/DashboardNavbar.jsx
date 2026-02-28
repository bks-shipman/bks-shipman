"use client";

import React, { useEffect, useState } from "react";
import {
  Burger,
  Button,
  Drawer,
  Flex,
  Menu,
  Text,
} from "@mantine/core";
import Sidebar from "./Sidebar";
import NextImage from "next/image";
import Link from "next/link";
import Image from "next/image";
import { getUser, logoutUser } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { ChevronDown, KeyRound, LogOut } from "lucide-react";
import { modals } from "@mantine/modals";
import { useMantineColorScheme, ActionIcon, Group } from '@mantine/core';
import { Sun, Moon } from 'lucide-react';
import PasswordModal from "@/components/dashboard/settings/PasswordModal";
export default function DashboardNavbar({
  toggle,
  opened,
}) {
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  
  const user = getUser();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  
  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
   const openChangePassword = () => {
    modals.open({
      title: "Change Password",
      centered: true,
      size: "md",
      radius: "xl",
      children: <PasswordModal />,
    });
  };

  const dark = colorScheme === 'dark';


  return (
    <>
      {/* Burger menu for small screens */}
      <Burger
        onClick={toggle}
        opened={opened}
        size="md"
        className="ml-4 duration-[400ms]"
      />

      {/* Drawer for mobile sidebar */}
      <Drawer
        hiddenFrom="sm"
        opened={opened}
        onClose={toggle}
        overlayProps={{ backgroundOpacity: 0.3, blur: 2 }}
        padding="md"
        lockScroll={false}
      >
        <Sidebar />
      </Drawer>

      {/* Right-side user controls */}
      <div className="mr-4 cursor-pointer flex items-center gap-2">
        {/* Dark mode toggle */}
       <ActionIcon
  variant="default"
  onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
  size="lg"
  radius="xl"
>
  {colorScheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
</ActionIcon>

        {/* Profile menu */}
      <Menu
        width={260}
        position="bottom-end"
        offset={12}
        shadow="xl"
        radius="xl"
        transitionProps={{ transition: "pop-top-right", duration: 200 }}
      >
        <Menu.Target>
          <button className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-[#161b2b] border border-slate-100 dark:border-slate-800/50 rounded-full hover:bg-white dark:hover:bg-[#1b1f2c] hover:shadow-lg transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-[#222a42] flex items-center justify-center text-white dark:text-slate-100 text-xs font-bold">
              {user?.name?.slice(0, 1)}
            </div>
              <span className="text-sm font-bold text-slate-900 hidden sm:block dark:text-slate-100">{user?.name}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </Menu.Target>

        <Menu.Dropdown
          className="!bg-white/95 dark:bg-[#161b2b]! backdrop-blur-xl !border !border-slate-100 dark:border-slate-800/50! !rounded-3xl shadow-2xl shadow-slate-900/10 p-3"
        >
          {/* Signed in section */}
          <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 mb-2">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest">
              Signed in as
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {user?.email}
            </p>
          </div>

          {/* Change password */}
          <Menu.Item
            // component={Link}
            onClick={openChangePassword}
            className="!rounded-2xl !text-slate-600 dark:text-slate-100! hover:!bg-blue-50 hover:!text-blue-600 font-medium text-sm"
          >
            <Flex align="center" gap={8}>
              <KeyRound size={16} />
              Change Password
            </Flex>
          </Menu.Item>

          <div className="h-[1px] bg-slate-50 dark:bg-slate-800/50 my-2"></div>

          {/* Logout */}
          <Menu.Item
            onClick={handleLogout}
            className="!rounded-2xl !text-red-500 hover:!bg-red-50 font-bold text-sm"
          >
            <Flex align="center" gap={8}>
              <LogOut size={16} />
              Logout
            </Flex>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      </div>
    </>
  );
}
