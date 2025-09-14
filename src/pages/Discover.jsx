import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, TrendingUp, Star, Play, Heart, Share2, Filter, Music } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const mockSongs = [
  {
    id: 1,
    title: "The Pythagorean Theorem Song",
    subject: "math",
    plays: 245,
    duration: "2:30",
    difficulty: "intermediate"
  },
  {
    id: 2,
    title: "Photosynthesis Rap",
    subject: "science",
    plays: 189,
    duration: "3:15",
    difficulty: "beginner"
  },
  {
    id: 3,
    title: "World War II Timeline",
    subject: "history",
    plays: 312,
    duration: "4:20",
    difficulty: "advanced"
  },
  {
    id: 4,
    title: "Shakespeare's Sonnets",
    subject: "literature",
    plays: 156,
    duration: "2:45",
    difficulty: "intermediate"
  },
  {
    id: 5,
    title: "Chemical Bonding Blues",
    subject: "chemistry",
    plays: 278,
    duration: "3:30",
    difficulty: "advanced"
  },
  {
    id: 6,
    title: "Cell Division Dance",
    subject: "biology",
    plays: 203,
    duration: "2:55",
    difficulty: "intermediate"
  }
];

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState("all");

  const subjects = ["all", "math", "science", "history", "literature", "chemistry", "biology"];

  const filteredSongs = mockSongs.filter(song => {
    const matchesSearch = !searchQuery || 
      song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = activeSubject === "all" || song.subject === activeSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Learn Through
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Music & Rhythm
              </span>
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Transform your study materials into catchy songs that stick in your memory forever
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/Create">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8">
                  Create Your First Song
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Library
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search songs, subjects, or topics..."
                className="pl-10 py-3 border-purple-200 focus:border-purple-400 bg-white/80 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <Badge
                key={subject}
                variant={activeSubject === subject ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 transition-all duration-200 ${
                  activeSubject === subject
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                    : "border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                }`}
                onClick={() => setActiveSubject(subject)}
              >
                {subject === "all" ? "All Subjects" : subject.charAt(0).toUpperCase() + subject.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Songs */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Songs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.slice(0, 6).map((song) => (
              <Card key={song.id} className="border-purple-200 hover:shadow-lg transition-all duration-300 hover:border-purple-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {song.title}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {song.subject}
                      </Badge>
                    </div>
                    <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {song.plays} plays
                    </span>
                    <span>{song.duration}</span>
                  </div>
                  <div className="mt-3">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        song.difficulty === 'beginner' ? 'border-green-200 text-green-700' :
                        song.difficulty === 'intermediate' ? 'border-yellow-200 text-yellow-700' :
                        'border-red-200 text-red-700'
                      }`}
                    >
                      {song.difficulty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recently Added */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Music className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recently Added</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSongs.map((song) => (
              <Card key={song.id} className="border-purple-200 hover:shadow-lg transition-all duration-300 hover:border-purple-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {song.title}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {song.subject}
                      </Badge>
                    </div>
                    <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {song.plays} plays
                    </span>
                    <span>{song.duration}</span>
                  </div>
                  <div className="mt-3">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        song.difficulty === 'beginner' ? 'border-green-200 text-green-700' :
                        song.difficulty === 'intermediate' ? 'border-yellow-200 text-yellow-700' :
                        'border-red-200 text-red-700'
                      }`}
                    >
                      {song.difficulty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}