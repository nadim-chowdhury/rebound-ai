# Rebound AI — Architecture Notes

## Folder Structure

```
rebound-ai/
├── app/
│   ├── globals.css          # Design system (dark theme, glassmorphism)
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Landing page
│   ├── dashboard/
│   │   ├── layout.tsx       # Dashboard shell (sidebar + topbar)
│   │   ├── page.tsx         # Overview dashboard
│   │   ├── payments/
│   │   │   └── page.tsx     # Failed payments table
│   │   ├── campaigns/
│   │   │   └── page.tsx     # Recovery campaigns
│   │   └── settings/
│   │       └── page.tsx     # Configuration
│   └── api/
│       ├── webhooks/stripe/route.ts    # Stripe webhook
│       ├── ai/generate-message/route.ts # AI email gen
│       ├── recovery/send/route.ts      # Email sender
│       └── dashboard/stats/route.ts    # Stats API
├── lib/
│   ├── types.ts             # TypeScript interfaces
│   ├── mock-data.ts         # Demo data
│   ├── ai-prompts.ts        # System prompts
│   └── payment-analyzer.ts  # Failure categorization
├── PROJECT_CONTEXT.md
├── ARCHITECTURE_NOTES.md
└── PROGRESS.md
```

## Database Schema (Supabase — Planned)

### `failed_payments`

| Column           | Type      | Description                       |
| ---------------- | --------- | --------------------------------- |
| id               | uuid      | Primary key                       |
| customer_id      | text      | Stripe customer ID                |
| customer_name    | text      | Customer display name             |
| customer_email   | text      | Customer email                    |
| amount           | decimal   | Failed amount                     |
| currency         | text      | Currency code                     |
| failure_reason   | text      | Stripe decline code               |
| status           | enum      | pending/recovering/recovered/lost |
| invoice_id       | text      | Stripe invoice ID                 |
| attempt_count    | int       | Number of recovery attempts       |
| created_at       | timestamp | When failure detected             |
| recovered_at     | timestamp | When payment recovered            |
| recovered_amount | decimal   | Actual recovered amount           |

### `recovery_campaigns`

| Column           | Type      | Description                          |
| ---------------- | --------- | ------------------------------------ |
| id               | uuid      | Primary key                          |
| payment_id       | uuid      | FK to failed_payments                |
| channel          | enum      | email/sms/whatsapp                   |
| status           | enum      | sent/opened/clicked/converted/failed |
| subject          | text      | Email subject                        |
| message_body     | text      | Full message content                 |
| discount_offered | decimal   | Discount % if any                    |
| sent_at          | timestamp | When sent                            |
| converted_at     | timestamp | When payment recovered               |

## API Contracts

### POST /api/webhooks/stripe

- **Input:** Raw Stripe event body + `stripe-signature` header
- **Output:** `{ received: true, payment: FailedPayment }`

### POST /api/ai/generate-message

- **Input:** `{ customerName, amount, failureReason, storeName, discountPercent? }`
- **Output:** `{ success: true, email: { subject, body } }`

### POST /api/recovery/send

- **Input:** `{ to, subject, htmlBody?, textBody?, from? }`
- **Output:** `{ success: true, emailId? }`

### GET /api/dashboard/stats

- **Output:** `{ stats: DashboardStats, revenueTrend: [], recentActivity: [] }`
