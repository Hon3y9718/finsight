"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

interface Loan {
  id: string;
  lender: string;
  paymentDate: string;
  initialAmount: number;
  currentBalance: number;
  interestRate: number;
  icon?: string;
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "loans"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Loan[];
      setLoans(data);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loans</CardTitle>
          <CardDescription>A summary of your outstanding loans.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loans.map((loan) => (
            <Card key={loan.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-500/10 rounded-full">
                  <span className="text-xl">{loan.icon || "🏦"}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{loan.lender}</p>
                    <p className="text-sm text-muted-foreground">
                      Next Payment: {loan.paymentDate}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Initial Amount</p>
                      <p className="font-medium">
                        ${loan.initialAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Balance</p>
                      <p className="font-medium">
                        ${loan.currentBalance.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Interest Rate</p>
                      <p className="font-medium">{loan.interestRate}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
