'use client'

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Sparkles, Music, Settings, ArrowRight, Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import toast from 'react-hot-toast'

interface ProcessedFile {
  id: string
  fileName: string
  fileType: string
  extractedText: string
  topicTags: string[]
  complexity: 'SIMPLE' | 'INTERMEDIATE' | 'ADVANCED'
  ocrConfidence?: number
}

interface SongGeneration {
  songId?: string
  sunoId?: string
  status: 'idle' | 'uploading' | 'processing' | 'generating' | 'streaming' | 'complete' | 'failed'
  progress: number
  message: string
  audioUrl?: string
  lyrics?: string
  newsCheck?: {
    mode: 'song' | 'narration'
    reasons: string[]
  }
}

export default function CreatePage() {
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [uploadedFile, setUploadedFile] = useState<ProcessedFile | null>(null)
  const [songGeneration, setSongGeneration] = useState<SongGeneration>({
    status: 'idle',
    progress: 0,
    message: ''
  })
  const [songOptions, setSongOptions] = useState({
    genre: "pop",
    bpm: 120,
    lengthCategory: "medium" as 'short' | 'medium' | 'long',
    lyricDensity: "MEDIUM" as 'LOW' | 'MEDIUM' | 'HIGH',
    complexity: "SIMPLE" as 'SIMPLE' | 'INTERMEDIATE' | 'ADVANCED'
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    { number: 1, title: "Add Content", icon: FileText },
    { number: 2, title: "Customize Song", icon: Settings },
    { number: 3, title: "Generate & Preview", icon: Music }
  ]

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setSongGeneration({
      status: 'uploading',
      progress: 0,
      message: 'Uploading file...'
    })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('subject', subject || 'General')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      // Use the DB notesId as the uploadedFile.id so generateSong sends a real notesId
      setUploadedFile({ ...result.data.processedFile, id: result.data.notesId })
      setContent(result.data.processedFile.extractedText)
      
      setSongGeneration({
        status: 'complete',
        progress: 100,
        message: 'File processed successfully!'
      })

      toast.success('File uploaded and processed successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      setSongGeneration({
        status: 'failed',
        progress: 0,
        message: 'Upload failed. Please try again.'
      })
      toast.error('Failed to upload file')
    }
  }

  const handleContentSubmit = () => {
    if (title && subject && (content || uploadedFile)) {
      setStep(2)
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const handleOptionsSubmit = () => {
    setStep(3)
  }

  const generateSong = async () => {
    setIsGenerating(true)
    setSongGeneration({
      status: 'processing',
      progress: 10,
      message: 'Analyzing content...'
    })

    try {
      // First, we need to create notes if we don't have them
      let notesId = uploadedFile?.id
      
      if (!notesId) {
        // Create notes from pasted content
        const notesResponse = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            subject,
            content,
            topicTags: [],
            complexity: 'SIMPLE'
          })
        })
        
        if (!notesResponse.ok) {
          const errorData = await notesResponse.json()
          throw new Error(errorData.error || 'Failed to create notes')
        }
        
        const notesData = await notesResponse.json()
        if (!notesData.success || !notesData.data?.notesId) {
          throw new Error('Invalid response from notes API')
        }
        notesId = notesData.data.notesId
      }

      // Validate that we have a notesId
      if (!notesId) {
        throw new Error('No notes ID available for song generation')
      }

      setSongGeneration({
        status: 'generating',
        progress: 30,
        message: 'Generating song...'
      })

      // Generate the song
      const response = await fetch('/api/songs/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notesId: String(notesId),
          title,
          lengthCategory: songOptions.lengthCategory,
          genre: songOptions.genre,
          bpm: songOptions.bpm,
          lyricDensity: songOptions.lyricDensity,
          complexity: songOptions.complexity,
        }),
        credentials: 'include', // <-- add this
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Song generation failed')
      }

      setSongGeneration({
        status: 'streaming',
        progress: 60,
        message: 'Music generation in progress...',
        songId: result.data.songId,
        sunoId: result.data.sunoId,
        audioUrl: result.data.audioUrl,
        lyrics: result.data.lyrics,
        newsCheck: result.data.newsCheck
      })

      // Start polling for completion
      if (result.data.sunoId) {
        pollForCompletion(result.data.songId, result.data.sunoId)
      } else {
        setSongGeneration({
          status: 'complete',
          progress: 100,
          message: 'Song generated successfully!',
          songId: result.data.songId,
          lyrics: result.data.lyrics,
          newsCheck: result.data.newsCheck
        })
        toast.success('Song generated successfully!')
      }

    } catch (error) {
      console.error('Generation error:', error)
      setSongGeneration({
        status: 'failed',
        progress: 0,
        message: 'Failed to generate song. Please try again.'
      })
      toast.error('Failed to generate song')
    }
    setIsGenerating(false)
  }

  const pollForCompletion = async (songId: string, sunoId: string) => {
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

          if (data.data.status === 'complete') {
            setSongGeneration(prev => ({
              ...prev,
              status: 'complete',
              progress: 100,
              message: 'Song ready!'
            }))
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
    }, 5000)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Learning
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Your Notes Into 
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Memorable Songs
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your study material and let our AI create catchy songs that make learning stick
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {steps.map((stepInfo, index) => (
              <div key={stepInfo.number} className="flex items-center">
                <div className={`flex items-center gap-3 ${
                  step >= stepInfo.number ? "text-purple-600" : "text-gray-400"
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step >= stepInfo.number 
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg" 
                      : "bg-gray-200 text-gray-500"
                  }`}>
                    {step > stepInfo.number ? "✓" : <stepInfo.icon className="w-5 h-5" />}
                  </div>
                  <span className="font-medium">{stepInfo.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className={`w-5 h-5 mx-4 ${
                    step > stepInfo.number ? "text-purple-600" : "text-gray-400"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* News Alert */}
        {songGeneration.newsCheck?.mode === 'narration' && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-800 mb-1">Sensitive Topic Detected</h4>
                  <p className="text-sm text-orange-700">
                    This content will be delivered as a spoken summary with background music instead of a song.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step Content */}
        {step === 1 && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Add Your Study Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div className="space-y-4">
                <Label>Upload File (Optional)</Label>
                <div 
                  className="border-2 border-dashed border-purple-200 rounded-lg p-8 text-center hover:border-purple-300 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    PDF, DOCX, images, or text files (max 10MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                  />
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
                
                {uploadedFile && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">File Processed Successfully</span>
                    </div>
                    <p className="text-sm text-green-700">
                      {uploadedFile.fileName} • {uploadedFile.fileType} • {uploadedFile.complexity} complexity
                    </p>
                    {uploadedFile.topicTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {uploadedFile.topicTags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Song Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., The Pythagorean Theorem Song"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Study Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Paste your notes, textbook content, or study material here..."
                  className="min-h-[200px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleContentSubmit}
                  disabled={!title || !subject || (!content && !uploadedFile)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Continue to Song Options
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Customize Your Song
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="genre">Music Genre</Label>
                  <select
                    id="genre"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={songOptions.genre}
                    onChange={(e) => setSongOptions({...songOptions, genre: e.target.value})}
                  >
                    <option value="pop">Pop</option>
                    <option value="rap">Rap</option>
                    <option value="rock">Rock</option>
                    <option value="lullaby">Lullaby</option>
                    <option value="lo-fi">Lo-Fi</option>
                    <option value="country">Country</option>
                    <option value="electronic">Electronic</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bpm">BPM (Beats Per Minute)</Label>
                  <Input
                    id="bpm"
                    type="number"
                    min="60"
                    max="200"
                    value={songOptions.bpm}
                    onChange={(e) => setSongOptions({...songOptions, bpm: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Length</Label>
                  <div className="flex gap-2">
                    {["short", "medium", "long"].map((length) => (
                      <Button
                        key={length}
                        variant={songOptions.lengthCategory === length ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSongOptions({...songOptions, lengthCategory: length as any})}
                      >
                        {length}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Lyric Density</Label>
                  <div className="flex gap-2">
                    {["LOW", "MEDIUM", "HIGH"].map((density) => (
                      <Button
                        key={density}
                        variant={songOptions.lyricDensity === density ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSongOptions({...songOptions, lyricDensity: density as any})}
                      >
                        {density}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Complexity</Label>
                  <div className="flex gap-2">
                    {["SIMPLE", "INTERMEDIATE", "ADVANCED"].map((complexity) => (
                      <Button
                        key={complexity}
                        variant={songOptions.complexity === complexity ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSongOptions({...songOptions, complexity: complexity as any})}
                      >
                        {complexity}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleOptionsSubmit}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Continue to Generation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back to Content
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <div className="space-y-8">
            {/* Summary Card */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-600" />
                  Ready to Generate Your Song
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Content</h4>
                    <p className="text-sm text-gray-600 mb-1"><strong>Title:</strong> {title}</p>
                    <p className="text-sm text-gray-600 mb-1"><strong>Subject:</strong> {subject}</p>
                    <p className="text-sm text-gray-600"><strong>Length:</strong> {content.length} characters</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Song Style</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{songOptions.genre}</Badge>
                      <Badge variant="secondary">{songOptions.bpm} BPM</Badge>
                      <Badge variant="secondary">{songOptions.lengthCategory} length</Badge>
                      <Badge variant="secondary">{songOptions.lyricDensity} density</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button 
                    onClick={generateSong}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Song
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setStep(2)} disabled={isGenerating}>
                    Edit Options
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generation Progress */}
            {songGeneration.status !== 'idle' && (
              <Card className="border-purple-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{songGeneration.message}</span>
                      <span className="text-sm text-gray-600">{songGeneration.progress}%</span>
                    </div>
                    <Progress value={songGeneration.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Song Preview */}
            {songGeneration.status === 'complete' && songGeneration.lyrics && (
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-purple-600" />
                    Generated Song
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {songGeneration.audioUrl && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <audio controls className="w-full">
                        <source src={songGeneration.audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold mb-2">Lyrics Preview:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line text-sm">
                      {songGeneration.lyrics}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    {songGeneration.songId && (
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        onClick={() => window.location.href = `/songs/${songGeneration.songId}`}
                      >
                        View Song
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => {
                      setStep(1)
                      setSongGeneration({ status: 'idle', progress: 0, message: '' })
                      setTitle('')
                      setSubject('')
                      setContent('')
                      setUploadedFile(null)
                    }}>
                      Generate Another
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
