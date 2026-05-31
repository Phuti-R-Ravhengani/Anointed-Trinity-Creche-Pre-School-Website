import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/utils/helpers";

// GET /api/notifications - Get notifications
export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized", 401), { status: 401 });
    }

    const url = new URL(request.url);
    const unreadOnly = url.searchParams.get("unreadOnly") === "true";

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.userId,
        ...(unreadOnly && { read: false }),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(successResponse(notifications), { status: 200 });
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message, 500), { status: 500 });
  }
}

// PATCH /api/notifications - Mark as read
export async function PATCH(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized", 401), { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(errorResponse("Notification ID required", 400), { status: 400 });
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json(
      successResponse(notification, "Notification marked as read"),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message, 500), { status: 500 });
  }
}
