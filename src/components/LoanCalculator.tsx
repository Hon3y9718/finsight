"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormValues {
  currentBalance: string;
  tenure: string;
  interestRate: string;
}

export default function LoanCalculator() {
  const form = useForm<FormValues>({
    defaultValues: {
      currentBalance: "",
      tenure: "",
      interestRate: "",
    },
  });

  const values = form.watch();
  const P = parseFloat(values.currentBalance) || 0;
  const n = parseFloat(values.tenure) || 0;
  const r = parseFloat(values.interestRate) || 0;

  const monthlyInterest = r / 12 / 100;

  let emi = 0;
  if (P > 0 && n > 0) {
    if (monthlyInterest > 0) {
      emi =
        (P * monthlyInterest * Math.pow(1 + monthlyInterest, n)) /
        (Math.pow(1 + monthlyInterest, n) - 1);
    } else {
      emi = P / n;
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle>Loan EMI Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Loan Amount */}
        <div className="space-y-2">
          <Label>Remaining Loan Amount</Label>
          <Input
            type="number"
            placeholder="Enter balance"
            {...form.register("currentBalance")}
          />
        </div>

        {/* Tenure */}
        <div className="space-y-2">
          <Label>Tenure (months)</Label>
          <Input
            type="number"
            placeholder="Enter months"
            {...form.register("tenure")}
          />
        </div>

        {/* Interest */}
        <div className="space-y-2">
          <Label>Interest Rate (%)</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="Enter rate"
            {...form.register("interestRate")}
          />
        </div>

        {/* Results */}
        {P > 0 && n > 0 && (
          <div className="p-4 rounded-lg border bg-muted text-sm space-y-2">
            <p>
              <strong>Remaining Balance:</strong> ${P.toFixed(2)}
            </p>
            <p>
              <strong>Tenure Left:</strong> {n} months
            </p>
            <p>
              <strong>Estimated EMI:</strong> ${emi.toFixed(2)} / month
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
