import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/gallery
 * Get gallery images
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");

    const where: any = {};
    if (category) {
      where.category = category;
    }

    const images = await prisma.gallery.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { uploadedAt: "desc" },
    });

    const total = await prisma.gallery.count({ where });

    return NextResponse.json(
      {
        success: true,
        images,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get gallery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gallery
 * Upload gallery image (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const { title, description, image, category, uploadedBy } =
      await request.json();

    if (!title || !image || !category || !uploadedBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const galleryItem = await prisma.gallery.create({
      data: {
        title,
        description,
        image,
        category,
        uploadedBy,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        gallery: galleryItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload gallery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
