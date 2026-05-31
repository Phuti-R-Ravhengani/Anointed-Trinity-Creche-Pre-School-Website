import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, withAdminAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/utils/helpers";

// GET /api/attendance - Get attendance records
export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized", 401), { status: 401 });
    }

    const url = new URL(request.url);
    const childId = url.searchParams.get("childId");
    const date = url.searchParams.get("date");

    const attendance = await prisma.attendance.findMany({
      where: {
        ...(childId && { childId }),
        ...(date && { date: new Date(date) }),
      },
      include: { child: true },
      orderBy: { date: "desc" },
      take: 100,
    });

    return NextResponse.json(successResponse(attendance), { status: 200 });
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message, 500), { status: 500 });
  }
}

// POST /api/attendance - Record attendance
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const { childId, date, status, notes } = await request.json();

    if (!childId || !date || !status) {
      return NextResponse.json(errorResponse("Missing required fields", 400), { status: 400 });
    }

    const attendance = await prisma.attendance.create({
      data: {
        childId,
        date: new Date(date),
        status,
        notes,
      },
    });

    return NextResponse.json(
      successResponse(attendance, "Attendance recorded"),
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message, 500), { status: 500 });
  }
});
