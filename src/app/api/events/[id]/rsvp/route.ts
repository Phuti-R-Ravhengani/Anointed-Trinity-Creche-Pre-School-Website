import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/middleware";

/**
 * POST /api/events/[id]/rsvp
 * RSVP to event
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = authenticateRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { numberOfAttendees } = await request.json();
    const eventId = params.id;

    // Get parent
    const parent = await prisma.parent.findUnique({
      where: { userId: (user as any).userId },
    });

    if (!parent) {
      return NextResponse.json(
        { error: "Parent profile not found" },
        { status: 404 }
      );
    }

    // Check if already RSVP'd
    const existingRsvp = await prisma.eventRsvp.findUnique({
      where: {
        eventId_parentId: {
          eventId,
          parentId: parent.id,
        },
      },
    });

    if (existingRsvp) {
      return NextResponse.json(
        { error: "Already RSVP'd to this event" },
        { status: 400 }
      );
    }

    const rsvp = await prisma.eventRsvp.create({
      data: {
        eventId,
        parentId: parent.id,
        numberOfAttendees: numberOfAttendees || 1,
      },
    });

    // Update RSVP count
    await prisma.event.update({
      where: { id: eventId },
      data: {
        rsvpCount: {
          increment: numberOfAttendees || 1,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "RSVP successful",
        rsvp,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
