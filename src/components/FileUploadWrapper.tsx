"use client";

import React from "react";
import FileUploader from "@/utils/fileUploader";
import { auth, db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface FileUploadWrapperProps {
  onUploaded?: (url: string) => void;
  children: React.ReactNode;
}

export default function FileUploadWrapper({ onUploaded, children }: FileUploadWrapperProps) {
  const handleClick = async () => {
    try {
      const url = await FileUploader.uploadFile();
      if (!url) return;

      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), { photoURL: url });
      }

      onUploaded?.(url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return <div onClick={handleClick} className="cursor-pointer inline-block">{children}</div>;
}
