import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Landmark } from "lucide-react";

export default function LoansPage() {
  const loans = [
    {
      id: "1",
      lender: "Community Bank",
      initialAmount: 25000,
      currentBalance: 12500,
      interestRate: 5.5,
      paymentDate: "2024-08-01",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Loans</CardTitle>
          <CardDescription>
            A summary of your outstanding loans.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loans.map((loan) => (
            <Card key={loan.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-500/10 rounded-full">
                  <Landmark className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{loan.lender}</p>
                    <p className="text-sm text-muted-foreground">
                      Next Payment: {loan.paymentDate}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Initial Amount</p>
                      <p className="font-medium">
                        ${loan.initialAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Balance</p>
                      <p className="font-medium">
                        ${loan.currentBalance.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Interest Rate</p>
                      <p className="font-medium">{loan.interestRate}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
