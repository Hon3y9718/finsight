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
                  <OtherForm type="Investment" />
                </TabsContent>
                <TabsContent value="loan">
                  <OtherForm type="Loan" />
                </TabsContent>
                <TabsContent value="subscription">
                  <OtherForm type="Subscription" />
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

function OtherForm({ type }: { type: "Investment" | "Loan" | "Subscription" }) {
    return (
        <div className="space-y-4 py-4 text-center">
            <h3 className="font-semibold">Add {type}</h3>
            <p className="text-sm text-muted-foreground">This feature is coming soon!</p>
        </div>
    )
}
