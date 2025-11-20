import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { Geist, Geist_Mono } from "next/font/google";
import { useMemo, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navigation = [
  { label: "Dashboard", href: "/", feature: "Dashboard" },
  { label: "Client", href: "/clients", feature: "Schedule" },
  { label: "Bookings", href: "/availability", feature: "Schedule" },
  { label: "Credit", href: "/credits", feature: "Schedule" },
  { label: "Reports", href: "/reports", feature: "Reports" },
  { label: "Document Manager", href: "/settings", feature: "Schedule" },
  { label: "Staff", href: "/notifications", feature: "Notifications" },
  { label: "Leave Manager", href: "/settings", feature: "Schedule" },
  { label: "Settings", href: "/settings", feature: "Schedule" },
  { label: "Users", href: "/users", feature: "Users" },
  { label: "Roles", href: "/roles", feature: "Users" },
];

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, hasPermission } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const activeItem = useMemo(
    () => navigation.find((item) => item.href === router.pathname) ?? navigation[0],
    [router.pathname],
  );

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn && router.pathname !== "/login") {
      router.push("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  if (!mounted || (!isLoggedIn && router.pathname !== "/login")) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen bg-slate-950`}>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-900 text-white p-2 rounded-md cursor-pointer"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-white/10 bg-slate-950 px-6 py-8 text-slate-100 transition-transform duration-300`}>
        <div className="mb-12 text-2xl font-semibold tracking-tight cursor-default">Control Center</div>
        <nav className="flex flex-1 flex-col gap-1">
          {navigation.filter(item => hasPermission(item.feature, 'viewOwn') || hasPermission(item.feature, 'viewGlobal')).map((item) => {
            const isActive = item.href === router.pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-950 shadow"
                    : "text-slate-300 hover:bg-white/10"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-4 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 cursor-pointer text-left"
        >
          Logout
        </button>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 bg-slate-100 md:ml-0">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8 pl-16 md:pl-8">
          <span className="text-lg font-semibold text-slate-900">{activeItem?.label || 'Dashboard'}</span>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Welcome back {user?.firstName}</span>
            <button className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700 cursor-pointer">
              Quick Action
            </button>
          </div>
        </div>
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  if (router.pathname === "/login") {
    return <Component {...pageProps} />;
  }
  
  return (
    <DashboardLayout>
      <Component {...pageProps} />
    </DashboardLayout>
  );
}
