import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Play, Edit, Trash2, Music, Calendar, TrendingUp } from "lucide-react";

// Mock data
const mockUserSongs = [
  {
    id: 1,
    title: "The Pythagorean Theorem Song",
    subject: "math",
    created_date: "2024-01-15",
    plays: 45,
    status: "complete"
  },
  {
    id: 2,
    title: "Photosynthesis Rap",
    subject: "science",
    created_date: "2024-01-12",
    plays: 32,
    status: "complete"
  },
  {
    id: 3,
    title: "World War II Timeline",
    subject: "history",
    created_date: "2024-01-10",
    plays: 28,
    status: "generating"
  },
  {
    id: 4,
    title: "Shakespeare's Sonnets",
    subject: "literature",
    created_date: "2024-01-08",
    plays: 19,
    status: "complete"
  }
];

export default function MySongs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs] = useState(mockUserSongs);

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Songs</h1>
              <p className="text-gray-600">Manage and organize your created songs</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search your songs..."
              className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{songs.length}</div>
              <div className="text-sm text-gray-600">Total Songs</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {songs.filter(s => s.status === 'complete').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {songs.reduce((sum, song) => sum + song.plays, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Plays</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {songs.filter(s => s.status === 'generating').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Songs List */}
        <div className="space-y-4">
          {filteredSongs.map((song) => (
            <Card key={song.id} className="border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{song.title}</h3>
                      <Badge 
                        variant={song.status === 'complete' ? 'default' : 'secondary'}
                        className={
                          song.status === 'complete' ? 'bg-green-100 text-green-800' :
                          song.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {song.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(song.created_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {song.plays} plays
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {song.subject}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-700">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSongs.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No songs found</h3>
            <p className="text-gray-500 mb-6">Create your first song to get started!</p>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Create Song
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}