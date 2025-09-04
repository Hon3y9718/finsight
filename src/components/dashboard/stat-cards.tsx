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
      // Transactions
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

      // Loans
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

  // ✅ Balance
  const currentBalance = (income - expenses) + loans;

  const stats = [
    {
      title: "Current Balance",
      amount: currentBalance,
      icon: Wallet,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Total Income",
      amount: income,
      icon: PiggyBank,
      gradient: "from-green-400 to-emerald-500",
    },
    {
      title: "Total Expenses",
      amount: expenses,
      icon: TrendingDown,
      gradient: "from-red-500 to-pink-500",
    },
    {
      title: "Loans",
      amount: loans,
      icon: Landmark,
      gradient: "from-orange-400 to-yellow-500",
    },
  ];

  return (
    <div className="grid gap-24 md:grid-cols-4  lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
        >
          {/* Gradient border glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-20 blur-2xl`}
          ></div>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-300">
              {stat.title}
            </CardTitle>
            <div
              className={`p-2 rounded-full bg-gradient-to-r ${stat.gradient} text-white shadow-md`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-white truncate">
              ₹{stat.amount.toLocaleString("en-US")}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
