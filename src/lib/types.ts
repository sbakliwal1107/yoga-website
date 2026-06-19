import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type Sex = "female" | "male" | "other";
export type LearningFor = "self" | "kids" | "family" | "other";
export type UserRole = "user" | "admin";

export interface UserDoc {
  phone: string;
  name: string;
  age: number;
  sex: Sex;
  address: string;
  whatsappSameAsPhone: boolean;
  learningFor: LearningFor;
  role: UserRole;
  // Lifetime count of demo classes the user has joined.
  demoClassesJoined: number;
  // Timestamp until which the user has paid access. Past = no access.
  // Admin can extend this manually to bypass payment.
  accessUntil: FirebaseFirestoreTypes.Timestamp | null;
  // Free pass granted by admin (e.g. family). Overrides accessUntil check.
  freeAccess: boolean;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}

export interface PaymentDoc {
  userId: string;
  userPhone: string;
  planId: string;
  amount: number;
  // 'pending' = user uploaded screenshot, awaiting admin approval.
  // 'approved' = admin approved; accessUntil extended.
  // 'rejected' = admin rejected.
  status: "pending" | "approved" | "rejected";
  screenshotUrl: string | null;
  upiReference: string | null;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  reviewedAt: FirebaseFirestoreTypes.Timestamp | null;
  reviewedBy: string | null;
  note: string | null;
}

export interface ReviewDoc {
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface ContactDoc {
  userId: string | null;
  name: string;
  phone: string;
  message: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}
