"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Key,
  Database,
  Activity,
  Users,
  ArrowRight,
  Check,
  Globe,
  Terminal,
  Layers,
  ChevronRight,
  Zap,
  Server,
  Lock,
  RefreshCw,
  Bell
} from "lucide-react";

export default function Home() {
  const [selectedTenant, setSelectedTenant] = useState("Acme Corp");
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"database" | "security" | "rbac">("database");
  const [notifications, setNotifications] = useState(3);

  // Generate mock logs simulating tenant traffic
  useEffect(() => {
    const tenants = ["Acme Corp", "Globex Inc", "Initech LLC"];
    const actions = [
      "Accessed user registry",
      "Created query on Prisma Client",
      "Refreshed JWT token session",
      "Updated subscription tier to Enterprise",
      "Triggered Webhook event: invoice.paid",
      "Dispatched API request to healthcheck endpoint",
      "Authenticated team member via MFA"
    ];

    const interval = setInterval(() => {
      const randomTenant = tenants[Math.floor(Math.random() * tenants.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const timestamp = new Date().toLocaleTimeString();
      const newLog = `[${timestamp}] [TENANT: ${randomTenant}] - ${randomAction}`;
      setSimulationLogs((prev) => [newLog, ...prev.slice(0, 7)]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const tenantMockData: Record<string, { users: number; requests: string; dbSize: string; plan: string; health: string }> = {
    "Acme Corp": { users: 1240, requests: "1.2M / day", dbSize: "4.8 GB", plan: "Enterprise Premium", health: "99.99%" },
    "Globex Inc": { users: 850, requests: "820K / day", dbSize: "2.1 GB", plan: "Growth Scale", health: "99.98%" },
    "Initech LLC": { users: 140, requests: "95K / day", dbSize: "420 MB", plan: "Developer Sandbox", health: "100%" }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
      {/* ─── Glowing Ambient Background ─── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-30 blur-[130px] bg-gradient-to-b from-purple-900/60 via-indigo-900/20 to-transparent" />
      <div className="absolute top-[400px] right-10 w-96 h-96 pointer-events-none opacity-20 blur-[150px] bg-teal-500" />
      <div className="absolute top-[800px] left-10 w-96 h-96 pointer-events-none opacity-10 blur-[150px] bg-purple-600" />

      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-zinc-900/80 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
              Æ
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Aether
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#features" className="hover:text-white transition-colors">Core Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:4000/api/health"
              target="_blank"
              className="text-xs px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Health Server
            </a>
            <a
              href="/dashboard"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all active:scale-[0.98]"
            >
              Launch Demo
            </a>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-medium text-purple-300 mb-8 animate-fade-in">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          Production-Ready Enterprise Boilerplate
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 bg-gradient-to-b from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent">
          The Ultimate Platform for <br />
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
            Secure Multi-Tenant SaaS
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed mb-12">
          A production-grade architecture leveraging PostgreSQL Row-Level Security (RLS), custom RBAC auth, isolated tenant contexts, and premium real-time metrics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <a
            href="#demo"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Try Interactive Live Demo <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#architecture"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold border border-zinc-800 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Explore Tech Architecture
          </a>
        </div>

        {/* ─── Floating Dashboard Preview (Interactive Sandbox) ─── */}
        <div id="demo" className="relative max-w-5xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-xl shadow-2xl overflow-hidden p-1 md:p-2">
          {/* Glowing border outline */}
          <div className="absolute inset-0 rounded-2xl border border-purple-500/10 pointer-events-none" />

          {/* Top Panel Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="ml-4 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-purple-400" />
                https://aether-saas.com/dashboard
              </div>
            </div>

            {/* Tenant Switcher dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 font-medium hidden sm:inline">Active Tenant:</span>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer font-semibold"
              >
                <option value="Acme Corp">🏢 Acme Corp</option>
                <option value="Globex Inc">🏢 Globex Inc</option>
                <option value="Initech LLC">🏢 Initech LLC</option>
              </select>

              <button className="relative p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all">
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Simulated Workspace Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left Metrics Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-2 text-left">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span className="text-xs font-medium uppercase tracking-wider">Active Members</span>
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-white">
                    {tenantMockData[selectedTenant].users.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span>↑ 12% this month</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-2 text-left">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span className="text-xs font-medium uppercase tracking-wider">Requests / Vol</span>
                    <Activity className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-white">
                    {tenantMockData[selectedTenant].requests}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span>↑ 4.8% growth rate</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-2 text-left">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span className="text-xs font-medium uppercase tracking-wider">Isolated DB Size</span>
                    <Database className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-white">
                    {tenantMockData[selectedTenant].dbSize}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Row-Level Isolation (RLS)
                  </div>
                </div>
              </div>

              {/* Dynamic Chart Simulator */}
              <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 text-left">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-300">Isolated Query Throughput</h3>
                    <p className="text-xs text-zinc-500">Real-time database operations executing for {selectedTenant}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 font-semibold font-mono">
                    {tenantMockData[selectedTenant].plan}
                  </span>
                </div>

                {/* Simulated Chart Bars */}
                <div className="h-40 flex items-end gap-3 pt-4 border-b border-zinc-900">
                  {[45, 60, 30, 80, 95, 70, 85, 110, 90, 120, 135, 150].map((val, idx) => {
                    const multiplier = selectedTenant === "Initech LLC" ? 0.25 : selectedTenant === "Globex Inc" ? 0.7 : 1;
                    const heightVal = Math.round(val * multiplier);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative">
                        <div
                          style={{ height: `${Math.max(12, Math.min(100, (heightVal / 150) * 100))}%` }}
                          className="w-full rounded-t bg-gradient-to-t from-purple-900 via-purple-600 to-indigo-400 group-hover:to-teal-400 transition-all duration-500"
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[9px] font-mono text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {Math.round(heightVal * 100)} ops/s
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] text-zinc-600 mt-2 font-mono">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                </div>
              </div>
            </div>

            {/* Right Audit Log / Interactive Shell */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 text-left flex flex-col justify-between min-h-[300px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <h3 className="font-semibold text-sm text-zinc-300">Live RLS Context Logs</h3>
                  </div>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>

                <div className="space-y-2 max-h-[280px] overflow-y-auto font-mono text-[10px] text-zinc-400 leading-normal scrollbar-thin">
                  {simulationLogs.length === 0 ? (
                    <div className="text-zinc-600 italic py-4">Waiting for isolated DB activity...</div>
                  ) : (
                    simulationLogs.map((log, i) => {
                      const isSelected = log.includes(selectedTenant);
                      return (
                        <div
                          key={i}
                          className={`p-1.5 rounded transition-all duration-300 border ${
                            isSelected
                              ? "bg-purple-950/20 border-purple-500/20 text-purple-300"
                              : "border-transparent text-zinc-500 opacity-60"
                          }`}
                        >
                          {log}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900/60 mt-4 text-[11px] text-zinc-500 leading-relaxed space-y-2.5">
                <div className="flex justify-between">
                  <span>System Health:</span>
                  <span className="text-emerald-400 font-bold">{tenantMockData[selectedTenant].health}</span>
                </div>
                <div className="flex justify-between">
                  <span>Context Strategy:</span>
                  <span className="text-indigo-400 font-mono">AsyncLocalStorage</span>
                </div>
                <div className="flex justify-between">
                  <span>Isolation Protocol:</span>
                  <span className="text-purple-400 font-mono">Prisma Client Middleware</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section: Architecture ─── */}
      <section id="architecture" className="border-t border-zinc-900 bg-zinc-950/30 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Clean Architecture Built for Enterprise Scale
            </h2>
            <p className="text-zinc-400">
              A carefully structured monorepo separating infrastructure, database constraints, business domain, and UI components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-950/80 hover:border-purple-500/30 transition-all flex flex-col justify-between text-left">
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Row-Level Database Isolation</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  PostgreSQL Row-Level Security (RLS) guarantees that tenant queries are restricted at the database engine level. Tenants can never view or modify data from other organizations, satisfying strict enterprise compliance.
                </p>
              </div>
              <div className="mt-8 text-xs font-mono text-zinc-600">
                packages/database/prisma/schema.prisma
              </div>
            </div>

            <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-950/80 hover:border-indigo-500/30 transition-all flex flex-col justify-between text-left">
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Automatic Context Propagation</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Leveraging Node&apos;s native <code className="text-indigo-300 font-mono bg-indigo-950/40 px-1 py-0.5 rounded">AsyncLocalStorage</code>, the tenant context (tenantId, userId) flows transparently across HTTP handlers, business services, and database queries without prop-drilling.
                </p>
              </div>
              <div className="mt-8 text-xs font-mono text-zinc-600">
                apps/api/src/context/index.ts
              </div>
            </div>

            <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-950/80 hover:border-teal-500/30 transition-all flex flex-col justify-between text-left">
              <div>
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Granular RBAC Authorization</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  A comprehensive role-based access control engine. Define detailed permission structures (Admin, Editor, Viewer, Custom) that govern read/write operations for API paths and client UI views.
                </p>
              </div>
              <div className="mt-8 text-xs font-mono text-zinc-600">
                packages/shared-types/src/auth.ts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Interactive Feature Tabs Section ─── */}
      <section id="features" className="py-24 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Column Text */}
            <div className="lg:w-2/5 space-y-6 text-left">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                Designed to satisfy security auditors
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Click through the architectural pillars to inspect how Aether isolates operations at every layer, securing transactions from user session down to Postgres tables.
              </p>

              <div className="space-y-3 pt-4">
                <button
                  onClick={() => setActiveTab("database")}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    activeTab === "database"
                      ? "bg-zinc-950 border-purple-500/30 text-white shadow-lg shadow-purple-950/20"
                      : "border-zinc-900 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Database className={`w-5 h-5 ${activeTab === "database" ? "text-purple-400" : "text-zinc-600"}`} />
                    <span className="font-semibold text-sm">Postgres Tenant Isolation</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    activeTab === "security"
                      ? "bg-zinc-950 border-indigo-500/30 text-white shadow-lg shadow-indigo-950/20"
                      : "border-zinc-900 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield className={`w-5 h-5 ${activeTab === "security" ? "text-indigo-400" : "text-zinc-600"}`} />
                    <span className="font-semibold text-sm">Context Propagation (ALC)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </button>

                <button
                  onClick={() => setActiveTab("rbac")}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    activeTab === "rbac"
                      ? "bg-zinc-950 border-teal-500/30 text-white shadow-lg shadow-teal-950/20"
                      : "border-zinc-900 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Key className={`w-5 h-5 ${activeTab === "rbac" ? "text-teal-400" : "text-zinc-600"}`} />
                    <span className="font-semibold text-sm">Fine-Grained RBAC Rules</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </button>
              </div>
            </div>

            {/* Right Column Visual Code Showcase */}
            <div className="lg:w-3/5 w-full">
              <div className="rounded-xl border border-zinc-900 bg-zinc-950 shadow-2xl p-6 text-left font-mono text-xs overflow-x-auto min-h-[380px] flex flex-col justify-between">
                {activeTab === "database" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-900 pb-3">
                      <span>File: packages/database/prisma/schema.prisma</span>
                      <span className="text-[10px] text-purple-400">PostgreSQL Schema Definition</span>
                    </div>
                    <pre className="text-purple-300 leading-5">
{`model Tenant {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  status    TenantStatus @default(active)
  createdAt DateTime @default(now())
  users     User[]
  auditLogs AuditLog[]

  @@index([slug])
}

// Every application entity includes a tenantId relation
model User {
  id        String   @id @default(uuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  email     String   @unique
  password  String
  
  @@index([tenantId])
}`}
                    </pre>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-900 pb-3">
                      <span>File: apps/api/src/context/index.ts</span>
                      <span className="text-[10px] text-indigo-400">Node.js AsyncLocalStorage Context</span>
                    </div>
                    <pre className="text-indigo-300 leading-5">
{`import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  tenantId?: string;
  userId?: string;
  correlationId: string;
}

const contextStore = new AsyncLocalStorage<RequestContext>();

export function runWithContext(context: RequestContext, callback: () => void) {
  return contextStore.run(context, callback);
}

export function getTenantId(): string | undefined {
  return contextStore.getStore()?.tenantId;
}

export function getCorrelationId(): string {
  return contextStore.getStore()?.correlationId || 'system';
}`}
                    </pre>
                  </div>
                )}

                {activeTab === "rbac" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-900 pb-3">
                      <span>File: packages/shared-types/src/auth.ts</span>
                      <span className="text-[10px] text-teal-400">Role-Based Access Contract</span>
                    </div>
                    <pre className="text-teal-300 leading-5">
{`export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export type Permission = 
  | 'tenant:write' | 'tenant:read'
  | 'user:invite'  | 'user:remove' | 'user:view'
  | 'billing:manage' | 'billing:read'
  | 'audit:read';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  OWNER: [
    'tenant:write', 'tenant:read', 'user:invite', 
    'user:remove', 'user:view', 'billing:manage', 
    'billing:read', 'audit:read'
  ],
  ADMIN: [
    'tenant:read', 'user:invite', 'user:view', 
    'billing:read', 'audit:read'
  ],
  MEMBER: ['tenant:read', 'user:view'],
  VIEWER: ['tenant:read']
};`}
                    </pre>
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-900/60 mt-4 flex justify-between items-center text-[10px] text-zinc-500">
                  <span>Secure-by-default architecture</span>
                  <a href="#demo" className="text-purple-400 hover:underline flex items-center gap-1">
                    See interactive simulator <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─── */}
      <section id="pricing" className="py-24 border-t border-zinc-900 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Flexible Tiers for Scaling Enterprises
            </h2>
            <p className="text-zinc-400">
              Each tier is completely isolated at the row or schemas layer, complete with dedicated auth profiles and metrics logging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Dev Tier */}
            <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-950/60 text-left flex flex-col justify-between relative">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Developer Sandbox</h3>
                <p className="text-xs text-zinc-500 mb-6">For building prototypes and running API tests.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-zinc-500">/ forever free</span>
                </div>

                <ul className="space-y-3.5 text-xs text-zinc-400">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Single Isolated Tenant Profile</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Up to 150 registered users</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Shared Database Cluster</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Basic JWT Authentication</span>
                  </li>
                </ul>
              </div>
              <button className="w-full mt-8 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 text-xs font-semibold text-white transition-all">
                Access Sandbox
              </button>
            </div>

            {/* Growth Tier */}
            <div className="p-8 rounded-2xl border border-purple-500/30 bg-purple-950/10 text-left flex flex-col justify-between relative shadow-lg shadow-purple-950/20">
              <span className="absolute top-4 right-4 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Popular
              </span>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Growth Scale</h3>
                <p className="text-xs text-purple-300 mb-6">Ideal for growing SaaS applications and team operations.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl font-extrabold text-white">$49</span>
                  <span className="text-xs text-zinc-500">/ month</span>
                </div>

                <ul className="space-y-3.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Multiple Tenants Switcher support</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Up to 2,500 users per tenant</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Postgres Row-Level Isolation (RLS)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Hierarchical team access roles</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Webhooks + Stripe sync</span>
                  </li>
                </ul>
              </div>
              <button className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white transition-all shadow-md shadow-purple-600/20">
                Upgrade to Scale
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-950/60 text-left flex flex-col justify-between relative">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Enterprise Premium</h3>
                <p className="text-xs text-zinc-500 mb-6">Advanced governance, auditing, and bespoke databases.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl font-extrabold text-white">Custom</span>
                  <span className="text-xs text-zinc-500">/ annual contract</span>
                </div>

                <ul className="space-y-3.5 text-xs text-zinc-400">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Unlimited Tenant Accounts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Unlimited users + custom DB limits</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Dedicated Schema or Database instance</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Immutable Audit Log storage</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>SAML/SSO Authentication mapping</span>
                  </li>
                </ul>
              </div>
              <button className="w-full mt-8 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 text-xs font-semibold text-white transition-all">
                Contact Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-24 border-t border-zinc-900 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-20 blur-[130px] bg-purple-600 rounded-full" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-8">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Build with confidence on a <br />secure-by-default architecture
          </h2>
          <p className="max-w-xl mx-auto text-sm md:text-base text-zinc-400 leading-relaxed">
            Don&apos;t reinvent multi-tenancy. Launch your SaaS platform using verified monorepo structures, pre-built schemas, and complete isolation strategies.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#demo"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-all text-sm active:scale-[0.98]"
            >
              Get Started Instantly
            </a>
            <a
              href="https://github.com"
              target="_blank"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold border border-zinc-800 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all text-sm"
            >
              Star Repository on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-zinc-900 bg-black/60 py-12 text-sm text-zinc-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">
              Æ
            </div>
            <span className="font-semibold text-zinc-400">Aether SaaS</span>
          </div>

          <div className="flex items-center gap-8 text-xs">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Support</a>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Aether Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
