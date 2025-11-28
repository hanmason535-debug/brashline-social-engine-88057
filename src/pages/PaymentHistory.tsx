/**
 * Payment History Page
 * Displays user's payment history and invoices
 */
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Receipt, ExternalLink, CreditCard, Download } from "lucide-react";
import { format } from "date-fns";
import { SubscriptionStatus } from "@/components/payment";
import { useStripe } from "@/contexts/StripeContext";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  receiptUrl: string | null;
  createdAt: string;
}

export default function PaymentHistory() {
  const { isSignedIn, isLoaded } = useAuth();
  const { openCustomerPortal, isLoading: isPortalLoading } = useStripe();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch payment history from API
    // For now, using mock data
    const timer = setTimeout(() => {
      setPayments([]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in?redirect_url=/payment/history" replace />;
  }

  const formatAmount = (cents: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  };

  const statusColors: Record<string, string> = {
    succeeded: "bg-green-500",
    pending: "bg-yellow-500",
    failed: "bg-red-500",
    refunded: "bg-blue-500",
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Billing & Payments</h1>
            <p className="text-muted-foreground mt-1">
              Manage your subscription and view payment history
            </p>
          </div>
          <Button
            onClick={() => openCustomerPortal()}
            disabled={isPortalLoading}
            variant="outline"
          >
            {isPortalLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-4 w-4" />
            )}
            Manage Billing
          </Button>
        </div>

        {/* Current Subscription */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Current Subscription</h2>
          <SubscriptionStatus />
        </section>

        {/* Payment History */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Payment History</h2>
          
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : payments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle className="text-lg mb-2">No payments yet</CardTitle>
                <CardDescription>
                  Your payment history will appear here once you make a purchase.
                </CardDescription>
                <Button asChild className="mt-6">
                  <Link to="/pricing">View Pricing Plans</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {format(new Date(payment.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {payment.description || "Subscription payment"}
                      </TableCell>
                      <TableCell>
                        {formatAmount(payment.amount, payment.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[payment.status] || "bg-gray-500"}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.receiptUrl ? (
                          <Button asChild variant="ghost" size="sm">
                            <a
                              href={payment.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="mr-1 h-4 w-4" />
                              Receipt
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </section>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Have questions about your billing or need to make changes to your subscription?
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="outline">
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button asChild variant="ghost">
                <a
                  href="https://stripe.com/docs/billing/customer-portal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Billing FAQ
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
