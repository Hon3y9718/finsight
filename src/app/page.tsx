"use client"

import { StatCards } from "@/components/dashboard/stat-cards";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AiInsights } from "@/components/dashboard/ai-insights";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();

  // This is a placeholder for actual authentication logic
  // in a real app, this would be handled by a context or a hook
  const isAuthenticated = true; 

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);


  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <StatCards />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <OverviewChart />
        </div>
        <div className="lg:col-span-2">
          <AiInsights />
        </div>
      </div>
      <RecentTransactions />
    </div>
  );
}
