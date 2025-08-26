"use server";

import { db } from "@/firebase";
import {
  addDoc,
  doc,
  getDoc,
  arrayUnion,
  updateDoc,
  collection,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

// 🔹 Transactions Helper
async function addTransactionToCollection(
  collectionName: string,
  data: any,
  uid: string,
  type: string,
  icon: string
): Promise<{ success: boolean }> {
  try {
    const txDate = data.date ? new Date(data.date) : new Date();
    const timestamp = Timestamp.fromDate(txDate);

    // ✅ Make sure amount is a number
    const transactionData = {
      ...data,
      amount: Number(data.amount) || 0,
      uid,
      type,
      icon,
      timestamp,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, collectionName), transactionData);

    return { success: true };
  } catch (error) {
    console.error("Error adding to", collectionName, error);
    return { success: false };
  }
}

// 🔹 Income
export async function addIncome(data: any, uid: string) {
  return addTransactionToCollection(
    "income",
    data,
    uid,
    "income",
    "ArrowUpCircle"
  );
}

// 🔹 Expense
export async function addExpense(data: any, uid: string) {
  return addTransactionToCollection(
    "expenses",
    data,
    uid,
    "expense",
    "ArrowDownCircle"
  );
}

// 🔹 Investment
export async function addInvestment(data: any, uid: string) {
  return addTransactionToCollection(
    "investments",
    data,
    uid,
    "investment",
    "TrendingUp"
  );
}

// 🔹 Subscription
export async function addSubscription(data: any, uid: string) {
  return addTransactionToCollection(
    "subscriptions",
    data,
    uid,
    "subscription",
    "Repeat"
  );
}

// 🔹 Loan Add
export async function addLoan(data: any, uid: string): Promise<{ id: string } | null> {
  try {
    const txDate = data.paymentDate ? new Date(data.paymentDate) : new Date();
    const timestamp = Timestamp.fromDate(txDate);

    const initialAmount = Number(data.initialAmount) || 0;

    // 1️⃣ Loans collection
    const loanRef = await addDoc(collection(db, "loans"), {
      lender: data.lender,
      initialAmount,
      currentBalance: initialAmount,
      interestRate: Number(data.interestRate) || 0,
      paymentDate: data.paymentDate,
      uid,
      type: "loan",
      icon: "🏦",
      timestamp,
      createdAt: serverTimestamp(),
      emiHistory: [],
    });

    // 2️⃣ LoanHistory collection
    await addDoc(collection(db, "loanHistory"), {
      loanId: loanRef.id,
      lender: data.lender,
      initialAmount,
      currentBalance: initialAmount,
      interestRate: Number(data.interestRate) || 0,
      paymentDate: data.paymentDate,
      uid,
      type: "loan",
      icon: "🏦",
      timestamp,
      createdAt: serverTimestamp(),
    });

    // 3️⃣ Transactions collection
    await addDoc(collection(db, "transactions"), {
      title: `Loan from ${data.lender}`,
      amount: initialAmount,
      uid,
      type: "loan",
      icon: "🏦",
      timestamp,
      createdAt: serverTimestamp(),
    });

    console.log("Loan Added ✅", loanRef.id);
    return { id: loanRef.id };
  } catch (error) {
    console.error("Error adding loan:", error);
    return null;
  }
}

// 🔹 EMI Pay
export async function payEmi(loanId: string, emiAmount: number, uid: string) {
  const loanRef = doc(db, "loans", loanId);
  const loanSnap = await getDoc(loanRef);
  if (!loanSnap.exists()) return null;

  const loanData = loanSnap.data();
  const newBalance = Number(loanData.currentBalance) - Number(emiAmount);

  // 1️⃣ Update loan document
  await updateDoc(loanRef, {
    currentBalance: newBalance,
    emiHistory: arrayUnion({
      amount: Number(emiAmount),
      paidAt: serverTimestamp(),
      status: "paid",
    }),
  });

  // 2️⃣ Add EMI to loanHistory
  const emiRef = await addDoc(collection(db, "loanHistory"), {
    loanId,
    amount: Number(emiAmount),
    uid,
    type: "emi",
    icon: "💸",
    paidAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    status: "paid",
  });

  // 3️⃣ Add transaction
  await addDoc(collection(db, "transactions"), {
    title: `EMI Payment - ${loanData.lender}`,
    amount: Number(emiAmount),
    uid,
    type: "expense",
    icon: "ArrowDownCircle",
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  console.log("EMI Paid ✅");

  return {
    id: emiRef.id,
    loanId,
    amount: Number(emiAmount),
    status: "paid",
    paidAt: new Date(),
    lender: loanData.lender,
  };
}