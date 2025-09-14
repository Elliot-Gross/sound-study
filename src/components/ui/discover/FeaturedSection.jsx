import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, Share2, Clock, TrendingUp } from "lucide-react";
// import { Skeleton } from "../components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function FeaturedSection({ songs, isLoading }) {
  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Songs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[16/9]">
                <Skeleton className="w-full h-full" />
              </div>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Songs</h2>
        <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {songs.slice(0, 2).map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-purple-100 bg-gradient-to-br from-white to-purple-50/30">
              <div className="aspect-[16/9] relative overflow-hidden bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-500">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-white/30 transition-colors">
                      <Play className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{song.title}</h3>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                      {song.subject}
                    </Badge>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold">
                    ⭐ Featured
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="icon" variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {song.length_seconds ? `${Math.floor(song.length_seconds / 60)}:${String(song.length_seconds % 60).padStart(2, '0')}` : '1:00'}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {song.plays || 0} plays
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {song.genre}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Master {song.subject} concepts with this catchy {song.genre} song
                </p>
                <Link to={createPageUrl(`Song?id=${song.id}`)}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                    <Play className="w-4 h-4 mr-2" />
                    Play Song
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {songs.slice(2, 6).map((song) => (
          <Card key={song.id} className="p-4 hover:shadow-lg transition-all duration-200 border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                <Play className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{song.title}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{song.subject} • {song.genre}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}