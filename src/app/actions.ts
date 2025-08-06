"use server";

import { db, auth } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

// Types (define if not already)
export type Income = {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: "income";
  icon: string;
};

export type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: "expense";
  icon: string;
};

export type Investment = {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: "investment";
  icon: string;
};

// ✅ Add Income
export async function addIncome(data: Omit<Income, "id" | "type" | "icon">) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await addDoc(collection(db, "income"), {
    ...data,
    uid: user.uid,
    type: "income",
    icon: "ArrowUpCircle",
    timestamp: serverTimestamp(),
  });

  return { success: true };
}
export async function getFinancialInsights() {
  return {
    insights: [
      "You spent more on food this month. Consider cutting down takeouts.",
      "Great job! Your investment portfolio is up by 5%.",
      "Try to save at least 20% of your income each month.",
    ],
  };
}

// ✅ Add Expense
export async function addExpense(data: Omit<Expense, "id" | "type" | "icon">) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await addDoc(collection(db, "expenses"), {
    ...data,
    uid: user.uid,
    type: "expense",
    icon: "ArrowDownCircle",
    timestamp: serverTimestamp(),
  });

  return { success: true };
}

// ✅ Add Investment
export async function addInvestment(data: Omit<Investment, "id" | "type" | "icon">) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await addDoc(collection(db, "investments"), {
    ...data,
    uid: user.uid,
    type: "investment",
    icon: "TrendingUp",
    timestamp: serverTimestamp(),
  });

  return { success: true };
}

// ✅ Add Loan
export async function addLoan(data: any) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await addDoc(collection(db, "loans"), {
    ...data,
    uid: user.uid,
    type: "loan",
    icon: "Banknote",
    timestamp: serverTimestamp(),
  });

  return { success: true };
}

// ✅ Add Subscription
export async function addSubscription(data: any) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await addDoc(collection(db, "subscriptions"), {
    ...data,
    uid: user.uid,
    type: "subscription",
    icon: "Repeat",
    timestamp: serverTimestamp(),
  });

  return { success: true };
}
