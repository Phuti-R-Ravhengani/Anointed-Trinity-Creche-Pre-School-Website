import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken, hashPassword, comparePassword } from "@/lib/auth";
import { isValidEmail } from "@/utils/helpers";

/**
 * POST /api/auth/register
 * Register a new parent account
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phoneNumber } =
      await request.json();

    // Validate input
    if (!email || !password || !firstName || !lastName || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        role: "PARENT",
      },
    });

    // Create parent profile
    await prisma.parent.create({
      data: {
        userId: user.id,
      },
    });

    // Generate token
    const token = generateToken(
      user.id,
      user.role,
      user.email,
      `${user.firstName} ${user.lastName}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
