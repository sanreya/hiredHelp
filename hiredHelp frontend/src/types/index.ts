export type Role = "USER" | "TECHNICIAN" | "ADMIN";

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  role: Role;
  active: boolean;
}

export interface Skill {
  skillId: number;
  skillName: string;
  description: string;
  active: boolean;
}

export interface TechnicianProfile {
  technicianId: number;
  user: User;
  completedJobs: number;
  acceptedJobs: number;
  rejectedJobs: number;
  forfeitedJobs: number;
  slaScore: number;
  averageRating: number;
  totalRatings: number;
  profilePhoto: string;
}

export interface TechnicianSkill {
  id: number;
  technician: TechnicianProfile;
  skill: Skill;
  skillName: string;
  experienceYears: number;
  certificateUrl?: string;
  workPhotos?: string[];
}

export type RequestStatus =
  | "OPEN"
  | "REQUESTED"
  | "ACCEPTED"
  | "TECHNICIAN_ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "DELAYED"
  | "REOPENED"
  | "REJECTED";

export type AssignmentStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "REJECTED"
  | "FORFEITED"
  | "CANCELLED";

export interface ServiceRequest {
  requestId: number;
  customer: User;
  skill: Skill;
  description: string;
  issuePhotos?: string[];
  serviceAddress: string;
  latitude?: number;
  longitude?: number;
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  status: RequestStatus;
  estimatedPriceMin?: number | null;
  estimatedPriceMax?: number | null;
  finalPrice?: number | null;
  acceptedAt?: Date | null;
  arrivedAt?: Date | null
  startedAt?: Date | null
  completedAt?: Date | null
}

export interface TechnicianAssignment {
  assignmentId: number;
  requestId: number;
  technicianId: number;
  status: RequestStatus;
  requestedAt?: string;
  respondedAt?: string;
}

export interface PendingRequest {
  assignmentId: number;
  request: ServiceRequest;
  status: AssignmentStatus;
  requestedAt: string;
  respondedAt: string | null;
  rejectionReason: string | null;
  issuePhotos: string[];
}

export interface ActiveJob {
  request: ServiceRequest;
  customerName: string;
  customerPhone: string;
  serviceAddress: string;
  skillName: string;
  description: string;
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  status: RequestStatus;
}

export interface CompletedJobUser {
  serviceRequestAssignment: {
    request: ServiceRequest;
    customer: User;
    skillName: string;
    completedAt: string;
    finalPrice: number;
    rating?: number;
    status: RequestStatus;
    technician: TechnicianProfile;
  };
  review: Review | null;
}

export interface CompletedJob {
  request: ServiceRequest;
  customer: User;
  skillName: string;
  completedAt: string;
  finalPrice: number;
  rating?: number;
  status: RequestStatus;
  technician: TechnicianProfile;
}

export interface Review {
  reviewId: number;
  requestId: number;
  customer: User;
  technician: TechnicianProfile;
  rating: number;
  review: string;
  createdAt: Date;
}

export interface TechnicianSearchItem {
  technician: {
    technicianId: number;
    user: {
      firstName: string;
      lastName: string;
      userId: number;
      email: string;
      phone: string;
      address: string;
      latitude?: number;
      longitude?: number;
      role: Role;
      active: boolean;
    }
    profilePhoto: string;
    yearsExperience: number;
    completedJobs: number;
    averageRating: number;
    totalRatings: number;
    slaScore: number;
  }
  skills: {
    skillId: number;
    skillName: string;
    experienceYears: number;
    certificateUrl: string;
    workPhotos: string[];
  }[];
}

export interface AuthResponse {
  token: string;
  userId: number;
  role: Role;
}

export interface CreateReviewRequest {
  rating: number;
  review: string;
}