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
        <div className="py-4">
          <Tabs defaultValue="expense">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="expense">Expense</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            <TabsContent value="expense">
              <TransactionForm type="Expense" />
            </TabsContent>
            <TabsContent value="income">
              <TransactionForm type="Income" />
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
        </div>
      </SheetContent>
    </Sheet>
  );
}

function TransactionForm({ type }: { type: "Income" | "Expense" }) {
  const categories =
    type === "Expense"
      ? ["Groceries", "Transport", "Rent", "Entertainment"]
      : ["Salary", "Freelance", "Bonus"];
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" placeholder="$0.00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select>
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="A brief description..." />
      </div>
      <Button className="w-full">Add {type}</Button>
    </div>
  );
}

function InvestmentForm() {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="asset-name">Asset Name</Label>
        <Input id="asset-name" placeholder="e.g., Apple Inc. (AAPL)" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="investment-amount">Amount</Label>
          <Input id="investment-amount" type="number" placeholder="$0.00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="investment-date">Date</Label>
          <Input id="investment-date" type="date" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="investment-description">Description</Label>
        <Textarea id="investment-description" placeholder="A brief description..." />
      </div>
      <Button className="w-full">Add Investment</Button>
    </div>
  );
}

function LoanForm() {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="lender-name">Lender Name</Label>
        <Input id="lender-name" placeholder="e.g., Community Bank" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="initial-amount">Initial Amount</Label>
          <Input id="initial-amount" type="number" placeholder="$25,000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current-balance">Current Balance</Label>
          <Input id="current-balance" type="number" placeholder="$12,500" />
        </div>
      </div>
       <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="interest-rate">Interest Rate (%)</Label>
          <Input id="interest-rate" type="number" placeholder="5.5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payment-date">Next Payment Date</Label>
          <Input id="payment-date" type="date" />
        </div>
      </div>
      <Button className="w-full">Add Loan</Button>
    </div>
  );
}

function SubscriptionForm() {
    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input id="service-name" placeholder="e.g., Netflix, Spotify" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="subscription-amount">Amount</Label>
                    <Input id="subscription-amount" type="number" placeholder="$15.00" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="renewal-date">Renewal Date</Label>
                    <Input id="renewal-date" type="date" />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="subscription-description">Description</Label>
                <Textarea id="subscription-description" placeholder="A brief description..." />
            </div>
            <Button className="w-full">Add Subscription</Button>
        </div>
    );
}