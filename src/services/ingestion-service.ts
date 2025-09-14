import { createWorker } from 'tesseract.js'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import sharp from 'sharp'
import type { ProcessedFile, UploadFile } from '@/types'

export class IngestionService {
  private static worker: Tesseract.Worker | null = null

  /**
   * Initialize OCR worker
   */
  private static async initWorker(): Promise<Tesseract.Worker> {
    if (!this.worker) {
      this.worker = await createWorker('eng')
    }
    return this.worker
  }

  /**
   * Process uploaded file and extract text
   */
  static async processFile(file: UploadFile): Promise<ProcessedFile> {
    const fileId = this.generateFileId()
    
    try {
      let extractedText = ''
      let ocrConfidence = 0
      let topicTags: string[] = []
      let complexity: 'SIMPLE' | 'INTERMEDIATE' | 'ADVANCED' = 'SIMPLE'

      switch (file.type) {
        case 'text':
          extractedText = await this.processTextFile(file.file)
          break
        case 'pdf':
          const pdfResult = await this.processPdfFile(file.file)
          extractedText = pdfResult.text
          ocrConfidence = pdfResult.confidence
          break
        case 'docx':
          extractedText = await this.processDocxFile(file.file)
          break
        case 'image':
          const imageResult = await this.processImageFile(file.file)
          extractedText = imageResult.text
          ocrConfidence = imageResult.confidence
          break
        default:
          throw new Error(`Unsupported file type: ${file.type}`)
      }

      // Analyze extracted text
      topicTags = this.extractTopics(extractedText)
      complexity = this.calculateComplexity(extractedText)

      return {
        id: fileId,
        fileName: file.file.name,
        fileType: file.type,
        fileSize: file.file.size,
        extractedText,
        topicTags,
        complexity,
        ocrConfidence,
        createdAt: new Date()
      }
    } catch (error) {
      console.error('Error processing file:', error)
      throw new Error(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Process plain text file
   */
  private static async processTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        resolve(text)
      }
      reader.onerror = () => reject(new Error('Failed to read text file'))
      reader.readAsText(file)
    })
  }

  /**
   * Process PDF file with OCR fallback
   */
  private static async processPdfFile(file: File): Promise<{ text: string; confidence: number }> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfData = await pdfParse(Buffer.from(arrayBuffer))
      
      // If PDF has text layer, use it
      if (pdfData.text && pdfData.text.trim().length > 50) {
        return {
          text: pdfData.text,
          confidence: 1.0
        }
      }
      
      // Otherwise, convert to images and use OCR
      console.log('PDF has no text layer, using OCR...')
      return await this.processPdfWithOCR(arrayBuffer)
    } catch (error) {
      console.error('Error processing PDF:', error)
      throw new Error('Failed to process PDF file')
    }
  }

  /**
   * Process PDF with OCR (placeholder - would need pdf2pic or similar)
   */
  private static async processPdfWithOCR(arrayBuffer: ArrayBuffer): Promise<{ text: string; confidence: number }> {
    // This is a simplified implementation
    // In production, you'd use pdf2pic to convert PDF pages to images
    // then run OCR on each image
    throw new Error('PDF OCR not implemented - please use PDFs with text layer')
  }

  /**
   * Process DOCX file
   */
  private static async processDocxFile(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) })
      return result.value
    } catch (error) {
      console.error('Error processing DOCX:', error)
      throw new Error('Failed to process DOCX file')
    }
  }

  /**
   * Process image file with OCR
   */
  private static async processImageFile(file: File): Promise<{ text: string; confidence: number }> {
    try {
      const worker = await this.initWorker()
      
      // Convert image to buffer and optimize for OCR
      const arrayBuffer = await file.arrayBuffer()
      const imageBuffer = await sharp(Buffer.from(arrayBuffer))
        .grayscale()
        .normalize()
        .sharpen()
        .png()
        .toBuffer()

      // Perform OCR
      const { data: { text, confidence } } = await worker.recognize(imageBuffer)
      
      return {
        text: text.trim(),
        confidence: confidence / 100 // Convert to 0-1 scale
      }
    } catch (error) {
      console.error('Error processing image with OCR:', error)
      throw new Error('Failed to process image file')
    }
  }

  /**
   * Extract topics from text
   */
  private static extractTopics(text: string): string[] {
    const commonSubjects = [
      'mathematics', 'math', 'algebra', 'geometry', 'calculus', 'statistics',
      'science', 'biology', 'chemistry', 'physics', 'anatomy', 'physiology',
      'history', 'world war', 'civil war', 'revolution', 'ancient', 'medieval',
      'literature', 'english', 'poetry', 'novel', 'drama', 'shakespeare',
      'geography', 'economics', 'psychology', 'sociology', 'philosophy',
      'computer science', 'programming', 'technology', 'engineering'
    ]
    
    const topics: string[] = []
    const lowerText = text.toLowerCase()
    
    commonSubjects.forEach(subject => {
      if (lowerText.includes(subject)) {
        topics.push(subject)
      }
    })
    
    // Extract additional topics from common patterns
    const patterns = [
      /chapter \d+: (.+)/gi,
      /section \d+: (.+)/gi,
      /unit \d+: (.+)/gi,
      /lesson \d+: (.+)/gi
    ]
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach(match => {
          const topic = match.replace(/^(chapter|section|unit|lesson) \d+: /i, '').trim()
          if (topic.length > 3 && topic.length < 50) {
            topics.push(topic.toLowerCase())
          }
        })
      }
    })
    
    return [...new Set(topics)].slice(0, 10) // Limit to 10 topics
  }

  /**
   * Calculate content complexity
   */
  private static calculateComplexity(text: string): 'SIMPLE' | 'INTERMEDIATE' | 'ADVANCED' {
    const wordCount = text.split(/\s+/).length
    const sentenceCount = text.split(/[.!?]+/).length
    const avgWordsPerSentence = wordCount / sentenceCount
    
    // Count complex words (3+ syllables)
    const complexWords = text.split(/\s+/).filter(word => this.countSyllables(word) >= 3)
    const complexityRatio = complexWords.length / wordCount
    
    // Simple scoring system
    let score = 0
    
    if (avgWordsPerSentence > 15) score += 2
    else if (avgWordsPerSentence > 10) score += 1
    
    if (complexityRatio > 0.3) score += 2
    else if (complexityRatio > 0.15) score += 1
    
    if (wordCount > 1000) score += 1
    else if (wordCount > 500) score += 0.5
    
    if (score >= 4) return 'ADVANCED'
    if (score >= 2) return 'INTERMEDIATE'
    return 'SIMPLE'
  }

  /**
   * Count syllables in a word (approximate)
   */
  private static countSyllables(word: string): number {
    word = word.toLowerCase()
    if (word.length <= 3) return 1
    
    const vowels = 'aeiouy'
    let count = 0
    let previousWasVowel = false
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i])
      if (isVowel && !previousWasVowel) {
        count++
      }
      previousWasVowel = isVowel
    }
    
    // Handle silent 'e'
    if (word.endsWith('e') && count > 1) {
      count--
    }
    
    return Math.max(1, count)
  }

  /**
   * Generate unique file ID
   */
  private static generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substring(2)}`
  }

  /**
   * Validate file type and size
   */
  static validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' }
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Unsupported file type. Please upload text, PDF, DOCX, or image files.' }
    }
    
    return { valid: true }
  }

  /**
   * Clean up OCR worker
   */
  static async cleanup(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate()
      this.worker = null
    }
  }
}
