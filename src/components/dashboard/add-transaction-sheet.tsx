"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

import {
  addInvestment,
  addLoan,
  addSubscription,
  addIncome,
  addExpense,
} from "@/app/actions";

import { auth } from "@/firebase"; // Firebase auth import

// Schemas
const expenseIncomeSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

const investmentSchema = z.object({
  asset: z.string().min(1, "Asset name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});

const loanSchema = z.object({
  lender: z.string().min(1, "Lender name is required"),
  initialAmount: z.coerce.number().positive("Initial amount must be positive"),
  currentBalance: z.coerce.number().positive("Current balance must be positive"),
  interestRate: z.coerce.number().min(0, "Interest rate cannot be negative"),
  paymentDate: z.string().min(1, "Payment date is required"),
});

const subscriptionSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  renewalDate: z.string().min(1, "Renewal date is required"),
  description: z.string().optional(),
});

// Main Sheet Component
export function AddTransactionSheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Add a New Transaction</SheetTitle>
          <SheetDescription>
            Fill in the details of your transaction, income, or other financial
            activity.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="expense" className="py-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="expense">
            <ExpenseIncomeForm type="Expense" />
          </TabsContent>
          <TabsContent value="income">
            <ExpenseIncomeForm type="Income" />
          </TabsContent>
          <TabsContent value="other">
            <Tabs defaultValue="investment" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="investment">Investment</TabsTrigger>
                <TabsTrigger value="loan">Loan</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
              </TabsList>

              <TabsContent value="investment">
                <InvestmentForm />
              </TabsContent>
              <TabsContent value="loan">
                <LoanForm />
              </TabsContent>
              <TabsContent value="subscription">
                <SubscriptionForm />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

// Expense or Income Form
function ExpenseIncomeForm({ type }: { type: "Expense" | "Income" }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const categories =
    type === "Expense"
      ? ["Groceries", "Transport", "Rent", "Entertainment"]
      : ["Salary", "Freelance", "Bonus"];

  const form = useForm<z.infer<typeof expenseIncomeSchema>>({
    resolver: zodResolver(expenseIncomeSchema),
    defaultValues: { amount: 0, date: "", category: "", description: "" },
  });

  const onSubmit = (values: z.infer<typeof expenseIncomeSchema>) => {
    startTransition(async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        toast({ variant: "destructive", title: "User not logged in" });
        return;
      }

      let result;
      if (type === "Expense") {
        result = await addExpense(values, uid);
      } else {
        result = await addIncome(values, uid);
      }

      if (result) {
        toast({ title: `${type} added successfully` });
        form.reset();
      } else {
        toast({ variant: "destructive", title: `Error adding ${type.toLowerCase()}` });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="$0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select a ${type.toLowerCase()} category`} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add {type}
        </Button>
      </form>
    </Form>
  );
}

// Investment Form
function InvestmentForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
    defaultValues: { asset: "", amount: 0, date: "", description: "" },
  });

  const onSubmit = (values: z.infer<typeof investmentSchema>) => {
    startTransition(async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        toast({ variant: "destructive", title: "User not logged in" });
        return;
      }

      const result = await addInvestment(values, uid);
      if (result) {
        toast({ title: "Investment added successfully" });
        form.reset();
      } else {
        toast({ variant: "destructive", title: "Error adding investment" });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="asset"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Apple Inc. (AAPL)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="$0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Investment
        </Button>
      </form>
    </Form>
  );
}

// Loan Form
function LoanForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof loanSchema>>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      lender: "",
      initialAmount: 0,
      currentBalance: 0,
      interestRate: 0,
      paymentDate: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loanSchema>) => {
    startTransition(async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        toast({ variant: "destructive", title: "User not logged in" });
        return;
      }

      const result = await addLoan(values, uid);
      if (result) {
        toast({ title: "Loan added successfully" });
        form.reset();
      } else {
        toast({ variant: "destructive", title: "Error adding loan" });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="lender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lender Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Community Bank" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="initialAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="$25,000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentBalance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Balance</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="$12,500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Payment Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Loan
        </Button>
      </form>
    </Form>
  );
}

// Subscription Form
function SubscriptionForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: { name: "", amount: 0, renewalDate: "", description: "" },
  });

  const onSubmit = (values: z.infer<typeof subscriptionSchema>) => {
    startTransition(async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        toast({ variant: "destructive", title: "User not logged in" });
        return;
      }

      const result = await addSubscription(values, uid);
      if (result) {
        toast({ title: "Subscription added successfully" });
        form.reset();
      } else {
        toast({ variant: "destructive", title: "Error adding subscription" });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Netflix, Spotify" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="$15.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="renewalDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Renewal Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Subscription
        </Button>
      </form>
    </Form>
  );
}
