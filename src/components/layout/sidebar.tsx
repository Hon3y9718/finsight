
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
import { FinSightLogo } from "@/components/icons";
import {
  LayoutDashboard,
  ArrowRightLeft,
  TrendingUp,
  Landmark,
  Repeat,
  BarChart3,
  Settings,
  Wallet,
} from "lucide-react";
import { UserNav } from "./user-nav";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar
      className="border-r"
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarContent>
        <SidebarHeader className="h-16 justify-center">
          <FinSightLogo className="size-8" />
          <span className="text-xl font-semibold text-primary">FinSight</span>
        </SidebarHeader>

        <SidebarMenu className="flex-1 px-4">
          <SidebarMenuItem>
            <Link href="/" passHref legacyBehavior>
              <SidebarMenuButton as="a" tooltip="Dashboard" isActive={isActive('/')}>
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/transactions" passHref legacyBehavior>
              <SidebarMenuButton as="a" tooltip="Transactions" isActive={isActive('/transactions')}>
                <ArrowRightLeft />
                <span>Transactions</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/income" passHref legacyBehavior>
              <SidebarMenuButton as="a" tooltip="Income" isActive={isActive('/income')}>
                <Wallet/>
                <span>Income</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/investments" passHref legacyBehavior>
              <SidebarMenuButton as="a" tooltip="Investments" isActive={isActive('/investments')}>
                <TrendingUp />
                <span>Investments</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/loans" passHref legacyBehavior>
              <SidebarMenuButton as="a" tooltip="Loans" isActive={isActive('/loans')}>
                <Landmark />
                <span>Loans</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/subscriptions" passHref legacyBehavior>
              <SidebarMenuButton as="a" tooltip="Subscriptions" isActive={isActive('/subscriptions')}>
                <Repeat />
                <span>Subscriptions</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/reports" passHref legacyBehavior>
              <SidebarMenuButton as="a" tooltip="Reports" isActive={isActive('/reports')}>
                <BarChart3 />
                <span>Reports</span>
              </SidebarMenuButton>
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
