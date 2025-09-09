// src/App.tsx
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import Login from "./Login";
import AdminCreateUserOnDevice from "./AdminCreateUserOnDevice";
import InstallPWAButton from "./InstallPWAButton";
import InstallPWAButtoniOS from "./InstallPWAButtoniOS";
import DeviceLabel from "./DeviceLabel";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (!session) {
    return (
      <div style={{ display: "grid", gap: "2rem", padding: "2rem" }}>
        <DeviceLabel/>
        <br />
        <h2>Welcome – please log in</h2>

        <Login onSignedIn={(s: Session | null) => setSession(s)} />

        <hr />

        <AdminCreateUserOnDevice onSignedIn={(s: Session | null) => setSession(s)} />
        
        <hr />

        <InstallPWAButton />
        <InstallPWAButtoniOS />
      </div>
    );
  }

  const displayName =
    (session.user.user_metadata as { name?: string } | null)?.name ??
    session.user.email?.split("@")[0] ??
    "User";

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Logged in!</h2>
      <p>User ID: {session.user.id}</p>
      <p>Name: {displayName}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
