"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Ship,
  Building,
  Anchor,
  List,
  ChevronDown,
  ChevronRight,
  User,
  UsersRound,
  Building2,
  Info,
  Settings,
  CircleUserRound,
  HardHat,
  Cpu,
  Target,
  Eye,
  Wrench,
  CalendarCheck2,
  FileUser,
  Captions,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);

  const menus = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },

    { 
      label: "Company", 
      icon: Building2,
      children: [
        {
          label: "Profile", 
          icon: CircleUserRound,
          path: "/dashboard/company/profile" 
        },
        {
          label: "About Us", 
          icon: Info,
          path: "/dashboard/company/about-us" 
        },
        {
          label: "Captain", 
          icon: HardHat,
          path: "/dashboard/company/captain" 
        },
        {
          label: "Core Values", 
          icon: Cpu,
          path: "/dashboard/company/core-values" 
        },
        {
          label: "Vision & Mission", 
          icon: Target,
          path: "/dashboard/company/vision-mission" 
        },
        {
          label: "Services", 
          icon: Wrench,
          path: "/dashboard/company/services" 
        },
        ] 
      }, 

    {
      label: "Fleets",
      icon: Ship,
      children: [
        {
          label: "Registry",
          icon: Anchor,
          path: "/dashboard/vessels",
        },
        {
          label: "Vessel Type",
          icon: List,
          path: "/dashboard/vessel-types",
        },
      ],
    },
    { label: "Exhibitions", icon: CalendarCheck2, path: "/dashboard/exhibitions" },
    { label: "Careers", icon: FileUser, path: "/dashboard/careers" },
    { label: "Titles", icon: Captions, path: "/dashboard/titles" },
    {label: "Users", icon: UsersRound, path: "/dashboard/users"}
  ];

  // ✅ AUTO OPEN kalau child active
  useEffect(() => {
    menus.forEach((menu) => {
      if (menu.children?.some((child) => pathname === child.path)) {
        setOpenMenu(menu.label);
      }
    });
  }, [pathname]);

  return (
    <aside className="min-w-64 h-screen bg-white flex flex-col">
      {/* Logo */}
      <div className="flex flex-col justify-center py-4">
        <div className="bg-white p-2 rounded-full mx-auto mb-4">
          <Image
            src="/logo.png"
            alt="BKS SHIPMAN"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>

        <div className="mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Backoffice
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold italic tracking-tight text-nowrap">
            Command Center
          </h2>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="flex flex-col">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isDropdown = !!menu.children;
            const isOpen = openMenu === menu.label;

            const isChildActive =
              isDropdown &&
              menu.children.some((child) => pathname === child.path);

            const active = pathname === menu.path || isChildActive;

            return (
              <li key={menu.label}>
                {isDropdown ? (
                  <button
                    onClick={() =>
                      setOpenMenu(isOpen ? null : menu.label)
                    }
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                      active
                        ? "bg-blue-100 text-blue-600"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {menu.label}
                    </div>

                    {isOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <Link
                    href={menu.path}
                    onClick={() =>
                    setOpenMenu((prev) => (prev === menu.label ? null : menu.label))
                  }
                    className={`flex items-center gap-3 relative px-4 py-2 text-sm font-medium transition-all ${
                      active
                        ? "bg-blue-100 text-blue-600 shadow-lg shadow-blue-600/20"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {active && (
                      <div className="absolute h-full w-1 right-0 bg-blue-700 rounded-l-2xl"></div>
                    )}

                    <Icon className="w-5 h-5" />
                    {menu.label}
                  </Link>
                )}

                {isDropdown && (
                  <ul
                      className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                    {menu.children.map((child) => {
                      const childActive = pathname === child.path;
                      const ChildIcon = child.icon;

                      return (
                        <li key={child.label}>
                          <Link
                            href={child.path}
                            className={`flex items-center gap-3 px-4 py-2 text-sm rounded-xl transition ${
                              childActive
                                ? "bg-blue-600 text-white"
                                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                          >
                            <ChildIcon className="w-4 h-4" />
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}