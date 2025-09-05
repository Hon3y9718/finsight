"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  addDoc,
} from "firebase/firestore";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  Banknote,
  Repeat,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const iconMap: Record<string, any> = {
  income: ArrowUpCircle,
  expense: ArrowDownCircle,
  investment: TrendingUp,
  loan: Banknote,
  subscription: Repeat,
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch transactions from Firestore
  const fetchTransactions = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      let q;
      if (fromDate && toDate) {
        const fromTimestamp = Timestamp.fromDate(new Date(fromDate));
        const toTimestamp = Timestamp.fromDate(
          new Date(new Date(toDate).setHours(23, 59, 59, 999))
        );

        q = query(
          collection(db, "transactions"),
          where("uid", "==", uid),
          where("timestamp", ">=", fromTimestamp),
          where("timestamp", "<=", toTimestamp),
          orderBy("timestamp", "desc")
        );
      } else {
        q = query(
          collection(db, "transactions"),
          where("uid", "==", uid),
          orderBy("timestamp", "desc")
        );
      }

      const snapshot = await getDocs(q);
      const all = snapshot.docs.map((doc) => {
        const data = doc.data();
        const date =
          data.timestamp instanceof Timestamp
            ? data.timestamp.toDate()
            : new Date(data.timestamp); // fallback

        return {
          id: doc.id,
          type: data.type,
          category: data.category || "",
          amount: data.amount,
          date,
          description: data.description || "",
          icon: data.icon || data.type,
        };
      });

      setTransactions(all);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  // Add a new transaction (ensure correct timestamp)
  const addTransaction = async (data: any) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      // Convert user-selected date string to Firestore Timestamp
      const selectedDate = data.date ? new Date(data.date) : new Date();
      const txTimestamp = Timestamp.fromDate(selectedDate);

      await addDoc(collection(db, "transactions"), {
        ...data,
        uid,
        timestamp: txTimestamp,
      });

      fetchTransactions(); // refresh after adding
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fromDate, toDate]);

  return (
    <Card className="w-screen p-4 sm:p-6 lg:p- space-y-6 max-w-[70rem]">
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
        <CardDescription>
          A complete list of all your transactions.
        </CardDescription>
      </CardHeader>

      {/* Date Range Filter */}
      <div className="flex gap-4 mb-4 px-4">
        <div>
          <label className="block text-sm font-medium">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
      </div>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              
              <TableHead >Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => {
              const IconComp = iconMap[t.icon] || iconMap[t.type];
              return (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarFallback
                          className={
                            t.type === "income"
                              ? "bg-accent/20"
                              : "bg-primary/10"
                          }
                        >
                          {IconComp && (
                            <IconComp
                              className={`h-5 w-5 ${
                                t.type === "income"
                                  ? "text-accent-foreground"
                                  : "text-primary"
                              }`}
                            />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <p className="font-medium">{t.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={t.type === "income" ? "default" : "outline"}
                    >
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      t.type === "income" ? "text-green-500" : "text-yellow-500"
                    }`}
                  >
                    {t.type === "income" ? "+" : ""}$
                    {Number(t.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {t.date.toLocaleDateString()}{" "}
                    {t.date.toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
