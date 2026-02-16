"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  MessageSquareText,
  Settings,
  Zap,
  TrendingUp,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/payments", label: "Failed Payments", icon: CreditCard },
  {
    href: "/dashboard/campaigns",
    label: "Recovery Campaigns",
    icon: MessageSquareText,
  },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar glass-sidebar ${sidebarOpen ? "open" : ""}`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline mb-8 px-2"
        >
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 32,
              height: 32,
              background: "var(--gradient-accent)",
            }}
          >
            <Zap size={18} color="#fff" />
          </div>
          <span
            className="text-base font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Rebound<span className="text-gradient">AI</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          <div
            className="text-xs font-semibold uppercase tracking-widest px-3 mb-2"
            style={{ color: "var(--text-tertiary)" }}
          >
            Menu
          </div>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Card */}
        <div className="mt-auto pt-6">
          <div
            className="glass-card-static p-4"
            style={{ borderColor: "rgba(16, 185, 129, 0.15)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} style={{ color: "var(--accent)" }} />
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Revenue Saved
              </span>
            </div>
            <div
              className="text-xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              $8,934.20
            </div>
            <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              This month
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            className="btn-ghost lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <button className="btn-ghost relative" style={{ padding: 8 }}>
              <Bell size={18} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: "var(--accent)" }}
              />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "var(--gradient-accent)",
                color: "#fff",
              }}
            >
              M
            </div>
          </div>
        </div>

        {/* Page Content */}
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
