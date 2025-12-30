import { Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Paintbrush, Shirt } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product/ProductCard";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-primary">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2670')] bg-cover bg-center opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        </div>

        <div className="container relative mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-bold uppercase tracking-wide">
              <Sparkles className="h-4 w-4" />
              New Collection 2024
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight">
              Wear Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">Imagination</span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
              Premium apparel meeting cutting-edge AI customization. 
              Create unique designs that tell your story.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button size="lg" className="bg-accent text-primary hover:bg-accent/90 text-lg h-14 px-8">
                  Shop Collection
                </Button>
              </Link>
              <Link href="/ai-co-creation">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg h-14 px-8">
                  Create with AI
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shirt className="h-8 w-8 text-accent" />,
                title: "Premium Quality",
                desc: "Finest cotton blends and durable fabrics tailored for comfort."
              },
              {
                icon: <Paintbrush className="h-8 w-8 text-accent" />,
                title: "Custom Printing",
                desc: "Choose between high-quality Screen Printing or textured Flocking."
              },
              {
                icon: <Sparkles className="h-8 w-8 text-accent" />,
                title: "AI Co-Creation",
                desc: "Generate unique designs instantly with our AI integration."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 rounded-2xl bg-secondary/5 border border-secondary/10 hover:border-accent/30 transition-colors"
              >
                <div className="mb-6 w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Trending Now</h2>
              <p className="text-muted-foreground">Our most popular styles this week.</p>
            </div>
            <Link href="/shop">
              <Button variant="ghost" className="group">
                View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-[400px] bg-gray-200 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
