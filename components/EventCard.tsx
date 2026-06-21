import Link from "next/link";

interface EventCardProps {
  event: {
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
  };
}

export default function EventCard({ event }: EventCardProps) {
  const registered = event._count?.registrations ?? 0;

  return (
    <Link href={`/events/${event.id}`}>
      <div className="glass-card p-5 h-full flex flex-col cursor-pointer group">
        <div
          className="h-40 rounded-xl mb-4 flex items-center justify-center text-white text-4xl font-bold overflow-hidden"
          style={{
            background: event.image
              ? `url(${event.image}) center/cover`
              : "linear-gradient(135deg, #4F46E5, #7C3AED)",
          }}
        >
          {!event.image && event.title.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg leading-tight" style={{ color: "#0F172A" }}>
              {event.title}
            </h3>
            <span
              className="text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap"
              style={{
                background: "rgba(79, 70, 229, 0.1)",
                color: "#4F46E5",
              }}
            >
              {event.category}
            </span>
          </div>
          <p className="text-sm mb-3 line-clamp-2" style={{ color: "#64748B" }}>
            {event.description}
          </p>
          <div className="mt-auto space-y-1.5">
            <div className="flex items-center gap-2 text-xs" style={{ color: "#94A3B8" }}>
              <span>📅</span>
              <span>{event.date}</span>
              <span className="mx-1">•</span>
              <span>⏰ {event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: "#94A3B8" }}>
              <span>📍</span>
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-3 border-t" style={{ borderColor: "#F1F5F9" }}>
              <span className="text-xs font-medium" style={{ color: "#4F46E5" }}>
                {registered}/{event.capacity} registered
              </span>
              <span className="text-xs" style={{ color: "#94A3B8" }}>
                by {event.organizer.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
