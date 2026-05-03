import { Movie } from "@/lib/gemini";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Star } from "lucide-react";
import { motion } from "motion/react";

// Helper for consistent gradient backgrounds based on ID/Title
const getGradient = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c1 = `hsl(${hash % 360}, 70%, 40%)`;
  const c2 = `hsl(${(hash + 40) % 360}, 70%, 20%)`;
  return `linear-gradient(135deg, ${c1}, ${c2})`;
};

export function MovieCard({ movie, onClick }: { movie: Movie; onClick?: () => void }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card 
        className="overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow border-zinc-800 bg-zinc-950/50 backdrop-blur"
        onClick={onClick}
      >
        <div 
          className="h-48 w-full relative flex items-center justify-center p-4 text-center shadow-inner"
          style={{ background: getGradient(movie.id || movie.title) }}
        >
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-yellow-500 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10">
            <Star className="w-3 h-3 fill-current" />
            {movie.rating?.toFixed(1) || "N/A"}
          </div>
          <h3 className="text-white font-bold text-xl drop-shadow-md line-clamp-3 leading-tight font-serif tracking-tight">{movie.title}</h3>
        </div>
        <CardContent className="p-4 flex-grow flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>{movie.year}</span>
            <span className="truncate max-w-[60%]">{movie.director}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {movie.genres?.slice(0, 3).map((g) => (
              <Badge key={g} variant="secondary" className="bg-zinc-800/50 text-zinc-300 text-[10px] px-1 py-0 border-zinc-700/50">
                {g}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
            {movie.plot}
          </p>
        </CardContent>
        {movie.matchPercentage && (
          <CardFooter className="p-4 pt-0 border-t border-zinc-800/50 mt-auto flex flex-col items-start gap-2">
			<div className="flex justify-between w-full text-xs text-zinc-500">
				<span>Match</span>
				<span className="text-emerald-400 font-mono">{movie.matchPercentage}%</span>
			</div>
			<div className="w-full bg-zinc-800 rounded-full h-1">
			  <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${movie.matchPercentage}%` }} />
			</div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
