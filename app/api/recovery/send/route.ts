import { NextRequest, NextResponse } from "next/server";

// Recovery Email Send Endpoint
// Sends the AI-generated recovery email via Resend.
// Falls back to logging for demo mode.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, htmlBody, textBody, from } = body;

    if (!to || !subject || (!htmlBody && !textBody)) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, and body content" },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const emailFrom = from || process.env.EMAIL_FROM || "recovery@rebound.ai";

    // ============================================
    // PRODUCTION: Send via Resend
    // ============================================
    if (apiKey && apiKey !== "re_...") {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);

        const { data, error } = await resend.emails.send({
          from: emailFrom,
          to: [to],
          subject: subject,
          html: htmlBody || undefined,
          text: textBody || undefined,
        });

        if (error) {
          console.error("[Rebound AI] Resend error:", error);
          return NextResponse.json(
            { error: "Failed to send email", details: error },
            { status: 500 },
          );
        }

        return NextResponse.json({
          success: true,
          source: "resend",
          emailId: data?.id,
          message: `Recovery email sent to ${to}`,
        });
      } catch (sendError) {
        console.error("[Rebound AI] Send error:", sendError);
      }
    }

    // ============================================
    // DEMO MODE: Log the email
    // ============================================
    console.log("[Rebound AI] Demo mode — email logged:", {
      to,
      subject,
      bodyPreview: (textBody || htmlBody || "").slice(0, 100) + "...",
    });

    return NextResponse.json({
      success: true,
      source: "demo",
      message: `Demo mode: Recovery email to ${to} logged (not actually sent)`,
      email: { to, subject, bodyPreview: (textBody || "").slice(0, 200) },
    });
  } catch (error) {
    console.error("[Rebound AI] Recovery send error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
