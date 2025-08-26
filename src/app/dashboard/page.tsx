"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/firebase";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

import { StatCards } from "@/components/dashboard/stat-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";

interface Loan {
  id: string;
  lender: string;
  paymentDate: string;
  amount?: number;
  emiHistory?: { amount: number; paidAt: Date; status: string }[];
  isPaid?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [overdueLoan, setOverdueLoan] = useState<Loan | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("activeUser", currentUser.uid);
          }

          // Fetch user profile
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }

          // Fetch loans & check overdue
          const q = query(
            collection(db, "loans"),
            where("uid", "==", currentUser.uid)
          );
          const unsubLoans = onSnapshot(q, (snapshot) => {
            const loans = snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            })) as Loan[];

            const today = new Date().toISOString().split("T")[0];

            loans.forEach((loan) => {
              if (!loan.isPaid) {
                const dueDate = loan.paymentDate;
                const nextDay = new Date(dueDate);
                nextDay.setDate(nextDay.getDate() + 1);
                const nextDayStr = nextDay.toISOString().split("T")[0];

                if (today === nextDayStr) {
                  setOverdueLoan(loan);
                }
              }
            });
          });

          return () => unsubLoans();
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // ✅ Mark loan as paid + update history safely
  const handleMarkPaid = async () => {
    if (overdueLoan && user) {
      try {
        const loanRef = doc(db, "loans", overdueLoan.id);

        await updateDoc(loanRef, {
          isPaid: true,
          emiHistory: [
            ...(overdueLoan.emiHistory || []),
            {
              amount: overdueLoan.amount || 0,
              paidAt: new Date(),
              status: "paid",
            },
          ],
        });

        setOverdueLoan(null); // close popup
        alert("✅ Loan marked as Paid!");
      } catch (err) {
        console.error("Error updating loan:", err);
      }
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {profile && (
        <div>
          <h1 className="text-2xl font-bold">
            Welcome {profile.firstName} {profile.lastName}
          </h1>
        </div>
      )}

      {/* 🚨 Overdue Loan Popup */}
      {overdueLoan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-[90%] sm:w-96 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Loan Payment Reminder
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Your loan from{" "}
              <span className="font-medium text-red-600">
                {overdueLoan.lender}
              </span>{" "}
              was due <b>yesterday</b>. Please confirm the status below.
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleMarkPaid}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
              >
                ✅ Mark as Paid
              </button>
              <button
                onClick={() => setOverdueLoan(null)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition"
              >
                ❌ Not Paid
              </button>
            </div>
          </div>
        </div>
      )}

      <StatCards />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">{/* <OverviewChart /> */}</div>
        <div className="lg:col-span-2">{/* <AiInsights /> */}</div>
      </div>

      <RecentTransactions />
    </div>
  );
}
