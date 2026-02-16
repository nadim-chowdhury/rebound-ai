"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  ArrowUpRight,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Zap,
  Send,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import {
  mockDashboardStats,
  mockRevenueTrend,
  mockActivity,
  mockFailedPayments,
} from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function timeAgo(dateString: string) {
  const now = new Date("2026-02-16T17:15:00Z");
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

const statCards = [
  {
    label: "Revenue Lost",
    value: formatCurrency(mockDashboardStats.totalRevenueLost),
    icon: TrendingDown,
    trend: "-12% vs last month",
    trendDir: "down" as const,
    iconBg: "rgba(239, 68, 68, 0.1)",
    iconColor: "#f87171",
  },
  {
    label: "Revenue Recovered",
    value: formatCurrency(mockDashboardStats.totalRevenueRecovered),
    icon: TrendingUp,
    trend: "+23% vs last month",
    trendDir: "up" as const,
    iconBg: "rgba(16, 185, 129, 0.1)",
    iconColor: "#34d399",
  },
  {
    label: "Recovery Rate",
    value: `${mockDashboardStats.recoveryRate}%`,
    icon: Activity,
    trend: "+5.2% vs last month",
    trendDir: "up" as const,
    iconBg: "rgba(59, 130, 246, 0.1)",
    iconColor: "#60a5fa",
  },
  {
    label: "Your Commission",
    value: formatCurrency(mockDashboardStats.commission),
    icon: DollarSign,
    trend: "+23% vs last month",
    trendDir: "up" as const,
    iconBg: "rgba(139, 92, 246, 0.1)",
    iconColor: "#a78bfa",
  },
];

const activityIcons: Record<string, { icon: typeof Zap; color: string }> = {
  payment_failed: { icon: AlertCircle, color: "#f87171" },
  recovery_sent: { icon: Send, color: "#60a5fa" },
  payment_recovered: { icon: CheckCircle2, color: "#34d399" },
  discount_offered: { icon: DollarSign, color: "#fbbf24" },
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div
      className="glass-card-static"
      style={{
        padding: "10px 14px",
        fontSize: 13,
        minWidth: 140,
      }}
    >
      <div
        style={{
          color: "var(--text-tertiary)",
          marginBottom: 6,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          className="flex items-center justify-between gap-4"
          style={{ marginBottom: 2 }}
        >
          <span
            style={{ color: p.dataKey === "recovered" ? "#34d399" : "#f87171" }}
          >
            {p.dataKey === "recovered" ? "Recovered" : "Lost"}
          </span>
          <span style={{ color: "var(--foreground)", fontWeight: 600 }}>
            ${p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const recentPayments = mockFailedPayments.slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Dashboard</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Your revenue recovery overview
        </p>
      </div>

      {/* Stat Cards */}
      <div className="bento-grid bento-grid-4 mb-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i}
            className="glass-card stat-card"
          >
            <div className="stat-icon" style={{ background: stat.iconBg }}>
              <stat.icon size={20} style={{ color: stat.iconColor }} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className={`stat-trend ${stat.trendDir}`}>
              {stat.trendDir === "up" ? (
                <ArrowUpRight size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts + Activity Row */}
      <div className="bento-grid bento-grid-3 mb-6">
        {/* Revenue Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={5}
          className="glass-card-static bento-span-2"
          style={{ padding: 24 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className="text-base font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Revenue Recovery Trend
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                Last 14 days
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-1.5"
                style={{ fontSize: 12 }}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: "#f87171" }}
                />
                <span style={{ color: "var(--text-secondary)" }}>Lost</span>
              </div>
              <div
                className="flex items-center gap-1.5"
                style={{ fontSize: 12 }}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: "#34d399" }}
                />
                <span style={{ color: "var(--text-secondary)" }}>
                  Recovered
                </span>
              </div>
            </div>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenueTrend}>
                <defs>
                  <linearGradient id="gradLost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="gradRecovered"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#475569", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#475569", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="lost"
                  stroke="#f87171"
                  strokeWidth={2}
                  fill="url(#gradLost)"
                />
                <Area
                  type="monotone"
                  dataKey="recovered"
                  stroke="#34d399"
                  strokeWidth={2}
                  fill="url(#gradRecovered)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={6}
          className="glass-card-static"
          style={{ padding: 24 }}
        >
          <h3
            className="text-base font-semibold mb-4"
            style={{ color: "var(--foreground)" }}
          >
            Recent Activity
          </h3>
          <div className="flex flex-col gap-4">
            {mockActivity.slice(0, 6).map((item) => {
              const config = activityIcons[item.type];
              const IconComp = config.icon;
              return (
                <div key={item.id} className="flex gap-3">
                  <div
                    className="mt-0.5 flex-shrink-0 flex items-center justify-center rounded-lg"
                    style={{
                      width: 32,
                      height: 32,
                      background: `${config.color}15`,
                    }}
                  >
                    <IconComp size={15} style={{ color: config.color }} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm leading-snug line-clamp-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.message}
                    </p>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {timeAgo(item.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Failed Payments Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={7}
        className="glass-card-static"
        style={{ padding: 24 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-base font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Recent Failed Payments
          </h3>
          <a
            href="/dashboard/payments"
            className="btn-ghost"
            style={{ fontSize: 13 }}
          >
            View All <ArrowUpRight size={14} />
          </a>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div>
                      <div
                        style={{ fontWeight: 500, color: "var(--foreground)" }}
                      >
                        {p.customerName}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-tertiary)",
                          marginTop: 1,
                        }}
                      >
                        {p.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--foreground)" }}>
                    ${p.amount.toFixed(2)}
                  </td>
                  <td>
                    {p.failureReason
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </td>
                  <td>
                    <span className={`badge badge-${p.status}`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {timeAgo(p.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
