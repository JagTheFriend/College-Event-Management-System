"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function CreateEventPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Other",
    capacity: "100",
    image: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not auth");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        if (data.user.role !== "ORGANIZER") {
          router.push("/");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setChecking(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/events/${data.event.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <Spinner />;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#0F172A" }}>
        Create Event
      </h1>

      <div className="glass-card p-8">
        {error && (
          <div
            className="text-sm p-3 rounded-xl mb-4"
            style={{ background: "#FEF2F2", color: "#EF4444" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#475569" }}>
              Title
            </label>
            <input
              type="text"
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#475569" }}>
              Description
            </label>
            <textarea
              className="input-field min-h-[120px] resize-y"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#475569" }}>
                Date
              </label>
              <input
                type="date"
                className="input-field"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#475569" }}>
                Time
              </label>
              <input
                type="time"
                className="input-field"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#475569" }}>
              Location
            </label>
            <input
              type="text"
              className="input-field"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#475569" }}>
                Category
              </label>
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#475569" }}>
                Capacity
              </label>
              <input
                type="number"
                className="input-field"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                min={1}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#475569" }}>
              Image URL (optional)
            </label>
            <input
              type="url"
              className="input-field"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <button type="submit" className="gradient-btn w-full" disabled={loading}>
            {loading ? <div className="spinner mx-auto" /> : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
