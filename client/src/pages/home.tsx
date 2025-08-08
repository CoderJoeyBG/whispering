import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import WhisperCard from "@/components/whisper-card";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { user } = useAuth();
  
  const { data: recentWhispers } = useQuery({
    queryKey: ["/api/whispers"],
    queryFn: async () => {
      const res = await fetch("/api/whispers?limit=6&sort=recent");
      return res.json();
    },
  });

  const { data: currentTheme } = useQuery({
    queryKey: ["/api/themes/current"],
  });

  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />
      
      {/* Welcome Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className="text-lg text-cool-gray mb-8">
            Ready to share your thoughts or explore what others are whispering?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit">
              <Button className="bg-gradient-to-r from-coral to-lavender text-white px-6 py-3 rounded-full font-medium hover:from-coral/80 hover:to-lavender/80 transition-all duration-300">
                <i className="fas fa-feather-alt mr-2"></i>
                Share a Whisper
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" className="border-lavender/50 text-lavender px-6 py-3 rounded-full font-medium hover:bg-lavender/10">
                <i className="fas fa-eye mr-2"></i>
                Browse Whispers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Current Theme */}
      {currentTheme && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-moonlight/10 backdrop-blur-sm rounded-2xl p-8 border border-lavender/20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Today's Theme</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-coral to-lavender mx-auto rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-coral mb-4 text-center">{currentTheme.title}</h3>
              <p className="text-cool-gray text-center mb-6">{currentTheme.description}</p>
              <div className="text-center">
                <Link href={`/themes?current=${currentTheme.id}`}>
                  <Button variant="outline" className="border-coral/50 text-coral hover:bg-coral/10">
                    Join the Theme
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Whispers */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Recent Whispers</h2>
            <p className="text-cool-gray">Fresh stories from the community</p>
          </div>
          
          {recentWhispers && recentWhispers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recentWhispers.map((whisper: any, index: number) => (
                <div key={whisper.id} className="fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <WhisperCard whisper={whisper} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-feather-alt text-4xl text-cool-gray/50 mb-4"></i>
              <p className="text-cool-gray">No whispers yet. Be the first to share!</p>
            </div>
          )}
          
          <div className="text-center">
            <Link href="/browse">
              <Button variant="outline" className="border-lavender/50 text-lavender hover:bg-lavender/10">
                View All Whispers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
