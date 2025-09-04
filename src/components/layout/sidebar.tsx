"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { TechiciousLogo } from "@/components/icons";
import {
  LayoutDashboard,
  ArrowRightLeft,
  TrendingUp,
  Landmark,
  Repeat,
  BarChart3,
  Wallet,
} from "lucide-react";
import { UserNav } from "./user-nav";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar className="border-r" collapsible="icon" variant="sidebar">
      <SidebarContent>
        <SidebarHeader className="flex items-center gap-2 h-16 px-8">
          <TechiciousLogo className="text-3xl" />
        </SidebarHeader>



        <SidebarMenu className="flex-1 px-4">
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton tooltip="Dashboard" isActive={isActive("/")}>
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href="/transactions">
              <SidebarMenuButton
                tooltip="Transactions"
                isActive={isActive("/transactions")}
              >
                <ArrowRightLeft />
                <span>Transactions</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href="/income">
              <SidebarMenuButton
                tooltip="Income"
                isActive={isActive("/income")}
              >
                <Wallet />
                <span>Income</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href="/investments">
              {/* Future investments */}
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href="/loans">
              <SidebarMenuButton tooltip="Loans" isActive={isActive("/loans")}>
                <Landmark />
                <span>Loans</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href="/subscriptions">
              {/* Future subscriptions */}
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href="/reports">
              {/* Future reports */}
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        <SidebarFooter className="p-4">
          <UserNav />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
