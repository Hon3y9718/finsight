import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { investments } from "@/lib/data";

export default function InvestmentsPage() {
  const investmentTransactions = investments;
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Investments</CardTitle>
          <CardDescription>
            A list of all your investments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investmentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-full">
                        <transaction.icon className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="grid gap-0.5">
                        <p className="font-medium">{transaction.asset}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
