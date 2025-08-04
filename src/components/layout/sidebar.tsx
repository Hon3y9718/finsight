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
            <SidebarMenuButton href="#" tooltip="Dashboard" isActive={isActive('/')}>
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" tooltip="Transactions">
              <ArrowRightLeft />
              <span>Transactions</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" tooltip="Income">
              <Wallet/>
              <span>Income</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" tooltip="Investments">
              <TrendingUp />
              <span>Investments</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" tooltip="Loans">
              <Landmark />
              <span>Loans</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" tooltip="Subscriptions">
              <Repeat />
              <span>Subscriptions</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" tooltip="Reports">
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
