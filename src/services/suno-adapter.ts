import axios from 'axios'
import type { SunoGenerateRequest, SunoGenerateResponse, SunoClipResponse } from '@/types'

export class SunoAdapter {
  private baseUrl: string
  private token: string

  constructor() {
    this.baseUrl = process.env.SUNO_API_BASE || 'https://studio-api.prod.suno.com/api/v2/external/hackmit/'
    this.token = process.env.SUNO_HACKMIT_TOKEN || 'c17a70babe4f419299a45a5957088ad0'
    
    if (!this.token) {
      throw new Error('SUNO_HACKMIT_TOKEN is required')
    }
  }

  /**
   * Generate a new song clip
   */
  async generateSong(request: SunoGenerateRequest): Promise<SunoGenerateResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}generate`,
        {
          topic: request.topic,
          prompt: request.prompt,
          tags: request.tags,
          negative_tags: request.negative_tags,
          make_instrumental: request.make_instrumental || false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      )

      return {
        id: response.data.id,
        status: response.data.status || 'queued',
        audio_url: response.data.audio_url,
        metadata: response.data.metadata
      }
    } catch (error) {
      console.error('Error generating song:', error)
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.')
        }
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw new Error('Invalid Suno API credentials')
        }
        if (error.response?.status >= 500) {
          throw new Error('Suno service temporarily unavailable')
        }
      }
      
      throw new Error('Failed to generate song')
    }
  }

  /**
   * Check the status of a song generation
   */
  async getClipStatus(clipId: string): Promise<SunoClipResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}clips?ids=${clipId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          },
          timeout: 10000
        }
      )

      const clips = response.data
      if (!Array.isArray(clips) || clips.length === 0) {
        throw new Error('Clip not found')
      }
      
      const clip = clips[0]

      return {
        id: clip.id,
        status: clip.status,
        audio_url: clip.audio_url,
        metadata: {
          duration: clip.metadata?.duration,
          error_message: clip.metadata?.error_message
        }
      }
    } catch (error) {
      console.error('Error getting clip status:', error)
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Clip not found')
        }
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw new Error('Invalid Suno API credentials')
        }
      }
      
      throw new Error('Failed to get clip status')
    }
  }

  /**
   * Poll for clip completion with streaming support
   */
  async pollForCompletion(
    clipId: string, 
    onStatusUpdate?: (status: string, audioUrl?: string) => void,
    maxAttempts: number = 60
  ): Promise<SunoClipResponse> {
    let attempts = 0
    
    while (attempts < maxAttempts) {
      try {
        const clip = await this.getClipStatus(clipId)
        
        // Notify about status updates
        if (onStatusUpdate) {
          onStatusUpdate(clip.status, clip.audio_url)
        }
        
        // Return if complete or failed
        if (clip.status === 'complete' || clip.status === 'failed') {
          return clip
        }
        
        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, 5000)) // 5 seconds
        attempts++
        
      } catch (error) {
        console.error(`Polling attempt ${attempts + 1} failed:`, error)
        attempts++
        
        if (attempts >= maxAttempts) {
          throw new Error('Max polling attempts reached')
        }
        
        // Wait longer on error
        await new Promise(resolve => setTimeout(resolve, 10000)) // 10 seconds
      }
    }
    
    throw new Error('Polling timeout reached')
  }

  /**
   * Generate instrumental track for narration
   */
  async generateInstrumental(
    genre: string,
    bpm: number,
    duration: number = 90
  ): Promise<SunoGenerateResponse> {
    const prompt = `Create a calm, instrumental background track for educational content.
Genre: ${genre}
BPM: ${bpm}
Duration: ${duration} seconds
Style: Calm, neutral, non-distracting, suitable for narration
Make it instrumental only - no vocals.`

    return this.generateSong({
      prompt,
      tags: `${genre}, instrumental, calm, educational, background`,
      negative_tags: 'vocals, singing, loud, aggressive',
      make_instrumental: true
    })
  }

  /**
   * Generate educational song with lyrics
   */
  async generateEducationalSong(
    lyrics: string,
    genre: string,
    bpm: number,
    subject: string
  ): Promise<SunoGenerateResponse> {
    const prompt = `Create an educational song with these lyrics:

${lyrics}

Style: ${genre} at ${bpm} BPM
Subject: ${subject}
Make it catchy, educational, and memorable. Ensure lyrics are clearly audible.`

    return this.generateSong({
      prompt,
      tags: `${genre}, educational, catchy, clear vocals, ${subject}`,
      negative_tags: 'unclear vocals, too fast, aggressive'
    })
  }

  /**
   * Download audio file from URL
   */
  async downloadAudio(audioUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
        timeout: 60000 // 1 minute timeout
      })
      
      return Buffer.from(response.data)
    } catch (error) {
      console.error('Error downloading audio:', error)
      throw new Error('Failed to download audio file')
    }
  }

  /**
   * Validate API connection
   */
  async validateConnection(): Promise<boolean> {
    try {
      // Try to get clips with an invalid ID to test auth
      await this.getClipStatus('test-connection')
      return true
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // 404 is expected for invalid ID, but means auth works
        if (error.response?.status === 404) {
          return true
        }
        // 401/403 means auth failed
        if (error.response?.status === 401 || error.response?.status === 403) {
          return false
        }
      }
      return false
    }
  }
}

// Export singleton instance
export const sunoAdapter = new SunoAdapter()
