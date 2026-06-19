import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import { Screen } from "@/components/Screen";
import { Field } from "@/components/Field";
import { PrimaryButton } from "@/components/PrimaryButton";
import { COLORS } from "@/lib/constants";

// Holds the confirmation result across the login -> verify screens.
// Stored at module level (not React state) because Firebase's confirmation
// object isn't serializable — we can't pass it via route params.
let pendingConfirmation: import("@react-native-firebase/auth").FirebaseAuthTypes.ConfirmationResult | null = null;
export function getPendingConfirmation() {
  return pendingConfirmation;
}
export function clearPendingConfirmation() {
  pendingConfirmation = null;
}

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);

  async function sendOtp() {
    const cleaned = phone.replace(/\s+/g, "");
    if (!/^\+\d{10,15}$/.test(cleaned)) {
      Alert.alert("Invalid number", "Enter your phone with country code, e.g. +919876543210");
      return;
    }
    try {
      setSending(true);
      pendingConfirmation = await auth().signInWithPhoneNumber(cleaned);
      router.push({ pathname: "/(auth)/verify", params: { phone: cleaned } });
    } catch (e: any) {
      Alert.alert("Could not send OTP", e?.message ?? "Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.logo}>🪷</Text>
        <Text style={styles.title}>Yogini Rakshita</Text>
        <Text style={styles.subtitle}>Sign in with your mobile number</Text>
      </View>

      <Field
        label="Mobile number (with country code)"
        placeholder="+91 9876543210"
        keyboardType="phone-pad"
        autoComplete="tel"
        value={phone}
        onChangeText={setPhone}
      />

      <PrimaryButton title="Send OTP" onPress={sendOtp} loading={sending} />

      <Text style={styles.help}>
        We will send a one-time verification code to this number.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", marginVertical: 32 },
  logo: { fontSize: 56 },
  title: { fontSize: 28, fontWeight: "700", color: COLORS.text, marginTop: 8 },
  subtitle: { color: COLORS.muted, marginTop: 4 },
  help: { color: COLORS.muted, marginTop: 16, textAlign: "center", fontSize: 12 },
});
