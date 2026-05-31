import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "your-super-secret-key";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

/**
 * Generate JWT token
 */
export const generateToken = (
  userId: string,
  role: string,
  email?: string,
  name?: string
) => {
  return (jwt as any).sign(
    { userId, role, email, name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

/**
 * Verify JWT token
 */
export interface VerifiedToken {
  userId: string;
  role: string;
  email?: string;
  name?: string;
}

export const verifyToken = (token: string): VerifiedToken | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
      return decoded as VerifiedToken;
    }

    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Hash password using bcryptjs
 */
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token: string) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};
