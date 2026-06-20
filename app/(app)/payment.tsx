import React, { useState } from "react";
import { Alert, Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Field } from "@/components/Field";
import { useAuth } from "@/context/AuthContext";
import { COLORS, OWNER_WHATSAPP, PLANS, UPI } from "@/lib/constants";
import { paymentsCol } from "@/lib/firebase";
import { buildPaymentNotifyMessage, sendWhatsApp } from "@/lib/whatsapp";

export default function Payment() {
  const { fbUser, profile } = useAuth();
  const [planId, setPlanId] = useState<string>(PLANS[0].id);
  const [reference, setReference] = useState("");
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];
  const upiLink =
    `upi://pay?pa=${encodeURIComponent(UPI.vpa)}` +
    `&pn=${encodeURIComponent(UPI.payeeName)}` +
    `&am=${plan.amount}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent(`Yogini Rakshita ${plan.label}`)}`;

  async function pickScreenshot() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled && res.assets[0]) setScreenshotUri(res.assets[0].uri);
  }

  async function submit() {
    if (!fbUser || !profile) return;
    if (!screenshotUri) {
      return Alert.alert("Screenshot required", "Please attach a screenshot of your UPI payment.");
    }
    try {
      setSubmitting(true);
      const path = payments/${fbUser.uid}/${Date.now()}.jpg;
      const ref = storage().ref(path);
      await ref.putFile(screenshotUri);
      const url = await ref.getDownloadURL();

      await paymentsCol().add({
        userId: fbUser.uid,
        userPhone: profile.phone,
        planId: plan.id,
        amount: plan.amount,
        status: "pending",
        screenshotUrl: url,
        upiReference: reference.trim() || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
        reviewedAt: null,
        reviewedBy: null,
        note: null,
      });

      setScreenshotUri(null);
      setReference("");

      const notifyMessage = buildPaymentNotifyMessage({
        userName: profile.name,
        userPhone: profile.phone,
        planLabel: plan.label,
        amount: plan.amount,
        upiReference: reference.trim() || null,
      });

      Alert.alert(
        "Payment submitted",
        "Your payment is pending verification. Tap 'Notify admin' to ping the admin on WhatsApp so they verify it faster.",
        [
          { text: "Later", style: "cancel" },
          ...(OWNER_WHATSAPP
            ? [
                {
                  text: "Notify admin",
                  onPress: async () => {
                    const ok = await sendWhatsApp(OWNER_WHATSAPP, notifyMessage);
                    if (!ok) {
                      Alert.alert(
                        "WhatsApp not available",
                        "Could not open WhatsApp. The admin will still see your payment in their app.",
                      );
                    }
                  },
                },
              ]
            : []),
        ],
      );
    } catch (e: any) {
      Alert.alert("Could not submit", e?.message ?? "Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.heading}>Choose a plan</Text>

      <View style={{ gap: 10, marginBottom: 16 }}>
        {PLANS.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => setPlanId(p.id)}
            style={[styles.plan, planId === p.id && styles.planActive]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.planLabel}>{p.label}</Text>
              <Text style={styles.planSub}>Valid for {p.days} days</Text>
            </View>
            <Text style={styles.planPrice}>₹{p.amount}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.heading}>Pay via UPI</Text>
      <View style={styles.card}>
        <Text style={styles.label}>UPI ID</Text>
        <Text selectable style={styles.value}>{UPI.vpa}</Text>
        <Text style={[styles.label, { marginTop: 10 }]}>Amount</Text>
        <Text style={styles.value}>₹{plan.amount}</Text>
        <View style={{ height: 12 }} />
        <PrimaryButton
          title="Open my UPI app"
          onPress={async () => {
            const can = await Linking.canOpenURL(upiLink);
            if (can) Linking.openURL(upiLink);
            else Alert.alert("No UPI app", "Open GPay/PhonePe/Paytm and pay to the UPI ID above.");
          }}
        />
      </View>

      <Text style={styles.heading}>Submit your payment</Text>
      <Text style={styles.help}>
        After paying, attach a screenshot of the success page. We'll verify and unlock your access.
      </Text>

      <Field
        label="UPI reference / transaction ID (optional)"
        placeholder="e.g. 4123456789"
        value={reference}
        onChangeText={setReference}
      />

      <Pressable onPress={pickScreenshot} style={styles.upload}>
        {screenshotUri ? (
          <Image source={{ uri: screenshotUri }} style={styles.preview} />
        ) : (
          <>
            <Text style={{ fontSize: 28 }}>📎</Text>
            <Text style={styles.uploadText}>Attach payment screenshot</Text>
          </>
        )}
      </Pressable>

      <PrimaryButton title="Submit for verification" onPress={submit} loading={submitting} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.text, marginBottom: 10, marginTop: 8 },
  help: { color: COLORS.muted, marginBottom: 10 },
  plan: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  planActive: { borderColor: COLORS.primary, borderWidth: 2 },
  planLabel: { fontWeight: "700", fontSize: 16, color: COLORS.text },
  planSub: { color: COLORS.muted, marginTop: 2, fontSize: 12 },
  planPrice: { fontSize: 20, fontWeight: "700", color: COLORS.primary },
  card: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  label: { color: COLORS.muted, fontSize: 12, fontWeight: "600" },
  value: { color: COLORS.text, fontSize: 16, marginTop: 2 },
  upload: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    minHeight: 120,
  },
  uploadText: { color: COLORS.muted, marginTop: 6 },
  preview: { width: "100%", height: 220, borderRadius: 8, resizeMode: "contain" },
});