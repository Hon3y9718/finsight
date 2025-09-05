"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  status: "active" | "paid" | "not paid" | "pending";
  icon?: string;
}

interface LoanHistory {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "not paid" | "pending";
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [history, setHistory] = useState<LoanHistory[]>([]);
  const [open, setOpen] = useState(false);

  const user = auth.currentUser;

  // Manual calculator states
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState<number | null>(null);

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

  // Fetch loan history when loan selected
  useEffect(() => {
    if (!selectedLoan) return;

    const q = query(
      collection(db, "loanHistory"),
      where("loanId", "==", selectedLoan.id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          amount: d.amount,
          status: d.status,
          // Firestore Timestamp → Date string
          date: d.date?.toDate
            ? d.date.toDate().toLocaleDateString()
            : new Date(d.date).toLocaleDateString(),
        } as LoanHistory;
      });
      setHistory(data);
    });

    return () => unsubscribe();
  }, [selectedLoan]);

  // EMI calculation
  const calculateEMI = () => {
    const P = parseFloat(amount);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseInt(tenure);

    if (!P || !r || !n) {
      setEmi(null);
      return;
    }

    const emiValue =
      (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    setEmi(emiValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "paid":
        return "bg-blue-100 text-blue-700";
      case "not paid":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-screen w-full max-auto max-w-[70rem] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Loans Section */}
      <Card>
        <CardHeader>
          <CardTitle>Loans</CardTitle>
          <CardDescription>A summary of your outstanding loans.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loans.map((loan) => (
            <Card
              key={loan.id}
              className="p-4 cursor-pointer hover:shadow-md transition"
              onClick={() => {
                setSelectedLoan(loan);
                setOpen(true);
              }}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-500/10 rounded-full">
                  <span className="text-xl">{loan.icon || "🏦"}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{loan.lender}</p>
                    <p
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        loan.status
                      )}`}
                    >
                      {loan.status}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Next Payment: {loan.paymentDate}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Loan Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          {selectedLoan && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLoan.lender} – Loan Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Loan Info */}
                <div className="flex justify-between">
                  <p className="font-medium">Initial Amount:</p>
                  <p>₹{selectedLoan.initialAmount.toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Current Balance:</p>
                  <p>₹{selectedLoan.currentBalance.toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Interest Rate:</p>
                  <p>{selectedLoan.interestRate}%</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Status:</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedLoan.status
                    )}`}
                  >
                    {selectedLoan.status}
                  </span>
                </div>

                {/* Loan History */}
                <div>
                  <p className="font-semibold mb-2">Payment History</p>
                  {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No history available</p>
                  ) : (
                    <ul className="space-y-2">
                      {history.map((h) => (
                        <li
                          key={h.id}
                          className="flex justify-between p-2 border rounded-lg"
                        >
                          <span>{h.date}</span>
                          <span>₹{h.amount}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                              h.status
                            )}`}
                          >
                            {h.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Manual EMI Calculator Section */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Calculator</CardTitle>
          <CardDescription>
            Enter details to manually calculate EMI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Loan Amount</p>
              <Input
                type="number"
                placeholder="e.g. 100000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Interest Rate (%)</p>
              <Input
                type="number"
                placeholder="e.g. 10"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tenure (Months)</p>
              <Input
                type="number"
                placeholder="e.g. 12"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={calculateEMI}>Calculate EMI</Button>

          {emi !== null && (
            <div className="mt-4 p-4 border rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Your Monthly EMI:</p>
              <p className="text-lg font-semibold">₹{emi.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
