import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, Share2, Clock, Volume2, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const genreColors = {
  rap: "from-red-500 to-orange-500",
  pop: "from-pink-500 to-purple-500",
  lullaby: "from-blue-400 to-indigo-500",
  "lo-fi": "from-green-400 to-teal-500",
  acoustic: "from-yellow-500 to-orange-500",
  electronic: "from-purple-500 to-indigo-600",
  "r&b": "from-pink-600 to-purple-600"
};

const subjectIcons = {
  math: "📐",
  science: "🔬",
  history: "🏛️",
  literature: "📚",
  chemistry: "⚗️",
  biology: "🧬",
  physics: "⚡",
  geography: "🌍",
  language: "💬",
  other: "📖"
};

export default function SongCard({ song, rank }) {
  const gradientClass = genreColors[song.genre] || "from-gray-500 to-gray-600";
  const subjectIcon = subjectIcons[song.subject] || subjectIcons.other;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -4 }}
    >
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-purple-100 bg-white/80 backdrop-blur-sm">
        {/* Header with gradient */}
        <div className={`h-32 bg-gradient-to-br ${gradientClass} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="icon"
              className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 transition-all duration-200 group-hover:scale-110"
            >
              <Play className="w-6 h-6 text-white" />
            </Button>
          </div>
          
          {/* Rank badge for trending */}
          {rank && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/90 text-black font-bold">
                #{rank}
              </Badge>
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" className="w-8 h-8 bg-white/20 hover:bg-white/30 border-0">
              <Heart className="w-4 h-4 text-white" />
            </Button>
            <Button size="icon" className="w-8 h-8 bg-white/20 hover:bg-white/30 border-0">
              <Share2 className="w-4 h-4 text-white" />
            </Button>
          </div>

          {/* Subject icon */}
          <div className="absolute bottom-3 left-3">
            <div className="text-2xl">{subjectIcon}</div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{song.title}</h3>
            <p className="text-sm text-gray-600 capitalize">{song.subject}</p>
          </div>

          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{song.length_seconds ? `${Math.floor(song.length_seconds / 60)}:${String(song.length_seconds % 60).padStart(2, '0')}` : '1:00'}</span>
            
            <Volume2 className="w-3 h-3 ml-2" />
            <span className="capitalize">{song.genre}</span>
            
            {song.plays > 0 && (
              <>
                <TrendingUp className="w-3 h-3 ml-2" />
                <span>{song.plays} plays</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs capitalize">
              {song.lyric_density} density
            </Badge>
            <Badge variant="outline" className="text-xs">
              {song.tempo_bpm} BPM
            </Badge>
          </div>

          <Link to={createPageUrl(`Song?id=${song.id}`)}>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-sm">
              <Play className="w-4 h-4 mr-2" />
              Play Now
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}