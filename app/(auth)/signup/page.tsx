"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STUDENT" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: "#0F172A" }}>
          Create Account
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: "#64748B" }}>
          Join the event community
        </p>

        {error && (
          <div
            className="text-sm p-3 rounded-xl mb-4"
            style={{ background: "#FEF2F2", color: "#EF4444" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
          <select
            className="input-field"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="STUDENT">Student</option>
            <option value="ORGANIZER">Organizer</option>
          </select>
          <button type="submit" className="gradient-btn w-full" disabled={loading}>
            {loading ? <div className="spinner mx-auto" /> : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: "#64748B" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#4F46E5" }} className="font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
