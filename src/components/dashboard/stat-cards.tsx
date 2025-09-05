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
  query,
  where,
  onSnapshot,
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

    const transRef = query(
      collection(db, "transactions"),
      where("uid", "==", userId)
    );

    const unsubTrans = onSnapshot(transRef, (snapshot) => {
      let incomeTotal = 0;
      let expenseTotal = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === "income") {
          incomeTotal += Number(data.amount) || 0;
        } else if (data.type === "expense") {
          expenseTotal += Number(data.amount) || 0;
        }
      });

      setIncome(incomeTotal);
      setExpenses(expenseTotal);
    });

    const loansRef = query(
      collection(db, "loans"),
      where("uid", "==", userId)
    );

    const unsubLoans = onSnapshot(loansRef, (snapshot) => {
      let loanTotal = 0;
      snapshot.forEach((doc) => {
        loanTotal += Number(doc.data().currentBalance) || 0;
      });
      setLoans(loanTotal);
    });

    return () => {
      unsubTrans();
      unsubLoans();
    };
  }, [userId]);

  const currentBalance = income - expenses + loans;

  const stats = [
    {
      title: "Current Balance",
      amount: currentBalance,
      icon: Wallet,
      gradient: "from-blue-500 via-indigo-500 to-purple-600",
    },
    {
      title: "Total Income",
      amount: income,
      icon: PiggyBank,
      gradient: "from-green-400 via-emerald-500 to-teal-500",
    },
    {
      title: "Total Expenses",
      amount: expenses,
      icon: TrendingDown,
      gradient: "from-red-500 via-pink-500 to-rose-500",
    },
    {
      title: "Loans",
      amount: loans,
      icon: Landmark,
      gradient: "from-yellow-400 via-orange-500 to-amber-500",
    },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-6">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
        >
          <div className="relative z-10 p-5">
            <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-full bg-gradient-to-r ${stat.gradient} text-white shadow-md`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1 truncate">
                ₹{stat.amount.toLocaleString("en-IN")}
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
