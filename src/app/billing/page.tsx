
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { 
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow
// } from "@/components/ui/table";
// import { Download } from "lucide-react";


// const invoices = [
//     {
//         invoice: "INV001",
//         date: "July 2024",
//         amount: "$99.00",
//     },
//     {
//         invoice: "INV002",
//         date: "June 2024",
//         amount: "$99.00",
//     },
//     {
//         invoice: "INV003",
//         date: "May 2024",
//         amount: "$99.00",
//     },
// ]

// export default function BillingPage() {
//   return (
//     <div className="p-4 sm:p-6 lg:p-8 space-y-6">
//        <Card>
//         <CardHeader>
//           <CardTitle>Subscription Plan</CardTitle>
//           <CardDescription>
//             You are currently on the <strong>Pro Plan</strong>.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
//                 <div>
//                     <p className="text-lg font-semibold">$99 / month</p>
//                     <p className="text-muted-foreground">Your next bill is on August 1, 2024.</p>
//                 </div>
//                 <Button variant="outline" className="mt-4 md:mt-0">Cancel Subscription</Button>
//             </div>
//         </CardContent>
//       </Card>

//        <Card>
//         <CardHeader>
//           <CardTitle>Payment Method</CardTitle>
//           <CardDescription>
//             Change how you pay for your plan.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
//                 <div>
//                     <p className="font-medium">Visa ending in 1234</p>
//                     <p className="text-muted-foreground">Expires 12/2028</p>
//                 </div>
//                 <Button variant="outline" className="mt-4 md:mt-0">Update Payment Method</Button>
//             </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//             <CardTitle>Billing History</CardTitle>
//             <CardDescription>
//                 View and download your past invoices.
//             </CardDescription>
//         </CardHeader>
//         <CardContent>
//             <Table>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>Invoice</TableHead>
//                         <TableHead>Date</TableHead>
//                         <TableHead>Amount</TableHead>
//                         <TableHead className="text-right">Action</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {invoices.map((invoice) => (
//                         <TableRow key={invoice.invoice}>
//                             <TableCell className="font-medium">{invoice.invoice}</TableCell>
//                             <TableCell>{invoice.date}</TableCell>
//                             <TableCell>{invoice.amount}</TableCell>
//                             <TableCell className="text-right">
//                                 <Button variant="outline" size="icon">
//                                     <Download className="h-4 w-4" />
//                                     <span className="sr-only">Download</span>
//                                 </Button>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
