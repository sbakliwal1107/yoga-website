import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthContext";
import { paymentsCol } from "@/lib/firebase";
import { COLORS, PLANS } from "@/lib/constants";
import type { PaymentDoc } from "@/lib/types";

type Row = PaymentDoc & { id: string };

const STATUS_COLOR: Record<PaymentDoc["status"], string> = {
  pending: "D97706_1",
  approved: COLORS.success,
  rejected: COLORS.danger,
};

export default function History() {
  const { fbUser } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fbUser) return;
    setError(null);
    // We deliberately don't use orderBy("createdAt", "desc") on the server
    // because combining it with a where() requires a Firestore composite index.
    // At per-user payment volumes this is a handful of docs — we sort client-side.
    const unsub = paymentsCol()
      .where("userId", "==", fbUser.uid)
      .onSnapshot(
        (snap) => {
          const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as PaymentDoc) }));
          docs.sort((a, b) => {
            const am = a.createdAt?.toMillis?.() ?? 0;
            const bm = b.createdAt?.toMillis?.() ?? 0;
            return bm - am;
          });
          setRows(docs);
        },
        (err) => {
          console.warn("History query failed:", err);
          setError(err?.message ?? "Could not load payment history.");
        },
      );
    return unsub;
  }, [fbUser?.uid]);

  return (
    <Screen scroll={false}>
      <Text style={styles.heading}>Payment history</Text>
      {error ? (
        <Text style={{ color: COLORS.danger, marginBottom: 12 }}>{error}</Text>
      ) : null}
      <FlatList
        data={rows}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={{ color: COLORS.muted, marginTop: 20 }}>
            {error ? "" : "No payments yet."}
          </Text>
        }
        renderItem={({ item }) => {
          const plan = PLANS.find((p) => p.id === item.planId);
          const d = item.createdAt?.toDate?.();
          return (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{plan?.label ?? item.planId} — ₹{item.amount}</Text>
                <Text style={styles.sub}>{d ? d.toLocaleString() : "—"}</Text>
                {item.upiReference ? (
                  <Text style={styles.sub}>Ref: {item.upiReference}</Text>
                ) : null}
              </View>
              <View style={[styles.pill, { backgroundColor: STATUS_COLOR[item.status] }]}>
                <Text style={styles.pillText}>{item.status}</Text>
              </View>
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: "700", color: COLORS.text, marginBottom: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  title: { color: COLORS.text, fontWeight: "700" },
  sub: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  pillText: { color: "#fff", fontSize: 12, fontWeight: "700", textTransform: "uppercase" },
});