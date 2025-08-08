import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import WhisperCard from "@/components/whisper-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Themes() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const currentThemeId = urlParams.get('current');

  const { data: currentTheme } = useQuery({
    queryKey: ["/api/themes/current"],
  });

  const { data: allThemes } = useQuery({
    queryKey: ["/api/themes"],
  });

  const { data: themeWhispers } = useQuery({
    queryKey: ["/api/whispers", { theme: currentThemeId || currentTheme?.id }],
    queryFn: async () => {
      const themeId = currentThemeId || currentTheme?.id;
      if (!themeId) return [];
      
      const params = new URLSearchParams();
      params.append("theme", themeId);
      params.append("limit", "12");
      
      const res = await fetch(`/api/whispers?${params}`);
      return res.json();
    },
    enabled: !!(currentThemeId || currentTheme?.id),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isThemeActive = (theme: any) => {
    const now = new Date();
    const start = new Date(theme.startDate);
    const end = new Date(theme.endDate);
    return now >= start && now <= end && theme.isActive;
  };

  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Daily Themes</h1>
            <p className="text-cool-gray text-lg">Join the conversation with guided prompts and themes</p>
          </div>

          {/* Current Theme */}
          {currentTheme && (
            <Card className="bg-moonlight/10 backdrop-blur-sm border-lavender/20 mb-12">
              <CardHeader>
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-coral to-lavender text-white mb-4">
                    Current Theme
                  </Badge>
                  <CardTitle className="text-2xl text-white mb-2">{currentTheme.title}</CardTitle>
                  <div className="w-16 h-1 bg-gradient-to-r from-coral to-lavender mx-auto rounded-full"></div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-cool-gray text-center mb-6 text-lg leading-relaxed">
                  {currentTheme.description}
                </p>
                <div className="text-center mb-6">
                  <p className="text-cool-gray/60 text-sm">
                    Active from {formatDate(currentTheme.startDate)} to {formatDate(currentTheme.endDate)}
                  </p>
                </div>
                <div className="text-center">
                  <Link href="/submit">
                    <Button className="bg-gradient-to-r from-coral to-lavender text-white px-6 py-3 rounded-full font-medium hover:from-coral/80 hover:to-lavender/80 transition-all duration-300">
                      <i className="fas fa-feather-alt mr-2"></i>
                      Join This Theme
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Theme Whispers */}
          {themeWhispers && themeWhispers.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Whispers for This Theme
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themeWhispers.map((whisper: any, index: number) => (
                  <div key={whisper.id} className="fade-in" style={{animationDelay: `${index * 100}ms`}}>
                    <WhisperCard whisper={whisper} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Themes Archive */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Theme Archive</h2>
            
            {allThemes && allThemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allThemes.map((theme: any) => (
                  <Card key={theme.id} className="bg-moonlight border-lavender/20 hover:border-coral/30 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-midnight">{theme.title}</CardTitle>
                        {isThemeActive(theme) ? (
                          <Badge className="bg-green-500/20 text-green-600">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="border-cool-gray/30 text-cool-gray/60">
                            Ended
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-cool-gray mb-4 leading-relaxed">
                        {theme.description}
                      </p>
                      <div className="flex justify-between items-center text-sm text-cool-gray/60">
                        <span>{formatDate(theme.startDate)}</span>
                        <span>→</span>
                        <span>{formatDate(theme.endDate)}</span>
                      </div>
                      
                      {isThemeActive(theme) && (
                        <div className="mt-4">
                          <Link href={`/themes?current=${theme.id}`}>
                            <Button variant="outline" className="w-full border-coral/50 text-coral hover:bg-coral/10">
                              View Theme Whispers
                            </Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-calendar-day text-4xl text-cool-gray/50 mb-4"></i>
                <p className="text-cool-gray text-lg mb-2">No themes available</p>
                <p className="text-cool-gray/60">Check back soon for new themes and prompts</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
