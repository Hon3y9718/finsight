"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase";

import { StatCards } from "@/components/dashboard/stat-cards";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AiInsights } from "@/components/dashboard/ai-insights";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Listen to auth changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("activeUser", currentUser.uid);
        }
      }
      setLoading(false);
    });

    // ✅ Clean up on unmount
    return () => unsubscribe();
  }, [router]);

  if (loading || !user) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ✅ Dashboard Cards */}
      <StatCards />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <OverviewChart />
        </div>
        <div className="lg:col-span-2">
          <AiInsights />
        </div>
      </div>

      {/* ✅ Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}
