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
  paymentDate: string;
  currentBalance: number;
  initialAmount: number;
  interestRate: number;
  emiHistory?: { amount: number; paidAt: Date; status: string }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [emiMonths, setEmiMonths] = useState(12); // user-selectable EMI term

  // Listen to user auth and loans in real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      setUser(currentUser);

      const loansQ = query(collection(db, "loans"), where("uid", "==", currentUser.uid));

      const unsubLoans = onSnapshot(loansQ, (snapshot) => {
        const updatedLoans = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Loan[];
        setLoans(updatedLoans);
      });

      return () => unsubLoans();
    });

    return () => unsubscribe();
  }, [router]);

  // Compute dueLoan dynamically from loans state
  const dueLoan = loans.find((loan) => {
    const today = new Date();
    const dueDate = new Date(loan.paymentDate);
    return loan.currentBalance > 0 && today >= dueDate;
  });

  const handleEmiAction = async (status: "paid" | "not paid") => {
    if (!user || !dueLoan) return;

    const emiAmount = Math.round(dueLoan.currentBalance / emiMonths);
    const loanRef = doc(db, "loans", dueLoan.id);
    let newPaymentDate = new Date(dueLoan.paymentDate);

    if (status === "paid") {
      newPaymentDate.setMonth(newPaymentDate.getMonth() + 1);
    }

    try {
      // Update Firestore
      await updateDoc(loanRef, {
        currentBalance: status === "paid" ? dueLoan.currentBalance - emiAmount : dueLoan.currentBalance,
        paymentDate: newPaymentDate.toISOString(),
        emiHistory: [
          ...(dueLoan.emiHistory || []),
          { amount: emiAmount, paidAt: new Date(), status },
        ],
      });

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

      // Update local state instantly for real-time UI update
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.id === dueLoan.id
            ? {
                ...loan,
                currentBalance: status === "paid" ? loan.currentBalance - emiAmount : loan.currentBalance,
                paymentDate: newPaymentDate.toISOString(),
                emiHistory: [...(loan.emiHistory || []), { amount: emiAmount, paidAt: new Date(), status }],
              }
            : loan
        )
      );
    } catch (err) {
      console.error("Error updating EMI:", err);
    }
  };

  return (
    <div className="w-screen w-full max-w-[70rem] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Popup for EMI due */}
      {dueLoan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-[90%] sm:w-96 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              EMI Due – {dueLoan.lender}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Your current balance is <b>₹{dueLoan.currentBalance}</b>.
            </p>

            {/* User selects EMI term */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                EMI Term (months)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={emiMonths}
                onChange={(e) => setEmiMonths(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Calculated EMI: <b>₹{Math.round(dueLoan.currentBalance / emiMonths)}</b>
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
