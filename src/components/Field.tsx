import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";
import { COLORS } from "@/lib/constants";

export function Field({
  label,
  error,
  ...rest
}: TextInputProps & { label: string; error?: string | null }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={COLORS.muted}
        style={[styles.input, !!error && { borderColor: COLORS.danger }]}
        {...rest}
      />
      {error ? <Text style={styles.err}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 13, color: COLORS.muted, marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  err: { color: COLORS.danger, marginTop: 4, fontSize: 12 },
});
