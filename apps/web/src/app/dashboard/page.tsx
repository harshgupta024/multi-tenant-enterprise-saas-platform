"use client";

import React from "react";
import DashboardShell from "../../components/DashboardShell";

export default function DashboardPage() {
  const kpis = [
    { title: "Total Organizations", value: "1,284", change: "+12%", icon: "corporate_fare", color: "text-primary", bg: "bg-primary/10" },
    { title: "Active Users", value: "45,201", change: "+5.4%", icon: "group", color: "text-secondary", bg: "bg-secondary/10" },
    { title: "Monthly Revenue", value: "$842,000", change: "+8%", icon: "payments", color: "text-tertiary", bg: "bg-tertiary/10" },
  ];

  const activities = [
    { title: "Acme Corp provisioned a new workspace.", time: "2 mins ago", icon: "corporate_fare", color: "text-primary", bg: "bg-primary/10" },
    { title: "Failed login attempt detected from IP 192.168.1.1", time: "15 mins ago", icon: "security", color: "text-error", bg: "bg-error/10" },
    { title: "Sarah Jenkins was added as Global Admin.", time: "1 hour ago", icon: "group_add", color: "text-secondary", bg: "bg-secondary/10" },
    { title: "System update v2.4.1 deployed successfully.", time: "3 hours ago", icon: "update", color: "text-on-surface", bg: "bg-surface-bright" },
  ];

  return (
    <DashboardShell>
      <div className="space-y-lg">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up stagger-1">
          <div>
            <h2 className="font-display-lg text-display-lg text-on-surface text-[28px] font-bold">Dashboard</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Platform overview and key metrics.</p>
          </div>
          {/* Timeframe selector */}
          <div className="flex items-center bg-surface-container border border-outline-variant rounded-lg p-1 shadow-sm">
            <button className="px-3 py-1 text-xs text-on-surface-variant hover:text-on-surface rounded transition-colors">7D</button>
            <button className="px-3 py-1 text-xs text-on-surface-variant hover:text-on-surface rounded transition-colors">30D</button>
            <button className="px-3 py-1 text-xs bg-surface-bright text-on-surface rounded shadow-sm transition-colors">YTD</button>
            <div className="w-px h-4 bg-outline-variant mx-2"></div>
            <button className="px-3 py-1 flex items-center gap-2 text-xs text-on-surface hover:text-on-surface rounded transition-colors">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              Custom
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-md animate-fade-in-up stagger-2">
          {kpis.map((kpi, i) => (
            <div key={i} className="glass-card rounded-xl p-md flex flex-col relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-md text-label-md text-on-surface-variant text-[13px]">{kpi.title}</span>
                <div className={`p-1.5 bg-surface-container-highest rounded text-on-surface-variant group-hover:${kpi.color} transition-colors`}>
                  <span className="material-symbols-outlined text-[18px]">{kpi.icon}</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-auto">
                <h3 className="font-headline-lg text-headline-lg text-on-surface text-[24px] font-bold">{kpi.value}</h3>
                <span className="font-label-md text-label-md text-tertiary flex items-center bg-tertiary/10 px-1.5 py-0.5 rounded text-xs">
                  <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> {kpi.change}
                </span>
              </div>
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 ${kpi.color}/5 rounded-full blur-2xl pointer-events-none`}></div>
            </div>
          ))}

          {/* KPI 4: Security Score */}
          <div className="glass-card rounded-xl p-md flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-md text-label-md text-on-surface-variant text-[13px]">Security Score</span>
              <div className="p-1.5 bg-surface-container-highest rounded text-on-surface-variant group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">security</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-auto">
              <h3 className="font-headline-lg text-headline-lg text-on-surface text-[24px] font-bold">98<span className="text-[14px] text-on-surface-variant font-normal">/100</span></h3>
              <span className="font-label-md text-label-md text-outline flex items-center bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/30 text-xs">
                Stable
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[98%]"></div>
            </div>
          </div>
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md animate-fade-in-up stagger-3">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 glass-card rounded-xl p-lg flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface text-[18px] font-semibold">Revenue Growth</h3>
                <p className="font-body-md text-body-md text-on-surface-variant text-[13px]">MRR progression over current period.</p>
              </div>
              <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors">
                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
              </button>
            </div>
            {/* SVG simulated line chart */}
            <div className="flex-1 relative w-full border-b border-l border-outline-variant/30 flex items-end pt-4 pr-2 pb-6 pl-8">
              <div className="absolute left-0 top-4 bottom-6 flex flex-col justify-between font-code-sm text-[10px] text-on-surface-variant w-6 text-right">
                <span>1M</span>
                <span>750k</span>
                <span>500k</span>
                <span>250k</span>
                <span>0</span>
              </div>
              <div className="absolute left-8 right-2 top-4 bottom-6 flex flex-col justify-between pointer-events-none">
                <div className="w-full border-t border-outline-variant/10"></div>
                <div className="w-full border-t border-outline-variant/10"></div>
                <div className="w-full border-t border-outline-variant/10"></div>
                <div className="w-full border-t border-outline-variant/10"></div>
                <div className="w-full border-t border-outline-variant/10"></div>
              </div>
              <div className="w-full h-full relative">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#c0c1ff" stopOpacity="0.2"></stop>
                      <stop offset="100%" stopColor="#c0c1ff" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M0,80 Q10,75 20,60 T40,50 T60,30 T80,10 L100,5 L100,100 L0,100 Z" fill="url(#chartGradient)"></path>
                  <path d="M0,80 Q10,75 20,60 T40,50 T60,30 T80,10 L100,5" fill="none" stroke="#c0c1ff" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                </svg>
              </div>
              <div className="absolute left-8 right-2 -bottom-6 flex justify-between font-code-sm text-[10px] text-on-surface-variant pt-2">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card rounded-xl p-lg flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-title-lg text-title-lg text-on-surface text-[18px] font-semibold">Recent Activity</h3>
              <a className="font-label-md text-label-md text-primary hover:text-primary-fixed text-xs transition-colors" href="#">View All</a>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
              {activities.map((act, i) => (
                <div key={i} className="flex gap-3 items-start group">
                  <div className={`w-8 h-8 rounded-full ${act.bg} flex items-center justify-center ${act.color} shrink-0 mt-0.5`}>
                    <span className="material-symbols-outlined text-[16px]">{act.icon}</span>
                  </div>
                  <div className="flex-1 border-b border-outline-variant/20 pb-4 group-last:border-0 group-last:pb-0">
                    <p className="font-body-md text-body-md text-on-surface text-[13px]">{act.title}</p>
                    <span className="font-label-md text-label-md text-on-surface-variant text-[11px] mt-1 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom charts: Onboarding & Subscription */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md animate-fade-in-up stagger-4 pb-lg">
          {/* Tenant Onboarding */}
          <div className="glass-card rounded-xl p-lg flex flex-col h-[300px]">
            <h3 className="font-title-lg text-title-lg text-on-surface text-[18px] font-semibold mb-6">Tenant Onboarding</h3>
            <div className="flex-1 flex items-end gap-2 pb-6 border-b border-outline-variant/30 relative pt-4">
              <div className="absolute left-0 top-4 bottom-6 flex flex-col justify-between font-code-sm text-[10px] text-on-surface-variant w-4 text-right">
                <span>50</span><span>25</span><span>0</span>
              </div>
              <div className="flex-1 flex items-end justify-between pl-6 h-full gap-4">
                {[15, 22, 30, 42, 25, 35].map((val, i) => (
                  <div key={i} className={`w-full ${i === 3 ? "bg-primary" : "bg-surface-bright"} hover:bg-primary/50 transition-colors rounded-t h-[${(val/50)*100}%] relative group`} style={{ height: `${(val / 50) * 100}%` }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-surface px-2 py-1 rounded text-xs text-on-surface whitespace-nowrap transition-opacity">{val}</div>
                  </div>
                ))}
              </div>
              <div className="absolute left-6 right-0 -bottom-6 flex justify-between font-code-sm text-[10px] text-on-surface-variant pt-2">
                <span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span>
              </div>
            </div>
          </div>

          {/* Plan Distribution */}
          <div className="glass-card rounded-xl p-lg flex items-center h-[300px]">
            <div className="w-1/2 flex justify-center items-center relative">
              <svg className="w-40 h-40 transform -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#232a3a" strokeWidth="15"></circle>
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#c0c1ff" strokeDasharray="251.2" strokeDashoffset="125.6" strokeWidth="15"></circle>
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#d0bcff" strokeDasharray="251.2" strokeDashoffset="175.84" strokeWidth="15" transform="rotate(180 50 50)"></circle>
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#908fa0" strokeDasharray="251.2" strokeDashoffset="200.96" strokeWidth="15" transform="rotate(288 50 50)"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-md text-headline-md text-on-surface text-[20px] font-bold">1.2k</span>
                <span className="font-label-md text-label-md text-on-surface-variant text-[11px]">Total Plans</span>
              </div>
            </div>
            <div className="w-1/2 pl-6 flex flex-col gap-4">
              <h3 className="font-title-lg text-title-lg text-on-surface text-[18px] font-semibold mb-2">Plan Distribution</h3>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-on-surface">Pro</span>
                </div>
                <span className="text-on-surface-variant">50%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="text-on-surface">Enterprise</span>
                </div>
                <span className="text-on-surface-variant">30%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-outline"></div>
                  <span className="text-on-surface">Starter</span>
                </div>
                <span className="text-on-surface-variant">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
