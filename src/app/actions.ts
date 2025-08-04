// This is a server-side only file.
// It is safe to use private keys here.
"use server";

import {
  generateFinancialTips,
  type FinancialDataInput,
} from "@/ai/flows/generate-financial-tips";
import {
  summarizeSpendingHabits,
  type SummarizeSpendingHabitsInput,
} from "@/ai/flows/summarize-spending-habits";
import { transactions as mockTransactions } from "@/lib/data";

export async function getFinancialInsights() {
  // In a real app, you would fetch this data from your database (e.g., Firebase)
  const transactions = mockTransactions;

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .map(({ category, amount }) => ({ category, amount }));
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  // Dummy data for other fields for now
  const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);
  const investments = 5000;
  const loans = 15000;
  const subscriptions = 150;

  const spendingHabitsInput: SummarizeSpendingHabitsInput = {
    expenses: JSON.stringify(expenses),
    income: JSON.stringify({ totalIncome }),
  };

  const financialTipsInput: FinancialDataInput = {
    income: totalIncome,
    expenses: totalExpenses,
    investments,
    loans,
    subscriptions,
  };

  try {
    const [summary, tips] = await Promise.all([
      summarizeSpendingHabits(spendingHabitsInput),
      generateFinancialTips(financialTipsInput),
    ]);

    return { summary: summary.summary, tips: tips.tips, error: null };
  } catch (error) {
    console.error("Error getting financial insights:", error);
    return {
      summary: null,
      tips: null,
      error: "Failed to generate insights. Please try again.",
    };
  }
}
