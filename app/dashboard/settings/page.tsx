"use client";

import { useState } from "react";
import {
  Save,
  Key,
  Bell,
  Sliders,
  Mail,
  MessageSquare,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    stripeApiKey: "",
    openaiApiKey: "",
    resendApiKey: "",
    storeName: "My Awesome Store",
    emailFrom: "recovery@mystore.com",
    discountPercent: 10,
    maxDelayDays: 7,
    maxRetries: 3,
    autoSend: true,
    channelEmail: true,
    channelSms: false,
    channelWhatsapp: false,
    notifyOnRecovery: true,
    notifyOnFailure: true,
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function updateSetting(key: string, value: string | number | boolean) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Settings</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Configure your integrations and recovery strategy
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={handleSave}
          style={{ padding: "10px 24px" }}
        >
          {saved ? (
            <>
              <CheckCircle2 size={16} />
              Saved!
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-3xl">
        {/* API Keys */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="glass-card-static"
          style={{ padding: 28 }}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 36,
                height: 36,
                background: "rgba(139, 92, 246, 0.1)",
              }}
            >
              <Key size={18} style={{ color: "#a78bfa" }} />
            </div>
            <div>
              <h2
                className="text-base font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                API Integrations
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                Connect your payment and messaging services
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Stripe Secret Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  className="glass-input"
                  placeholder="sk_live_..."
                  value={settings.stripeApiKey}
                  onChange={(e) =>
                    updateSetting("stripeApiKey", e.target.value)
                  }
                />
                <div
                  className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    background: settings.stripeApiKey
                      ? "rgba(16,185,129,0.1)"
                      : "rgba(245,158,11,0.1)",
                  }}
                >
                  {settings.stripeApiKey ? (
                    <CheckCircle2 size={16} style={{ color: "#34d399" }} />
                  ) : (
                    <AlertCircle size={16} style={{ color: "#fbbf24" }} />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                OpenAI API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  className="glass-input"
                  placeholder="sk-..."
                  value={settings.openaiApiKey}
                  onChange={(e) =>
                    updateSetting("openaiApiKey", e.target.value)
                  }
                />
                <div
                  className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    background: settings.openaiApiKey
                      ? "rgba(16,185,129,0.1)"
                      : "rgba(245,158,11,0.1)",
                  }}
                >
                  {settings.openaiApiKey ? (
                    <CheckCircle2 size={16} style={{ color: "#34d399" }} />
                  ) : (
                    <AlertCircle size={16} style={{ color: "#fbbf24" }} />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Resend API Key (Email)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  className="glass-input"
                  placeholder="re_..."
                  value={settings.resendApiKey}
                  onChange={(e) =>
                    updateSetting("resendApiKey", e.target.value)
                  }
                />
                <div
                  className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    background: settings.resendApiKey
                      ? "rgba(16,185,129,0.1)"
                      : "rgba(245,158,11,0.1)",
                  }}
                >
                  {settings.resendApiKey ? (
                    <CheckCircle2 size={16} style={{ color: "#34d399" }} />
                  ) : (
                    <AlertCircle size={16} style={{ color: "#fbbf24" }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Store Settings */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="glass-card-static"
          style={{ padding: 28 }}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 36,
                height: 36,
                background: "rgba(59, 130, 246, 0.1)",
              }}
            >
              <Zap size={18} style={{ color: "#60a5fa" }} />
            </div>
            <div>
              <h2
                className="text-base font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Store Configuration
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                Your business details for personalized recovery
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Store Name
              </label>
              <input
                type="text"
                className="glass-input"
                value={settings.storeName}
                onChange={(e) => updateSetting("storeName", e.target.value)}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Reply-From Email
              </label>
              <input
                type="email"
                className="glass-input"
                value={settings.emailFrom}
                onChange={(e) => updateSetting("emailFrom", e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Recovery Strategy */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="glass-card-static"
          style={{ padding: 28 }}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 36,
                height: 36,
                background: "rgba(16, 185, 129, 0.1)",
              }}
            >
              <Sliders size={18} style={{ color: "#34d399" }} />
            </div>
            <div>
              <h2
                className="text-base font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Recovery Strategy
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                Fine-tune how your AI agent recovers payments
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="bento-grid bento-grid-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Max Discount (%)
                </label>
                <input
                  type="number"
                  className="glass-input"
                  min={0}
                  max={50}
                  value={settings.discountPercent}
                  onChange={(e) =>
                    updateSetting(
                      "discountPercent",
                      parseInt(e.target.value) || 0,
                    )
                  }
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Max Delay (days)
                </label>
                <input
                  type="number"
                  className="glass-input"
                  min={0}
                  max={30}
                  value={settings.maxDelayDays}
                  onChange={(e) =>
                    updateSetting("maxDelayDays", parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Max Retries
                </label>
                <input
                  type="number"
                  className="glass-input"
                  min={1}
                  max={10}
                  value={settings.maxRetries}
                  onChange={(e) =>
                    updateSetting("maxRetries", parseInt(e.target.value) || 1)
                  }
                />
              </div>
            </div>

            {/* Auto Send Toggle */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: "var(--surface)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div>
                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  Auto-Send Recovery Emails
                </div>
                <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                  Automatically send AI messages when a payment fails
                </div>
              </div>
              <button
                onClick={() => updateSetting("autoSend", !settings.autoSend)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  border: "none",
                  cursor: "pointer",
                  background: settings.autoSend
                    ? "var(--accent)"
                    : "rgba(255,255,255,0.1)",
                  position: "relative",
                  transition: "background 0.2s",
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    background: "#fff",
                    position: "absolute",
                    top: 3,
                    left: settings.autoSend ? 25 : 3,
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>

            {/* Channels */}
            <div>
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Recovery Channels
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  {
                    key: "channelEmail",
                    label: "Email",
                    icon: Mail,
                    enabled: settings.channelEmail,
                  },
                  {
                    key: "channelSms",
                    label: "SMS",
                    icon: MessageSquare,
                    enabled: settings.channelSms,
                  },
                  {
                    key: "channelWhatsapp",
                    label: "WhatsApp",
                    icon: MessageSquare,
                    enabled: settings.channelWhatsapp,
                  },
                ].map((ch) => (
                  <button
                    key={ch.key}
                    onClick={() => updateSetting(ch.key, !ch.enabled)}
                    className={ch.enabled ? "btn-primary" : "btn-secondary"}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 10,
                      fontSize: 13,
                    }}
                  >
                    <ch.icon size={14} />
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="glass-card-static"
          style={{ padding: 28 }}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 36,
                height: 36,
                background: "rgba(245, 158, 11, 0.1)",
              }}
            >
              <Bell size={18} style={{ color: "#fbbf24" }} />
            </div>
            <div>
              <h2
                className="text-base font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Notifications
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                Choose what you want to be notified about
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                key: "notifyOnRecovery",
                label: "Payment Recovered",
                desc: "Get notified when a payment is successfully recovered",
                enabled: settings.notifyOnRecovery,
              },
              {
                key: "notifyOnFailure",
                label: "New Failed Payment",
                desc: "Get notified when a new payment failure is detected",
                enabled: settings.notifyOnFailure,
              },
            ].map((notif) => (
              <div
                key={notif.key}
                className="flex items-center justify-between"
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "var(--surface)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    {notif.label}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                    {notif.desc}
                  </div>
                </div>
                <button
                  onClick={() => updateSetting(notif.key, !notif.enabled)}
                  style={{
                    width: 48,
                    height: 26,
                    borderRadius: 13,
                    border: "none",
                    cursor: "pointer",
                    background: notif.enabled
                      ? "var(--accent)"
                      : "rgba(255,255,255,0.1)",
                    position: "relative",
                    transition: "background 0.2s",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      background: "#fff",
                      position: "absolute",
                      top: 3,
                      left: notif.enabled ? 25 : 3,
                      transition: "left 0.2s",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
