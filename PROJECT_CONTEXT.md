# Rebound AI — Project Context

## What Is This?

AI-powered failed payment recovery agent for Stripe & Shopify. Detects failed payments via webhooks, uses AI to craft personalized recovery messages, and wins back lost revenue on autopilot.

## Tech Stack

| Component  | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 16 (App Router) |
| Styling    | Tailwind CSS 4          |
| Animations | Framer Motion           |
| Charts     | Recharts                |
| Icons      | Lucide React            |
| AI Brain   | OpenAI GPT-4o-mini      |
| Payments   | Stripe API + Webhooks   |
| Email      | Resend                  |
| Database   | Supabase (planned)      |
| Deployment | Vercel                  |

## Core Features

1. **Stripe Webhook Listener** — Detects `invoice.payment_failed` events in real-time
2. **AI Message Generation** — GPT-4o crafts personalized, human-sounding recovery emails
3. **Smart Negotiation** — Auto-offers discounts or payment delays for customers in difficulty
4. **Revenue Dashboard** — Bento grid layout with real-time stats, charts, and activity feed
5. **Multi-Channel** — Email (Resend), SMS (Twilio), WhatsApp support
6. **Fraud Protection** — Automatically skips stolen/fraudulent cards

## User Flow

1. User connects Stripe account → webhook auto-configured
2. Customer's payment fails → webhook fires → app logs failure
3. AI analyzes failure reason → generates personalized email
4. Email sent via Resend → customer updates card or gets discount
5. Dashboard shows revenue lost vs recovered in real-time

## Pricing Model

- **Free tier:** 50 recoveries/month
- **Performance tier:** 10% of recovered revenue (pay only when it works)
