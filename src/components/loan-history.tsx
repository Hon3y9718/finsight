"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import {
    collection,
    onSnapshot,
    query,
    where,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    getDocs,
    DocumentData,
} from "firebase/firestore";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
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
import { Button } from "@/components/ui/button";

interface Loan {
    id: string;
    lender: string;
    amount: number;
    tenure: number;
    paymentDate: string;
    status: "Paid" | "Not Paid" | "Pending";
    active?: boolean;
    currentBalance: number;
    emiHistory: {
        amount: number;
        paidAt?: any;
    }[];
}

export default function LoanHistory() {
    const [loans, setLoans] = useState<Loan[]>([]);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(collection(db, "loans"), where("uid", "==", user.uid));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const loanData: Loan[] = await Promise.all(
                snapshot.docs.map(async (docSnap) => {
                    const data = docSnap.data() as DocumentData;

                    // EMI history nikalna
                    const emiSnap = await getDocs(
                        collection(db, `loans/${docSnap.id}/emiPayments`)
                    );
                    const emiHistory = emiSnap.docs.map((d) => d.data());

                    const currentBalance = data.currentBalance ?? data.amount;
                    const active = currentBalance > 0;

                    return {
                        id: docSnap.id,
                        lender: data.lender,
                        amount: data.amount,
                        tenure: data.tenure,
                        paymentDate: data.paymentDate,
                        status: data.status,
                        currentBalance,
                        active,
                        emiHistory,
                    } as Loan;
                })
            );

            setLoans(loanData);
        });

        return () => unsubscribe();
    }, []);

    // EMI pay karne ka function
    const handlePayEMI = async (loan: Loan, emiAmount: number) => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            // EMI add in subcollection
            await addDoc(collection(db, `loans/${loan.id}/emiPayments`), {
                userId: user.uid,
                amount: emiAmount,
                paidAt: serverTimestamp(),
                status: "Paid",
            });

            // Loan ka balance update
            const newBalance = loan.currentBalance - emiAmount;

            await updateDoc(doc(db, "loans", loan.id), {
                currentBalance: newBalance,
                status: newBalance <= 0 ? "Paid" : "Pending",
            });

            alert("✅ EMI payment saved successfully!");
        } catch (error) {
            console.error("Error saving EMI:", error);
            alert("❌ Failed to save EMI");
        }
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>📑 Loan History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Lender</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Balance</TableHead>
                            <TableHead>Tenure</TableHead>
                            <TableHead>Payment Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loans.map((loan) => {
                            const emiAmount = loan.amount / loan.tenure;

                            return (
                                <>
                                    <TableRow key={loan.id}>
                                        <TableCell>{loan.lender}</TableCell>
                                        <TableCell>₹{loan.amount}</TableCell>
                                        <TableCell>₹{loan.currentBalance}</TableCell>
                                        <TableCell>{loan.tenure} months</TableCell>
                                        <TableCell>{loan.paymentDate}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    loan.status === "Paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : loan.status === "Pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : loan.status === "Not Paid"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-gray-200 text-gray-700"
                                                }
                                            >
                                                {loan.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {loan.active && (
                                                <Button
                                                    onClick={() =>
                                                        handlePayEMI(loan, emiAmount)
                                                    }
                                                >
                                                    Pay EMI ₹{emiAmount.toFixed(2)}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>

                                    {/* EMI History Row */}
                                    {loan.emiHistory?.length > 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <div className="p-2 bg-gray-100 rounded">
                                                    <p className="font-semibold">
                                                        EMI Payments:
                                                    </p>
                                                    <ul className="list-disc pl-5">
                                                        {loan.emiHistory.map(
                                                            (emi, i) => (
                                                                <li key={i}>
                                                                    Paid ₹{emi.amount} on{" "}
                                                                    {emi.paidAt?.toDate
                                                                        ? emi.paidAt.toDate().toLocaleDateString()
                                                                        : "—"}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
