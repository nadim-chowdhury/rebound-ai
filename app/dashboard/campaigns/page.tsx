"use client";

import {
  Mail,
  Eye,
  MousePointer,
  CheckCircle2,
  Clock,
  ExternalLink,
  Percent,
  Users,
  ArrowUpRight,
  MessageSquareText,
} from "lucide-react";
import { motion } from "framer-motion";
import { mockCampaigns } from "@/lib/mock-data";
import { CampaignStatus } from "@/lib/types";

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

const statusSteps: CampaignStatus[] = [
  "sent",
  "opened",
  "clicked",
  "converted",
];

function getStatusProgress(status: CampaignStatus) {
  const idx = statusSteps.indexOf(status);
  if (status === "failed") return 0;
  return ((idx + 1) / statusSteps.length) * 100;
}

const statusIcons: Record<CampaignStatus, typeof Mail> = {
  sent: Mail,
  opened: Eye,
  clicked: MousePointer,
  converted: CheckCircle2,
  failed: Clock,
};

export default function CampaignsPage() {
  const totalSent = mockCampaigns.length;
  const opened = mockCampaigns.filter(
    (c) =>
      c.status === "opened" ||
      c.status === "clicked" ||
      c.status === "converted",
  ).length;
  const converted = mockCampaigns.filter(
    (c) => c.status === "converted",
  ).length;
  const recoveredAmount = mockCampaigns
    .filter((c) => c.status === "converted")
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Recovery Campaigns
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          AI-generated recovery messages and their performance
        </p>
      </div>

      {/* Stats */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="bento-grid bento-grid-4 mb-8"
      >
        <div className="glass-card" style={{ padding: 20 }}>
          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} style={{ color: "#a78bfa" }} />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-tertiary)" }}
            >
              Sent
            </span>
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {totalSent}
          </div>
        </div>
        <div className="glass-card" style={{ padding: 20 }}>
          <div className="flex items-center gap-2 mb-2">
            <Eye size={16} style={{ color: "#60a5fa" }} />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-tertiary)" }}
            >
              Opened
            </span>
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {opened}
            <span
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "var(--text-tertiary)",
                marginLeft: 4,
              }}
            >
              ({Math.round((opened / totalSent) * 100)}%)
            </span>
          </div>
        </div>
        <div className="glass-card" style={{ padding: 20 }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} style={{ color: "#34d399" }} />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-tertiary)" }}
            >
              Converted
            </span>
          </div>
          <div className="text-2xl font-bold text-gradient">{converted}</div>
        </div>
        <div className="glass-card" style={{ padding: 20 }}>
          <div className="flex items-center gap-2 mb-2">
            <Percent size={16} style={{ color: "#fbbf24" }} />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-tertiary)" }}
            >
              Revenue Recovered
            </span>
          </div>
          <div className="text-2xl font-bold text-gradient">
            ${recoveredAmount.toFixed(2)}
          </div>
        </div>
      </motion.div>

      {/* Campaign Cards */}
      <div className="flex flex-col gap-4">
        {mockCampaigns.map((campaign, i) => {
          const StatusIcon = statusIcons[campaign.status];
          const progress = getStatusProgress(campaign.status);

          return (
            <motion.div
              key={campaign.id}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i + 1}
              className="glass-card"
              style={{ padding: 24 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Left: Campaign Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge badge-${campaign.status}`}>
                      <StatusIcon size={12} />
                      {campaign.status.charAt(0).toUpperCase() +
                        campaign.status.slice(1)}
                    </span>
                    {campaign.discountOffered && (
                      <span className="badge badge-clicked">
                        <Percent size={10} />
                        {campaign.discountOffered}% discount offered
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-tertiary)",
                        marginLeft: "auto",
                      }}
                    >
                      {timeAgo(campaign.sentAt)}
                    </span>
                  </div>

                  <h3
                    className="text-base font-semibold mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    {campaign.subject}
                  </h3>

                  <div
                    className="flex items-center gap-2 mb-3"
                    style={{ fontSize: 13, color: "var(--text-tertiary)" }}
                  >
                    <Users size={13} />
                    {campaign.customerName} · {campaign.customerEmail}
                  </div>

                  {/* Message Preview */}
                  <div
                    className="glass-card-static"
                    style={{
                      padding: "12px 16px",
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      borderRadius: 10,
                    }}
                  >
                    <div
                      className="flex items-center gap-1.5 mb-1.5"
                      style={{
                        fontSize: 11,
                        color: "var(--text-tertiary)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      <MessageSquareText size={11} />
                      AI-Generated Message
                    </div>
                    {campaign.messagePreview}
                  </div>
                </div>

                {/* Right: Progress & Amount */}
                <div
                  className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-3"
                  style={{ minWidth: 140 }}
                >
                  <div className="text-right">
                    <div
                      className="text-xs mb-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Amount
                    </div>
                    <div
                      className="text-lg font-bold"
                      style={{
                        color:
                          campaign.status === "converted"
                            ? "var(--accent)"
                            : "var(--foreground)",
                      }}
                    >
                      ${campaign.amount.toFixed(2)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: "100%" }}>
                    <div
                      className="flex items-center justify-between mb-1"
                      style={{ fontSize: 11, color: "var(--text-tertiary)" }}
                    >
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${progress}%`,
                          borderRadius: 2,
                          background:
                            campaign.status === "converted"
                              ? "var(--gradient-accent)"
                              : campaign.status === "failed"
                                ? "#ef4444"
                                : "#60a5fa",
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div
                    className="flex gap-3"
                    style={{ fontSize: 11, color: "var(--text-tertiary)" }}
                  >
                    {campaign.openedAt && (
                      <span>Opened {timeAgo(campaign.openedAt)}</span>
                    )}
                    {campaign.clickedAt && (
                      <span>Clicked {timeAgo(campaign.clickedAt)}</span>
                    )}
                    {campaign.convertedAt && (
                      <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                        Converted {timeAgo(campaign.convertedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
