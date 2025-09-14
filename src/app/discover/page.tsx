'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, TrendingUp, Star, Play, Heart, Share2, Filter, Music } from "lucide-react"
import Link from "next/link"

interface Song {
  id: string
  title: string
  subject: string
  genre: string
  bpm: number
  lengthSec: number
  audioUrl?: string
  lyricsUrl?: string
  captionsUrl?: string
  mode: 'SONG' | 'NARRATION'
  createdAt: string
  stats?: {
    plays: number
    likes: number
    shares: number
  }
  creator?: {
    name: string
    email: string
  }
}

export default function DiscoverPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSubject, setActiveSubject] = useState("all")

  const subjects = ["all", "math", "science", "history", "literature", "chemistry", "biology"]

  // Fetch songs from API
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('/api/songs')
        const data = await response.json()
        if (data.success) {
          setSongs(data.data.songs)
        }
      } catch (error) {
        console.error('Failed to fetch songs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSongs()
  }, [])

  const filteredSongs = songs.filter(song => {
    const matchesSearch = !searchQuery || 
      song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = activeSubject === "all" || song.subject.toLowerCase() === activeSubject
    return matchesSearch && matchesSubject
  })

  return (
    <div className="min-h-screen bg-white">
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
              <Link href="/create">
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
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search songs, subjects, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Subject Filters */}
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

        {/* Songs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading songs...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-2 mb-6">
              <Music className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Recently Added</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSongs.map((song) => (
                <Card 
                  key={song.id} 
                  className="border-purple-200 hover:shadow-lg transition-all duration-300 hover:border-purple-300 cursor-pointer"
                  onClick={() => window.location.href = `/songs/${song.id}`}
                >
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
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-purple-600 hover:text-purple-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.location.href = `/songs/${song.id}`
                        }}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {song.stats?.plays || 0} plays
                      </span>
                      <span>{Math.floor(song.lengthSec / 60)}:{(song.lengthSec % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {song.genre}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-purple-600">
                          <Share2 className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-purple-600">
                          <Heart className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredSongs.length === 0 && !loading && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No songs found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or create a new song!</p>
                <Link href="/create">
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                    Create Your First Song
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}