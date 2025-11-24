/**
 * Cart Icon Component - Displays cart with item count badge
 */
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

export const CartIcon = () => {
  const { cart } = useCart();

  return (
    <Button variant="ghost" size="sm" asChild className="relative">
      <Link to="/cart" aria-label={`Cart with ${cart.itemCount} items`}>
        <ShoppingCart className="h-5 w-5" />
        {cart.itemCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground"
            aria-label={`${cart.itemCount} items in cart`}
          >
            {cart.itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
};
