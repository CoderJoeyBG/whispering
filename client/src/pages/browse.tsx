import { useState, useCallback, useMemo } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import WhisperCard from "@/components/whisper-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  MessageCircle,
  SlidersHorizontal,
  Sparkles,
  Heart,
  RotateCcw,
  Loader2
} from "lucide-react";

export default function Browse() {
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data: tags } = useQuery({
    queryKey: ["/api/tags"],
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery({
    queryKey: ["/api/whispers", { search, mood: moodFilter, topic: topicFilter, sort: sortBy }],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (moodFilter && moodFilter !== "all") params.append("mood", moodFilter);
      if (topicFilter && topicFilter !== "all") params.append("topic", topicFilter);
      params.append("sort", sortBy);
      params.append("page", pageParam.toString());
      params.append("limit", "12");
      
      const res = await fetch(`/api/whispers?${params}`);
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 12 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const whispers = useMemo(() => {
    return data?.pages?.flat() || [];
  }, [data]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchValue);
  }, [searchValue]);

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setSearchValue("");
    setMoodFilter("all");
    setTopicFilter("all");
    setSortBy("recent");
  }, []);

  const getSortIcon = (sortType: string) => {
    switch (sortType) {
      case 'popular': return TrendingUp;
      case 'discussed': return MessageCircle;
      default: return Clock;
    }
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (search) count++;
    if (moodFilter !== "all") count++;
    if (topicFilter !== "all") count++;
    if (sortBy !== "recent") count++;
    return count;
  }, [search, moodFilter, topicFilter, sortBy]);

  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Explore</span>
              <span className="text-white"> Whispers</span>
            </h1>
            <p className="text-xl text-cool-gray max-w-2xl mx-auto">
              Discover anonymous stories, thoughts, and confessions from hearts around the world
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 mb-8"
          >
            {/* Main Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cool-gray/60 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search whispers by content..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-12 pr-20 py-4 text-lg bg-moonlight/30 border-cool-gray/20 rounded-2xl focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all duration-300"
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6 py-2"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Filter Toggle */}
            <div className="flex justify-between items-center mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 text-cool-gray hover:text-white transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-medium">
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </span>
              </motion.button>

              {activeFiltersCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 text-coral hover:text-coral/80 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">Clear All</span>
                </motion.button>
              )}
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-cool-gray/10">
                    {/* Mood Filter */}
                    <div>
                      <label className="block text-sm font-medium text-cool-gray mb-2">
                        <Heart className="w-4 h-4 inline mr-1" />
                        Mood
                      </label>
                      <Select value={moodFilter} onValueChange={setMoodFilter}>
                        <SelectTrigger className="glass-card border-cool-gray/20 hover:border-coral/30 transition-colors">
                          <SelectValue placeholder="All Moods" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-cool-gray/20">
                          <SelectItem value="all">All Moods</SelectItem>
                          {tags?.moodTags?.map((tag: any) => (
                            <SelectItem key={tag.id} value={tag.id}>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-coral rounded-full" />
                                {tag.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Topic Filter */}
                    <div>
                      <label className="block text-sm font-medium text-cool-gray mb-2">
                        <Sparkles className="w-4 h-4 inline mr-1" />
                        Topic
                      </label>
                      <Select value={topicFilter} onValueChange={setTopicFilter}>
                        <SelectTrigger className="glass-card border-cool-gray/20 hover:border-lavender/30 transition-colors">
                          <SelectValue placeholder="All Topics" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-cool-gray/20">
                          <SelectItem value="all">All Topics</SelectItem>
                          {tags?.topicTags?.map((tag: any) => (
                            <SelectItem key={tag.id} value={tag.id}>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-lavender rounded-full" />
                                {tag.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Sort Filter */}
                    <div>
                      <label className="block text-sm font-medium text-cool-gray mb-2">
                        <Filter className="w-4 h-4 inline mr-1" />
                        Sort By
                      </label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="glass-card border-cool-gray/20 hover:border-electric-blue/30 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-cool-gray/20">
                          <SelectItem value="recent">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Most Recent
                            </div>
                          </SelectItem>
                          <SelectItem value="popular">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              Most Popular
                            </div>
                          </SelectItem>
                          <SelectItem value="discussed">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" />
                              Most Discussed
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-cool-gray/10"
              >
                {search && (
                  <Badge className="bg-coral/20 text-coral border-coral/30">
                    Search: "{search}"
                  </Badge>
                )}
                {moodFilter !== "all" && (
                  <Badge className="bg-coral/20 text-coral border-coral/30">
                    Mood: {tags?.moodTags?.find((t: any) => t.id === moodFilter)?.name}
                  </Badge>
                )}
                {topicFilter !== "all" && (
                  <Badge className="bg-lavender/20 text-lavender border-lavender/30">
                    Topic: {tags?.topicTags?.find((t: any) => t.id === topicFilter)?.name}
                  </Badge>
                )}
                {sortBy !== "recent" && (
                  <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                    <Clock className="w-3 h-3 mr-1" />
                    {sortBy === "popular" ? "Popular" : "Discussed"}
                  </Badge>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Results */}
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="glass-card p-8 inline-block">
                <Loader2 className="w-12 h-12 text-coral animate-spin mx-auto mb-4" />
                <p className="text-cool-gray text-lg">Discovering whispers...</p>
              </div>
            </motion.div>
          ) : whispers.length > 0 ? (
            <>
              {/* Results Count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 text-center"
              >
                <p className="text-cool-gray">
                  Found <span className="text-white font-semibold">{whispers.length}</span> whispers
                </p>
              </motion.div>

              {/* Whispers Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              >
                <AnimatePresence>
                  {whispers.map((whisper: any, index: number) => (
                    <motion.div
                      key={whisper.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      layout
                    >
                      <WhisperCard whisper={whisper} index={index} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load More */}
              {hasNextPage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <Button 
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="btn-primary px-12 py-4 text-lg font-semibold"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      <>
                        Discover More
                        <Sparkles className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="glass-card p-12 max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-coral/20 to-lavender/20 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-cool-gray/40" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No whispers found</h3>
                <p className="text-cool-gray mb-6">
                  {activeFiltersCount > 0 
                    ? "Try adjusting your filters or search terms" 
                    : "Be the first to share a whisper in this space"
                  }
                </p>
                <div className="flex gap-4 justify-center">
                  {activeFiltersCount > 0 && (
                    <Button 
                      onClick={handleClearFilters}
                      variant="outline"
                      className="glass-card border-cool-gray/30 text-cool-gray hover:bg-cool-gray/10"
                    >
                      Clear Filters
                    </Button>
                  )}
                  <Button 
                    onClick={() => window.location.href = '/submit'}
                    className="btn-primary"
                  >
                    Share a Whisper
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}