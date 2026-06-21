"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import { EventListSkeleton } from "@/components/Skeleton";

const categories = [
  "All",
  "Technical",
  "Cultural",
  "Sports",
  "Workshop",
  "Seminar",
  "Other",
];

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  image: string;
  _count?: { registrations: number };
  organizer: { name: string };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (search) params.set("search", search);

    fetch(`/api/events?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setEvents(data.events))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6" style={{ color: "#0F172A" }}>
        All Events
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search events..."
          className="input-field flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background:
                  category === cat
                    ? "linear-gradient(135deg, #4F46E5, #7C3AED)"
                    : "#FFFFFF",
                color: category === cat ? "#FFFFFF" : "#64748B",
                border: category === cat ? "none" : "1px solid #E2E8F0",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <EventListSkeleton />
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg" style={{ color: "#94A3B8" }}>
            No events found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
