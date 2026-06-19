import React, { useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Screen } from "@/components/Screen";
import { Field } from "@/components/Field";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { CONTACT, COLORS } from "@/lib/constants";
import { contactsCol } from "@/lib/firebase";

export default function Contact() {
  const { fbUser, profile } = useAuth();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    if (!message.trim()) return Alert.alert("Required", "Please type a message.");
    try {
      setSending(true);
      await contactsCol().add({
        userId: fbUser?.uid ?? null,
        name: profile?.name ?? "Unknown",
        phone: profile?.phone ?? "",
        message: message.trim(),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setMessage("");
      Alert.alert("Thanks!", "We'll get back to you shortly.");
    } catch (e: any) {
      Alert.alert("Could not send", e?.message ?? "Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.heading}>Get in touch</Text>

      <View style={styles.card}>
        <ContactRow icon="📞" label="Phone" value={CONTACT.phone} onPress={() => Linking.openURL(`tel:${CONTACT.phone}`)} />
        <ContactRow icon="✉️" label="Email" value={CONTACT.email} onPress={() => Linking.openURL(`mailto:${CONTACT.email}`)} />
        <ContactRow icon="📍" label="Address" value={CONTACT.address} />
      </View>

      <Text style={styles.heading}>Send us a message</Text>
      <Field
        label="Message"
        placeholder="How can we help?"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={5}
      />
      <PrimaryButton title="Send" onPress={send} loading={sending} />
    </Screen>
  );
}

function ContactRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: string;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={{ fontSize: 22, marginRight: 10 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.text, marginBottom: 10, marginTop: 8 },
  card: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
  },
  row: { flexDirection: "row", alignItems: "center", padding: 12 },
  label: { color: COLORS.muted, fontSize: 12, fontWeight: "600" },
  value: { color: COLORS.text, fontSize: 15, marginTop: 2 },
});
