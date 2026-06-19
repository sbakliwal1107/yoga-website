import * as Linking from "expo-linking";

// Returns true if the OS could open WhatsApp with the message; false otherwise.
// Uses wa.me deep link — works without any WhatsApp Business API setup.
// `phone` must be in international format without "+" or spaces, e.g. "919999999999".
export async function sendWhatsApp(phone: string, message: string): Promise<boolean> {
  const cleaned = phone.replace(/[^0-9]/g, "");
  const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
  try {
    const ok = await Linking.canOpenURL(url);
    if (!ok) return false;
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

export function buildSignupMessage(input: {
  name: string;
  age: number;
  sex: string;
  address: string;
  phone: string;
  learningFor: string;
}): string {
  return [
    `🪷 Welcome to Yogini Rakshita, ${input.name}!`,
    ``,
    `Here are the details you signed up with:`,
    `• Name: ${input.name}`,
    `• Age: ${input.age}`,
    `• Sex: ${input.sex}`,
    `• Phone: ${input.phone}`,
    `• Address: ${input.address}`,
    `• Learning for: ${input.learningFor}`,
    ``,
    `Namaste 🙏`,
  ].join("\n");
}
