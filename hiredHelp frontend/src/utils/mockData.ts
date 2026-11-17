import { Skill, TechnicianSearchItem, ServiceRequest, PendingRequest, ActiveJob, CompletedJob, CompletedJobUser, Review } from "../types";

export const mockSkills: Skill[] = [
  { skillId: 1, skillName: "PLUMBING", description: "Plumbing installation and repair services", active: true },
  { skillId: 2, skillName: "ELECTRICAL", description: "Electrical repair and installation", active: true },
  { skillId: 3, skillName: "CLEANING", description: "Deep house cleaning services", active: true },
  { skillId: 4, skillName: "PAINTING", description: "Interior and exterior painting", active: true },
  { skillId: 5, skillName: "CARPENTRY", description: "Woodwork and furniture repair", active: true },
  { skillId: 6, skillName: "AC_REPAIR", description: "AC servicing and repair", active: true },
  { skillId: 7, skillName: "APPLIANCE", description: "Home appliance repair", active: true },
  { skillId: 8, skillName: "BEAUTY", description: "Salon and makeup services at home", active: true }
];

export const mockTechnicians: TechnicianSearchItem[] = [
  {
    technicianId: 25,
    name: "Rahul Kumar",
    profilePhoto: "https://i.pravatar.cc/150?u=rahul",
    yearsExperience: 7,
    completedJobs: 243,
    averageRating: 4.7,
    totalRatings: 128,
    slaScore: 96,
    skills: [
      {
        skillId: 1,
        skillName: "PLUMBING",
        experienceYears: 7,
        certificateUrl: "https://example.com/cert.pdf",
        workPhotos: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12"]
      }
    ]
  },
  {
    technicianId: 26,
    name: "Amit Singh",
    profilePhoto: "https://i.pravatar.cc/150?u=amit",
    yearsExperience: 4,
    completedJobs: 89,
    averageRating: 4.2,
    totalRatings: 45,
    slaScore: 90,
    skills: [
      {
        skillId: 1,
        skillName: "PLUMBING",
        experienceYears: 4,
        certificateUrl: "https://example.com/cert2.pdf",
        workPhotos: []
      }
    ]
  }
];

export const mockUserRequests: ServiceRequest[] = [
  {
    requestId: 101,
    customerId: 15,
    skillId: 1,
    skillName: "PLUMBING",
    description: "Kitchen sink is leaking and water is collecting underneath.",
    issuePhotos: [],
    serviceAddress: "Bettadasanapura, Bangalore",
    scheduledDate: "2026-09-05",
    scheduledStartTime: "10:00",
    scheduledEndTime: "12:00",
    status: "OPEN"
  }
];

export const mockPendingRequests: PendingRequest[] = [
  {
    assignmentId: 501,
    requestId: 102,
    customer: {
      userId: 16,
      name: "Priya Sharma",
      phone: "9876543211"
    },
    skillName: "ELECTRICAL",
    description: "Short circuit in the living room.",
    serviceAddress: "Koramangala, Bangalore",
    scheduledDate: "2026-09-06",
    scheduledStartTime: "14:00",
    scheduledEndTime: "16:00",
    status: "REQUESTED",
    requestedAt: "2026-09-02T09:30:00"
  }
];

export const mockActiveJobs: ActiveJob[] = [
  {
    requestId: 103,
    customerName: "Vikram Reddy",
    customerPhone: "9876543212",
    serviceAddress: "Indiranagar, Bangalore",
    skillName: "PLUMBING",
    description: "Fixing the showerhead.",
    scheduledDate: "2026-09-02",
    scheduledStartTime: "11:00",
    scheduledEndTime: "12:00",
    status: "ACCEPTED"
  }
];

export const mockCompletedJobsTechnician: CompletedJob[] = [
  {
    requestId: 99,
    customerName: "Anita Desai",
    skillName: "PLUMBING",
    completedAt: "2026-08-28T15:30:00",
    finalPrice: 1200,
    rating: 5,
    status: "COMPLETED"
  }
];

export const mockCompletedJobsUser: CompletedJobUser[] = [
  {
    requestId: 98,
    skillName: "CLEANING",
    technicianName: "Sunita Devi",
    completedAt: "2026-08-20T14:00:00",
    finalPrice: 2000,
    rating: 4,
    review: "Good job, but took a bit longer than expected."
  }
];

export const mockReviews: Review[] = [
  {
    reviewId: 9001,
    requestId: 99,
    customerName: "Anita Desai",
    rating: 5,
    review: "Very professional and completed the work quickly.",
    createdAt: "2026-08-28T16:00:00"
  }
];
