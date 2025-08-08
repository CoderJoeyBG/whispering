import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        {/* Subtle background pattern with scattered dots representing whispers */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-2 h-2 bg-lavender/30 rounded-full"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-coral/40 rounded-full"></div>
          <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-lavender/20 rounded-full"></div>
          <div className="absolute top-60 left-1/2 w-1 h-1 bg-coral/30 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-lavender/25 rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 fade-in">
            Where Secrets Find
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-lavender ml-4">
              Their Voice
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-cool-gray mb-12 max-w-2xl mx-auto fade-in">
            Share your whispers anonymously. Connect through stories. 
            Find comfort in the collective human experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in">
            <Link href="/submit">
              <Button className="bg-gradient-to-r from-coral to-lavender text-white px-8 py-4 rounded-full text-lg font-medium hover:from-coral/80 hover:to-lavender/80 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <i className="fas fa-feather-alt mr-2"></i>
                Leave Your Whisper
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" className="border-2 border-lavender/50 text-lavender px-8 py-4 rounded-full text-lg font-medium hover:bg-lavender/10 transition-all duration-300">
                <i className="fas fa-headphones mr-2"></i>
                Hear the Whispers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
