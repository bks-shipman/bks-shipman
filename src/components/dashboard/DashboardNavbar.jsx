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
import { ChevronDown, Key, LogOut } from "lucide-react";
import { modals } from "@mantine/modals";
import { KeyRound } from "lucide-react";
import PasswordModal from "@/components/dashboard/settings/PasswordModal";
export default function DashboardNavbar({
  toggle,
  opened,
}) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const user = getUser();
  
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
      >
        <Sidebar />
      </Drawer>

      {/* Right-side user controls */}
      <div className="mr-4 cursor-pointer flex items-center gap-2">
        {/* Dark mode toggle */}
        {/* <Button
          variant="transparent"
          onClick={() => setDarkMode((val) => !val)}
          className="relative"
        >
          <Icon
            icon="mdi:moon-waning-crescent"
            width={20}
            height={20}
            className={`transition-all duration-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              darkMode ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
            }`}
          />
          <Icon
            icon="mdi:weather-sunny"
            width={22}
            height={22}
            className={`transition-all duration-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              darkMode ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
            }`}
          />
        </Button> */}

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
          <button className="flex items-center gap-3 px-3 py-2 bg-slate-50 border border-slate-100 rounded-full hover:bg-white hover:shadow-lg transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.slice(0, 1)}
            </div>
              <span className="text-sm font-bold text-slate-900 hidden sm:block">{user?.name}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </Menu.Target>

        <Menu.Dropdown
          className="!bg-white/95 backdrop-blur-xl !border !border-slate-100 !rounded-3xl shadow-2xl shadow-slate-900/10 p-3"
        >
          {/* Signed in section */}
          <div className="px-4 py-3 border-b border-slate-50 mb-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Signed in as
            </p>
            <p className="text-sm font-bold text-slate-900 truncate">
              {user?.email}
            </p>
          </div>

          {/* Change password */}
          <Menu.Item
            // component={Link}
            onClick={openChangePassword}
            className="!rounded-2xl !text-slate-600 hover:!bg-blue-50 hover:!text-blue-600 font-medium text-sm"
          >
            <Flex align="center" gap={8}>
              <Key size={16} />
              Change Password
            </Flex>
          </Menu.Item>

          <div className="h-[1px] bg-slate-50 my-2"></div>

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
