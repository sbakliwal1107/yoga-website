// ============================================================================
// Edit the values in this file when you onboard the app to your account.
// ============================================================================

// Phone numbers (with country code, no spaces) that should be treated as admin.
// First admin = the owner. Add more if you want shared admin access.
export const ADMIN_PHONES: string[] = [
  "+918058225998", // <-- REPLACE with the owner's phone number
];

// Your UPI details — shown on the Payment screen.
export const UPI = {
  vpa: "jainrakshita52@ybl", // <-- REPLACE with your real UPI ID
  payeeName: "Yogini Rakshita",
};

// Plans shown on the Payment screen.
export const PLANS = [
  { id: "1m", label: "1 Month", amount: 1000, days: 30 },
  { id: "3m", label: "3 Months", amount: 2700, days: 90 },
  { id: "6m", label: "6 Months", amount: 5500, days: 180 },
] as const;

// Free demo classes allowed per user (lifetime).
export const DEMO_LIMIT = 3;

// Jitsi room name prefix — every class joins a room derived from this.
// Using meet.jit.si (free public Jitsi server).
export const JITSI_DOMAIN = "meet.jit.si";
export const JITSI_ROOM_PREFIX = "yogini-rakshita";

// WhatsApp number that receives signup notifications (the owner's number).
// Used only if you'd also like signup details delivered to the owner.
// Set to null to disable owner copy.
export const OWNER_WHATSAPP: string | null = "+918058225998"; // <-- REPLACE

// Contact info shown on the Contact Us screen.
export const CONTACT = {
  email: "sourabhbakliwal143@gmail.com",
  phone: "+918058225998",
  address: "Rakshita Yoga Studio, 17-B, Shivaji Nagar, Kampu, Tonk-304001",
};

// Color palette.
export const COLORS = {
  primary: "#7C3AED",
  primaryDark: "#5B21B6",
  bg: "#FFF7ED",
  card: "#FFFFFF",
  text: "#1F2937",
  muted: "#6B7280",
  border: "#E5E7EB",
  success: "#16A34A",
  danger: "#DC2626",
};
