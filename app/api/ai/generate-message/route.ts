import { NextRequest, NextResponse } from "next/server";
import { getRecoveryEmailPrompt } from "@/lib/ai-prompts";

// AI Message Generation Endpoint
// Generates personalized recovery emails using OpenAI GPT-4o-mini.
// Falls back to a smart template if no API key is configured.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      amount,
      currency = "usd",
      failureReason,
      storeName = process.env.STORE_NAME || "Our Store",
      subscriptionPlan,
      discountPercent,
    } = body;

    if (!customerName || !amount || !failureReason) {
      return NextResponse.json(
        {
          error: "Missing required fields: customerName, amount, failureReason",
        },
        { status: 400 },
      );
    }

    const prompt = getRecoveryEmailPrompt({
      storeName,
      customerName,
      amount,
      currency,
      failureReason: failureReason.replace(/_/g, " "),
      subscriptionPlan,
      discountPercent,
    });

    // ============================================
    // PRODUCTION: Call OpenAI API
    // ============================================
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && apiKey !== "sk-...") {
      try {
        const { OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey });

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: prompt },
            {
              role: "user",
              content: "Generate the recovery email now.",
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
          response_format: { type: "json_object" },
        });

        const content = completion.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return NextResponse.json({
            success: true,
            source: "openai",
            email: parsed,
          });
        }
      } catch (aiError) {
        console.error("[Rebound AI] OpenAI error, falling back:", aiError);
      }
    }

    // ============================================
    // DEMO MODE: Generate a smart template
    // ============================================
    const reasonMap: Record<string, string> = {
      expired_card: "We noticed that your card on file has expired.",
      insufficient_funds:
        "It looks like there was a temporary issue with your card balance.",
      card_declined: "Your bank declined the most recent charge.",
      authentication_required:
        "Your payment needs a quick security verification.",
      processing_error: "There was a temporary glitch processing your payment.",
      incorrect_cvc: "The security code on your card didn't match.",
      generic_decline: "There was an issue processing your payment.",
    };

    const reasonText = reasonMap[failureReason] || reasonMap.generic_decline;

    const discountText = discountPercent
      ? `\n\nAs a thank you for being a valued customer, we'd like to offer you ${discountPercent}% off if you update your payment today. Just use the link below — the discount is already applied!`
      : "";

    const demoEmail = {
      subject: `Quick heads up about your ${storeName} subscription 💳`,
      body: `Hi ${customerName}!\n\n${reasonText} Your payment of $${amount.toFixed(2)} didn't go through, and we definitely don't want you to lose access to everything you love about ${storeName}.${discountText}\n\nUpdating your card takes just 30 seconds:\n→ [Update Payment Method]\n\nIf you have any questions or need a hand, just reply to this email — we're real humans and we're here to help! 😊\n\nCheers,\nThe ${storeName} Team`,
    };

    return NextResponse.json({
      success: true,
      source: "template",
      email: demoEmail,
    });
  } catch (error) {
    console.error("[Rebound AI] Message generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate message" },
      { status: 500 },
    );
  }
}
