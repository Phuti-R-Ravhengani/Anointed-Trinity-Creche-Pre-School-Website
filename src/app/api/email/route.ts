import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware";
import { sendEmail } from "@/lib/email";

interface EmailPayload {
  to: string[];
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const { to, subject, message }: EmailPayload = await request.json();

    if (!to || !Array.isArray(to) || to.length === 0) {
      return NextResponse.json(
        { success: false, message: "Recipients required" },
        { status: 400 }
      );
    }

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, message: "Subject and message required" },
        { status: 400 }
      );
    }

    // Send to each recipient
    const results = await Promise.all(
      to.map((email) =>
        sendEmail({
          to: email,
          subject,
          html: message,
        })
      )
    );

    const successCount = results.filter((r) => r).length;

    return NextResponse.json(
      {
        success: true,
        message: `Email sent to ${successCount}/${to.length} recipients`,
        sent: successCount,
        failed: to.length - successCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Email error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Email send failed" },
      { status: 500 }
    );
  }
}
