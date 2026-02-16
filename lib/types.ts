// ============================================
// Rebound AI — Core Type Definitions
// ============================================

export type PaymentStatus = "pending" | "recovering" | "recovered" | "lost";
export type FailureReason =
  | "card_declined"
  | "insufficient_funds"
  | "expired_card"
  | "processing_error"
  | "incorrect_cvc"
  | "lost_card"
  | "stolen_card"
  | "fraudulent"
  | "authentication_required"
  | "generic_decline";

export type RecoveryChannel = "email" | "sms" | "whatsapp";
export type CampaignStatus =
  | "sent"
  | "opened"
  | "clicked"
  | "converted"
  | "failed";

export interface FailedPayment {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  failureReason: FailureReason;
  failureMessage: string;
  status: PaymentStatus;
  invoiceId: string;
  subscriptionId?: string;
  attemptCount: number;
  createdAt: string;
  updatedAt: string;
  recoveredAt?: string;
  recoveredAmount?: number;
}

export interface RecoveryCampaign {
  id: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  channel: RecoveryChannel;
  status: CampaignStatus;
  subject: string;
  messagePreview: string;
  discountOffered?: number;
  delayOffered?: number;
  sentAt: string;
  openedAt?: string;
  clickedAt?: string;
  convertedAt?: string;
  amount: number;
}

export interface DashboardStats {
  totalRevenueLost: number;
  totalRevenueRecovered: number;
  recoveryRate: number;
  commission: number;
  activeRecoveries: number;
  totalPaymentsFailed: number;
  totalPaymentsRecovered: number;
  avgRecoveryTime: number; // hours
}

export interface RevenueDataPoint {
  date: string;
  lost: number;
  recovered: number;
}

export interface ActivityItem {
  id: string;
  type:
    | "payment_failed"
    | "recovery_sent"
    | "payment_recovered"
    | "discount_offered";
  message: string;
  timestamp: string;
  amount?: number;
}

export interface RecoveryStrategy {
  discountPercent: number;
  maxDelayDays: number;
  maxRetries: number;
  autoSend: boolean;
  channels: RecoveryChannel[];
}

export interface Settings {
  stripeApiKey: string;
  openaiApiKey: string;
  resendApiKey: string;
  storeName: string;
  recoveryStrategy: RecoveryStrategy;
  notifyOnRecovery: boolean;
  notifyOnFailure: boolean;
  emailFrom: string;
}
