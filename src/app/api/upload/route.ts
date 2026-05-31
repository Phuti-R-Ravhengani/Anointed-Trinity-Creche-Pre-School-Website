import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // In production, upload to Cloudinary
    // For now, return mock response
    const mockUrl = `https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_crop/${file.name}`;

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        url: mockUrl,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
});
