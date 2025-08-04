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
import { transactions as mockTransactions, investments, loans, subscriptions } from "@/lib/data";
import type { Investment, Loan, Subscription } from "@/lib/types";
import { Landmark, Repeat, TrendingUp } from "lucide-react";

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
  const totalInvestments = investments.reduce((acc, i) => acc + i.amount, 0);
  const totalLoans = loans.reduce((acc, l) => acc + l.currentBalance, 0);
  const totalSubscriptions = subscriptions.reduce((acc, s) => acc + s.amount, 0);

  const spendingHabitsInput: SummarizeSpendingHabitsInput = {
    expenses: JSON.stringify(expenses),
    income: JSON.stringify({ totalIncome }),
  };

  const financialTipsInput: FinancialDataInput = {
    income: totalIncome,
    expenses: totalExpenses,
    investments: totalInvestments,
    loans: totalLoans,
    subscriptions: totalSubscriptions,
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

// In a real app, these would write to a database
export async function addInvestment(investment: Omit<Investment, 'id' | 'type' | 'icon'>) {
    console.log("Adding investment:", investment);
    investments.push({ ...investment, id: Date.now().toString(), type: 'investment', icon: TrendingUp });
    return { success: true };
}

export async function addLoan(loan: Omit<Loan, 'id' | 'type' | 'icon'>) {
    console.log("Adding loan:", loan);
    loans.push({ ...loan, id: Date.now().toString(), type: 'loan', icon: Landmark });
    return { success: true };
}

export async function addSubscription(subscription: Omit<Subscription, 'id' | 'type' | 'icon'>) {
    console.log("Adding subscription:", subscription);
    subscriptions.push({ ...subscription, id: Date.now().toString(), type: 'subscription', icon: Repeat });
    return { success: true };
}
