"use client";

import React, { useState } from "react";
import { Ban, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@mantine/core";
import ReadMore from "@/components/ReadMore";
import dayjs from "dayjs";
import { Pagination } from "@mantine/core";

export default function TableView({ exhibitions, onDeleteMany, onEdit, isAdmin }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // mau berapa data per halaman

  const isAllSelected =
  exhibitions.length > 0 && selectedIds.length === exhibitions.length;

  const isIndeterminate =
  selectedIds.length > 0 && selectedIds.length < exhibitions.length;

  const toggleSelectAll = () => {
  if (!exhibitions?.length) return;

  if (isAllSelected) {
    setSelectedIds([]);
  } else {
    setSelectedIds(exhibitions.map((u) => u.id));
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

    if (onDeleteMany) {
      onDeleteMany(selectedIds);
    }

    setSelectedIds([]);
  };
const formattedDate = (dateStr) => {
        return dayjs(dateStr).format('MMMM, DD YYYY');
    }

    const totalPages = Math.ceil(exhibitions.length / itemsPerPage);

    const paginatedData = exhibitions.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  return (
    <>
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
              {isAdmin == "ADMIN" && (

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
              <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest">
                Date
              </th>
              {isAdmin == "ADMIN" && (
                <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest text-right">
                Action
              </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {paginatedData?.map((exhibition) => {
              const isSelected = selectedIds.includes(exhibition.id);

              return (
                <tr
                  key={exhibition.id}
                  className={`hover:bg-slate-50/80 hover:dark:bg-[#222a42] rounded-4xl transition-colors group ${
                    isSelected ? "bg-blue-50/50" : ""
                  }`}
                >
                  {isAdmin == "ADMIN" && (
                  <td className="px-6 md:px-10 py-6">
                   <Checkbox
                      checked={isSelected}
                      onChange={() => toggleSelectOne(exhibition.id)}
                    />
                  </td>
                    )}

                  <td className="px-6 md:px-10 py-6 font-bold text-slate-900dark:text-slate-100">
                    {exhibition.name}
                  </td>

                  <td className="px-6 md:px-10 py-6 text-slate-500 dark:text-slate-100">
                   {formattedDate(exhibition.date)}                          
                  </td>

                    {isAdmin == "ADMIN" && (
                 <td className="px-6 md:px-10 py-6 text-right flex flex-wrap justify-end gap-2">
                    <button
                        onClick={() => onEdit(exhibition)}
                        className="p-2 text-slate-300 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onDeleteMany(exhibition.id)}
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
    </>
  );
}