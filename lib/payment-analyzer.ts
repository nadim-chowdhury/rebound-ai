// ============================================
// Rebound AI — Payment Failure Analyzer
// ============================================

import { FailureReason } from "./types";

interface AnalysisResult {
  category: "card_issue" | "funds_issue" | "security_issue" | "technical_issue";
  severity: "low" | "medium" | "high";
  humanReadable: string;
  suggestedAction: string;
  recoveryLikelihood: number; // 0-100
  shouldOfferDiscount: boolean;
  shouldOfferDelay: boolean;
}

const analysisMap: Record<FailureReason, AnalysisResult> = {
  expired_card: {
    category: "card_issue",
    severity: "low",
    humanReadable: "Card has expired",
    suggestedAction: "Ask customer to update their card on file",
    recoveryLikelihood: 85,
    shouldOfferDiscount: false,
    shouldOfferDelay: false,
  },
  card_declined: {
    category: "card_issue",
    severity: "medium",
    humanReadable: "Card was declined by issuing bank",
    suggestedAction: "Ask customer to try a different payment method",
    recoveryLikelihood: 60,
    shouldOfferDiscount: true,
    shouldOfferDelay: false,
  },
  insufficient_funds: {
    category: "funds_issue",
    severity: "medium",
    humanReadable: "Insufficient funds on card",
    suggestedAction: "Offer payment delay or installment option",
    recoveryLikelihood: 70,
    shouldOfferDiscount: true,
    shouldOfferDelay: true,
  },
  incorrect_cvc: {
    category: "card_issue",
    severity: "low",
    humanReadable: "CVC verification failed",
    suggestedAction: "Ask customer to re-enter their card details",
    recoveryLikelihood: 80,
    shouldOfferDiscount: false,
    shouldOfferDelay: false,
  },
  processing_error: {
    category: "technical_issue",
    severity: "low",
    humanReadable: "Temporary processing error",
    suggestedAction: "Retry payment automatically in 24 hours",
    recoveryLikelihood: 90,
    shouldOfferDiscount: false,
    shouldOfferDelay: false,
  },
  authentication_required: {
    category: "security_issue",
    severity: "medium",
    humanReadable: "3D Secure authentication needed",
    suggestedAction: "Send link for customer to complete 3DS verification",
    recoveryLikelihood: 75,
    shouldOfferDiscount: false,
    shouldOfferDelay: false,
  },
  lost_card: {
    category: "card_issue",
    severity: "high",
    humanReadable: "Card reported as lost",
    suggestedAction: "Ask customer to add a new payment method",
    recoveryLikelihood: 45,
    shouldOfferDiscount: true,
    shouldOfferDelay: true,
  },
  stolen_card: {
    category: "security_issue",
    severity: "high",
    humanReadable: "Card reported as stolen",
    suggestedAction: "Ask customer to add a new payment method",
    recoveryLikelihood: 30,
    shouldOfferDiscount: false,
    shouldOfferDelay: false,
  },
  fraudulent: {
    category: "security_issue",
    severity: "high",
    humanReadable: "Payment flagged as potentially fraudulent",
    suggestedAction: "Do not send recovery — flag for manual review",
    recoveryLikelihood: 10,
    shouldOfferDiscount: false,
    shouldOfferDelay: false,
  },
  generic_decline: {
    category: "card_issue",
    severity: "medium",
    humanReadable: "Card declined (no specific reason)",
    suggestedAction: "Ask customer to contact their bank or try another card",
    recoveryLikelihood: 55,
    shouldOfferDiscount: true,
    shouldOfferDelay: false,
  },
};

export function analyzePaymentFailure(reason: FailureReason): AnalysisResult {
  return analysisMap[reason] || analysisMap.generic_decline;
}

export function shouldAutoRecover(reason: FailureReason): boolean {
  const analysis = analyzePaymentFailure(reason);
  return analysis.severity !== "high" && analysis.category !== "security_issue";
}

export function getRecoveryPriority(
  amount: number,
  reason: FailureReason,
): "urgent" | "normal" | "low" {
  const analysis = analyzePaymentFailure(reason);
  if (amount >= 200 && analysis.recoveryLikelihood >= 50) return "urgent";
  if (analysis.recoveryLikelihood >= 40) return "normal";
  return "low";
}
