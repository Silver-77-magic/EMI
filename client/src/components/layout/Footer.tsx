import { Link } from "wouter";
import { MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold">EMI<span className="text-accent">.</span></h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Premium personalized clothing for the modern individual. Experience quality and creativity combined.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/shop" className="hover:text-accent transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=t-shirt" className="hover:text-accent transition-colors">T-Shirts</Link></li>
              <li><Link href="/shop?category=polo" className="hover:text-accent transition-colors">Polos</Link></li>
              <li><Link href="/shop?category=jacket" className="hover:text-accent transition-colors">Jackets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="/ai-co-creation" className="hover:text-accent transition-colors">AI Studio</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <div className="flex flex-col gap-4">
              <a 
                href="https://wa.me/237699651854" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Support
              </a>
              <p className="text-sm text-primary-foreground/70">
                Douala, Cameroon<br />
                support@emi-shop.com
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/10 pt-8 text-center text-xs text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} EMI Clothing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
