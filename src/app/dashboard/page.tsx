'use client'

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, Brain, Music, Calendar, Star, Clock, Target, 
  Zap, Award, BookOpen, Headphones, BarChart3 
} from "lucide-react"

// Mock data
const mockStats = {
  totalSongs: 5,
  completedQuizzes: 8,
  averageScore: 87,
  totalPlays: 156,
  currentStreak: 7,
  totalStudyTime: 12
}

const mockStudyProgress = [
  { quiz: 1, score: 75, date: "1/10" },
  { quiz: 2, score: 82, date: "1/11" },
  { quiz: 3, score: 90, date: "1/12" },
  { quiz: 4, score: 85, date: "1/13" },
  { quiz: 5, score: 88, date: "1/14" },
  { quiz: 6, score: 92, date: "1/15" },
  { quiz: 7, score: 89, date: "1/16" },
  { quiz: 8, score: 94, date: "1/17" }
]

const mockSubjectDistribution = [
  { subject: "Math", count: 2 },
  { subject: "Science", count: 2 },
  { subject: "History", count: 1 },
  { subject: "Literature", count: 1 }
]

export default function DashboardPage() {
  const [stats] = useState(mockStats)
  const [studyProgress] = useState(mockStudyProgress)
  const [subjectDistribution] = useState(mockSubjectDistribution)

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B']

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning Dashboard</h1>
              <p className="text-gray-600">Track your progress and optimize your learning</p>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Music className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSongs}</p>
              <p className="text-xs text-gray-600">Songs Created</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedQuizzes}</p>
              <p className="text-xs text-gray-600">Quizzes Taken</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              <p className="text-xs text-gray-600">Avg Score</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPlays}</p>
              <p className="text-xs text-gray-600">Total Plays</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
              <p className="text-xs text-gray-600">Day Streak</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudyTime}</p>
              <p className="text-xs text-gray-600">Hours Studied</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Chart */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studyProgress.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-semibold text-purple-600">
                      {item.quiz}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Quiz {item.quiz}</span>
                        <span>{item.score}%</span>
                      </div>
                      <Progress value={item.score} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject Distribution */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Subject Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{item.subject}</span>
                        <span>{item.count} songs</span>
                      </div>
                      <Progress 
                        value={(item.count / Math.max(...subjectDistribution.map(s => s.count))) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Great Progress!</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Your average score of {stats.averageScore}% shows excellent retention. Keep up the great work!
                </p>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">Study Tip</Badge>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Streak Champion</h4>
                <p className="text-sm text-green-700 mb-3">
                  You're on a {stats.currentStreak}-day learning streak! Daily practice is key to long-term retention.
                </p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Achievement</Badge>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Expand Your Library</h4>
                <p className="text-sm text-blue-700 mb-3">
                  You've created {stats.totalSongs} songs. Try exploring new subjects to diversify your learning!
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Create New Song
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
