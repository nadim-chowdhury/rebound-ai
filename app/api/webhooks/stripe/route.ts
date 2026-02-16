import { NextRequest, NextResponse } from "next/server";

// Stripe webhook handler for invoice.payment_failed events
// In production, this verifies the Stripe signature and processes real events.
// For demo mode, it accepts simulated events.

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    // ============================================
    // PRODUCTION: Verify Stripe Webhook Signature
    // ============================================
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // let event: Stripe.Event;
    // try {
    //   event = stripe.webhooks.constructEvent(
    //     body,
    //     sig!,
    //     process.env.STRIPE_WEBHOOK_SECRET!
    //   );
    // } catch (err) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    // }

    // ============================================
    // DEMO MODE: Parse the event directly
    // ============================================
    let event;
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data?.object;

      const failedPayment = {
        id: `fp_${Date.now()}`,
        customerId: invoice?.customer || "cus_unknown",
        customerEmail: invoice?.customer_email || "unknown@example.com",
        customerName: invoice?.customer_name || "Unknown Customer",
        amount: (invoice?.amount_due || 0) / 100, // Convert from cents
        currency: invoice?.currency || "usd",
        failureReason: invoice?.last_payment_error?.code || "generic_decline",
        failureMessage:
          invoice?.last_payment_error?.message || "Payment was declined",
        invoiceId: invoice?.id || "in_unknown",
        subscriptionId: invoice?.subscription || undefined,
        status: "pending",
        attemptCount: invoice?.attempt_count || 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // ============================================
      // PRODUCTION: Save to database (Supabase)
      // ============================================
      // const { data, error } = await supabase
      //   .from('failed_payments')
      //   .insert(failedPayment);

      // ============================================
      // PRODUCTION: Trigger AI recovery if auto-send enabled
      // ============================================
      // const analysis = analyzePaymentFailure(failedPayment.failureReason);
      // if (shouldAutoRecover(failedPayment.failureReason)) {
      //   await triggerAIRecovery(failedPayment);
      // }

      console.log("[Rebound AI] Payment failure detected:", {
        customer: failedPayment.customerEmail,
        amount: `$${failedPayment.amount}`,
        reason: failedPayment.failureReason,
      });

      return NextResponse.json({
        received: true,
        payment: failedPayment,
        message: "Payment failure logged. AI recovery initiated.",
      });
    }

    // Handle other event types
    return NextResponse.json({
      received: true,
      message: `Event type ${event.type} received but not processed.`,
    });
  } catch (error) {
    console.error("[Rebound AI] Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Disable body parsing so we can verify the raw Stripe signature
export const runtime = "nodejs";
