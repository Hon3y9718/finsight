"use client";

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
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export function StatCards() {
  const [userId, setUserId] = useState<string | null>(null);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [loans, setLoans] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      // Transactions (Income + Expenses)
      const transRef = query(
        collection(db, "transactions"),
        where("uid", "==", userId)
      );
      const transSnap = await getDocs(transRef);
      let incomeTotal = 0;
      let expenseTotal = 0;

      transSnap.forEach((doc) => {
        const data = doc.data();
        if (data.type === "income") {
          incomeTotal += Number(data.amount) || 0;
        } else if (data.type === "expense") {
          expenseTotal += Number(data.amount) || 0;
        }
      });

      setIncome(incomeTotal);
      setExpenses(expenseTotal);

      // Loans (Current Balance only)
      const loansRef = query(
        collection(db, "loans"),
        where("uid", "==", userId)
      );
      const loansSnap = await getDocs(loansRef);
      let loanTotal = 0;
      loansSnap.forEach((doc) => {
        loanTotal += Number(doc.data().currentBalance) || 0;
      });
      setLoans(loanTotal);
    };

    fetchData();
  }, [userId]);

  // ✅ Correct Current Balance Logic
  const currentBalance = (income - expenses) + loans;

  const stats = [
    {
      title: "Current Balance",
      amount: currentBalance,
      icon: Wallet,
      color: "text-blue-500",
    },
    {
      title: "Total Income",
      amount: income,
      icon: PiggyBank,
      color: "text-green-500",
    },
    {
      title: "Total Expenses",
      amount: expenses,
      icon: TrendingDown,
      color: "text-red-500",
    },
    {
      title: "Loans",
      amount: loans,
      icon: Landmark,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="hover:shadow-lg transition-shadow duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              ₹{stat.amount.toLocaleString("en-US")}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
