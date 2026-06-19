import React, { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Screen } from "@/components/Screen";
import { Field } from "@/components/Field";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { reviewsCol } from "@/lib/firebase";
import { COLORS } from "@/lib/constants";
import type { ReviewDoc } from "@/lib/types";

type Row = ReviewDoc & { id: string };

export default function Reviews() {
  const { fbUser, profile } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const unsub = reviewsCol()
      .orderBy("createdAt", "desc")
      .limit(50)
      .onSnapshot((snap) => {
        setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as ReviewDoc) })));
      });
    return unsub;
  }, []);

  async function post() {
    if (!fbUser || !profile) return;
    if (!text.trim()) return Alert.alert("Required", "Please write something.");
    try {
      setPosting(true);
      await reviewsCol().add({
        userId: fbUser.uid,
        userName: profile.name,
        rating,
        text: text.trim(),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setText("");
      setRating(5);
    } catch (e: any) {
      Alert.alert("Could not post", e?.message ?? "Try again.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <Screen scroll={false}>
      <Text style={styles.heading}>Reviews</Text>

      <View style={styles.composer}>
        <Text style={styles.label}>Your rating</Text>
        <View style={{ flexDirection: "row", gap: 6, marginBottom: 6 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable key={n} onPress={() => setRating(n)} hitSlop={8}>
              <Text style={{ fontSize: 28 }}>{n <= rating ? "⭐" : "☆"}</Text>
            </Pressable>
          ))}
        </View>
        <Field
          label="Your review"
          placeholder="Share your experience…"
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={3}
        />
        <PrimaryButton title="Post review" onPress={post} loading={posting} />
      </View>

      <FlatList
        data={rows}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={{ color: COLORS.muted, marginTop: 12 }}>Be the first to leave a review.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.author}>
              {item.userName} {"  "}
              <Text style={{ color: "#F59E0B" }}>{"★".repeat(item.rating)}</Text>
            </Text>
            <Text style={styles.body}>{item.text}</Text>
            <Text style={styles.date}>{item.createdAt?.toDate?.().toLocaleString?.() ?? ""}</Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: "700", color: COLORS.text, marginBottom: 10 },
  composer: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  label: { color: COLORS.muted, fontSize: 12, fontWeight: "600", marginBottom: 4 },
  row: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  author: { fontWeight: "700", color: COLORS.text },
  body: { color: COLORS.text, marginTop: 4 },
  date: { color: COLORS.muted, fontSize: 11, marginTop: 6 },
});
