import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/utils/helpers";

// GET /api/messages - Get messages
export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized", 401), { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const messages = await prisma.message.findMany({
      where:
        user.role === "ADMIN"
          ? {}
          : {
              OR: [
                { senderId: user.userId },
                { parent: { userId: user.userId } },
              ],
            },
      include: {
        sender: { select: { firstName: true, lastName: true, email: true } },
        parent: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.message.count();

    return NextResponse.json(
      successResponse(
        { messages, meta: { total, limit, offset } },
        "Messages retrieved"
      ),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message, 500), { status: 500 });
  }
}

// POST /api/messages - Send message
export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized", 401), { status: 401 });
    }

    const { recipientId, subject, body } = await request.json();

    if (!recipientId || !subject || !body) {
      return NextResponse.json(errorResponse("Missing required fields", 400), { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.userId,
        parentId: recipientId,
        subject,
        content: body,
        attachments: [],
        read: false,
      },
    });

    return NextResponse.json(
      successResponse(message, "Message sent successfully"),
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message, 500), { status: 500 });
  }
}
