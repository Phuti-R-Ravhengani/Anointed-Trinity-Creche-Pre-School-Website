import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/middleware";
import { sendApplicationStatusEmail } from "@/lib/email";

/**
 * GET /api/applications/[id]
 * Get application details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = authenticateRequest(request);
    const applicationId = params.id;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        parent: {
          include: { user: true },
        },
        child: true,
        branch: true,
        documents: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Check if user is the applicant or admin
    if (
      user &&
      (user as any).userId !== application.parent.userId &&
      (user as any).role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        application,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/applications/[id]
 * Update application status (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = authenticateRequest(request);

    if (!user || (user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { status, rejectionReason, notes } = await request.json();
    const applicationId = params.id;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status,
        rejectionReason: status === "REJECTED" ? rejectionReason : null,
        notes,
        reviewedBy: (user as any).userId,
        reviewedAt: new Date(),
      },
      include: {
        parent: {
          include: { user: true },
        },
        child: true,
      },
    });

    // Send email notification
    await sendApplicationStatusEmail(
      application.parent.user.email,
      application.parent.user.firstName,
      application.child.firstName,
      application.referenceNumber,
      status,
      rejectionReason
    );

    return NextResponse.json(
      {
        success: true,
        message: `Application ${status.toLowerCase()}`,
        application,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
