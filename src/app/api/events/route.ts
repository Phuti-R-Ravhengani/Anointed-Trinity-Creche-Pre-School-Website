import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/events
 * Get all events
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const category = searchParams.get("category");

    const where: any = {};
    if (category) {
      where.category = category;
    }

    const events = await prisma.event.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { startDate: "asc" },
    });

    const total = await prisma.event.count({ where });

    return NextResponse.json(
      {
        success: true,
        events,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get events error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events
 * Create event (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      image,
      category,
      capacity,
    } = await request.json();

    if (!title || !startDate || !endDate || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        image,
        category,
        capacity,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        event,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
