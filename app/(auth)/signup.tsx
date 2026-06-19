import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Screen } from "@/components/Screen";
import { Field } from "@/components/Field";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { ADMIN_PHONES, COLORS, OWNER_WHATSAPP } from "@/lib/constants";
import type { LearningFor, Sex, UserDoc } from "@/lib/types";
import { buildSignupMessage, sendWhatsApp } from "@/lib/whatsapp";
import { usersCol } from "@/lib/firebase";

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
];

const LEARNING_OPTIONS: { value: LearningFor; label: string }[] = [
  { value: "self", label: "Self" },
  { value: "kids", label: "Kids" },
  { value: "family", label: "Family" },
  { value: "other", label: "Other" },
];

export default function Signup() {
  const { fbUser, signOut } = useAuth();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<Sex>("female");
  const [address, setAddress] = useState("");
  const [whatsappSame, setWhatsappSame] = useState(true);
  const [learningFor, setLearningFor] = useState<LearningFor>("self");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!fbUser) return;
    if (!name.trim()) return Alert.alert("Required", "Please enter your name.");
    const ageNum = Number(age);
    if (!Number.isFinite(ageNum) || ageNum < 3 || ageNum > 120) {
      return Alert.alert("Invalid age", "Please enter a valid age.");
    }
    if (!address.trim()) return Alert.alert("Required", "Please enter your address.");

    try {
      setSaving(true);
      const phone = fbUser.phoneNumber ?? "";
      const isAdmin = ADMIN_PHONES.includes(phone);
      const now = firestore.FieldValue.serverTimestamp();
      const doc: Partial<UserDoc> = {
        phone,
        name: name.trim(),
        age: ageNum,
        sex,
        address: address.trim(),
        whatsappSameAsPhone: whatsappSame,
        learningFor,
        role: isAdmin ? "admin" : "user",
        demoClassesJoined: 0,
        accessUntil: null,
        freeAccess: isAdmin,
        // @ts-expect-error - server-side timestamp
        createdAt: now,
        // @ts-expect-error
        updatedAt: now,
      };
      await usersCol().doc(fbUser.uid).set(doc);

      if (whatsappSame && phone) {
        const msg = buildSignupMessage({
          name: name.trim(),
          age: ageNum,
          sex,
          address: address.trim(),
          phone,
          learningFor,
        });
        // Send a copy to the user themselves.
        await sendWhatsApp(phone, msg);
        // Optionally notify the owner too.
        if (OWNER_WHATSAPP && OWNER_WHATSAPP !== phone) {
          await sendWhatsApp(OWNER_WHATSAPP, `New signup:\n\n${msg}`);
        }
      }
    } catch (e: any) {
      Alert.alert("Could not save", e?.message ?? "Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>Tell us about you</Text>
      <Text style={styles.subtitle}>This helps us personalise your classes.</Text>

      <Field label="Full name" placeholder="Your name" value={name} onChangeText={setName} />
      <Field
        label="Age"
        placeholder="e.g. 28"
        keyboardType="number-pad"
        value={age}
        onChangeText={setAge}
      />

      <Text style={styles.label}>Sex</Text>
      <View style={styles.row}>
        {SEX_OPTIONS.map((o) => (
          <Chip key={o.value} selected={sex === o.value} label={o.label} onPress={() => setSex(o.value)} />
        ))}
      </View>

      <Field
        label="Address"
        placeholder="House, street, city, pincode"
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={3}
      />

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>This number is on WhatsApp</Text>
          <Text style={styles.switchHint}>We'll send your signup details there.</Text>
        </View>
        <Switch value={whatsappSame} onValueChange={setWhatsappSame} />
      </View>

      <Text style={styles.label}>Learning yoga for</Text>
      <View style={styles.row}>
        {LEARNING_OPTIONS.map((o) => (
          <Chip
            key={o.value}
            selected={learningFor === o.value}
            label={o.label}
            onPress={() => setLearningFor(o.value)}
          />
        ))}
      </View>

      <View style={{ height: 12 }} />
      <PrimaryButton title="Create my account" onPress={save} loading={saving} />
      <View style={{ height: 8 }} />
      <PrimaryButton title="Sign out" variant="secondary" onPress={signOut} />
    </Screen>
  );
}

function Chip({ selected, label, onPress }: { selected: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
    >
      <Text style={[styles.chipText, selected && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: COLORS.text, marginTop: 8 },
  subtitle: { color: COLORS.muted, marginTop: 4, marginBottom: 20 },
  label: { fontSize: 13, color: COLORS.muted, marginBottom: 6, fontWeight: "600" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderColor: COLORS.border,
    borderWidth: 1,
    backgroundColor: COLORS.card,
  },
  chipText: { color: COLORS.text, fontWeight: "500" },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  switchLabel: { color: COLORS.text, fontWeight: "600" },
  switchHint: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
});
