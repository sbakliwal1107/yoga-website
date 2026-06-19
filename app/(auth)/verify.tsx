import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Field } from "@/components/Field";
import { PrimaryButton } from "@/components/PrimaryButton";
import { COLORS } from "@/lib/constants";
import { clearPendingConfirmation, getPendingConfirmation } from "./login";

export default function Verify() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  async function verify() {
    const conf = getPendingConfirmation();
    if (!conf) {
      Alert.alert("Session expired", "Please request a new OTP.");
      router.replace("/(auth)/login");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      Alert.alert("Invalid code", "Enter the 6-digit code we sent you.");
      return;
    }
    try {
      setVerifying(true);
      await conf.confirm(code);
      clearPendingConfirmation();
      // Gate in _layout.tsx will route to signup or home based on profile.
    } catch (e: any) {
      Alert.alert("Verification failed", e?.message ?? "Wrong code or expired.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.title}>Enter the 6-digit code</Text>
        <Text style={styles.subtitle}>Sent to {phone}</Text>
      </View>

      <Field
        label="OTP"
        placeholder="123456"
        keyboardType="number-pad"
        autoComplete="sms-otp"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />

      <PrimaryButton title="Verify & continue" onPress={verify} loading={verifying} />

      <PrimaryButton
        title="Change number"
        variant="secondary"
        onPress={() => router.replace("/(auth)/login")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", marginVertical: 32 },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.text },
  subtitle: { color: COLORS.muted, marginTop: 4 },
});
