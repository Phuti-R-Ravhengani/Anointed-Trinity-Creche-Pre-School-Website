import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    role: string;
  };
}

/**
 * Verify JWT from request headers
 */
export const authenticateRequest = (request: NextRequest) => {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  return decoded;
};

/**
 * Middleware for protected routes
 */
export const withAuth =
  (handler: (req: AuthenticatedRequest) => Promise<Response>) =>
  async (req: AuthenticatedRequest) => {
    const user = authenticateRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    (req as any).user = user;
    return handler(req);
  };

/**
 * Middleware for admin-only routes
 */
export const withAdminAuth =
  (handler: (req: AuthenticatedRequest) => Promise<Response>) =>
  async (req: AuthenticatedRequest) => {
    const user = authenticateRequest(req);

    if (!user || (user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    (req as any).user = user;
    return handler(req);
  };
