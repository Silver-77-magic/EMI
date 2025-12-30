import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
      <div className="aspect-[4/5] relative overflow-hidden bg-secondary/5">
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"} // Fallback image
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link href={`/shop/${product.id}`}>
            <Button variant="secondary" className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View Details
            </Button>
          </Link>
        </div>
      </div>
      
      <CardContent className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-accent uppercase tracking-wider">{product.category}</p>
          <span className="font-mono text-sm font-bold">{product.price.toLocaleString()} FCFA</span>
        </div>
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-display text-xl font-bold mb-2 group-hover:text-accent transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
      </CardContent>
    </Card>
  );
}
