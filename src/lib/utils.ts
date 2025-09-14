import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function isValidFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = getFileExtension(filename)
  return allowedTypes.includes(extension)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function calculateComplexity(text: string): 'SIMPLE' | 'INTERMEDIATE' | 'ADVANCED' {
  const wordCount = text.split(/\s+/).length
  const sentenceCount = text.split(/[.!?]+/).length
  const avgWordsPerSentence = wordCount / sentenceCount
  
  if (avgWordsPerSentence < 10 && wordCount < 200) return 'SIMPLE'
  if (avgWordsPerSentence < 20 && wordCount < 500) return 'INTERMEDIATE'
  return 'ADVANCED'
}

export function extractTopics(text: string): string[] {
  // Simple topic extraction - in production, this would use NLP
  const commonSubjects = [
    'mathematics', 'math', 'algebra', 'geometry', 'calculus',
    'science', 'biology', 'chemistry', 'physics', 'anatomy',
    'history', 'world war', 'civil war', 'revolution',
    'literature', 'english', 'poetry', 'novel', 'drama',
    'geography', 'economics', 'psychology', 'sociology'
  ]
  
  const topics: string[] = []
  const lowerText = text.toLowerCase()
  
  commonSubjects.forEach(subject => {
    if (lowerText.includes(subject)) {
      topics.push(subject)
    }
  })
  
  return [...new Set(topics)]
}

export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4)
}

export function getBPMRange(genre: string): { min: number; max: number; default: number } {
  const ranges: Record<string, { min: number; max: number; default: number }> = {
    'rap': { min: 80, max: 140, default: 120 },
    'pop': { min: 100, max: 130, default: 120 },
    'lullaby': { min: 60, max: 80, default: 70 },
    'lo-fi': { min: 70, max: 100, default: 85 },
    'rock': { min: 120, max: 160, default: 140 },
    'country': { min: 80, max: 120, default: 100 },
    'electronic': { min: 120, max: 140, default: 130 }
  }
  
  return ranges[genre] || ranges['pop']
}

export function getLengthSeconds(lengthCategory: string): number {
  const lengths: Record<string, number> = {
    'short': 30,
    'medium': 60,
    'long': 120
  }
  
  return lengths[lengthCategory] || 60
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

export function createPageUrl(pageName: string): string {
  return `/${pageName.replace(/\s+/g, '')}`
}
