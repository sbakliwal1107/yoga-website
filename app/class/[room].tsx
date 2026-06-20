import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import firestore from "@react-native-firebase/firestore";
import { JitsiVideo, type JitsiEvent } from "@/components/JitsiVideo";
import { useAuth } from "@/context/AuthContext";
import { usersCol } from "@/lib/firebase";
import { hasPaidAccess } from "@/lib/access";

// A demo class is counted as "used" only after the user has stayed in the
// meeting for this long. Prevents accidental tap-and-leave from burning a demo.
const DEMO_COUNT_AFTER_MS = 10 * 60 * 1000; // 10 minutes

export default function ClassRoom() {
  const { room, kind } = useLocalSearchParams<{ room: string; kind?: string }>();
  const { profile, fbUser } = useAuth();
  const router = useRouter();

  const isDemo = kind === "demo";
  const shouldCountDemo = isDemo && !!profile && !hasPaidAccess(profile);

  // Refs so cleanup can clear the timer regardless of state churn.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countedRef = useRef(false);
  const [joined, setJoined] = useState(false);

  function startDemoTimer() {
    if (!shouldCountDemo || countedRef.current || timerRef.current) return;
    timerRef.current = setTimeout(async () => {
      if (countedRef.current || !fbUser) return;
      countedRef.current = true;
      try {
        await usersCol().doc(fbUser.uid).update({
          demoClassesJoined: firestore.FieldValue.increment(1),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      } catch (e) {
        // Increment failure is non-fatal — log only. User keeps watching.
        console.warn("Demo counter increment failed:", e);
      }
    }, DEMO_COUNT_AFTER_MS);
  }

  function clearDemoTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    return () => clearDemoTimer();
  }, []);

  function handleJitsiEvent(e: JitsiEvent) {
    if (e === "joined") {
      setJoined(true);
      startDemoTimer();
    } else if (e === "left" || e === "ready-to-close") {
      clearDemoTimer();
      router.back();
    }
  }

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <View style={styles.bar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.close}>← Leave</Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {room}
          {isDemo && !joined ? "  •  connecting…" : ""}
        </Text>
      </View>
      <JitsiVideo
        room={String(room)}
        displayName={profile?.name ?? "Student"}
        isModerator={profile?.role === "admin"}
        onEvent={handleJitsiEvent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#111",
    gap: 14,
  },
  close: { color: "#fff", fontSize: 16, fontWeight: "600" },
  title: { color: "#fff", flex: 1, fontSize: 14, opacity: 0.7 },
});