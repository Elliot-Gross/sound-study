import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Upload, FileText, Sparkles, Music, Settings, ArrowRight, Loader2 } from "lucide-react";

export default function Create() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [songOptions, setSongOptions] = useState({
    genre: "pop",
    bpm: 120,
    length_category: "medium",
    lyric_density: "medium",
    complexity: "simple"
  });

  const steps = [
    { number: 1, title: "Add Content", icon: FileText },
    { number: 2, title: "Customize Song", icon: Settings },
    { number: 3, title: "Generate & Preview", icon: Music }
  ];

  const handleContentSubmit = () => {
    if (title && subject && content) {
      setStep(2);
    }
  };

  const handleOptionsSubmit = () => {
    setStep(3);
  };

  const generateSong = async () => {
    setIsGenerating(true);
    // Simulate generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    alert("Song generated successfully! (This is a demo)");
  };

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
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Song Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., The Pythagorean Theorem Song"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Study Content</Label>
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
                  disabled={!title || !subject || !content}
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
                    <option value="rock">Rock</option>
                    <option value="hip-hop">Hip-Hop</option>
                    <option value="country">Country</option>
                    <option value="electronic">Electronic</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bpm">BPM (Beats Per Minute)</Label>
                  <Input
                    id="bpm"
                    type="number"
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
                        variant={songOptions.length_category === length ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSongOptions({...songOptions, length_category: length})}
                      >
                        {length}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Lyric Density</Label>
                  <div className="flex gap-2">
                    {["low", "medium", "high"].map((density) => (
                      <Button
                        key={density}
                        variant={songOptions.lyric_density === density ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSongOptions({...songOptions, lyric_density: density})}
                      >
                        {density}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Complexity</Label>
                  <div className="flex gap-2">
                    {["simple", "intermediate", "advanced"].map((complexity) => (
                      <Button
                        key={complexity}
                        variant={songOptions.complexity === complexity ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSongOptions({...songOptions, complexity: complexity})}
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
                          <Badge variant="secondary">{songOptions.length_category} length</Badge>
                          <Badge variant="secondary">{songOptions.lyric_density} density</Badge>
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
              </div>
          )}
      </div>
    </div>
  );
}