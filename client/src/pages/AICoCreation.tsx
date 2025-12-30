import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGenerateImage } from "@/hooks/use-ai-generation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Download, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AICoCreation() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { mutate: generate, isPending } = useGenerateImage();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!prompt) return;
    generate({ prompt }, {
      onSuccess: (data) => {
        setGeneratedImage(data.url);
        toast({ title: "Design Generated!", description: "Your custom AI design is ready." });
      },
      onError: (error) => {
        toast({ 
          title: "Generation Failed", 
          description: error.message, 
          variant: "destructive" 
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-primary py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent via-primary to-primary"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
              AI Design Studio
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Describe your dream design and watch our AI bring it to life instantly.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 -mt-16 relative z-20">
          <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-6 md:p-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <Input
                placeholder="Describe your design (e.g., 'A cyberpunk lion in neon colors')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-14 text-lg"
              />
              <Button 
                size="lg" 
                onClick={handleGenerate} 
                disabled={isPending || !prompt}
                className="h-14 px-8 bg-accent text-primary hover:bg-accent/90"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" /> Generate
                  </>
                )}
              </Button>
            </div>

            <div className="aspect-video bg-secondary/10 rounded-xl border-2 border-dashed border-secondary/20 flex items-center justify-center overflow-hidden relative group">
              {generatedImage ? (
                <>
                  <img 
                    src={generatedImage} 
                    alt="Generated Design" 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button variant="secondary" onClick={() => window.open(generatedImage, '_blank')}>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                    {/* Future integration: Add directly to product */}
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground p-12">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Sparkles className="h-8 w-8 text-secondary" />
                  </div>
                  <p className="text-lg font-medium">Your imagination is the limit</p>
                  <p className="text-sm">Enter a prompt above to start creating</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
