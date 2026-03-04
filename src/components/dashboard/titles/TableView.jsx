"use client";

import React, { useState } from "react";
import { Ban, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@mantine/core";
import ReadMore from "@/components/ReadMore";

export default function TableView({ titles, onDeleteMany, onEdit, isAdmin }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const isAllSelected =
  titles.length > 0 && selectedIds.length === titles.length;

  const isIndeterminate =
  selectedIds.length > 0 && selectedIds.length < titles.length;

  const toggleSelectAll = () => {
  if (!titles?.length) return;

  if (isAllSelected) {
    setSelectedIds([]);
  } else {
    setSelectedIds(titles.map((u) => u.id));
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

  return (
    <div className="bg-white dark:bg-[#161b2b] rounded-4xl md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800/50 shadow-xl mb-12">
      
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
                Section
              </th>
              <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest">
                First Title (ID)
              </th>
              <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest">
                First Title (EN)
              </th>
             
              {isAdmin == "ADMIN" && (

                <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest text-right">
                Action
              </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {titles?.map((career) => {
              const isSelected = selectedIds.includes(career.id);

              return (
                <tr
                  key={career.id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-[#222a42] rounded-4xl transition-colors group ${
                    isSelected ? "bg-blue-50/50" : ""
                  }`}
                >
                  {isAdmin == "ADMIN" && (
                    <td className="px-6 md:px-10 py-6">
                   <Checkbox
                      checked={isSelected}
                      onChange={() => toggleSelectOne(career.id)}
                      />
                  </td>
                    )}

                  <td className="px-6 md:px-10 py-6 font-bold text-slate-900 dark:text-slate-100">
                    {career.type}
                  </td>
                  <td className="px-6 md:px-10 py-6 font-bold text-slate-900 dark:text-slate-100">
                    {career.title}
                  </td>
                  <td className="px-6 md:px-10 py-6 font-bold text-slate-900 dark:text-slate-100">
                    {career.title_en}
                  </td>

                  {isAdmin == "ADMIN" && (
                    <td className="px-6 md:px-10 py-6 text-right flex flex-wrap justify-end gap-2">
                    <button
                        onClick={() => onEdit(career)}
                        className="p-2 text-slate-300 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                        <Pencil className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onDeleteMany(career.id)}
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
  );
}