import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    const unsub = auth().onAuthStateChanged((u) => {
      setFbUser(u);
      if (!u) {
        setProfile(null);
        setProfileLoaded(true);
        setInitializing(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!fbUser) return;
    setProfileLoaded(false);
    const unsub = usersCol()
      .doc(fbUser.uid)
      .onSnapshot(
        (snap) => {
          setProfile(snap.exists ? (snap.data() as UserDoc) : null);
          setProfileLoaded(true);
          setInitializing(false);
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
