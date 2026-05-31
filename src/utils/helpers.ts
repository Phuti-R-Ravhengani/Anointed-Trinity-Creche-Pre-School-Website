/**
 * API response formatter
 */
export const successResponse = (data: any, message = "Success") => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (message: string, statusCode = 400) => {
  return {
    success: false,
    message,
    statusCode,
  };
};

/**
 * Generate unique reference number for applications
 */
export const generateReferenceNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ATK-${timestamp}${random}`;
};

/**
 * Validate email
 */
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (South African format)
 */
export const isValidPhoneNumber = (phone: string) => {
  // South African format: +27, 0, or just digits
  const phoneRegex = /^(\+27|0|27)[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/[- ]/g, ""));
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

/**
 * Sanitize file name
 */
export const sanitizeFileName = (fileName: string) => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .substring(0, 255);
};

/**
 * Convert file size to readable format
 */
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};
