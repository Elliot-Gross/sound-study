'use client'

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, Play, CheckCircle, Clock, Target, Award } from "lucide-react"

// Mock data
const mockQuizzes = [
  {
    id: 1,
    title: "Pythagorean Theorem Quiz",
    subject: "math",
    questions: 10,
    completed: 8,
    score: 85,
    status: "completed",
    created_date: "2024-01-15"
  },
  {
    id: 2,
    title: "Photosynthesis Knowledge Check",
    subject: "science",
    questions: 12,
    completed: 0,
    score: null,
    status: "available",
    created_date: "2024-01-12"
  },
  {
    id: 3,
    title: "World War II Timeline Quiz",
    subject: "history",
    questions: 15,
    completed: 15,
    score: 92,
    status: "completed",
    created_date: "2024-01-10"
  },
  {
    id: 4,
    title: "Shakespeare's Sonnets Quiz",
    subject: "literature",
    questions: 8,
    completed: 5,
    score: 62,
    status: "in_progress",
    created_date: "2024-01-08"
  }
]

export default function QuizzesPage() {
  const [quizzes] = useState(mockQuizzes)

  const completedQuizzes = quizzes.filter(q => q.status === 'completed')
  const averageScore = completedQuizzes.length > 0 
    ? Math.round(completedQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / completedQuizzes.length)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
              <p className="text-gray-600">Test your knowledge and track your progress</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{quizzes.length}</div>
              <div className="text-sm text-gray-600">Total Quizzes</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{completedQuizzes.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{averageScore}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {quizzes.filter(q => q.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Quizzes List */}
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{quiz.title}</h3>
                      <Badge 
                        variant={quiz.status === 'completed' ? 'default' : 'secondary'}
                        className={
                          quiz.status === 'completed' ? 'bg-green-100 text-green-800' :
                          quiz.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {quiz.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>{quiz.questions} questions</span>
                      <Badge variant="outline" className="text-xs">
                        {quiz.subject}
                      </Badge>
                      {quiz.score && (
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {quiz.score}% score
                        </span>
                      )}
                    </div>
                    {quiz.status === 'in_progress' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{quiz.completed}/{quiz.questions}</span>
                        </div>
                        <Progress value={(quiz.completed / quiz.questions) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      className={
                        quiz.status === 'completed' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                      }
                    >
                      {quiz.status === 'completed' ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Review
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          {quiz.status === 'in_progress' ? 'Continue' : 'Start'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievement Section */}
        <Card className="border-purple-200 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-green-800">Quiz Master</h4>
                <p className="text-sm text-green-600">Completed 3+ quizzes</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-800">High Achiever</h4>
                <p className="text-sm text-blue-600">Average score above 80%</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-purple-800">Consistent Learner</h4>
                <p className="text-sm text-purple-600">Daily quiz streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
