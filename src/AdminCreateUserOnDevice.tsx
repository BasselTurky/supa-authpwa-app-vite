// src/AdminCreateUserOnDevice.tsx
import React, { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export default function AdminCreateUserOnDevice({ onSignedIn }: { onSignedIn: (session: Session | null) => void }) {
  const [name, setName] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await supabase.functions.invoke("create-user", {
        body: JSON.stringify({ name, adminSecret }),
      });

      if (res.error) return setMsg(res.error.message || "Function error");

    //   const decoder = new TextDecoder();
    //   const text = typeof res.data === "string" ? res.data : decoder.decode(res.data);
    //   const json = JSON.parse(text || "{}");
      const json = res.data;

      const email: string | undefined = json.user?.email;
      if (!email) return setMsg("Function did not return an email");

      const { data: signData, error: signError } = await supabase.auth.signInWithPassword({
        email,
        password: adminSecret,
      });

      setAdminSecret("");
      setName("");

      if (signError) return setMsg(signError.message || "Sign-in failed");

      onSignedIn(signData.session ?? null);
      setMsg("User created and signed in.");
    } catch (e: any) {
      setMsg(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleCreate}>
      <h3>Admin: create user on this device</h3>
      <label>
        User name
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Admin secret
        <input value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} type="password" required />
      </label>
      <button type="submit" disabled={loading}>Create & Sign In</button>
      {msg && <div role="status">{msg}</div>}
    </form>
  );
}
