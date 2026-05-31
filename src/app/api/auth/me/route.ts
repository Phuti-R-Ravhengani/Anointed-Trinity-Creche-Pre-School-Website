import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/auth/me
 * Get current user profile
 */
export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userData = await prisma.user.findUnique({
      where: { id: (user as any).userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        profileImage: true,
        createdAt: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
