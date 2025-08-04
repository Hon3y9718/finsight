import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Landmark,
  PiggyBank,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { transactions, investments, loans } from "@/lib/data";

export function StatCards() {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalInvestments = investments.reduce((acc, i) => acc + i.amount, 0);
  const totalLoans = loans.reduce((acc, l) => acc + l.currentBalance, 0);

  const stats = [
    {
      title: "Total Income",
      amount: totalIncome,
      icon: PiggyBank,
      color: "text-green-500",
    },
    {
      title: "Total Expenses",
      amount: totalExpenses,
      icon: TrendingDown,
      color: "text-red-500",
    },
    {
      title: "Investments",
      amount: totalInvestments,
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      title: "Loans",
      amount: totalLoans,
      icon: Landmark,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stat.amount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
