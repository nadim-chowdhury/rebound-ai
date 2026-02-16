"use client";

import Link from "next/link";
import {
  Zap,
  Shield,
  Brain,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Mail,
  TrendingUp,
  Clock,
  Sparkles,
  CreditCard,
  MessageSquare,
  Percent,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const stats = [
  { value: "$2.4M+", label: "Revenue Recovered" },
  { value: "69.5%", label: "Recovery Rate" },
  { value: "18hrs", label: "Avg Recovery Time" },
  { value: "340+", label: "Businesses Served" },
];

const steps = [
  {
    icon: CreditCard,
    title: "Payment Fails",
    description:
      "A customer's card is declined, expires, or has insufficient funds. Stripe fires a webhook instantly.",
  },
  {
    icon: Brain,
    title: "AI Analyzes & Writes",
    description:
      "Our AI analyzes the failure reason and generates a warm, personalized recovery message in seconds.",
  },
  {
    icon: MessageSquare,
    title: "Customer Recovers",
    description:
      "The customer receives a friendly email with a clear CTA. If needed, the AI offers a small discount or delay.",
  },
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Messages",
    description:
      "GPT-4o generates human-sounding emails that feel personal, not automated. 3x higher open rates.",
  },
  {
    icon: Zap,
    title: "Instant Detection",
    description:
      "Stripe webhooks trigger recovery within seconds of a failed payment. No delay, no lost time.",
  },
  {
    icon: Percent,
    title: "Smart Negotiation",
    description:
      "AI can auto-offer discounts or payment delays when customers say they need help. Keeps them from canceling.",
  },
  {
    icon: BarChart3,
    title: "Revenue Dashboard",
    description:
      "Real-time tracking of lost revenue, recovered amounts, and your ROI. See every dollar saved.",
  },
  {
    icon: Shield,
    title: "Fraud Protection",
    description:
      "Automatically skips stolen or fraudulent cards. Only sends recovery for legitimate failures.",
  },
  {
    icon: Mail,
    title: "Multi-Channel",
    description:
      "Email, SMS, and WhatsApp support. Reach customers where they actually respond.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="hero-grid fixed inset-0 pointer-events-none" />
      <div
        className="orb orb-emerald"
        style={{ width: 600, height: 600, top: -200, right: -200 }}
      />
      <div
        className="orb orb-cyan"
        style={{ width: 500, height: 500, bottom: -100, left: -150 }}
      />
      <div
        className="orb orb-purple"
        style={{ width: 400, height: 400, top: "40%", left: "50%" }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 36,
              height: 36,
              background: "var(--gradient-accent)",
            }}
          >
            <Zap size={20} color="#fff" />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Rebound
            <span className="text-gradient">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="btn-ghost">
            Dashboard
          </Link>
          <Link href="/dashboard" className="btn-primary">
            Get Started Free <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
          style={{
            background: "var(--accent-subtle)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            color: "var(--accent)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Sparkles size={14} />
          Recover revenue you didn&apos;t know you were losing
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
        >
          Stop Losing Money to{" "}
          <span className="text-gradient">Failed Payments</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10"
          style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
        >
          Rebound AI connects to your Stripe account, detects failed payments in
          real-time, and uses AI to send personalized recovery messages that{" "}
          <strong style={{ color: "var(--foreground)" }}>
            actually get opened
          </strong>
          .
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link
            href="/dashboard"
            className="btn-primary animate-pulse-glow"
            style={{ padding: "14px 32px", fontSize: 16, borderRadius: 14 }}
          >
            Start Recovering Revenue <ArrowRight size={18} />
          </Link>
          <button
            className="btn-secondary"
            style={{ padding: "14px 32px", fontSize: 16, borderRadius: 14 }}
          >
            See How It Works
          </button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
          className="glass-card-static flex flex-wrap justify-center gap-0 divide-x"
          style={{
            maxWidth: 700,
            margin: "0 auto",
            borderColor: "var(--border-color)",
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex-1 py-5 px-6 min-w-[140px]">
              <div
                className="text-2xl font-bold text-gradient"
                style={{ marginBottom: 2 }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section
        className="relative z-10 max-w-5xl mx-auto px-6 py-24"
        id="how-it-works"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 17 }}>
            Three simple steps. Zero effort from you.
          </p>
        </motion.div>

        <div
          className="grid gap-8"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i + 1}
              className="glass-card"
              style={{ padding: 28 }}
            >
              <div
                className="flex items-center justify-center rounded-xl mb-5"
                style={{
                  width: 52,
                  height: 52,
                  background: "var(--accent-subtle)",
                  border: "1px solid rgba(16,185,129,0.15)",
                }}
              >
                <step.icon size={24} style={{ color: "var(--accent)" }} />
              </div>
              <div
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--accent)" }}
              >
                Step {i + 1}
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Built for <span className="text-gradient">Maximum Recovery</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 17 }}>
            Every feature designed to win back your lost revenue.
          </p>
        </motion.div>

        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i * 0.5}
              className="glass-card"
              style={{ padding: 28 }}
            >
              <div className="feature-icon mb-4">
                <feature.icon size={22} />
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple, <span className="text-gradient">Performance-Based</span>{" "}
            Pricing
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 17 }}>
            We only get paid when you recover money. Zero risk.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
          {/* Free Tier */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="pricing-card"
          >
            <div
              className="text-sm font-semibold mb-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              STARTER
            </div>
            <div className="text-4xl font-bold mb-1">Free</div>
            <p
              className="mb-6"
              style={{ color: "var(--text-secondary)", fontSize: 14 }}
            >
              Up to 50 recovery attempts/month
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Stripe integration",
                "AI email recovery",
                "Basic dashboard",
                "Email support",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5"
                  style={{ fontSize: 14, color: "var(--text-secondary)" }}
                >
                  <CheckCircle2 size={16} style={{ color: "var(--accent)" }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="btn-secondary w-full justify-center"
            >
              Get Started
            </Link>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="pricing-card featured"
          >
            <div
              className="text-sm font-semibold mb-2"
              style={{ color: "var(--accent)" }}
            >
              ⚡ PERFORMANCE
            </div>
            <div className="text-4xl font-bold mb-1">
              10<span className="text-lg font-normal">%</span>
            </div>
            <p
              className="mb-6"
              style={{ color: "var(--text-secondary)", fontSize: 14 }}
            >
              Of recovered revenue. Only pay when we save you money.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Unlimited recoveries",
                "AI negotiation (discounts & delays)",
                "Multi-channel (Email + SMS)",
                "Advanced analytics",
                "Priority support",
                "Custom AI tone & branding",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5"
                  style={{ fontSize: 14, color: "var(--text-secondary)" }}
                >
                  <CheckCircle2 size={16} style={{ color: "var(--accent)" }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="btn-primary w-full justify-center"
            >
              Start Recovering <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="glass-card-static"
          style={{
            padding: "48px 32px",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <div className="flex justify-center mb-5">
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{
                width: 64,
                height: 64,
                background: "var(--accent-subtle)",
                border: "1px solid rgba(16,185,129,0.15)",
              }}
            >
              <DollarSign size={30} style={{ color: "var(--accent)" }} />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Ready to stop losing money?
          </h2>
          <p
            className="mb-8 max-w-lg mx-auto"
            style={{
              color: "var(--text-secondary)",
              fontSize: 16,
              lineHeight: 1.7,
            }}
          >
            Connect your Stripe account in 2 minutes. If we recover $0, you pay
            $0. It&apos;s actually that simple.
          </p>
          <Link
            href="/dashboard"
            className="btn-primary"
            style={{ padding: "14px 32px", fontSize: 16, borderRadius: 14 }}
          >
            Connect Stripe & Start Free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 border-t py-8 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex items-center gap-2">
          <Zap size={16} style={{ color: "var(--accent)" }} />
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-secondary)" }}
          >
            Rebound AI
          </span>
        </div>
        <div className="flex items-center gap-6">
          {["Privacy", "Terms", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm"
              style={{
                color: "var(--text-tertiary)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--foreground)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-tertiary)")
              }
            >
              {link}
            </a>
          ))}
        </div>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          © 2026 Rebound AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
