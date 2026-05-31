import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/announcements
 * Get all announcements
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");

    const announcements = await prisma.announcement.findMany({
      where: { published: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.announcement.count({ where: { published: true } });

    return NextResponse.json(
      {
        success: true,
        announcements,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get announcements error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/announcements
 * Create announcement (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const { title, content, image, priority, published } =
      await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        image,
        priority: priority || "NORMAL",
        published: published || false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Announcement created successfully",
        announcement,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create announcement error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
