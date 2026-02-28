"use client";

import React, { useState } from "react";
import { Ban, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@mantine/core";
import { Pagination } from "@mantine/core";

export default function TableView({ users, onSuspend, onDeleteMany }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const isAllSelected =
  users.length > 0 && selectedIds.length === users.length;

  const isIndeterminate =
  selectedIds.length > 0 && selectedIds.length < users.length;

  const toggleSelectAll = () => {
  if (!users?.length) return;

  if (isAllSelected) {
    setSelectedIds([]);
  } else {
    setSelectedIds(users.map((u) => u.id));
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

  const totalPages = Math.ceil(users.length / itemsPerPage);

    const paginatedData = users.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

  return (
    <>
    <div className="bg-white dark:bg-[#161b2b] rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800/50 shadow-xl mb-12">
      
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
              <th className="px-6 md:px-10 py-5">
               <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest">
                Full Name
              </th>
              <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest">
                Email Address
              </th>
              <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest">
                Role
              </th>
              <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 dark:text-slate-100 uppercase tracking-widest text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {paginatedData.map((user) => {
              const isSelected = selectedIds.includes(user.id);

              return (
                <tr
                  key={user.id}
                  className={`hover:bg-slate-50/80 hover:dark:bg-[#222a42] transition-colors group ${
                    isSelected ? "bg-blue-50/50" : ""
                  }`}
                >
                  <td className="px-6 md:px-10 py-6">
                   <Checkbox
                      checked={isSelected}
                      onChange={() => toggleSelectOne(user.id)}
                    />
                  </td>

                  <td className="px-6 md:px-10 py-6 font-bold text-slate-900 dark:text-slate-100">
                    {user.name}
                  </td>

                  <td className="px-6 md:px-10 py-6 text-slate-500 dark:text-slate-100">
                    {user.email}
                  </td>

                  <td className="px-6 md:px-10 py-6">
                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-slate-100 text-slate-600">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 md:px-10 py-6">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${user.status == "ACTIVE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"} `}>
                      {user.status}
                    </span>
                  </td>

                 <td className="px-6 md:px-10 py-6 text-right space-x-2">
                    <button
                        onClick={() => onSuspend(user)}
                        className="cursor-pointer p-2 text-slate-300 hover:text-yellow-600 transition-colors"
                    >
                        <Ban className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onDeleteMany(user.id)}
                        className="cursor-pointer p-2 text-slate-300 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    </td>
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