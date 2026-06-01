import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/middleware";

/**
 * GET /api/branches/[id]
 * Get branch details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const branch = await prisma.branch.findUnique({
      where: { id: params.id },
    });

    if (!branch) {
      return NextResponse.json(
        { error: "Branch not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        branch,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get branch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/branches/[id]
 * Update branch (admin only)
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

    const branch = await prisma.branch.update({
      where: { id: params.id },
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
        numberOfClasses,
        description,
        latitude,
        longitude,
        images: Array.isArray(images) ? JSON.stringify(images) : undefined,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Branch updated successfully",
        branch,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update branch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/branches/[id]
 * Delete branch (admin only)
 */
export async function DELETE(
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

    await prisma.branch.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Branch deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete branch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
