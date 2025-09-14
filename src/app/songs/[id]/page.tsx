'use client'

import React, { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  SkipBack, 
  SkipForward,
  Music,
  Clock,
  TrendingUp,
  Heart,
  Share2,
  Download,
  Loader2
} from "lucide-react"
import toast from 'react-hot-toast'

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
  lyrics?: string
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

interface SongGeneration {
  songId?: string
  sunoId?: string
  status: 'idle' | 'processing' | 'generating' | 'streaming' | 'complete' | 'failed'
  progress: number
  message: string
  audioUrl?: string
  lyrics?: string
  newsCheck?: {
    mode: 'song' | 'narration'
    reasons: string[]
  }
}

export default function SongDetailPage() {
  const params = useParams()
  const songId = params.id as string
  
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [loopMode, setLoopMode] = useState<'none' | 'song' | 'hook'>('none')
  const [songGeneration, setSongGeneration] = useState<SongGeneration>({
    status: 'idle',
    progress: 0,
    message: ''
  })
  
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (songId) {
      loadSong()
    }
  }, [songId])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      if (loopMode === 'song') {
        audio.currentTime = 0
        audio.play()
        setIsPlaying(true)
      }
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [loopMode])

  const loadSong = async () => {
    try {
      setLoading(true)
      
      // Try to get song from database first
      const response = await fetch(`/api/songs/${songId}`)
      if (response.ok) {
        const data = await response.json()
        setSong(data.song)
        
        // If song is still generating, start polling
        if (data.song && !data.song.audioUrl && data.sunoId) {
          pollForCompletion(data.sunoId)
        }
      } else {
        // If song doesn't exist, show error
        toast.error('Song not found')
      }
    } catch (error) {
      console.error('Error loading song:', error)
      toast.error('Failed to load song')
    } finally {
      setLoading(false)
    }
  }

  const pollForCompletion = async (sunoId: string) => {
    setSongGeneration({
      status: 'streaming',
      progress: 50,
      message: 'Generating music...'
    })

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/songs/status?songId=${songId}&sunoId=${sunoId}`)
        const data = await response.json()
        
        if (data.success) {
          setSongGeneration(prev => ({
            ...prev,
            progress: data.data.status === 'complete' ? 100 : 75,
            message: data.data.status === 'complete' ? 'Complete!' : 'Processing...',
            audioUrl: data.data.audioUrl
          }))

          if (data.data.status === 'complete' && data.data.audioUrl) {
            setSong(prev => prev ? { ...prev, audioUrl: data.data.audioUrl } : null)
            setSongGeneration({
              status: 'complete',
              progress: 100,
              message: 'Song ready!'
            })
            clearInterval(pollInterval)
            toast.success('Song generated successfully!')
          }
        }
      } catch (error) {
        console.error('Polling error:', error)
        setSongGeneration({
          status: 'failed',
          progress: 0,
          message: 'Generation failed'
        })
        clearInterval(pollInterval)
        toast.error('Song generation failed')
      }
    }, 5000) // Poll every 5 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval)
      if (songGeneration.status !== 'complete') {
        setSongGeneration({
          status: 'failed',
          progress: 0,
          message: 'Generation timeout'
        })
      }
    }, 300000)
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading song...</p>
        </div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Song Not Found</h2>
          <p className="text-gray-500 mb-6">The song you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Song Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Music className="w-16 h-16 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{song.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary">{song.subject}</Badge>
                <Badge variant="outline">{song.genre}</Badge>
                <Badge variant="outline">{song.bpm} BPM</Badge>
                <Badge variant="outline">{formatTime(song.lengthSec)}</Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {song.stats?.plays || 0} plays
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {song.stats?.likes || 0} likes
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  {song.stats?.shares || 0} shares
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <Card className="border-purple-200 mb-8">
          <CardContent className="p-6">
            {songGeneration.status !== 'complete' && songGeneration.status !== 'idle' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{songGeneration.message}</span>
                  <span className="text-sm text-gray-600">{songGeneration.progress}%</span>
                </div>
                <Progress value={songGeneration.progress} className="h-2" />
                {songGeneration.audioUrl && (
                  <div className="text-sm text-green-600">
                    🎵 Streaming available - {songGeneration.audioUrl}
                  </div>
                )}
              </div>
            ) : song.audioUrl ? (
              <div className="space-y-6">
                {/* Audio Element */}
                <audio
                  ref={audioRef}
                  src={song.audioUrl}
                  preload="metadata"
                  onLoadStart={() => console.log('Audio loading started')}
                  onCanPlay={() => console.log('Audio can play')}
                  onError={(e) => {
                    console.error('Audio error:', e)
                    toast.error('Failed to load audio')
                  }}
                />

                {/* Progress Bar */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLoopMode(loopMode === 'song' ? 'none' : 'song')}
                    className={loopMode === 'song' ? 'text-purple-600' : ''}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const audio = audioRef.current
                      if (audio) {
                        audio.currentTime = Math.max(0, audio.currentTime - 10)
                      }
                    }}
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>

                  <Button
                    size="lg"
                    onClick={togglePlay}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const audio = audioRef.current
                      if (audio) {
                        audio.currentTime = Math.min(duration, audio.currentTime + 10)
                      }
                    }}
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 max-w-xs mx-auto">
                  <Volume2 className="w-4 h-4 text-gray-600" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Audio Not Available</h3>
                <p className="text-gray-500">This song doesn't have audio yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Song Info */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Lyrics */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-600" />
                Lyrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {songGeneration.lyrics || song?.lyrics ? (
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {songGeneration.lyrics || song?.lyrics}
                </div>
              ) : (
                <p className="text-gray-500">Lyrics will appear here once the song is generated.</p>
              )}
            </CardContent>
          </Card>

          {/* Song Details */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle>Song Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subject:</span>
                <Badge variant="secondary">{song.subject}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Genre:</span>
                <Badge variant="outline">{song.genre}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">BPM:</span>
                <span className="font-medium">{song.bpm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{formatTime(song.lengthSec)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mode:</span>
                <Badge variant={song.mode === 'SONG' ? 'default' : 'secondary'}>
                  {song.mode === 'SONG' ? 'Song' : 'Narration'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {new Date(song.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Button variant="outline">
            <Heart className="w-4 h-4 mr-2" />
            Like
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  )
}
