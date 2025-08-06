"use client";

import { useEffect, useState } from "react";
import { fetchUserTransactions } from "@/lib/fetchUserTransactions";

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchUserTransactions().then(setTransactions);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="p-3 bg-gray-100 rounded-md shadow-sm border"
            >
              <div className="font-bold">{tx.title}</div>
              <div>Amount: ₹{tx.amount}</div>
              <div className="text-sm text-gray-600">
                {new Date(tx.createdAt?.seconds * 1000).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
