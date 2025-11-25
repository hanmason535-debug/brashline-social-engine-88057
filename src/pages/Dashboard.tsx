/**
 * User Dashboard - View subscriptions, orders, billing, and profile
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Package, ShoppingBag, CreditCard, User, LogOut, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  date: string;
  items: Array<{ name: string; price: number }>;
  total: number;
  status: string;
}

export default function Dashboard() {
  const { user, billingInfo, isAuthenticated, logout, updateProfile, updateBilling } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: user?.company || "",
  });
  const [billingForm, setBillingForm] = useState({
    billingAddress: billingInfo?.billingAddress || "",
    billingCity: billingInfo?.billingCity || "",
    billingState: billingInfo?.billingState || "",
    billingZip: billingInfo?.billingZip || "",
    billingCountry: billingInfo?.billingCountry || "United States",
  });

  // Get orders from localStorage
  const orders: Order[] = JSON.parse(localStorage.getItem("brashline_orders") || "[]");

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
        <p className="text-muted-foreground mb-6">Please log in to view your dashboard</p>
        <Button onClick={() => navigate("/checkout")}>Go to Login</Button>
      </div>
    );
  }

  const handleProfileUpdate = () => {
    updateProfile(profileForm);
    setIsEditing(false);
  };

  const handleBillingUpdate = () => {
    updateBilling(billingForm);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This is a frontend-only dashboard. Enable Lovable Cloud for full authentication and
            payment processing.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="subscriptions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subscriptions">
              <Package className="h-4 w-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
                <CardDescription>Manage your active subscription packages</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.filter((o) => o.status === "active").length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No active subscriptions</p>
                    <Button className="mt-4" onClick={() => navigate("/pricing")}>
                      Browse Packages
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders
                      .filter((o) => o.status === "active")
                      .map((order) => (
                        <Card key={order.id}>
                          <CardContent className="pt-6">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center mb-2">
                                <div>
                                  <h4 className="font-semibold">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Started {format(new Date(order.date), "MMM d, yyyy")}
                                  </p>
                                </div>
                                <p className="font-bold">${item.price}/mo</p>
                              </div>
                            ))}
                            <Separator className="my-4" />
                            <div className="flex justify-between items-center">
                              <Button variant="outline" size="sm">
                                Manage
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View your past orders and invoices</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                    <Button className="mt-4" onClick={() => navigate("/pricing")}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(order.date), "MMM d, yyyy")}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                order.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between mb-2">
                              <span className="text-sm">{item.name}</span>
                              <span className="text-sm font-medium">${item.price}</span>
                            </div>
                          ))}
                          <Separator className="my-3" />
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>${order.total}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Manage your payment methods and billing address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Payment Method</h3>
                  {billingInfo?.cardLast4 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-8 w-8" />
                            <div>
                              <p className="font-medium">
                                {billingInfo.cardBrand} •••• {billingInfo.cardLast4}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Default payment method
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Button>Add Payment Method</Button>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Billing Address</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={billingForm.billingAddress}
                        onChange={(e) =>
                          setBillingForm({ ...billingForm, billingAddress: e.target.value })
                        }
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={billingForm.billingCity}
                          onChange={(e) =>
                            setBillingForm({ ...billingForm, billingCity: e.target.value })
                          }
                          placeholder="New York"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={billingForm.billingState}
                          onChange={(e) =>
                            setBillingForm({ ...billingForm, billingState: e.target.value })
                          }
                          placeholder="NY"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          value={billingForm.billingZip}
                          onChange={(e) =>
                            setBillingForm({ ...billingForm, billingZip: e.target.value })
                          }
                          placeholder="10001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={billingForm.billingCountry}
                          onChange={(e) =>
                            setBillingForm({ ...billingForm, billingCountry: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <Button onClick={handleBillingUpdate}>Save Billing Info</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, firstName: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    disabled
                    placeholder="john@example.com"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Acme Inc."
                  />
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleProfileUpdate}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  )}
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-semibold mb-2 text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
