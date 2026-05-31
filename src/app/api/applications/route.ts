import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReferenceNumber } from "@/utils/helpers";
import { sendApplicationConfirmationEmail } from "@/lib/email";

/**
 * POST /api/applications
 * Submit a new application
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const childFirstName = formData.get("childFirstName") as string;
    const childLastName = formData.get("childLastName") as string;
    const childDateOfBirth = formData.get("childDateOfBirth") as string;
    const childGender = formData.get("childGender") as string;
    const parentFirstName = formData.get("parentFirstName") as string;
    const parentLastName = formData.get("parentLastName") as string;
    const parentEmail = formData.get("parentEmail") as string;
    const parentPhone = formData.get("parentPhone") as string;
    const parentOccupation = formData.get("parentOccupation") as string;
    const parentCompany = formData.get("parentCompany") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const province = formData.get("province") as string;
    const postalCode = formData.get("postalCode") as string;
    const emergencyName = formData.get("emergencyName") as string;
    const emergencyPhone = formData.get("emergencyPhone") as string;
    const emergencyEmail = formData.get("emergencyEmail") as string;
    const allergies = formData.get("allergies") as string;
    const medicalNotes = formData.get("medicalNotes") as string;
    const branchId = formData.get("branchId") as string;
    const classPreference = formData.get("classPreference") as string;

    // Validate required fields
    if (
      !childFirstName ||
      !childLastName ||
      !childDateOfBirth ||
      !childGender ||
      !parentFirstName ||
      !parentLastName ||
      !parentEmail ||
      !parentPhone ||
      !address ||
      !city ||
      !province ||
      !postalCode ||
      !emergencyName ||
      !emergencyPhone ||
      !branchId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      return NextResponse.json(
        { error: "Branch not found" },
        { status: 404 }
      );
    }

    // Check if user exists or create new parent
    let parent = await prisma.parent.findFirst({
      where: {
        user: { email: parentEmail },
      },
      include: { user: true },
    });

    if (!parent) {
      // Create new user and parent profile (without password for now)
      const user = await prisma.user.create({
        data: {
          email: parentEmail,
          password: "", // Will be set later
          firstName: parentFirstName,
          lastName: parentLastName,
          phoneNumber: parentPhone,
          role: "PARENT",
        },
      });

      parent = await prisma.parent.create({
        data: {
          userId: user.id,
          occupation: parentOccupation,
          company: parentCompany,
          address,
          city,
          province,
          postalCode,
          emergencyName,
          emergencyPhone,
          emergencyEmail,
        },
        include: { user: true },
      });
    } else {
      // Update existing parent
      await prisma.parent.update({
        where: { id: parent.id },
        data: {
          occupation: parentOccupation,
          company: parentCompany,
          address,
          city,
          province,
          postalCode,
          emergencyName,
          emergencyPhone,
          emergencyEmail,
        },
      });
    }

    // Create child
    const child = await prisma.child.create({
      data: {
        parentId: parent.id,
        firstName: childFirstName,
        lastName: childLastName,
        dateOfBirth: new Date(childDateOfBirth),
        gender: childGender,
        allergies,
        medicalNotes,
      },
    });

    // Generate reference number
    const referenceNumber = generateReferenceNumber();

    // Create application
    const application = await prisma.application.create({
      data: {
        referenceNumber,
        parentId: parent.id,
        childId: child.id,
        branchId,
        classPreference,
        status: "PENDING",
      },
    });

    // Handle document uploads
    const files = formData.getAll("documents") as File[];
    if (files.length > 0) {
      for (const file of files) {
        // In a real app, upload to Cloudinary/Firebase
        // For now, just store the file info
        const fileName = file.name;
        const fileSize = file.size;
        const documentType = fileName.includes("birth")
          ? "BIRTH_CERTIFICATE"
          : fileName.includes("id")
            ? "PARENT_ID"
            : fileName.includes("residence")
              ? "PROOF_OF_RESIDENCE"
              : "OTHER";

        await prisma.document.create({
          data: {
            applicationId: application.id,
            type: documentType as any,
            url: `/uploads/${application.id}/${fileName}`,
            fileName,
            fileSize,
          },
        });
      }
    }

    // Send confirmation email
    await sendApplicationConfirmationEmail(
      parentEmail,
      parentFirstName,
      childFirstName,
      referenceNumber
    );

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        application: {
          id: application.id,
          referenceNumber: application.referenceNumber,
          status: application.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/applications
 * Get all applications (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const applications = await prisma.application.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        parent: {
          include: { user: true },
        },
        child: true,
        branch: true,
        documents: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.application.count({ where });

    return NextResponse.json(
      {
        success: true,
        applications,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          pageSize: limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
