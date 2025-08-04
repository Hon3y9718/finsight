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
            <SidebarMenuButton href="/" tooltip="Dashboard" isActive={isActive('/')}>
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/transactions" tooltip="Transactions" isActive={isActive('/transactions')}>
              <ArrowRightLeft />
              <span>Transactions</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/income" tooltip="Income" isActive={isActive('/income')}>
              <Wallet/>
              <span>Income</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/investments" tooltip="Investments" isActive={isActive('/investments')}>
              <TrendingUp />
              <span>Investments</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/loans" tooltip="Loans" isActive={isActive('/loans')}>
              <Landmark />
              <span>Loans</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/subscriptions" tooltip="Subscriptions" isActive={isActive('/subscriptions')}>
              <Repeat />
              <span>Subscriptions</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/reports" tooltip="Reports" isActive={isActive('/reports')}>
              <BarChart3 />
              <span>Reports</span>
            </SidebarMenuButton>
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
