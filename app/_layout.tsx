import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { COLORS } from "@/lib/constants";

function Gate() {
  const { initializing, fbUser, profile, needsProfile } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;
    const segs = segments as readonly string[];
    const first = segs[0];
    const second = segs[1];
    const inAuth = first === "(auth)";
    const inApp = first === "(app)";

    if (!fbUser) {
      if (!inAuth) router.replace("/(auth)/login");
      return;
    }
    if (needsProfile) {
      if (second !== "signup") router.replace("/(auth)/signup");
      return;
    }
    if (profile && !inApp) {
      router.replace("/(app)");
    }
  }, [initializing, fbUser, profile, needsProfile, segments]);

  if (initializing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.bg } }} />
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <Gate />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg },
});
