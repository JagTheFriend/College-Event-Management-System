"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { EventListSkeleton } from "@/components/Skeleton";
import EventCard from "@/components/EventCard";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Registration {
  id: string;
  status: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    category: string;
    capacity: number;
    image: string;
    organizer: { name: string };
    _count: { registrations: number };
  };
  attendance: { id: string }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [myEvents, setMyEvents] = useState<Registration["event"][]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not auth");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        return Promise.all([
          fetch("/api/registrations").then((r) => r.json()),
          data.user.role === "ORGANIZER"
            ? fetch("/api/events").then((r) => r.json())
            : Promise.resolve({ events: [] }),
        ]);
      })
      .then(([regData, eventData]) => {
        setRegistrations(regData.registrations || []);
        setMyEvents(eventData.events || []);
      })
      .catch(() => router.push("/login"))
      .finally(() => {
        setChecking(false);
        setLoading(false);
      });
  }, []);

  if (checking) return <Spinner />;
  if (!user) return null;

  const activeRegistrations = registrations.filter(
    (r) => r.status === "REGISTERED"
  );
  const attended = registrations.filter((r) => r.attendance.length > 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#0F172A" }}>
          Welcome, {user.name}
        </h1>
        <p className="text-sm" style={{ color: "#64748B" }}>
          {user.role === "ORGANIZER" ? "Event Organizer" : "Student"} • {user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold" style={{ color: "#4F46E5" }}>
            {activeRegistrations.length}
          </p>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>Active Registrations</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold" style={{ color: "#22C55E" }}>
            {attended.length}
          </p>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>Events Attended</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold" style={{ color: "#06B6D4" }}>
            {user.role === "ORGANIZER"
              ? myEvents.length
              : registrations.length}
          </p>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            {user.role === "ORGANIZER" ? "Events Created" : "Total Registrations"}
          </p>
        </div>
      </div>

      {user.role === "ORGANIZER" && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: "#0F172A" }}>
              My Events
            </h2>
            <Link href="/events/create" className="gradient-btn text-sm">
              + Create Event
            </Link>
          </div>
          {loading ? (
            <EventListSkeleton count={3} />
          ) : myEvents.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p style={{ color: "#94A3B8" }}>You haven&apos;t created any events yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#0F172A" }}>
          My Registrations
        </h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-xl" />
            ))}
          </div>
        ) : registrations.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="mb-3" style={{ color: "#94A3B8" }}>
              You haven&apos;t registered for any events yet
            </p>
            <Link href="/events" className="gradient-btn inline-block text-sm">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {registrations.map((reg) => (
              <Link key={reg.id} href={`/events/${reg.event.id}`}>
                <div
                  className="glass-card p-4 flex items-center justify-between hover:translate-y-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{
                        background: reg.event.image
                          ? `url(${reg.event.image}) center/cover`
                          : "linear-gradient(135deg, #4F46E5, #7C3AED)",
                      }}
                    >
                      {!reg.event.image && reg.event.title.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: "#0F172A" }}>
                        {reg.event.title}
                      </p>
                      <p className="text-xs" style={{ color: "#64748B" }}>
                        {reg.event.date} • {reg.event.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {reg.attendance.length > 0 && (
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22C55E" }}
                      >
                        Attended
                      </span>
                    )}
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        background:
                          reg.status === "REGISTERED"
                            ? "rgba(79, 70, 229, 0.1)"
                            : "rgba(245, 158, 11, 0.1)",
                        color:
                          reg.status === "REGISTERED" ? "#4F46E5" : "#F59E0B",
                      }}
                    >
                      {reg.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
