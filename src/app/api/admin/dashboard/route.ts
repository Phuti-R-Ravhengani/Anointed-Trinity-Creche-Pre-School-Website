import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    const totalApplications = await prisma.application.count();
    const pendingApplications = await prisma.application.count({
      where: { status: "PENDING" },
    });
    const approvedApplications = await prisma.application.count({
      where: { status: "APPROVED" },
    });
    const totalParents = await prisma.parent.count();
    const totalChildren = await prisma.child.count();
    const totalBranches = await prisma.branch.count();
    const upcomingEvents = await prisma.event.findMany({
      where: {
        startDate: {
          gte: new Date(),
        },
      },
      take: 5,
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalApplications,
          pendingApplications,
          approvedApplications,
          totalParents,
          totalChildren,
          totalBranches,
          upcomingEvents,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
