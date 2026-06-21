"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    document.cookie = "token=; Path=/; Max-Age=0";
    setUser(null);
    router.push("/login");
  };

  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold" style={{ color: "#4F46E5" }}>
            EventHub
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/events"
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: "#0F172A" }}
            >
              Events
            </Link>
            {loading ? (
              <div className="w-8 h-8 rounded-full skeleton" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: "#0F172A" }}
                >
                  Dashboard
                </Link>
                {user.role === "ORGANIZER" && (
                  <Link href="/events/create" className="gradient-btn text-sm">
                    Create Event
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium px-4 py-2 rounded-xl border transition-all hover:bg-red-50"
                  style={{ borderColor: "#EF4444", color: "#EF4444" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="gradient-btn text-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
