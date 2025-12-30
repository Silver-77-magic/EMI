import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useCreateOrder } from "@/hooks/use-orders";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { items, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to complete your purchase.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    createOrder({
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        personalizationMethod: item.personalizationMethod,
        customDesignText: item.customDesignText,
        customDesignImageUrl: item.customDesignImageUrl,
      })),
      totalAmount: total,
    }, {
      onSuccess: () => {
        clearCart();
        toast({
          title: "Order Placed!",
          description: "We've received your order. Check your WhatsApp for details.",
        });
        setLocation("/profile"); // Redirect to orders page
      },
      onError: (err) => {
        toast({
          title: "Order Failed",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="h-10 w-10 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any items yet.</p>
          <Link href="/shop">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-card border rounded-xl p-6 flex gap-6 shadow-sm">
                <div className="w-24 h-24 bg-secondary/10 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{item.product.name}</h3>
                    <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1 mb-4">
                    <p>Size: {item.size} • Color: {item.color}</p>
                    <p>Method: {item.personalizationMethod}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="font-mono font-bold text-primary">
                      {item.product.price.toLocaleString()} FCFA x {item.quantity}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-xl p-6 sticky top-24 shadow-sm">
              <h3 className="font-bold text-xl mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{total.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-bold text-lg">Total</span>
                <span className="font-display text-2xl font-bold text-primary">{total.toLocaleString()} FCFA</span>
              </div>

              <div className="bg-secondary/10 p-4 rounded-lg mb-6 text-sm">
                <p className="font-bold text-primary mb-1">Cash on Delivery Only</p>
                <p className="text-muted-foreground">Pay when you receive your order. Delivery typically takes 1 week.</p>
              </div>

              <Button 
                className="w-full h-12 text-lg bg-accent text-primary hover:bg-accent/90"
                onClick={handleCheckout}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="animate-spin" /> : "Checkout Now"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
