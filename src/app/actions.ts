"use server";

import { db } from "@/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

async function addTransactionToCollection(
  collectionName: string,
  data: any,
  uid: string,
  type: string,
  icon: string
): Promise<{ success: boolean }> {
  try {
    console.log("Transaction Adding");

    // Convert user-selected date string to Firestore Timestamp
    const txDate = data.date ? new Date(data.date) : new Date();
    const timestamp = Timestamp.fromDate(txDate);

    await addDoc(collection(db, "transactions"), {
      ...data,
      uid,
      type,
      icon,
      timestamp, // <-- use the selected date instead of serverTimestamp
    });

    console.log("Transaction Added");
    return { success: true };
  } catch (error) {
    console.error("Error adding to", collectionName, error);
    return { success: false };
  }
}

export async function addIncome(data: any, uid: string) {
  return addTransactionToCollection("income", data, uid, "income", "ArrowUpCircle");
}

export async function addExpense(data: any, uid: string) {
  return addTransactionToCollection("expenses", data, uid, "expense", "ArrowDownCircle");
}

export async function addInvestment(data: any, uid: string) {
  return addTransactionToCollection("investments", data, uid, "investment", "TrendingUp");
}

export async function addLoan(data: any, uid: string) {
  return addTransactionToCollection("loans", data, uid, "loan", "Banknote");
}

export async function addSubscription(data: any, uid: string) {
  return addTransactionToCollection("subscriptions", data, uid, "subscription", "Repeat");
}
// Dummy insights function (no change)
export async function getFinancialInsights() {
  return {
    insights: [
      "You spent more on food this month. Consider cutting down takeouts.",
      "Great job! Your investment portfolio is up by 5%.",
      "Try to save at least 20% of your income each month.",
    ],
  };
}
