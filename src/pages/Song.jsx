import React, { useState, useEffect, useRef } from "react";
import { Song, Quiz, SongStats, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Heart, Share2, Download, RotateCcw, Clock, Volume2, Type, Users, TrendingUp, Calendar, Mic, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SongPage() {
  const [song, setSong] = useState(null);
  const [songStats, setSongStats] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [volume, setVolume] = useState([0.8]);
  const [isKaraokeMode, setIsKaraokeMode] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [similarSongs, setSimilarSongs] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedLine, setHighlightedLine] = useState(0);

  const urlParams = new URLSearchParams(window.location.search);
  const songId = urlParams.get('id');

  useEffect(() => {
    const loadSongData = async () => {
      setIsLoading(true);
      try {
        const [songData, userAuth, allSongs] = await Promise.all([
          Song.list().then(songs => songs.find(s => s.id === songId)),
          User.me().catch(() => null),
          Song.list("-created_date", 20)
        ]);

        if (songData) {
          setSong(songData);
          setDuration(songData.length_sec || 60);
          
          // Load or create song stats
          let stats = await SongStats.list().then(stats => stats.find(s => s.song_id === songId));
          if (!stats) {
            stats = await SongStats.create({ song_id: songId });
          }
          setSongStats(stats);

          // Find similar songs (same subject)
          const similar = allSongs.filter(s => s.id !== songId && s.subject === songData.subject).slice(0, 6);
          setSimilarSongs(similar);

          setUser(userAuth);
        }
      } catch (error) {
        console.error("Error loading song data:", error);
      }
      setIsLoading(false);
    };

    if (songId) {
      loadSongData();
    }
  }, [songId]);

  // Simulate audio playback
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  // Karaoke highlighting
  useEffect(() => {
    if (isKaraokeMode && song?.lyrics) {
      const lines = song.lyrics.split('\n').filter(line => line.trim());
      const lineTime = duration / lines.length;
      const currentLine = Math.floor(currentTime / lineTime);
      setHighlightedLine(Math.min(currentLine, lines.length - 1));
    }
  }, [currentTime, isKaraokeMode, song?.lyrics, duration]);

  const handlePlay = async () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying && songStats) {
      // Increment play count
      const updatedStats = await SongStats.update(songStats.id, {
        ...songStats,
        plays: (songStats.plays || 0) + 1
      });
      setSongStats(updatedStats);
    }
  };

  const handleLike = async () => {
    setIsLiked(!isLiked);
    
    if (songStats) {
      await SongStats.update(songStats.id, {
        ...songStats,
        likes: (songStats.likes || 0) + (isLiked ? -1 : 1)
      });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: song.title,
        text: `Check out this study song: ${song.title}`,
        url: url
      });
    } else {
      await navigator.clipboard.writeText(url);
    }

    if (songStats) {
      await SongStats.update(songStats.id, {
        ...songStats,
        shares: (songStats.shares || 0) + 1
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value) => {
    setCurrentTime(value[0]);
  };

  const copyLyrics = () => {
    if (song?.lyrics) {
      navigator.clipboard.writeText(song.lyrics);
    }
  };

  if (isLoading || !song) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Loading song...</p>
        </div>
      </div>
    );
  }

  const genreColors = {
    rap: "from-red-500 to-orange-500",
    pop: "from-pink-500 to-purple-500", 
    lullaby: "from-blue-400 to-indigo-500",
    "lo-fi": "from-green-400 to-teal-500",
    acoustic: "from-yellow-500 to-orange-500",
    electronic: "from-purple-500 to-indigo-600"
  };

  const gradientClass = genreColors[song.style_genre] || "from-purple-500 to-indigo-500";
  const lines = song.lyrics ? song.lyrics.split('\n').filter(line => line.trim()) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className={`relative rounded-3xl bg-gradient-to-r ${gradientClass} p-8 mb-8 text-white overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-white/20 text-white border-white/20">
                    {song.mode === "narration" ? "Narration Mode" : "Song"}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/20 capitalize">
                    {song.subject}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{song.title}</h1>
                <div className="flex items-center gap-6 text-white/80 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(song.length_sec || 60)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Volume2 className="w-4 h-4" />
                    {song.bpm} BPM
                  </div>
                  <div className="flex items-center gap-1">
                    <Type className="w-4 h-4" />
                    {song.lyric_density} density
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {songStats?.plays || 0} plays
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <div className="flex-shrink-0">
                <Button
                  size="lg"
                  onClick={handlePlay}
                  className="w-20 h-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 rounded-full"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* News Alert for Narration Mode */}
        {song.mode === "narration" && (
          <Alert className="mb-8 border-orange-200 bg-orange-50">
            <AlertDescription className="text-orange-800">
              <strong>Sensitive Topic:</strong> This content is delivered as a spoken summary with background music instead of a song.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Audio Player */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardContent className="p-6">
                {/* Waveform Visualization */}
                <div className="h-20 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-lg mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-end gap-1 opacity-60">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 bg-purple-600 transition-all duration-200 ${
                            i < (currentTime / duration) * 50 ? 'opacity-100' : 'opacity-30'
                          }`}
                          style={{ height: `${Math.random() * 60 + 20}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Playhead */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg transition-all duration-200"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <Slider
                    value={[currentTime]}
                    onValueChange={handleSeek}
                    max={duration}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                      className="w-10 h-10"
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>

                    <Button
                      size="icon"
                      onClick={handlePlay}
                      className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                      className="w-10 h-10"
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant={isKaraokeMode ? "default" : "outline"}
                      onClick={() => setIsKaraokeMode(!isKaraokeMode)}
                      className="w-10 h-10"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      className="w-10 h-10"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lyrics Display */}
            <Card className="border-purple-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {isKaraokeMode ? "Karaoke Mode" : "Lyrics"}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {isKaraokeMode && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        <Mic className="w-3 h-3 mr-1" />
                        Follow along
                      </Badge>
                    )}
                    <Button size="icon" variant="outline" onClick={copyLyrics}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`space-y-2 ${isKaraokeMode ? 'text-lg' : 'text-base'}`}>
                  {lines.map((line, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        isKaraokeMode && index === highlightedLine
                          ? 'bg-gradient-to-r from-purple-100 to-indigo-100 border-l-4 border-purple-500 text-purple-900 font-semibold'
                          : isKaraokeMode && index < highlightedLine
                          ? 'text-gray-500'
                          : 'text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                </div>

                {isKaraokeMode && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 text-sm text-purple-700">
                      <Mic className="w-4 h-4" />
                      <span>Karaoke mode is active. Sing along as the lyrics highlight!</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Song Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleLike}
                className={isLiked ? "border-red-500 text-red-500" : ""}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Liked" : "Like"}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Remix
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Song Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Song Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Genre</p>
                  <p className="font-medium capitalize">{song.style_genre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{new Date(song.created_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Complexity</p>
                  <p className="font-medium capitalize">{song.complexity || "Medium"}</p>
                </div>
                {songStats && (
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Plays</p>
                        <p className="font-bold text-lg">{songStats.plays || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Likes</p>
                        <p className="font-bold text-lg">{songStats.likes || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Similar Songs */}
            {similarSongs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Songs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {similarSongs.slice(0, 4).map((similarSong) => (
                      <div key={similarSong.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{similarSong.title}</p>
                          <p className="text-xs text-gray-500 truncate capitalize">{similarSong.style_genre}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}