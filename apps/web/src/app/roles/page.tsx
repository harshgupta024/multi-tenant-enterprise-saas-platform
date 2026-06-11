"use client";

import React, { useState } from "react";
import DashboardShell from "../../components/DashboardShell";

interface PermissionRow {
  resource: string;
  icon: string;
  view: boolean;
  edit: boolean;
  create: boolean | null; // null represents "-"
  delete: boolean | null;
  admin: boolean | null;
}

export default function RolesPage() {
  const roles = ["Global Admin", "Org Manager", "Team Lead", "Employee", "Viewer"];
  const [activeRole, setActiveRole] = useState("Global Admin");

  const [permissions, setPermissions] = useState<Record<string, PermissionRow[]>>({
    "Global Admin": [
      { resource: "Dashboard", icon: "dashboard", view: true, edit: true, create: null, delete: null, admin: null },
      { resource: "Users & Teams", icon: "group", view: true, edit: true, create: true, delete: true, admin: true },
      { resource: "Billing", icon: "payments", view: true, edit: true, create: null, delete: null, admin: true },
    ],
    "Employee": [
      { resource: "Dashboard", icon: "dashboard", view: true, edit: false, create: null, delete: null, admin: null },
      { resource: "Users & Teams", icon: "group", view: true, edit: false, create: false, delete: false, admin: false },
      { resource: "Billing", icon: "payments", view: false, edit: false, create: null, delete: null, admin: false },
    ]
  });

  const activePermissions = permissions[activeRole] || [
    { resource: "Dashboard", icon: "dashboard", view: true, edit: false, create: null, delete: null, admin: null },
    { resource: "Users & Teams", icon: "group", view: true, edit: false, create: false, delete: false, admin: false },
    { resource: "Billing", icon: "payments", view: false, edit: false, create: null, delete: null, admin: false },
  ];

  const handleToggle = (index: number, field: "view" | "edit" | "create" | "delete" | "admin") => {
    setPermissions((prev) => {
      const currentList = prev[activeRole] ? [...prev[activeRole]] : [...activePermissions];
      const targetRow = { ...currentList[index] };
      
      if (targetRow[field] !== null) {
        targetRow[field] = !targetRow[field] as any;
      }
      
      currentList[index] = targetRow;
      return {
        ...prev,
        [activeRole]: currentList
      };
    });
  };

  return (
    <DashboardShell>
      <div className="space-y-lg relative">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-xl pb-md border-b border-white/5">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface text-[24px] font-bold mb-xs">Roles &amp; Permissions</h2>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">Manage access control and define granular permissions across the organization.</p>
          </div>
          <button className="bg-primary text-on-primary px-md py-sm rounded-md text-xs font-semibold hover:bg-primary-fixed-dim transition-colors active:scale-[0.98] flex items-center gap-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Role
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-lg flex-1 pb-3xl">
          {/* Roles Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-surface-container-low border border-white/5 rounded-xl p-sm flex flex-col gap-xs">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`w-full text-left px-md py-2 rounded-md text-xs font-medium border-l-2 transition-all ${
                    activeRole === role
                      ? "bg-white/5 text-on-surface border-primary font-semibold"
                      : "text-on-surface-variant border-transparent hover:bg-white/5 hover:text-on-surface"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Permission Matrix Canvas */}
          <div className="flex-1 bg-surface border border-white/5 rounded-xl overflow-hidden shadow-lg relative">
            <div className="p-lg border-b border-white/5 flex justify-between items-center bg-surface-container-lowest/50">
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">{activeRole} Permissions</h3>
                <p className="font-label-md text-label-md text-on-surface-variant mt-xs text-[11px]">Define granular access to system resources.</p>
              </div>
              <span className="px-sm py-xs bg-primary/10 text-primary rounded-full font-code-sm text-xs border border-primary/20">System Custom</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-surface-container-low text-xs">
                    <th className="p-md font-semibold text-on-surface-variant w-1/3">Resource Category</th>
                    <th className="p-md font-semibold text-on-surface-variant text-center">View</th>
                    <th className="p-md font-semibold text-on-surface-variant text-center">Edit</th>
                    <th className="p-md font-semibold text-on-surface-variant text-center">Create</th>
                    <th className="p-md font-semibold text-on-surface-variant text-center">Delete</th>
                    <th className="p-md font-semibold text-on-surface-variant text-center">Admin</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-white/5">
                  {activePermissions.map((row, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="p-md text-on-surface font-medium flex items-center gap-sm">
                        <span className="material-symbols-outlined text-outline text-[18px]">{row.icon}</span>
                        {row.resource}
                      </td>
                      
                      {/* View Column */}
                      <td className="p-md text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.view}
                            onChange={() => handleToggle(index, "view")}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-surface-bright rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                        </label>
                      </td>

                      {/* Edit Column */}
                      <td className="p-md text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.edit}
                            onChange={() => handleToggle(index, "edit")}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-surface-bright rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                        </label>
                      </td>

                      {/* Create Column */}
                      <td className="p-md text-center text-outline-variant">
                        {row.create === null ? (
                          "-"
                        ) : (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={row.create}
                              onChange={() => handleToggle(index, "create")}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-surface-bright rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                          </label>
                        )}
                      </td>

                      {/* Delete Column */}
                      <td className="p-md text-center text-outline-variant">
                        {row.delete === null ? (
                          "-"
                        ) : (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={row.delete}
                              onChange={() => handleToggle(index, "delete")}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-surface-bright rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                          </label>
                        )}
                      </td>

                      {/* Admin Column */}
                      <td className="p-md text-center text-outline-variant">
                        {row.admin === null ? (
                          "-"
                        ) : (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={row.admin}
                              onChange={() => handleToggle(index, "admin")}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-surface-bright rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                          </label>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Floating Save Bar */}
        <div className="fixed bottom-0 left-[240px] right-0 p-md bg-surface-container/90 backdrop-blur-md border-t border-white/5 flex justify-end items-center z-30 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.5)]">
          <div className="flex gap-md mr-lg">
            <button className="px-4 py-2 rounded-md text-xs font-semibold border border-white/10 text-on-surface hover:bg-white/5 transition-colors active:scale-[0.98]">
              Discard Changes
            </button>
            <button className="bg-primary text-on-primary px-4 py-2 rounded-md text-xs font-semibold hover:bg-primary-fixed-dim transition-colors active:scale-[0.98] shadow-[0_0_15px_rgba(192,193,255,0.3)]">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
