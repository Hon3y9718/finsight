
"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Label>Theme</Label>
            <RadioGroup defaultValue={theme} onValueChange={setTheme} className="flex space-x-4">
                <div>
                    <RadioGroupItem value="light" id="light" className="peer sr-only" />
                    <Label htmlFor="light" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        Light
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                    <Label htmlFor="dark" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        Dark
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="system" id="system" className="peer sr-only" />
                    <Label htmlFor="system" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        System
                    </Label>
                </div>
            </RadioGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
                Manage your email notification preferences.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                <div className="space-y-0.5">
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-muted-foreground">Receive a summary of your finances every week.</p>
                </div>
                <Switch defaultChecked />
            </div>
             <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                <div className="space-y-0.5">
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified about suspicious activity on your account.</p>
                </div>
                <Switch defaultChecked />
            </div>
             <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                <div className="space-y-0.5">
                    <p className="font-medium">Promotional Emails</p>
                    <p className="text-sm text-muted-foreground">Receive news and special offers from FinSight.</p>
                </div>
                <Switch />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
