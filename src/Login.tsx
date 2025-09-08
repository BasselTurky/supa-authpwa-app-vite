// src/Login.tsx
import React, { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export default function Login({ onSignedIn }: { onSignedIn: (session: Session | null) => void }) {
  const [name, setName] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const email = `${name}@domain.local`;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: adminSecret });

      setAdminSecret(""); // clear sensitive input

      if (error) return setMsg(error.message || "Login failed");

      onSignedIn(data.session ?? null);
      setMsg("Signed in successfully.");
    } catch (e: any) {
      setMsg(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h3>Login</h3>
      <label>
        User name
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Admin secret
        <input type="password" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} required />
      </label>
      <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      {msg && <div role="status">{msg}</div>}
    </form>
  );
}
