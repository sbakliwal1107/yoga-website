import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { COLORS, DEMO_LIMIT, JITSI_ROOM_PREFIX } from "@/lib/constants";
import { demoClassesLeft, hasPaidAccess } from "@/lib/access";
import { usersCol } from "@/lib/firebase";

export default function Demo() {
  const { profile, fbUser } = useAuth();
  const router = useRouter();
  const [joining, setJoining] = useState(false);

  const paid = hasPaidAccess(profile);
  const left = demoClassesLeft(profile, DEMO_LIMIT);

  async function joinDemo() {
    if (!profile || !fbUser) return;
    if (!paid && left <= 0) {
      Alert.alert(
        "Demo limit reached",
        "You've used all your free demo classes. Please buy a plan to continue.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "View plans", onPress: () => router.push("/(app)/payment") },
        ],
      );
      return;
    }

    try {
      setJoining(true);
      // Atomically increment the count so the limit can't be bypassed by tapping fast.
      if (!paid) {
        await usersCol()
          .doc(fbUser.uid)
          .update({
            demoClassesJoined: firestore.FieldValue.increment(1),
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });
      }
      const today = new Date().toISOString().slice(0, 10);
      const room = `${JITSI_ROOM_PREFIX}-demo-${today}`;
      router.push({ pathname: "/class/[room]", params: { room, kind: "demo" } });
    } catch (e: any) {
      Alert.alert("Could not join", e?.message ?? "Try again.");
    } finally {
      setJoining(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.heading}>Demo classes</Text>
      <Text style={styles.subtitle}>
        New here? Try up to {DEMO_LIMIT} demo classes for free.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>
          {paid
            ? "You're a paid member — unlimited access."
            : `${left} of ${DEMO_LIMIT} demo classes remaining`}
        </Text>
        <Text style={[styles.label, { marginTop: 12 }]}>What you'll experience</Text>
        <Text style={styles.value}>
          A short guided session — easy postures, breathwork, and a calm wind-down.
        </Text>
      </View>

      {(paid || left > 0) ? (
        <PrimaryButton
          title={paid ? "Join class" : `Join demo (${left} left)`}
          onPress={joinDemo}
          loading={joining}
        />
      ) : (
        <PrimaryButton title="Buy a plan" onPress={() => router.push("/(app)/payment")} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 24, fontWeight: "700", color: COLORS.text },
  subtitle: { color: COLORS.muted, marginTop: 4, marginBottom: 16 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  label: { color: COLORS.muted, fontSize: 12, fontWeight: "600" },
  value: { color: COLORS.text, fontSize: 16, marginTop: 2, lineHeight: 22 },
});
