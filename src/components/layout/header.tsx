
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { AddTransactionSheet } from "../dashboard/add-transaction-sheet";
// import { CsvImportDialog } from "../dashboard/csv-import-dialog";
import { usePathname } from "next/navigation";

function getTitle(pathname: string) {
  switch (pathname) {
    case "/":
      return "Dashboard";
    case "/transactions":
      return "Transactions";
    case "/income":
      return "Income";
    case "/investments":
      return "Investments";
    case "/loans":
      return "Loans";
    case "/subscriptions":
      return "Subscriptions";
    case "/reports":
      return "Reports";
    case "/profile":
      return "Profile";
    case "/billing":
      return "Billing";
    case "/settings":
      return "Settings";
    default:
      return "Dashboard";
  }
}

export default function Header() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        {/* <CsvImportDialog>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
        </CsvImportDialog> */}
        <AddTransactionSheet>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </AddTransactionSheet>
      </div>
    </header>
  );
}
