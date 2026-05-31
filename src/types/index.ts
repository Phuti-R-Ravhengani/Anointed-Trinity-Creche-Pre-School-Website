/**
 * Type definitions for the application
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "PARENT" | "STAFF";
  phoneNumber?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Parent {
  id: string;
  userId: string;
  occupation?: string;
  company?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  idNumber?: string;
  idType?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyEmail?: string;
}

export interface Child {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  allergies?: string;
  medicalNotes?: string;
  profileImage?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  managerName?: string;
  openingHours?: string;
  numberOfClasses: number;
  images: string[];
  description?: string;
  latitude?: number;
  longitude?: number;
}

export interface Application {
  id: string;
  referenceNumber: string;
  parentId: string;
  childId: string;
  branchId: string;
  status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" | "ENROLLED";
  classPreference?: string;
  startDate?: Date;
  notes?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  image?: string;
  category: EventCategory;
  capacity?: number;
  rsvpCount: number;
}

export type EventCategory =
  | "SCHOOL_EVENT"
  | "SPORTS_DAY"
  | "CULTURAL_PROGRAM"
  | "FIELD_TRIP"
  | "PARENT_MEETING"
  | "OTHER";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  image?: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role?: "PARENT" | "ADMIN";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface ApplicationSubmission {
  parentId?: string;
  childFirstName: string;
  childLastName: string;
  childDateOfBirth: string;
  childGender: string;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  parentOccupation?: string;
  parentCompany?: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyEmail?: string;
  allergies?: string;
  medicalNotes?: string;
  branchId: string;
  classPreference?: string;
  documents: File[];
}
