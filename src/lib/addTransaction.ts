import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

export const addTransaction = async (transaction: {
  title: string;
  amount: number;
  type: "income" | "expense";
}) => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("No user is logged in");
    return;
  }

  const dataWithUser = {
    ...transaction,
    userId: user.uid,
    createdAt: new Date(),
  };

  await addDoc(collection(db, "transactions"), dataWithUser);
};
