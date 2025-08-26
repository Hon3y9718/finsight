"use client";

import { useEffect, useState } from "react";
import { fetchUserTransactions } from "@/lib/fetchUserTransactions";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  Banknote,
  Repeat,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const iconMap: Record<string, any> = {
  income: ArrowUpCircle,
  expense: ArrowDownCircle,
  investment: TrendingUp,
  loan: Banknote,
  subscription: Repeat,
};

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchUserTransactions().then(setTransactions);
  }, []);

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Your Transactions</CardTitle>
        <CardDescription>
          Your latest income and expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground">No transactions found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => {
                const IconComp = iconMap[t.type] || ArrowDownCircle;
                const dateObj = t.createdAt?.seconds
                  ? new Date(t.createdAt.seconds * 1000)
                  : new Date();

                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarFallback
                            className={
                              t.type === "income"
                                ? "bg-accent/20"
                                : "bg-primary/10"
                            }
                          >
                            {IconComp && (
                              <IconComp
                                className={`h-5 w-5 ${t.type === "income"
                                    ? "text-accent-foreground"
                                    : "text-primary"
                                  }`}
                              />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                          <p className="font-medium">{t.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.description || ""}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={t.type === "income" ? "default" : "outline"}
                      >
                        {t.type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${t.type === "income"
                          ? "text-green-500"
                          : t.type === "expense" || t.type === "emi"
                            ? "text-red-500"
                            : "text-yellow-500" // loan/investment/subscription
                        }`}
                    >
                      {t.type === "income" ? "+" : ""}₹{Number(t.amount).toFixed(2)}
                    </TableCell>

                    <TableCell>
                      {dateObj.toLocaleDateString()}{" "}
                      {dateObj.toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
