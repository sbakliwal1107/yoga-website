import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { COLORS, DEMO_LIMIT } from "@/lib/constants";
import { demoClassesLeft, hasPaidAccess } from "@/lib/access";
import { useRouter } from "expo-router";

export default function Home() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const paid = hasPaidAccess(profile);
  const left = demoClassesLeft(profile, DEMO_LIMIT);

  return (
    <Screen>
      <Text style={styles.hi}>Namaste, {profile?.name ?? "friend"} 🙏</Text>
      <Text style={styles.role}>
        {profile?.role === "admin" ? "Admin account" : paid ? "Active member" : `${left} demo classes left`}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About our classes</Text>
        <Text style={styles.cardText}>
          We offer live yoga classes led by certified instructors — gentle flows, breathwork,
          and meditation. Classes are held inside the app over a secure video room.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What to expect</Text>
        <Text style={styles.cardText}>
          • 45-minute sessions{"\n"}
          • Beginner to intermediate levels{"\n"}
          • Themes vary daily — Hatha, Vinyasa, Pranayama{"\n"}
          • Recordings for paid members on request
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Schedule</Text>
        <Text style={styles.cardText}>
          Monday – Saturday{"\n"}
          Morning: 6:30 AM – 7:15 AM IST{"\n"}
          Evening: 6:30 PM – 7:15 PM IST
        </Text>
      </View>

      {!paid && (
        <PrimaryButton
          title={left > 0 ? "Try a free demo class" : "View plans"}
          onPress={() => router.push(left > 0 ? "/(app)/demo" : "/(app)/payment")}
        />
      )}
      <View style={{ height: 8 }} />
      <PrimaryButton title="Sign out" variant="secondary" onPress={signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hi: { fontSize: 24, fontWeight: "700", color: COLORS.text },
  role: { color: COLORS.muted, marginTop: 4, marginBottom: 16 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  cardTitle: { fontWeight: "700", fontSize: 16, color: COLORS.text, marginBottom: 6 },
  cardText: { color: COLORS.text, lineHeight: 20 },
});
