import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { COLORS, PLANS } from "@/lib/constants";
import { paymentsCol, usersCol } from "@/lib/firebase";
import type { PaymentDoc, UserDoc } from "@/lib/types";

type UserRow = UserDoc & { id: string };
type PaymentRow = PaymentDoc & { id: string };

type Tab = "payments" | "users";

export default function Admin() {
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>("payments");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);

  useEffect(() => {
    if (profile?.role !== "admin") return;
    const u = usersCol()
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) =>
        setUsers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as UserDoc) }))),
      );
    const p = paymentsCol()
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) =>
        setPayments(snap.docs.map((d) => ({ id: d.id, ...(d.data() as PaymentDoc) }))),
      );
    return () => {
      u();
      p();
    };
  }, [profile?.role]);

  if (profile?.role !== "admin") {
    return (
      <Screen>
        <Text style={styles.title}>Admins only</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <Text style={styles.title}>Admin</Text>

      <View style={styles.tabs}>
        <TabBtn label="Payments" active={tab === "payments"} onPress={() => setTab("payments")} />
        <TabBtn label="Users" active={tab === "users"} onPress={() => setTab("users")} />
      </View>

      {tab === "payments" ? (
        <FlatList
          data={payments}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={<Text style={styles.empty}>No payments yet.</Text>}
          renderItem={({ item }) => (
            <PaymentCard
              row={item}
              adminId={profile.phone}
            />
          )}
        />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={<Text style={styles.empty}>No users yet.</Text>}
          renderItem={({ item }) => <UserCard row={item} />}
        />
      )}
    </Screen>
  );
}

function TabBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabBtn, active && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
    >
      <Text style={[styles.tabBtnText, active && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}

function PaymentCard({ row, adminId }: { row: PaymentRow; adminId: string }) {
  const plan = PLANS.find((p) => p.id === row.planId);
  const d = row.createdAt?.toDate?.();

  async function approve() {
    if (!plan) return;
    try {
      const userRef = usersCol().doc(row.userId);
      await firestore().runTransaction(async (tx) => {
        const userSnap = await tx.get(userRef);
        const user = userSnap.data() as UserDoc | undefined;
        const now = Date.now();
        const currentExpiry = user?.accessUntil?.toMillis() ?? 0;
        const startFrom = Math.max(now, currentExpiry);
        const newExpiry = new Date(startFrom + plan.days * 24 * 60 * 60 * 1000);
        tx.update(userRef, {
          accessUntil: firestore.Timestamp.fromDate(newExpiry),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
        tx.update(paymentsCol().doc(row.id), {
          status: "approved",
          reviewedAt: firestore.FieldValue.serverTimestamp(),
          reviewedBy: adminId,
        });
      });
    } catch (e: any) {
      Alert.alert("Failed", e?.message ?? "Could not approve.");
    }
  }

  async function reject() {
    Alert.alert("Reject payment?", "The user will see this as rejected.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: async () => {
          await paymentsCol().doc(row.id).update({
            status: "rejected",
            reviewedAt: firestore.FieldValue.serverTimestamp(),
            reviewedBy: adminId,
          });
        },
      },
    ]);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {row.userPhone} — ₹{row.amount} ({plan?.label ?? row.planId})
      </Text>
      <Text style={styles.cardSub}>{d ? d.toLocaleString() : ""}</Text>
      {row.upiReference ? <Text style={styles.cardSub}>Ref: {row.upiReference}</Text> : null}
      <Text style={[styles.statusPill, statusStyle(row.status)]}>{row.status.toUpperCase()}</Text>

      {row.screenshotUrl ? (
        <Pressable onPress={() => Linking.openURL(row.screenshotUrl!)}>
          <Text style={styles.link}>View screenshot ↗</Text>
        </Pressable>
      ) : null}

      {row.status === "pending" ? (
        <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
          <View style={{ flex: 1 }}>
            <PrimaryButton title="Approve" onPress={approve} />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton title="Reject" variant="danger" onPress={reject} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

function UserCard({ row }: { row: UserRow }) {
  const expiry = row.accessUntil?.toDate?.();
  const active = !!row.freeAccess || (expiry ? expiry.getTime() > Date.now() : false);

  async function toggleFreeAccess(v: boolean) {
    await usersCol().doc(row.id).update({
      freeAccess: v,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  async function extend(days: number) {
    const userRef = usersCol().doc(row.id);
    const start = Math.max(Date.now(), row.accessUntil?.toMillis() ?? 0);
    const newExpiry = new Date(start + days * 24 * 60 * 60 * 1000);
    await userRef.update({
      accessUntil: firestore.Timestamp.fromDate(newExpiry),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {row.name} {row.role === "admin" ? " (admin)" : ""}
      </Text>
      <Text style={styles.cardSub}>
        {row.phone} • {row.age}y • {row.sex} • for {row.learningFor}
      </Text>
      <Text style={styles.cardSub}>
        Demos joined: {row.demoClassesJoined ?? 0}
      </Text>
      <Text style={styles.cardSub}>
        Access: {active ? `✅ until ${expiry?.toLocaleDateString?.() ?? "∞"}` : "❌ none"}
      </Text>

      <View style={styles.switchRow}>
        <Text style={{ flex: 1, color: COLORS.text, fontWeight: "600" }}>
          Free access (bypass payment)
        </Text>
        <Switch value={!!row.freeAccess} onValueChange={toggleFreeAccess} />
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
        <Pressable onPress={() => extend(30)} style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>+30d</Text>
        </Pressable>
        <Pressable onPress={() => extend(90)} style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>+90d</Text>
        </Pressable>
        <Pressable onPress={() => extend(180)} style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>+180d</Text>
        </Pressable>
      </View>
    </View>
  );
}

function statusStyle(s: PaymentDoc["status"]) {
  if (s === "approved") return { backgroundColor: COLORS.success };
  if (s === "rejected") return { backgroundColor: COLORS.danger };
  return { backgroundColor: "#D97706" };
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", color: COLORS.text, marginBottom: 12 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 12 },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  tabBtnText: { color: COLORS.text, fontWeight: "600" },
  card: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardTitle: { color: COLORS.text, fontWeight: "700", fontSize: 16 },
  cardSub: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  link: { color: COLORS.primary, marginTop: 8, fontWeight: "600" },
  empty: { color: COLORS.muted, marginTop: 16 },
  statusPill: {
    alignSelf: "flex-start",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
    overflow: "hidden",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
  },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  smallBtnText: { color: COLORS.primary, fontWeight: "700" },
});
