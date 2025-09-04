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

// 🔹 General helper to add transactions only to "transactions" collection
async function addTransaction(data: any, uid: string, type: string, icon: string) {
  try {
    const txDate = data.date ? new Date(data.date) : new Date();
    const timestamp = Timestamp.fromDate(txDate);

    const transactionData = {
      ...data,
      amount: Number(data.amount) || 0,
      uid,
      type,
      icon,
      timestamp,
      createdAt: serverTimestamp(),
    };

    // write only to general transactions collection
    await addDoc(collection(db, "transactions"), transactionData);

    return { success: true };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { success: false };
  }
}

// 🔹 Income
export async function addIncome(data: any, uid: string) {
  return addTransaction(data, uid, "income", "ArrowUpCircle");
}

// 🔹 Expense
export async function addExpense(data: any, uid: string) {
  return addTransaction(data, uid, "expense", "ArrowDownCircle");
}

// 🔹 Investment
export async function addInvestment(data: any, uid: string) {
  return addTransaction(data, uid, "investment", "TrendingUp");
}

// 🔹 Subscription
export async function addSubscription(data: any, uid: string) {
  return addTransaction(data, uid, "subscription", "Repeat");
}

// 🔹 Add Loan (also adds to transactions)
export async function addLoan(data: any, uid: string) {
  try {
    const txDate = data.paymentDate ? new Date(data.paymentDate) : new Date();
    const initialAmount = Number(data.initialAmount) || 0;

    const loanRef = await addDoc(collection(db, "loans"), {
      lender: data.lender,
      initialAmount,
      currentBalance: initialAmount,
      interestRate: Number(data.interestRate) || 0,
      paymentDate: data.paymentDate,
      nextDueDate: data.paymentDate,
      uid,
      type: "loan",
      icon: "🏦",
      timestamp: Timestamp.fromDate(txDate),
      createdAt: serverTimestamp(),
      emiHistory: [],
    });

    // Initial loan history
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
      timestamp: Timestamp.fromDate(txDate),
      createdAt: serverTimestamp(),
      status: "pending",
      nextDueDate: data.paymentDate,
    });

    // 🔹 Add loan itself as transaction
    await addTransaction(
      { amount: initialAmount, title: `Loan Added - ${data.lender}` },
      uid,
      "loan",
      "🏦"
    );

    return { id: loanRef.id, lender: data.lender, currentBalance: initialAmount };
  } catch (error) {
    console.error("Error adding loan:", error);
    return null;
  }
}

// 🔹 Pay EMI (without reducing currentBalance)
export async function payEmi(
  loanId: string,
  uid: string,
  status: "paid" | "not paid" = "paid",
  emiAmount?: number
) {
  const loanRef = doc(db, "loans", loanId);
  const loanSnap = await getDoc(loanRef);
  if (!loanSnap.exists()) return null;

  const loanData = loanSnap.data();

  // 🔹 Auto calculate EMI if not provided
  const emi = emiAmount ?? Math.ceil(Number(loanData.initialAmount) / 12);

  const currentDue = loanData.nextDueDate
    ? loanData.nextDueDate.toDate()
    : loanData.paymentDate
    ? new Date(loanData.paymentDate)
    : new Date();

  const nextDue = new Date(currentDue);
  nextDue.setMonth(currentDue.getMonth() + 1);

  // update only emiHistory and nextDueDate
  await updateDoc(loanRef, {
    emiHistory: arrayUnion({
      amount: emi,
      paidAt: serverTimestamp(),
      status,
    }),
    nextDueDate: Timestamp.fromDate(nextDue),
  });

  const emiRef = await addDoc(collection(db, "loanHistory"), {
    loanId,
    amount: emi,
    uid,
    type: "emi",
    icon: "💸",
    status,
    paidAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    nextDueDate: Timestamp.fromDate(nextDue),
  });

  // 🔹 Add to transactions if paid
  if (status === "paid") {
    await addTransaction(
      { amount: emi, title: `EMI Payment - ${loanData.lender}` },
      uid,
      "expense",
      "ArrowDownCircle"
    );
  }

  return {
    id: emiRef.id,
    loanId,
    amount: emi,
    status,
    paidAt: new Date(),
    lender: loanData.lender,
    nextDueDate: nextDue,
  };
}
