"use client";

import React from "react";
import DashboardShell from "../../components/DashboardShell";

export default function OrganizationsPage() {
  const orgs = [
    { name: "Acme Corp", initials: "AC", plan: "Enterprise", users: "1,245", status: "Active", statusColor: "text-tertiary bg-tertiary/10 border-tertiary/20", dotColor: "bg-tertiary", revenue: "$145,000", created: "Oct 12, 2023" },
    { name: "Global Tech", initials: "GT", plan: "Pro", users: "342", status: "Active", statusColor: "text-tertiary bg-tertiary/10 border-tertiary/20", dotColor: "bg-tertiary", revenue: "$24,500", created: "Nov 05, 2023" },
    { name: "Stark Industries", initials: "SI", plan: "Enterprise", users: "8,902", status: "Suspended", statusColor: "text-error bg-error/10 border-error/20", dotColor: "bg-error", revenue: "$0", created: "Jan 15, 2022" },
    { name: "Wayne Ent", initials: "WE", plan: "Enterprise", users: "4,512", status: "Active", statusColor: "text-tertiary bg-tertiary/10 border-tertiary/20", dotColor: "bg-tertiary", revenue: "$890,000", created: "Mar 02, 2021" },
    { name: "Cyberdyne", initials: "CD", plan: "Free", users: "12", status: "Pending", statusColor: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20", dotColor: "bg-[#f59e0b]", revenue: "$0", created: "Today" },
  ];

  return (
    <DashboardShell>
      <div className="space-y-md">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface text-[24px] font-bold">Organizations</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-sm">Manage enterprise tenants, billing plans, and status.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant/50 rounded bg-transparent hover:bg-white/5 text-on-surface transition-colors text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">download</span>
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded bg-primary text-on-primary hover:bg-primary-fixed transition-colors text-xs font-semibold shadow-[0_0_15px_rgba(192,193,255,0.15)]">
              <span className="material-symbols-outlined text-[16px]">add</span>
              Create New
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-surface border border-outline-variant/30 rounded-lg p-3 flex flex-wrap items-center gap-4 shadow-sm">
          <div className="flex-1 min-w-[200px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input
              className="w-full bg-surface-container border border-outline-variant/50 rounded text-on-surface placeholder:text-on-surface-variant/50 pl-9 pr-3 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-xs"
              placeholder="Filter organizations..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select className="appearance-none bg-surface-container border border-outline-variant/50 rounded text-on-surface pl-3 pr-8 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-xs cursor-pointer">
                <option value="">Status: All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">arrow_drop_down</span>
            </div>
            <div className="relative">
              <select className="appearance-none bg-surface-container border border-outline-variant/50 rounded text-on-surface pl-3 pr-8 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-xs cursor-pointer">
                <option value="">Plan: All</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">arrow_drop_down</span>
            </div>
            <button className="p-1.5 rounded text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-colors border border-outline-variant/30" title="Clear Filters">
              <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface border border-outline-variant/30 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-low/50 text-xs">
                  <th className="py-3 px-4 w-[40px]">
                    <input className="rounded border-outline-variant/50 bg-transparent text-primary focus:ring-primary/50" type="checkbox"/>
                  </th>
                  <th className="py-3 px-4 font-semibold hover:text-on-surface cursor-pointer group">
                    <div className="flex items-center gap-1">Org Name <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_downward</span></div>
                  </th>
                  <th className="py-3 px-4 font-semibold">Plan</th>
                  <th className="py-3 px-4 font-semibold hover:text-on-surface cursor-pointer group">
                    <div className="flex items-center gap-1">Users <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_downward</span></div>
                  </th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right hover:text-on-surface cursor-pointer group">
                    <div className="flex items-center justify-end gap-1">Revenue <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_downward</span></div>
                  </th>
                  <th className="py-3 px-4 font-semibold hover:text-on-surface cursor-pointer group">
                    <div className="flex items-center gap-1">Created <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_downward</span></div>
                  </th>
                  <th className="py-3 px-4 w-[40px]"></th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-outline-variant/10">
                {orgs.map((org, index) => (
                  <tr key={index} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="py-3 px-4">
                      <input className="rounded border-outline-variant/50 bg-transparent text-primary focus:ring-primary/50" type="checkbox"/>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center border border-outline-variant/30 text-primary font-bold text-xs">{org.initials}</div>
                        <span className="font-semibold text-on-surface">{org.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">{org.plan}</span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">{org.users}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${org.statusColor}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${org.dotColor}`}></div> {org.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-on-surface-variant">{org.revenue}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{org.created}</td>
                    <td className="py-3 px-4">
                      <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-on-surface transition-all">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="border-t border-outline-variant/30 px-4 py-3 flex items-center justify-between bg-surface-container-lowest/50 text-xs">
            <div className="text-on-surface-variant">
              Showing <span className="font-medium text-on-surface">1</span> to <span className="font-medium text-on-surface">5</span> of <span className="font-medium text-on-surface">42</span> results
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded border border-outline-variant/30 text-on-surface-variant hover:bg-white/5 hover:text-on-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-semibold">1</button>
                <button className="w-8 h-8 rounded hover:bg-white/5 text-on-surface-variant flex items-center justify-center transition-colors">2</button>
                <button className="w-8 h-8 rounded hover:bg-white/5 text-on-surface-variant flex items-center justify-center transition-colors">3</button>
                <span className="text-on-surface-variant px-1">...</span>
                <button className="w-8 h-8 rounded hover:bg-white/5 text-on-surface-variant flex items-center justify-center transition-colors">9</button>
              </div>
              <button className="p-1 rounded border border-outline-variant/30 text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
