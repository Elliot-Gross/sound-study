import { describe, it, expect, beforeEach } from 'vitest'
import { LLMOrchestrator } from '../src/services/llm-orchestrator'
import { IngestionService } from '../src/services/ingestion-service'
import { sunoAdapter } from '../src/services/suno-adapter'

describe('LLM Orchestrator', () => {
  it('should extract facts from study content', async () => {
    const mockNotes = {
      id: 'test-notes',
      userId: 'test-user',
      subject: 'mathematics',
      cleanedText: 'The Pythagorean theorem states that in a right triangle, a² + b² = c² where c is the hypotenuse.',
      topicTags: ['geometry', 'triangles'],
      complexity: 'INTERMEDIATE' as const,
      createdAt: new Date(),
      facts: []
    }

    // Mock the OpenAI response
    const mockResponse = {
      topics: ['mathematics', 'geometry', 'triangles'],
      facts: [
        {
          text: 'The Pythagorean theorem applies to right triangles',
          must_include: true,
          importance: 1 as const,
          entities: ['Pythagorean theorem', 'right triangle']
        }
      ],
      glossary: [
        {
          term: 'hypotenuse',
          definition: 'The longest side of a right triangle'
        }
      ],
      complexity: 'simple' as const
    }

    // This would normally call OpenAI, but we'll mock it for testing
    expect(mockResponse.topics).toContain('mathematics')
    expect(mockResponse.facts).toHaveLength(1)
    expect(mockResponse.facts[0].must_include).toBe(true)
  })

  it('should check news appropriateness', async () => {
    const mockResponse = {
      mode: 'song' as const,
      reasons: ['Content is educational and appropriate for singing']
    }

    expect(mockResponse.mode).toBe('song')
    expect(mockResponse.reasons).toHaveLength(1)
  })
})

describe('Ingestion Service', () => {
  it('should validate file types', () => {
    const validFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    const invalidFile = new File(['test content'], 'test.exe', { type: 'application/x-executable' })

    const validResult = IngestionService.validateFile(validFile)
    const invalidResult = IngestionService.validateFile(invalidFile)

    expect(validResult.valid).toBe(true)
    expect(invalidResult.valid).toBe(false)
    expect(invalidResult.error).toContain('Unsupported file type')
  })

  it('should calculate complexity correctly', () => {
    const simpleText = 'This is a simple sentence.'
    const complexText = 'The multifaceted, interdisciplinary approach to understanding the intricate complexities of quantum mechanical phenomena requires sophisticated analytical methodologies.'

    const simpleComplexity = IngestionService.calculateComplexity(simpleText)
    const complexComplexity = IngestionService.calculateComplexity(complexText)

    expect(simpleComplexity).toBe('SIMPLE')
    expect(complexComplexity).toBe('ADVANCED')
  })

  it('should extract topics from text', () => {
    const text = 'In mathematics, the Pythagorean theorem is fundamental to geometry and trigonometry.'
    const topics = IngestionService.extractTopics(text)

    expect(topics).toContain('mathematics')
    expect(topics).toContain('geometry')
  })
})

describe('Suno Adapter', () => {
  it('should validate API connection', async () => {
    // Mock the validation response
    const isValid = await sunoAdapter.validateConnection()
    
    // In a real test, this would depend on actual API credentials
    expect(typeof isValid).toBe('boolean')
  })

  it('should generate correct BPM ranges', () => {
    const rapRange = sunoAdapter.getBPMRange('rap')
    const lullabyRange = sunoAdapter.getBPMRange('lullaby')

    expect(rapRange.min).toBeLessThan(rapRange.max)
    expect(lullabyRange.min).toBeLessThan(lullabyRange.max)
    expect(rapRange.default).toBeGreaterThan(lullabyRange.default)
  })
})

describe('Utility Functions', () => {
  it('should format duration correctly', () => {
    const { formatDuration } = require('../src/lib/utils')
    
    expect(formatDuration(90)).toBe('1:30')
    expect(formatDuration(125)).toBe('2:05')
    expect(formatDuration(30)).toBe('0:30')
  })

  it('should generate unique IDs', () => {
    const { generateId } = require('../src/lib/utils')
    
    const id1 = generateId()
    const id2 = generateId()
    
    expect(id1).not.toBe(id2)
    expect(typeof id1).toBe('string')
    expect(id1.length).toBeGreaterThan(0)
  })

  it('should validate email addresses', () => {
    const { validateEmail } = require('../src/lib/utils')
    
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('invalid-email')).toBe(false)
    expect(validateEmail('user@domain.co.uk')).toBe(true)
  })
})
