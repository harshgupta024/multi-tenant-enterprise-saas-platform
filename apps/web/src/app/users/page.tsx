"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "../../components/DashboardShell";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  department?: string;
  avatarUrl?: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("employee");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch users from API (with local fallback if API fails)
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("http://localhost:4000/api/users", {
          headers: {
            "X-Tenant-ID": "mock-tenant-id", // simulate header tenant context
            "Authorization": "Bearer mock-token" // mocked authentication
          }
        });
        if (res.ok) {
          const json = await res.json();
          setUsers(json.data || []);
        } else {
          throw new Error("API failed");
        }
      } catch (err) {
        // Fallback mock users
        setUsers([
          { id: "mock-user-1", firstName: "Sarah", lastName: "Jenkins", email: "sarah.j@enterprise.com", role: "tenant_admin", status: "active", department: "Engineering" },
          { id: "mock-user-2", firstName: "Michael", lastName: "Rodriguez", email: "m.rodriguez@enterprise.com", role: "manager", status: "inactive", department: "Marketing" },
          { id: "mock-user-3", firstName: "David", lastName: "Chen", email: "d.chen@enterprise.com", role: "employee", status: "pending", department: "Sales" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      const res = await fetch("http://localhost:4000/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-ID": "mock-tenant-id",
          "Authorization": "Bearer mock-token"
        },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });

      if (res.ok) {
        const json = await res.json();
        setToastMessage(`Invitation email sent to ${inviteEmail}!`);
        // Add user locally as pending
        setUsers((prev) => [
          ...prev,
          {
            id: json.data.id || Math.random().toString(),
            firstName: "Pending",
            lastName: "User",
            email: inviteEmail,
            role: inviteRole,
            status: "pending",
            department: "General"
          }
        ]);
        setInviteEmail("");
        setInviteOpen(false);
      } else {
        const errJson = await res.json();
        alert(errJson.message || "Failed to invite user");
      }
    } catch (err) {
      alert("Could not connect to API server. Ensure backend is running!");
    }
  };

  // Close toast after 4s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <DashboardShell>
      <div className="space-y-lg relative">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-4 right-4 z-50 bg-surface-container border border-outline-variant rounded-lg p-4 shadow-xl flex items-center gap-3 animate-fade-in-up">
            <span className="material-symbols-outlined text-tertiary">check_circle</span>
            <span className="text-xs text-on-surface font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface text-[24px]">Users</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-sm">Manage organization members, roles, and access controls.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="px-4 py-2 border border-outline-variant text-on-surface rounded-lg text-xs font-semibold hover:bg-white/5 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">download</span>
              Export
            </button>
            <button
              onClick={() => setInviteOpen(true)}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-fixed transition-colors flex items-center gap-2 shadow-lg shadow-primary/20 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              Invite User
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="bg-surface-container rounded-xl p-md border border-white/5 shadow-md flex items-center justify-between">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-1 text-xs">Total Users</p>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-[20px]">{users.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
          </div>
          <div className="bg-surface-container rounded-xl p-md border border-white/5 shadow-md flex items-center justify-between">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-1 text-xs">Active Today</p>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-[20px]">
                {users.filter(u => u.status === "active").length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
            </div>
          </div>
          <div className="bg-surface-container rounded-xl p-md border border-white/5 shadow-md flex items-center justify-between">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-1 text-xs">Pending Invites</p>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-[20px]">
                {users.filter(u => u.status === "pending").length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">mark_email_unread</span>
            </div>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="bg-surface-container-high rounded-t-xl border border-white/5 border-b-0 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-lg">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="px-3 py-1.5 border border-outline-variant text-on-surface-variant rounded-md text-xs font-medium opacity-50 cursor-not-allowed flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">edit</span>
              Edit Role
            </button>
            <button className="px-3 py-1.5 border border-outline-variant text-error rounded-md text-xs font-medium opacity-50 cursor-not-allowed flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">delete</span>
              Delete
            </button>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select className="bg-surface border border-outline-variant rounded-lg pl-3 pr-8 py-1.5 text-on-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Employee</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface border border-white/5 rounded-b-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant text-xs flex justify-center items-center gap-2">
              <span className="material-symbols-outlined animate-spin">autorenew</span> Loading users...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-surface-container-high/50 text-xs">
                    <th className="p-4 w-12">
                      <input className="rounded border-outline-variant/50 bg-transparent text-primary focus:ring-primary/50" type="checkbox"/>
                    </th>
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Department</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <input className="rounded border-outline-variant/50 bg-transparent text-primary focus:ring-primary/50" type="checkbox"/>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-surface-bright flex items-center justify-center text-primary font-bold text-xs uppercase">
                            {(user.firstName?.[0] || "")}{(user.lastName?.[0] || "")}
                          </div>
                          <div>
                            <div className="font-semibold text-on-surface">{user.firstName} {user.lastName}</div>
                            <div className="text-on-surface-variant font-mono text-[11px]">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant">{user.department || "N/A"}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-tertiary" : user.status === "pending" ? "bg-[#f59e0b]" : "bg-outline"}`}></div>
                          <span className="text-on-surface capitalize">{user.status}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-on-surface transition-all">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Invite User Dialog */}
        {inviteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-surface-container border border-outline-variant rounded-xl p-lg w-full max-w-md shadow-2xl animate-fade-in-up stagger-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-title-lg text-title-lg text-on-surface text-[18px] font-bold">Invite New Member</h3>
                <button onClick={() => setInviteOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-2">Email Address</label>
                  <input
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="member@org.com"
                    className="w-full bg-surface border border-outline-variant/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-2">Role Assignment</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="employee">Employee (View Only)</option>
                    <option value="manager">Manager (Create/Update Teams)</option>
                    <option value="tenant_admin">Tenant Admin (Full Access)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30 mt-6">
                  <button
                    type="button"
                    onClick={() => setInviteOpen(false)}
                    className="px-4 py-2 border border-outline-variant text-on-surface rounded-lg text-xs font-semibold hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-fixed transition-colors shadow-lg shadow-primary/20"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
