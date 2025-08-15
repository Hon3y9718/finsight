"use client";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // ✅ Check auth state on first load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser && pathname !== "/login" && pathname !== "/register") {
        router.replace("/login");
      }
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [pathname, router]);

  // 🚫 Prevent flash before auth is checked
  if (loading) {
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg font-medium">Loading...</p>
          </div>
        </body>
      </html>
    );
  }

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster />
          {isAuthPage ? (
            // 🔹 Login/Register layout (No sidebar, No header)
            <main className="min-h-screen">{children}</main>
          ) : (
            // 🔹 Authenticated pages layout (With sidebar + header)
            <SidebarProvider>
              <div className="flex min-h-screen">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <Header />
                  <main className="flex-1 p-4">{children}</main>
                </div>
              </div>
            </SidebarProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
