"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Send,
  ArrowUpRight,
  MoreVertical,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { mockFailedPayments } from "@/lib/mock-data";
import { PaymentStatus } from "@/lib/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

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

const statusFilters: { label: string; value: PaymentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Recovering", value: "recovering" },
  { label: "Recovered", value: "recovered" },
  { label: "Lost", value: "lost" },
];

export default function PaymentsPage() {
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayments = mockFailedPayments.filter((p) => {
    const matchesStatus =
      selectedStatus === "all" || p.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalLost = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalRecovered = filteredPayments
    .filter((p) => p.status === "recovered")
    .reduce((sum, p) => sum + (p.recoveredAmount || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Failed Payments
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Track and manage all failed payment attempts
        </p>
      </div>

      {/* Summary Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="bento-grid bento-grid-3 mb-6"
      >
        <div className="glass-card" style={{ padding: 20 }}>
          <div
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Total at Risk
          </div>
          <div className="text-2xl font-bold" style={{ color: "#f87171" }}>
            ${totalLost.toFixed(2)}
          </div>
        </div>
        <div className="glass-card" style={{ padding: 20 }}>
          <div
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Recovered
          </div>
          <div className="text-2xl font-bold text-gradient">
            ${totalRecovered.toFixed(2)}
          </div>
        </div>
        <div className="glass-card" style={{ padding: 20 }}>
          <div
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Showing
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {filteredPayments.length}{" "}
            <span
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "var(--text-tertiary)",
              }}
            >
              payments
            </span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-tertiary)" }}
          />
          <input
            type="text"
            placeholder="Search customers..."
            className="glass-input"
            style={{ paddingLeft: 36 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={
                selectedStatus === filter.value
                  ? "btn-primary"
                  : "btn-secondary"
              }
              style={{
                padding: "6px 14px",
                fontSize: 13,
                borderRadius: 20,
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={2}
        className="glass-card-static"
        style={{ padding: 0, overflow: "hidden" }}
      >
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Failure Reason</th>
                <th>Attempts</th>
                <th>Status</th>
                <th>Time</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <div>
                      <div
                        style={{
                          fontWeight: 500,
                          color: "var(--foreground)",
                        }}
                      >
                        {payment.customerName}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-tertiary)",
                          marginTop: 1,
                        }}
                      >
                        {payment.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      fontWeight: 600,
                      color: "var(--foreground)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ${payment.amount.toFixed(2)}
                    {payment.recoveredAmount && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "#34d399",
                          fontWeight: 500,
                        }}
                      >
                        ✓ ${payment.recoveredAmount.toFixed(2)} recovered
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <AlertCircle
                        size={14}
                        style={{ color: "var(--warning)", flexShrink: 0 }}
                      />
                      <span>
                        {payment.failureReason
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        color:
                          payment.attemptCount >= 3
                            ? "#f87171"
                            : "var(--text-secondary)",
                        fontWeight: payment.attemptCount >= 3 ? 600 : 400,
                      }}
                    >
                      {payment.attemptCount}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${payment.status}`}>
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {timeAgo(payment.createdAt)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {(payment.status === "pending" ||
                      payment.status === "recovering") && (
                      <button
                        className="btn-primary"
                        style={{
                          padding: "5px 12px",
                          fontSize: 12,
                          borderRadius: 8,
                        }}
                      >
                        <Send size={12} />
                        Recover
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div
            className="text-center py-16"
            style={{ color: "var(--text-tertiary)" }}
          >
            <Search size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
            <p className="text-base font-medium mb-1">No payments found</p>
            <p style={{ fontSize: 13 }}>Try adjusting your filters</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
