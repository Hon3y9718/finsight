export type Transaction = {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type Investment = {
  id: string;
  date: string;
  amount: number;
  asset: string;
  type: "investment";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type Loan = {
  id: string;
  lender: string;
  initialAmount: number;
  currentBalance: number;
  interestRate: number;
  paymentDate: string;
  type: "loan";
  icon: React.ComponentType<{ className?: string }>;
};

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  renewalDate: string;
  type: "subscription";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type FinancialData = Transaction | Investment | Loan | Subscription;
