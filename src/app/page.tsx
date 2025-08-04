import { StatCards } from "@/components/dashboard/stat-cards";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AiInsights } from "@/components/dashboard/ai-insights";

export default function Dashboard() {
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
