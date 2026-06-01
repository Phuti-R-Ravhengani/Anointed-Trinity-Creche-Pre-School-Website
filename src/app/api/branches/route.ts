import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/middleware";

/**
 * GET /api/branches
 * Get all branches
 */
export async function GET(request: NextRequest) {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { name: "asc" },
    });

    // Parse JSON fields for compatibility with frontend
    const parsedBranches = branches.map(branch => ({
      ...branch,
      images: typeof branch.images === 'string' ? JSON.parse(branch.images || '[]') : branch.images,
    }));

    return NextResponse.json(
      {
        success: true,
        branches: parsedBranches,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get branches error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/branches
 * Create new branch (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);

    if (!user || (user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const {
      name,
      address,
      city,
      province,
      postalCode,
      phoneNumber,
      email,
      managerName,
      openingHours,
      numberOfClasses,
      description,
      latitude,
      longitude,
      images,
    } = await request.json();

    if (!name || !address || !city || !province || !phoneNumber || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.create({
      data: {
        name,
        address,
        city,
        province,
        postalCode,
        phoneNumber,
        email,
        managerName,
        openingHours,
        numberOfClasses: numberOfClasses || 0,
        description,
        latitude,
        longitude,
        images: Array.isArray(images) ? JSON.stringify(images) : "[]",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Branch created successfully",
        branch,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create branch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
