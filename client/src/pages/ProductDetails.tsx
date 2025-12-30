import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, Loader2, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetails() {
  const [, params] = useRoute("/shop/:id");
  const id = parseInt(params?.id || "0");
  const { data: product, isLoading } = useProduct(id);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [method, setMethod] = useState("Screen Printing");
  const [customText, setCustomText] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop"><Button>Back to Shop</Button></Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!color || !size) {
      toast({
        title: "Please select options",
        description: "Color and size are required.",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      productId: product.id,
      quantity,
      size,
      color,
      personalizationMethod: method,
      customDesignText: customText,
      product: product,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <Link href="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Side */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-secondary/10 rounded-3xl overflow-hidden relative">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details Side */}
          <div className="space-y-8">
            <div>
              <div className="text-accent font-bold uppercase tracking-wider text-sm mb-2">{product.category}</div>
              <h1 className="font-display text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl font-mono font-medium text-primary">{product.price.toLocaleString()} FCFA</p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-6 pt-6 border-t">
              {/* Color Selection */}
              <div className="space-y-3">
                <Label>Select Color</Label>
                <div className="flex gap-3">
                  {product.customizationOptions.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        color === c ? "border-primary scale-110" : "border-transparent hover:scale-110"
                      }`}
                      style={{ backgroundColor: c.toLowerCase() }}
                    >
                      {color === c && <Check className={`h-4 w-4 ${['white', 'yellow'].includes(c.toLowerCase()) ? 'text-black' : 'text-white'}`} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <Label>Select Size</Label>
                <div className="flex gap-3">
                  {product.customizationOptions.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`h-10 w-14 rounded-lg border text-sm font-medium transition-all ${
                        size === s 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-background border-input hover:border-primary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Printing Method */}
              <div className="space-y-3">
                <Label>Personalization Method</Label>
                <RadioGroup value={method} onValueChange={setMethod} className="flex gap-4">
                  {product.customizationOptions.methods.map((m) => (
                    <div key={m} className="flex items-center space-x-2">
                      <RadioGroupItem value={m} id={m} />
                      <Label htmlFor={m} className="cursor-pointer">{m}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Custom Text */}
              <div className="space-y-3">
                <Label>Custom Text (Optional)</Label>
                <Textarea 
                  placeholder="Enter text to print..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="resize-none"
                />
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <div className="flex items-center border rounded-lg w-fit">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  size="lg" 
                  className="flex-1 h-12 text-lg bg-accent text-primary hover:bg-accent/90"
                  onClick={handleAddToCart}
                >
                  Add to Cart - {(product.price * quantity).toLocaleString()} FCFA
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
