
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
       <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This page is under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p>Check back soon for your user profile!</p>
        </CardContent>
      </Card>
    </div>
  );
}
