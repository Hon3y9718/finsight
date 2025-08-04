import type { Transaction, Investment, Loan, Subscription } from "@/lib/types";
import {
  Banknote,
  Car,
  Home,
  PiggyBank,
  ReceiptText,
  Repeat,
  TrendingUp,
  Wallet,
  Landmark,
} from "lucide-react";

export const transactions: Transaction[] = [
  {
    id: "1",
    date: "2024-07-15",
    amount: 75.5,
    category: "Groceries",
    type: "expense",
    description: "Weekly grocery shopping at Walmart",
    icon: Wallet,
  },
  {
    id: "2",
    date: "2024-07-15",
    amount: 3000,
    category: "Salary",
    type: "income",
    description: "Monthly salary",
    icon: Banknote,
  },
  {
    id: "3",
    date: "2024-07-14",
    amount: 45.0,
    category: "Transport",
    type: "expense",
    description: "Uber ride to the airport",
    icon: Car,
  },
  {
    id: "4",
    date: "2024-07-13",
    amount: 1200,
    category: "Rent",
    type: "expense",
    description: "Monthly rent payment",
    icon: Home,
  },
  {
    id: "7",
    date: "2024-07-10",
    amount: 250,
    category: "Freelance",
    type: "income",
    description: "Payment for freelance work",
    icon: PiggyBank,
  },
];

export const investments: Investment[] = [
    {
        id: "1",
        date: "2024-07-11",
        amount: 500,
        asset: "Stocks",
        type: "investment",
        description: "Stocks investment",
        icon: TrendingUp,
    }
];

export const loans: Loan[] = [
    {
      id: "1",
      lender: "Community Bank",
      initialAmount: 25000,
      currentBalance: 12500,
      interestRate: 5.5,
      paymentDate: "2024-08-01",
      type: "loan",
      icon: Landmark
    },
];

export const subscriptions: Subscription[] = [
    {
        id: "1",
        name: "Netflix",
        amount: 15.0,
        renewalDate: "2024-07-28",
        type: "subscription",
        description: "Monthly subscription",
        icon: Repeat,
    }
]
