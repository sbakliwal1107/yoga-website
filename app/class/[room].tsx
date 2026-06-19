import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { JitsiVideo } from "@/components/JitsiVideo";
import { useAuth } from "@/context/AuthContext";

export default function ClassRoom() {
  const { room } = useLocalSearchParams<{ room: string; kind?: string }>();
  const { profile } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <View style={styles.bar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.close}>← Leave</Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{room}</Text>
      </View>
      <JitsiVideo
        room={String(room)}
        displayName={profile?.name ?? "Student"}
        isModerator={profile?.role === "admin"}
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
