"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { seedData } from "@/utils/storage";
import { getSession } from "@/utils/auth";
import Navbar from "@/components/Navbar";
import PublicNavbar from "@/components/PublicNavbar";

const PUBLIC_ROUTES = ["/", "/login", "/register"];

function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.includes(pathname);
}

export function AppShell({ children }) {
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    seedData();
    const currentSession = getSession();
    setSession(currentSession);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      const currentSession = getSession();
      setSession(currentSession);
    }
  }, [pathname, hydrated]);

  const showPublicNavbar = isPublicRoute(pathname);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {hydrated && (
        <>
          {showPublicNavbar ? (
            <PublicNavbar />
          ) : (
            session && <Navbar session={session} />
          )}
        </>
      )}
      <main>{children}</main>
    </div>
  );
}

export default AppShell;