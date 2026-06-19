import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/lib/constants";

export function Screen({
  children,
  scroll = true,
  padded = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
}) {
  const inner = (
    <View style={[styles.inner, padded && styles.padded]}>{children}</View>
  );
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      {scroll ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  inner: { flex: 1 },
  padded: { padding: 20 },
});
