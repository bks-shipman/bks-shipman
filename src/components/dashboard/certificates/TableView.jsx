"use client";

import React, { useState } from "react";
import { Ban, File, Pencil, Trash2 } from "lucide-react";
import { Checkbox, Text } from "@mantine/core";
import { Pagination } from "@mantine/core";
import { deleteCertificates, getCertificateData } from "@/utils/api/dashboard/certificates";
import useSWR from "swr";
import Loading from "@/components/Loading";
import CertificateModal from "./CertificateModal";
import { getUser } from "@/utils/auth";
import { nprogress } from "@mantine/nprogress";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

const fetcher = async () => {
    return await getCertificateData();
};
export default function TableView() {
 const user = getUser();
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [opened, setOpened] = useState(false); 
    const [selectedIds, setSelectedIds] = useState([]);
    const [page, setPage] = useState(1);
    
    const itemsPerPage = 5;
    const { data, error, isLoading, mutate } = useSWR(
        "certificates",
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );
// const dataList = Array.isArray(data) ? data : []; 
    const isAdmin = user?.role === "ADMIN"; // Lebih aman menggunakan perbandingan langsung

    const handleCreate = () => {
        setSelectedCertificate(null);
        setOpened(true);
    };

    const handleEdit = (certificate) => {
        setSelectedCertificate(certificate);
        setOpened(true);
    };

    const openDeleteConfirm = (ids) => {
        modals.openConfirmModal({
            title: "Konfirmasi Hapus",
            centered: true,
            children: (
                <Text size="sm">
                    Apakah kamu yakin ingin menghapus{" "}
                    <strong>
                        {Array.isArray(ids) ? `${ids.length} data terpilih` : "data ini"}
                    </strong>
                    ?
                </Text>
            ),
            labels: { confirm: "Ya", cancel: "Tidak" },
            confirmProps: { color: "red" },
            onConfirm: () => handleDeleteMany(ids),
        });
    };

    const handleDeleteMany = async (ids) => {
        try {
            nprogress.start()
            const idArray = Array.isArray(ids) ? ids : [ids];

            const res = await deleteCertificates(idArray);
            notifications.show({
                title: "Berhasil",
                message: res?.message || "Berhasil menghapus data",
                color: "green",
            });
            // Kosongkan seleksi setelah berhasil dihapus
            setSelectedIds([]); 
        } catch (err) {
            notifications.show({
                title: "Gagal",
                message:
                    err?.response?.data?.message ||
                    "Terjadi Kesalahan Saat Menghapus Data",
                color: "red",
            });
        } finally {
            nprogress.complete()
            await mutate();
        }
    };

    // PERBAIKAN 3: Gunakan dataList untuk semua perhitungan
    const isAllSelected = data?.certificates.length > 0 && selectedIds.length === data?.certificates.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < data?.certificates.length;

    const toggleSelectAll = () => {
        if (data?.certificates.length === 0) return;

        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(data?.certificates.map((u) => u.id));
        }
    };

    const toggleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((i) => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) return;

        openDeleteConfirm(selectedIds);
    };

    // PERBAIKAN 4: Pastikan totalPages minimal 1 agar Pagination tidak error
    const calculatedTotalPages = Math.ceil(data?.certificates.length / itemsPerPage);
    const totalPages = calculatedTotalPages > 0 ? calculatedTotalPages : 1;

    // Gunakan data?.certificates untuk slice
    const paginatedData = data?.certificates.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 font-bold">Failed to load data.</p>
            </div>
        );
    }
  return (
    <>
      <div className="w-full space-y-8 md:space-y-10">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 lg:mb-12">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2 dark:text-slate-100">
                        Certificates Management
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base">Manage the certificates data.</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={handleCreate}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all  bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 cursor-pointer`}
                    >
                        <File className="w-4 h-4" /> Add Certificate
                    </button>
                )}
            </header>
            <div className="max-w-6xl mx-auto pb-12">
                <div className="bg-white dark:bg-[#161b2b]
dark:border-slate-800/50 rounded-4xl md:rounded-[2.5rem] border border-slate-200 shadow-xl mb-12">
      
      {/* DELETE SELECTED BUTTON */}
      {selectedIds.length > 0 && (
        <div className="px-6 md:px-10 py-4 flex justify-between items-center bg-red-50 border-b border-red-100">
          <span className="text-sm font-semibold text-red-600">
            {selectedIds.length} selected
          </span>

          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-700 transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-150">
          <thead className="">
            <tr>
              {isAdmin && (
              <th className="px-6 md:px-10 py-5">
               <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={toggleSelectAll}
                />
              </th>
              )}
              <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest">
                Name
              </th>
              {isAdmin && (
              <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest text-right">
                Action
              </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {paginatedData.map((certificate) => {
              const isSelected = selectedIds.includes(certificate.id);

              return (
                <tr
                  key={certificate.id}
                  className={`hover:bg-slate-50/80 hover:dark:bg-[#222a42] rounded-4xl transition-colors group ${
                    isSelected ? "bg-blue-50/50" : ""
                  }`}
                >
                  {isAdmin && (
                    <td className="px-6 md:px-10 py-6">
                   <Checkbox
                      checked={isSelected}
                      onChange={() => toggleSelectOne(certificate.id)}
                      />
                  </td>
                    )}

                  <td className="px-6 md:px-10 py-6 font-bold text-slate-900 dark:text-slate-100">
                    {certificate.name}
                  </td>

                  {isAdmin && (
                    <td className="px-6 md:px-10 py-6 text-right flex flex-wrap justify-end gap-2">
                    <button
                        onClick={() => handleEdit(certificate)}
                        className="p-2 text-slate-300 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => openDeleteConfirm(certificate.id)}
                        className="p-2 text-slate-300 hover:text-red-600 cursor-pointer transition-colors"
                        >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    </td>
            )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    <div className="flex justify-center py-6">
      <Pagination
        value={page}
        onChange={setPage}
        total={totalPages}
      />
    </div>
            </div>
            <CertificateModal
                opened={opened}
                onClose={() => setOpened(false)}
                certificate={selectedCertificate}
                onSuccess={mutate}
            />
        </div>
   
    </>
  );
}