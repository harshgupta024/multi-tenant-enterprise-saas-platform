"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Organizations", href: "/organizations", icon: "corporate_fare" },
    { name: "Users", href: "/users", icon: "group" },
    { name: "Roles & Permissions", href: "/roles", icon: "verified_user" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="bg-background text-on-background min-h-screen flex antialiased">
      {/* ─── Sidebar Navigation (Desktop) ─── */}
      <aside className="hidden md:flex bg-surface-container-low border-r border-outline-variant shadow-md fixed left-0 top-0 h-full w-[240px] flex-col py-md z-50">
        {/* Brand Header */}
        <div className="px-lg mb-xl flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-on-primary font-bold">
              <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-on-surface leading-none text-[16px]">Enterprise SaaS</h1>
              <p className="font-label-md text-label-md text-on-surface-variant text-[11px] mt-0.5">Admin Console</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors">unfold_more</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto font-body-md text-body-md space-y-1 px-sm">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-2 px-4 transition-colors rounded-r-lg border-l-2 active:scale-[0.98] transition-transform duration-150 ${
                  active
                    ? "bg-white/5 text-on-surface border-primary font-medium"
                    : "text-on-surface-variant border-transparent hover:bg-white/5 hover:text-on-surface"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings Footer */}
        <div className="px-sm pt-sm border-t border-outline-variant/30 mt-auto">
          <Link
            href="/settings"
            className={`flex items-center gap-3 py-2 px-4 transition-colors rounded-r-lg border-l-2 active:scale-[0.98] transition-transform duration-150 ${
              isActive("/settings")
                ? "bg-white/5 text-on-surface border-primary"
                : "text-on-surface-variant border-transparent hover:bg-white/5 hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* ─── Mobile Sidebar ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <aside
            className="bg-surface-container-low w-[240px] h-full flex flex-col py-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Brand Header */}
            <div className="px-lg mb-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-on-primary font-bold">
                <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
              </div>
              <div>
                <h1 className="font-headline-md text-headline-md font-bold text-on-surface leading-none text-[16px]">Enterprise SaaS</h1>
              </div>
            </div>

            {/* Links */}
            <nav className="flex-1 space-y-1 px-sm">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 py-2 px-4 rounded-r-lg border-l-2 ${
                      active
                        ? "bg-white/5 text-on-surface border-primary"
                        : "text-on-surface-variant border-transparent hover:bg-white/5 hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* ─── Main Content Wrapper ─── */}
      <div className="flex-1 flex flex-col md:ml-[240px] min-h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm fixed top-0 right-0 w-full md:w-[calc(100%-240px)] z-40 flex justify-between items-center h-16 px-lg font-label-md text-label-md">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-on-surface-variant hover:text-on-surface mr-4"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              className="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-1.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/50"
              placeholder="Search..."
              type="text"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <kbd className="font-code-sm text-code-sm px-1.5 py-0.5 rounded bg-surface-container-high border border-outline-variant text-on-surface-variant">
                ⌘
              </kbd>
              <kbd className="font-code-sm text-code-sm px-1.5 py-0.5 rounded bg-surface-container-high border border-outline-variant text-on-surface-variant">
                K
              </kbd>
            </div>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex gap-4 mr-4 border-r border-outline-variant pr-4">
              <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">
                Docs
              </a>
              <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">
                Support
              </a>
            </div>
            <button className="hover:bg-surface-bright/10 rounded-full p-2 transition-all text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="hover:bg-surface-bright/10 rounded-full p-2 transition-all text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">dark_mode</span>
            </button>
            <img
              alt="User Profile"
              className="w-8 h-8 rounded-full border border-outline-variant cursor-pointer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg7u9_p4hdR7vyukwMy_wNO-HQW43rOxEmppGswMH0bDxtEvOw4BiiNqvGOGQYryzPoX0iEKpszw-Sp-FR5n9zHTPGltfKwRczBe2V7J18e7Fnu5oc6tnc0e8oIcz4djtKPrEAIjJpTq4ukUy3-ASHumv_jdzTRCBzR-W7rgBSejGi6GlNUfA-fNPUaZnqPBJ8ecuXAXIXjaAkkm0Ew3UhHuQDqt5SFYJYv2eCwNLUM4cAgz2t5uO4S0uQMEzF9OruoUrwQ_ISFV8"
            />
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 mt-16 p-margin md:p-xl max-w-[1440px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
