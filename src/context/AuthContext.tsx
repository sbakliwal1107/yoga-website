import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { auth, usersCol } from "@/lib/firebase";
import type { UserDoc } from "@/lib/types";

type AuthState = {
  initializing: boolean;
  fbUser: FirebaseAuthTypes.User | null;
  profile: UserDoc | null;
  // True after Firebase auth resolves but no Firestore profile yet (= mid-signup).
  needsProfile: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [fbUser, setFbUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [profile, setProfile] = useState<UserDoc | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Tracks the last seen accessUntil so we can detect transitions and
  // show a one-time "payment approved" alert. We only fire when access
  // gains — past→future or null→future — never on initial load.
  const lastAccessRef = useRef<{ initialized: boolean; activeUntilMs: number }>({
    initialized: false,
    activeUntilMs: 0,
  });

  useEffect(() => {
    const unsub = auth().onAuthStateChanged((u) => {
      setFbUser(u);
      if (!u) {
        setProfile(null);
        setProfileLoaded(true);
        setInitializing(false);
        lastAccessRef.current = { initialized: false, activeUntilMs: 0 };
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!fbUser) return;
    setProfileLoaded(false);
    lastAccessRef.current = { initialized: false, activeUntilMs: 0 };
    const unsub = usersCol()
      .doc(fbUser.uid)
      .onSnapshot(
        (snap) => {
          const next = snap.exists ? (snap.data() as UserDoc) : null;
          setProfile(next);
          setProfileLoaded(true);
          setInitializing(false);

          if (!next) return;
          const nextMs = next.accessUntil?.toMillis?.() ?? 0;
          const now = Date.now();
          const prev = lastAccessRef.current;
          if (!prev.initialized) {
            lastAccessRef.current = { initialized: true, activeUntilMs: nextMs };
            return;
          }
          // Detect "just got approved" — was inactive (past or null), now in the future.
          const wasActive = prev.activeUntilMs > now;
          const isActive = nextMs > now;
          if (!wasActive && isActive && nextMs > prev.activeUntilMs) {
            const expiry = next.accessUntil?.toDate?.();
            Alert.alert(
              "🎉 Payment approved",
              expiry
                ? `Your access is active until ${expiry.toLocaleDateString()}. Enjoy the classes!`
                : "Your access has been activated. Enjoy the classes!",
            );
          }
          lastAccessRef.current = { initialized: true, activeUntilMs: nextMs };
        },
        () => {
          setProfileLoaded(true);
          setInitializing(false);
        },
      );
    return unsub;
  }, [fbUser?.uid]);

  const value = useMemo<AuthState>(
    () => ({
      initializing,
      fbUser,
      profile,
      needsProfile: !!fbUser && profileLoaded && !profile,
      signOut: async () => {
        await auth().signOut();
      },
    }),
    [initializing, fbUser, profile, profileLoaded],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}