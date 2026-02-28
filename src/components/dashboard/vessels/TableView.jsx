"use client";

import React, { useState } from "react";
import { Ban, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@mantine/core";
import { Pagination } from "@mantine/core";

export default function TableView({ vessels, onDeleteMany, onEdit, isAdmin }) {
  const [selectedIds, setSelectedIds] = useState([]);
const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const isAllSelected =
  vessels.length > 0 && selectedIds.length === vessels.length;

  const isIndeterminate =
  selectedIds.length > 0 && selectedIds.length < vessels.length;

  const toggleSelectAll = () => {
  if (!vessels?.length) return;

  if (isAllSelected) {
    setSelectedIds([]);
  } else {
    setSelectedIds(vessels.map((u) => u.id));
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

  const totalPages = Math.ceil(vessels.length / itemsPerPage);

  const paginatedData = vessels.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  return (
    <>
    <div className="bg-white dark:bg-[#161b2b]
dark:border-slate-800/50 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-xl mb-12">
      
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
        <table className="w-full text-left min-w-[600px]">
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
                Country
              </th>
              <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest">
                Imo
              </th>
              <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest">
                Year
              </th>
              {isAdmin == "ADMIN" && (
              <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest text-right">
                Action
              </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {paginatedData.map((vessel) => {
              const isSelected = selectedIds.includes(vessel.id);

              return (
                <tr
                  key={vessel.id}
                  className={`hover:bg-slate-50/80 hover:dark:bg-[#222a42] rounded-[2rem] transition-colors group ${
                    isSelected ? "bg-blue-50/50" : ""
                  }`}
                >
                  {isAdmin == "ADMIN" && (
                    <td className="px-6 md:px-10 py-6">
                   <Checkbox
                      checked={isSelected}
                      onChange={() => toggleSelectOne(vessel.id)}
                      />
                  </td>
                    )}

                  <td className="px-6 md:px-10 py-6 font-bold text-slate-900 dark:text-slate-100">
                    {vessel.name}
                  </td>

                  <td className="px-6 md:px-10 py-6 dark:text-slate-100">
                    {vessel.country}
                  </td>

                  <td className="px-6 md:px-10 py-6 dark:text-slate-100">
                    {vessel.imo}
                  </td>

                  <td className="px-6 md:px-10 py-6 dark:text-slate-100">
                    {vessel.year}
                  </td>

                  {isAdmin == "ADMIN" && (
                    <td className="px-6 md:px-10 py-6 text-right flex flex-wrap justify-end gap-2">
                    <button
                        onClick={() => onEdit(vessel)}
                        className="p-2 text-slate-300 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onDeleteMany(vessel.id)}
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