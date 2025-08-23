"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/firebase";

interface Loan {
  id: string;
  dueDate: string; // YYYY-MM-DD
  isPaid: boolean;
}

export default function Notification() {
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  useEffect(() => {
    const checkDueLoans = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "loans"),
        where("userId", "==", auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

      snapshot.forEach((doc) => {
        const loan = doc.data() as Loan;

        if (!loan.isPaid) {
          const dueDate = new Date(loan.dueDate);

          // calculate next day
          const nextDay = new Date(dueDate);
          nextDay.setDate(dueDate.getDate() + 1);

          const nextDayStr = nextDay.toISOString().split("T")[0];

          if (todayStr === nextDayStr) {
            setAlertMsg("❌ Your loan payment was due yesterday and is not paid!");
          }
        }
      });
    };

    checkDueLoans();
  }, []);

  return (
    <>
      {/* 👇 yaha tumhari existing notification UI render hogi */}
      <div>
        <h2 className="text-lg font-bold mb-2">Notifications</h2>
        {/* agar tumhari koi aur notifications list hai to yaha map kardo */}
        <p>No new notifications</p>
      </div>

      {/* 👇 Due date overdue popup */}
      {alertMsg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="p-6 rounded-xl shadow-lg w-80 text-center bg-red-100 text-red-700">
            <p className="mb-4 font-medium">{alertMsg}</p>
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded-lg"
              onClick={() => setAlertMsg(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
