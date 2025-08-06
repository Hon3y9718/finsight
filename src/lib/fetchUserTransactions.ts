import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/firebase";

export async function fetchUserTransactions() {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "transactions"),
    where("uid", "==", user.uid)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
