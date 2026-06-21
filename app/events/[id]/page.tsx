"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DetailsSkeleton } from "@/components/Skeleton";

interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  image: string;
  organizerId: string;
  organizer: { id: string; name: string; email: string };
  registrations: {
    id: string;
    userId: string;
    status: string;
    user: { id: string; name: string; email: string };
  }[];
  _count: { registrations: number };
}

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [registering, setRegistering] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [qrLoading, setQrLoading] = useState(false);

  const fetchEvent = () => {
    setLoading(true);
    fetch(`/api/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Event not found");
        return res.json();
      })
      .then((data) => setEvent(data.event))
      .catch(() => setError("Event not found"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvent();
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not auth");
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, [id]);

  const isRegistered = event?.registrations.some((r) => r.userId === user?.id);
  const isFull = event ? event._count.registrations >= event.capacity : false;
  const isOrganizer = event?.organizerId === user?.id;
  const registration = event?.registrations.find((r) => r.userId === user?.id);
  const hasAttendance = false;

  const handleRegister = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setRegistering(true);
    try {
      const res = await fetch(`/api/events/${id}/register`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchEvent();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!confirm("Cancel your registration?")) return;
    setRegistering(true);
    try {
      const res = await fetch(`/api/events/${id}/register`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchEvent();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel");
    } finally {
      setRegistering(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleMarkAttendance = async () => {
    try {
      const res = await fetch(`/api/events/${id}/attendance`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("Attendance marked successfully!");
      fetchEvent();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to mark attendance");
    }
  };

  const handleGenerateQR = async () => {
    setQrLoading(true);
    try {
      const res = await fetch(`/api/events/${id}/qr`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQrCode(data.qrCode);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to generate QR");
    } finally {
      setQrLoading(false);
    }
  };

  if (loading) return <DetailsSkeleton />;
  if (error || !event) {
    return (
      <div className="text-center py-20">
        <p className="text-lg" style={{ color: "#EF4444" }}>
          {error || "Event not found"}
        </p>
        <Link href="/" className="gradient-btn inline-block mt-4">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div
        className="h-64 rounded-2xl mb-8 flex items-center justify-center text-white text-6xl font-bold"
        style={{
          background: event.image
            ? `url(${event.image}) center/cover`
            : "linear-gradient(135deg, #4F46E5, #7C3AED)",
        }}
      >
        {!event.image && event.title.charAt(0)}
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold" style={{ color: "#0F172A" }}>
              {event.title}
            </h1>
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ background: "rgba(79, 70, 229, 0.1)", color: "#4F46E5" }}
            >
              {event.category}
            </span>
          </div>
          <p className="text-sm" style={{ color: "#64748B" }}>
            Organized by {event.organizer.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-5 flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <p className="text-xs font-medium" style={{ color: "#94A3B8" }}>DATE</p>
            <p className="font-medium" style={{ color: "#0F172A" }}>{event.date}</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-3">
          <span className="text-2xl">⏰</span>
          <div>
            <p className="text-xs font-medium" style={{ color: "#94A3B8" }}>TIME</p>
            <p className="font-medium" style={{ color: "#0F172A" }}>{event.time}</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-3">
          <span className="text-2xl">📍</span>
          <div>
            <p className="text-xs font-medium" style={{ color: "#94A3B8" }}>LOCATION</p>
            <p className="font-medium" style={{ color: "#0F172A" }}>{event.location}</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-3">
          <span className="text-2xl">👥</span>
          <div>
            <p className="text-xs font-medium" style={{ color: "#94A3B8" }}>CAPACITY</p>
            <p className="font-medium" style={{ color: "#0F172A" }}>
              {event._count.registrations}/{event.capacity} registered
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-semibold mb-3" style={{ color: "#0F172A" }}>
          About this Event
        </h2>
        <p className="leading-relaxed" style={{ color: "#475569" }}>
          {event.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {!user ? (
          <Link href="/login" className="gradient-btn">
            Login to Register
          </Link>
        ) : isRegistered ? (
          <>
            <div
              className="px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22C55E" }}
            >
              ✓ Registered
            </div>
            <button
              onClick={handleMarkAttendance}
              className="gradient-btn text-sm"
              style={{
                background: "linear-gradient(135deg, #06B6D4, #4F46E5)",
              }}
            >
              Mark Attendance
            </button>
            <button
              onClick={handleCancelRegistration}
              className="text-sm font-medium px-6 py-2.5 rounded-xl border transition-all hover:bg-red-50"
              style={{ borderColor: "#EF4444", color: "#EF4444" }}
              disabled={registering}
            >
              {registering ? "Cancelling..." : "Cancel Registration"}
            </button>
          </>
        ) : isFull ? (
          <div
            className="px-6 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: "rgba(245, 158, 11, 0.1)", color: "#F59E0B" }}
          >
            Event Full
          </div>
        ) : (
          <button
            onClick={handleRegister}
            className="gradient-btn"
            disabled={registering}
          >
            {registering ? <div className="spinner mx-auto" /> : "Register Now"}
          </button>
        )}

        {isOrganizer && (
          <>
            <Link href={`/events/${id}/edit`} className="gradient-btn text-sm">
              Edit Event
            </Link>
            <button
              onClick={handleDelete}
              className="text-sm font-medium px-6 py-2.5 rounded-xl border transition-all hover:bg-red-50"
              style={{ borderColor: "#EF4444", color: "#EF4444" }}
            >
              Delete Event
            </button>
            <button
              onClick={handleGenerateQR}
              className="text-sm font-medium px-6 py-2.5 rounded-xl border transition-all"
              style={{ borderColor: "#4F46E5", color: "#4F46E5" }}
              disabled={qrLoading}
            >
              {qrLoading ? "Generating..." : "Generate QR Code"}
            </button>
          </>
        )}
      </div>

      {qrCode && (
        <div className="glass-card p-6 mb-8 text-center">
          <h3 className="font-semibold mb-4" style={{ color: "#0F172A" }}>
            QR Code
          </h3>
          <img src={qrCode} alt="Event QR Code" className="mx-auto" />
          <p className="text-xs mt-2" style={{ color: "#94A3B8" }}>
            Scan to view event details
          </p>
        </div>
      )}

      {isOrganizer && event.registrations.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: "#0F172A" }}>
            Registrations ({event.registrations.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "#94A3B8" }}>
                  <th className="text-left pb-3 font-medium">Name</th>
                  <th className="text-left pb-3 font-medium">Email</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody style={{ color: "#0F172A" }}>
                {event.registrations.map((reg) => (
                  <tr key={reg.id} className="border-t" style={{ borderColor: "#F1F5F9" }}>
                    <td className="py-3">{reg.user.name}</td>
                    <td className="py-3">{reg.user.email}</td>
                    <td className="py-3">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background:
                            reg.status === "REGISTERED"
                              ? "rgba(34, 197, 94, 0.1)"
                              : "rgba(245, 158, 11, 0.1)",
                          color:
                            reg.status === "REGISTERED" ? "#22C55E" : "#F59E0B",
                        }}
                      >
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
