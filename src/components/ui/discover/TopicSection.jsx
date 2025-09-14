import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Beaker, Calculator, Globe2, Dna, Zap, Scroll, MessageSquare } from "lucide-react";
import SongCard from "./SongCard";

const subjectConfig = {
  math: { icon: Calculator, color: "from-blue-500 to-cyan-500", name: "Mathematics" },
  science: { icon: Beaker, color: "from-green-500 to-emerald-500", name: "Science" },
  history: { icon: Scroll, color: "from-amber-500 to-orange-500", name: "History" },
  literature: { icon: BookOpen, color: "from-purple-500 to-pink-500", name: "Literature" },
  chemistry: { icon: Beaker, color: "from-red-500 to-orange-500", name: "Chemistry" },
  biology: { icon: Dna, color: "from-green-600 to-teal-500", name: "Biology" },
  physics: { icon: Zap, color: "from-yellow-500 to-orange-500", name: "Physics" },
  geography: { icon: Globe2, color: "from-blue-600 to-indigo-500", name: "Geography" },
  language: { icon: MessageSquare, color: "from-indigo-500 to-purple-500", name: "Language" },
  other: { icon: BookOpen, color: "from-gray-500 to-gray-600", name: "Other" }
};

export default function TopicSection({ songs }) {
  const subjects = [...new Set(songs.map(song => song.subject))];

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Subject</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {subjects.map((subject) => {
            const config = subjectConfig[subject] || subjectConfig.other;
            const songCount = songs.filter(song => song.subject === subject).length;
            
            return (
              <Card key={subject} className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-purple-100">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <config.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{config.name}</h3>
                  <p className="text-sm text-gray-500">{songCount} songs</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {subjects.map((subject) => {
        const subjectSongs = songs.filter(song => song.subject === subject).slice(0, 4);
        const config = subjectConfig[subject] || subjectConfig.other;
        
        if (subjectSongs.length === 0) return null;
        
        return (
          <div key={subject}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center`}>
                  <config.icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{config.name}</h3>
                <Badge variant="outline" className="ml-2">
                  {songs.filter(song => song.subject === subject).length} songs
                </Badge>
              </div>
              <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjectSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}