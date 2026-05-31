import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

/**
 * POST /api/admin/auth/create-account
 * Create admin account (requires initial admin setup)
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, adminSecret } =
      await request.json();

    // Simple admin creation secret check
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Invalid admin secret" },
        { status: 403 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "ADMIN",
      },
    });

    await prisma.admin.create({
      data: {
        userId: user.id,
        permissions: ["all"],
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin account created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
