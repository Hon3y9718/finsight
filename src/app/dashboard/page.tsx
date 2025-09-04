"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/firebase";
import {
  doc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { StatCards } from "@/components/dashboard/stat-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";

interface Loan {
  id: string;
  lender: string;
  paymentDate: string; // 👈 next due date
  currentBalance: number;
  initialAmount: number;
  interestRate: number;
  emiHistory?: { amount: number; paidAt: Date; status: string }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dueLoan, setDueLoan] = useState<Loan | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      setUser(currentUser);

      // listen to user loans
      const loansQ = query(collection(db, "loans"), where("uid", "==", currentUser.uid));
      const unsubLoans = onSnapshot(loansQ, (snapshot) => {
        const loans = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Loan[];
        const today = new Date();

        loans.forEach((loan) => {
          const dueDate = new Date(loan.paymentDate);
          // 👇 popup trigger only when today >= next due date
          if (loan.currentBalance > 0 && today >= dueDate) {
            setDueLoan(loan);
          }
        });
      });

      return () => unsubLoans();
    });

    return () => unsubscribe();
  }, [router]);

  const handleEmiAction = async (status: "paid" | "not paid") => {
    if (!user || !dueLoan) return;

    const emiAmount = Math.round(dueLoan.initialAmount / 12); // example EMI calc
    const loanRef = doc(db, "loans", dueLoan.id);

    try {
      let newBalance = dueLoan.currentBalance;
      let newPaymentDate = new Date(dueLoan.paymentDate);

      if (status === "paid") {
        newBalance = dueLoan.currentBalance - emiAmount;

        // 👇 shift next due date by 1 month
        newPaymentDate.setMonth(newPaymentDate.getMonth() + 1);
      }

      // update loan
      await updateDoc(loanRef, {
        currentBalance: newBalance,
        paymentDate: newPaymentDate.toISOString(), // 👈 update next due date
        emiHistory: [
          ...(dueLoan.emiHistory || []),
          {
            amount: emiAmount,
            paidAt: new Date(),
            status,
          },
        ],
      });

      // record in loanHistory
      await addDoc(collection(db, "loanHistory"), {
        loanId: dueLoan.id,
        amount: emiAmount,
        uid: user.uid,
        type: "emi",
        icon: "💸",
        status,
        paidAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      setDueLoan(null); // close popup
    } catch (err) {
      console.error("Error updating EMI:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Popup for EMI due */}
      {dueLoan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-[90%] sm:w-96 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              EMI Due – {dueLoan.lender}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Your EMI of <b>₹{Math.round(dueLoan.initialAmount / 12)}</b> is due today. Please update status.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleEmiAction("not paid")}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              >
                ❌ Not Paid
              </button>
              <button
                onClick={() => handleEmiAction("paid")}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
              >
                ✅ Mark as Paid
              </button>
            </div>
          </div>
        </div>
      )}

      <StatCards />
      <RecentTransactions />
    </div>
  );
}
