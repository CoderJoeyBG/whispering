import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import WhisperCard from "@/components/whisper-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Browse() {
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);

  const { data: tags } = useQuery({
    queryKey: ["/api/tags"],
  });

  const { data: whispers, isLoading } = useQuery({
    queryKey: ["/api/whispers", { search, mood: moodFilter, topic: topicFilter, sort: sortBy, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (moodFilter && moodFilter !== "all") params.append("mood", moodFilter);
      if (topicFilter && topicFilter !== "all") params.append("topic", topicFilter);
      params.append("sort", sortBy);
      params.append("page", page.toString());
      params.append("limit", "12");
      
      const res = await fetch(`/api/whispers?${params}`);
      return res.json();
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Browse Whispers</h1>
            <p className="text-cool-gray text-lg">Anonymous stories from hearts around the world</p>
          </div>

          {/* Filters and Search */}
          <div className="bg-moonlight/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-lavender/20">
            <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search whispers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-moonlight/20 border border-lavender/30 rounded-xl px-4 py-3 pl-12 text-cool-gray placeholder-cool-gray/60 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-cool-gray/60"></i>
              </div>
              
              {/* Filter Dropdowns */}
              <div className="flex flex-wrap gap-3">
                <Select value={moodFilter} onValueChange={setMoodFilter}>
                  <SelectTrigger className="bg-moonlight/20 border border-lavender/30 rounded-xl px-4 py-3 text-cool-gray focus:outline-none focus:border-coral w-40">
                    <SelectValue placeholder="All Moods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Moods</SelectItem>
                    {tags?.moodTags?.map((tag: any) => (
                      <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={topicFilter} onValueChange={setTopicFilter}>
                  <SelectTrigger className="bg-moonlight/20 border border-lavender/30 rounded-xl px-4 py-3 text-cool-gray focus:outline-none focus:border-coral w-40">
                    <SelectValue placeholder="All Topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    {tags?.topicTags?.map((tag: any) => (
                      <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-moonlight/20 border border-lavender/30 rounded-xl px-4 py-3 text-cool-gray focus:outline-none focus:border-coral w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="discussed">Most Discussed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </div>

          {/* Whisper Cards Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <i className="fas fa-spinner fa-spin text-2xl text-cool-gray mb-4"></i>
              <p className="text-cool-gray">Loading whispers...</p>
            </div>
          ) : whispers && whispers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {whispers.map((whisper: any, index: number) => (
                  <div key={whisper.id} className="fade-in" style={{animationDelay: `${index * 100}ms`}}>
                    <WhisperCard whisper={whisper} />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center">
                <Button 
                  onClick={() => setPage(page + 1)}
                  variant="outline"
                  className="bg-moonlight/20 border border-lavender/30 text-cool-gray px-8 py-3 rounded-xl hover:bg-moonlight/30 hover:border-coral/30 transition-all duration-200"
                >
                  Load More Whispers
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-cool-gray/50 mb-4"></i>
              <p className="text-cool-gray text-lg mb-2">No whispers found</p>
              <p className="text-cool-gray/60">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
