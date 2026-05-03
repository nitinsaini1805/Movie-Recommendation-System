import { useState, useEffect } from "react";
import { Search, Loader2, Sparkles, Film, User, Compass } from "lucide-react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { MovieCard } from "./components/movie-card";
import { getTopRecommendations, searchMovies, getUserBasedRecommendations, getSimilarMovies, Movie } from "./lib/gemini";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { Badge } from "./components/ui/badge";

export default function App() {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [preferences, setPreferences] = useState("I like sci-fi with mind-bending plots and Christopher Nolan movies.");
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Load initial content
  useEffect(() => {
    fetchMovies("discover");
  }, []);

  const fetchMovies = async (tab: string, query?: string) => {
    setLoading(true);
    setMovies([]);
    let result: Movie[] = [];
    
    try {
      if (tab === "discover") {
        result = await getTopRecommendations(12);
      } else if (tab === "search" && query) {
        result = await searchMovies(query, 12);
      } else if (tab === "for-you") {
        result = await getUserBasedRecommendations(preferences, 12);
      } else if (tab === "similar" && query) {
        // Here query is the movie title
        result = await getSimilarMovies(query, 12);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMovies(result || []);
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "discover") {
      fetchMovies(value);
    } else if (value === "for-you") {
      fetchMovies(value);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveTab("search");
    fetchMovies("search", searchQuery);
  };

  const handleSimilar = (movie: Movie) => {
    setSelectedMovie(null);
    setSearchQuery(movie.title);
    setActiveTab("similar");
    fetchMovies("similar", movie.title);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-emerald-500" />
            <h1 className="text-xl font-bold tracking-tight text-white font-serif">MoviRec Engine</h1>
          </div>
          
          <form onSubmit={handleSearch} className="hidden md:flex relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input 
              placeholder="Search movies, genres, or themes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500 rounded-full text-sm"
            />
          </form>

          <div className="text-sm font-medium text-zinc-500 tracking-wide flex items-center gap-2">
            <span className="text-zinc-600">Developed by</span>
            <span className="text-emerald-500/90 font-semibold tracking-wider uppercase text-xs">Nitin Saini</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-transparent border-b border-zinc-800 w-full justify-start rounded-none p-0 h-auto mb-8 gap-6">
            <TabsTrigger 
              value="discover" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-emerald-500 data-[state=active]:shadow-none data-[state=active]:border-b-2 border-emerald-500 rounded-none px-0 pb-4 pt-2 text-zinc-400 hover:text-zinc-200"
            >
              <Compass className="w-4 h-4 mr-2" /> Top Picks
            </TabsTrigger>
            <TabsTrigger 
              value="for-you"
              className="data-[state=active]:bg-transparent data-[state=active]:text-emerald-500 data-[state=active]:shadow-none data-[state=active]:border-b-2 border-emerald-500 rounded-none px-0 pb-4 pt-2 text-zinc-400 hover:text-zinc-200"
            >
              <Sparkles className="w-4 h-4 mr-2" /> For You
            </TabsTrigger>
            {activeTab === "search" && (
              <TabsTrigger 
                value="search"
                className="data-[state=active]:bg-transparent data-[state=active]:text-emerald-500 data-[state=active]:shadow-none data-[state=active]:border-b-2 border-emerald-500 rounded-none px-0 pb-4 pt-2 text-zinc-400 hover:text-zinc-200"
              >
                <Search className="w-4 h-4 mr-2" /> Search Results
              </TabsTrigger>
            )}
            {activeTab === "similar" && (
              <TabsTrigger 
                value="similar"
                className="data-[state=active]:bg-transparent data-[state=active]:text-emerald-500 data-[state=active]:shadow-none data-[state=active]:border-b-2 border-emerald-500 rounded-none px-0 pb-4 pt-2 text-zinc-400 hover:text-zinc-200"
              >
                <Film className="w-4 h-4 mr-2" /> Similar Movies
              </TabsTrigger>
            )}
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "for-you" && (
                <div className="mb-8 p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                      <User className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-zinc-200 mb-1">Your Preference Profile</h3>
                      <p className="text-sm text-zinc-400 mb-4">Update your preferences to get better personalized recommendations via collaborative and content-based filtering.</p>
                      <div className="flex gap-2">
                        <Input 
                          value={preferences}
                          onChange={(e) => setPreferences(e.target.value)}
                          className="bg-zinc-950 border-zinc-800 focus-visible:ring-emerald-500"
                        />
                        <Button onClick={() => fetchMovies("for-you")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
                  <p className="font-mono text-xs uppercase tracking-widest">Generating Recommendations...</p>
                </div>
              ) : movies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {movies.map((movie, idx) => (
                    <motion.div 
                      key={movie.id || idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <MovieCard movie={movie} onClick={() => setSelectedMovie(movie)} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Film className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-500 text-lg">No movies found. Try a different search.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>

      {/* Movie Details Dialog */}
      <Dialog open={!!selectedMovie} onOpenChange={(open) => !open && setSelectedMovie(null)}>
        {selectedMovie && (
          <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-800 text-zinc-200 p-0 overflow-hidden">
            <div 
              className="h-32 w-full relative"
              style={{
                background: `linear-gradient(to bottom, transparent, #09090b), ${
                  ((str: string) => {
                    let hash = 0;
                    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
                    return `linear-gradient(135deg, hsl(${hash % 360}, 70%, 30%), hsl(${(hash + 40) % 360}, 70%, 15%))`;
                  })(selectedMovie.id || selectedMovie.title)
                }`
              }}
            >
              <div className="absolute bottom-0 left-6 translate-y-1/2 p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-lg text-emerald-500 font-bold text-xl">
                  {selectedMovie.rating?.toFixed(1) || "-"}
                </div>
              </div>
            </div>
            <div className="px-6 pt-10 pb-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif tracking-tight">{selectedMovie.title} <span className="text-zinc-500 text-lg font-normal ml-2">({selectedMovie.year})</span></DialogTitle>
                <DialogDescription className="text-zinc-400 mt-1">
                  Directed by <span className="text-zinc-300 font-medium">{selectedMovie.director}</span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedMovie.genres?.map(g => (
                  <Badge key={g} variant="outline" className="border-zinc-700 text-zinc-300">
                    {g}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Plot Summary</h4>
                  <p className="text-sm leading-relaxed text-zinc-300">{selectedMovie.plot}</p>
                </div>
                
                {selectedMovie.reason && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
                    <h4 className="text-xs font-semibold text-emerald-500/80 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> Why this was recommended
                    </h4>
                    <p className="text-sm text-zinc-300">{selectedMovie.reason}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedMovie(null)} className="border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                  Close
                </Button>
                <Button onClick={() => handleSimilar(selectedMovie)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Find Similar Movies
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

