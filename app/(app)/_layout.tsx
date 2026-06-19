import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { COLORS } from "@/lib/constants";

function TabIcon({ icon, color }: { icon: string; color: string }) {
  return <Text style={{ fontSize: 20, color }}>{icon}</Text>;
}

export default function AppLayout() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: { backgroundColor: COLORS.card, borderTopColor: COLORS.border },
        headerStyle: { backgroundColor: COLORS.bg },
        headerTitleStyle: { color: COLORS.text },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} /> }}
      />
      <Tabs.Screen
        name="online"
        options={{ title: "Online", tabBarIcon: ({ color }) => <TabIcon icon="🎥" color={color} /> }}
      />
      <Tabs.Screen
        name="demo"
        options={{ title: "Demo", tabBarIcon: ({ color }) => <TabIcon icon="🪷" color={color} /> }}
      />
      <Tabs.Screen
        name="payment"
        options={{ title: "Plans", tabBarIcon: ({ color }) => <TabIcon icon="💳" color={color} /> }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: "History", tabBarIcon: ({ color }) => <TabIcon icon="🧾" color={color} /> }}
      />
      <Tabs.Screen
        name="reviews"
        options={{ title: "Reviews", tabBarIcon: ({ color }) => <TabIcon icon="⭐" color={color} /> }}
      />
      <Tabs.Screen
        name="contact"
        options={{ title: "Contact", tabBarIcon: ({ color }) => <TabIcon icon="📞" color={color} /> }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Admin",
          href: isAdmin ? "/admin" : null,
          tabBarIcon: ({ color }) => <TabIcon icon="🛠️" color={color} />,
        }}
      />
    </Tabs>
  );
}
