import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { COLORS, JITSI_ROOM_PREFIX } from "@/lib/constants";
import { hasPaidAccess } from "@/lib/access";

export default function Online() {
  const { profile } = useAuth();
  const router = useRouter();
  const paid = hasPaidAccess(profile);

  // Spec: demo users tapping Online should be redirected to Demo automatically.
  useEffect(() => {
    if (profile && !paid) {
      const t = setTimeout(() => router.replace("/(app)/demo"), 800);
      return () => clearTimeout(t);
    }
  }, [profile, paid]);

  if (!paid) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.emoji}>🔒</Text>
          <Text style={styles.title}>Members only</Text>
          <Text style={styles.subtitle}>Redirecting you to demo classes…</Text>
        </View>
      </Screen>
    );
  }

  // For paid users — show today's scheduled room. In a real deployment you'd
  // store a "today's room" doc in Firestore and pull from it; for now a stable
  // per-day room name is enough.
  const today = new Date().toISOString().slice(0, 10);
  const room = `${JITSI_ROOM_PREFIX}-live-${today}`;

  return (
    <Screen>
      <Text style={styles.heading}>Today's live class</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{today}</Text>
        <Text style={[styles.label, { marginTop: 10 }]}>Room</Text>
        <Text style={styles.value}>{room}</Text>
        <Text style={[styles.label, { marginTop: 10 }]}>Timing</Text>
        <Text style={styles.value}>6:30 AM and 6:30 PM IST</Text>
      </View>

      <PrimaryButton
        title="Join class now"
        onPress={() =>
          router.push({
            pathname: "/class/[room]",
            params: { room, kind: "live" },
          })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emoji: { fontSize: 64 },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.text, marginTop: 12 },
  subtitle: { color: COLORS.muted, marginTop: 8, textAlign: "center" },
  heading: { fontSize: 22, fontWeight: "700", color: COLORS.text, marginBottom: 16 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  label: { color: COLORS.muted, fontSize: 12, fontWeight: "600" },
  value: { color: COLORS.text, fontSize: 16, marginTop: 2 },
});
