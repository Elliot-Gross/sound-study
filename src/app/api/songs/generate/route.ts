
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sunoAdapter } from '@/services/suno-adapter'
import { LLMOrchestrator } from '@/services/llm-orchestrator'
import { prisma } from '@/lib/prisma'

const generateSongSchema = z.object({
  notesId: z.string(),
  title: z.string(),
  lengthCategory: z.enum(['short', 'medium', 'long']),
  genre: z.string(),
  bpm: z.number().min(60).max(200),
  lyricDensity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  complexity: z.enum(['SIMPLE', 'INTERMEDIATE', 'ADVANCED']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = generateSongSchema.parse(body)

    // Fetch real notes from database
    const notes = await prisma.notes.findUnique({
      where: { id: validatedData.notesId },
      include: {
        facts: true
      }
    })

    if (!notes) {
      return NextResponse.json(
        { error: 'Notes not found' },
        { status: 404 }
      )
    }

    // Step 1: News Gate Check
    console.log('Checking news gate...')
    const newsCheck = await LLMOrchestrator.checkNewsGate(notes)
    
    if (newsCheck.mode === 'narration') {
      return NextResponse.json({
        success: false,
        error: 'Content is not suitable for song generation',
        newsCheck
      })
    }

    // Step 2: Fact Extraction
    console.log('Extracting facts...')
    const factExtraction = await LLMOrchestrator.extractFacts(notes)

    // Step 3: Lyric Planning
    console.log('Planning lyrics...')
    const lyricPlan = await LLMOrchestrator.planLyrics(
      factExtraction.facts,
      {
        lengthCategory: validatedData.lengthCategory,
        genre: validatedData.genre,
        bpm: validatedData.bpm,
        lyricDensity: validatedData.lyricDensity,
        complexity: validatedData.complexity
      }
    )

    // Step 4: Generate Suno Prompt
    const sunoPrompt = LLMOrchestrator.createSunoPrompt(
      notes,
      factExtraction,
      lyricPlan,
      {
        genre: validatedData.genre,
        bpm: validatedData.bpm,
        mode: 'song'
      }
    )

    // Step 5: Generate Song with Suno
    console.log('Generating song with Suno...')
    const sunoResponse = await sunoAdapter.generateSong({
      prompt: sunoPrompt,
      tags: `${validatedData.genre}, educational, clear vocals, ${validatedData.bpm} BPM`,
      negative_tags: 'unclear vocals, aggressive',
      make_instrumental: false
    })

    console.log('Song generation started:', sunoResponse.id)

    // Step 6: Save song to database
    console.log('Saving song to database...')
    const songLengthSec = validatedData.lengthCategory === 'short' ? 30 : 
                          validatedData.lengthCategory === 'medium' ? 60 : 120
    
    // Update notes with AI-generated lyrics
    await prisma.notes.update({
      where: { id: validatedData.notesId },
      data: {
        cleanedText: lyricPlan.lyrics
      }
    })
    
    const savedSong = await prisma.song.create({
      data: {
        notesId: validatedData.notesId,
        createdBy: 'cmfjsidkq00003e81qm607vuu', // Demo user ID
        provider: 'SUNO',
        styleGenre: validatedData.genre,
        bpm: validatedData.bpm,
        lyricDensity: validatedData.lyricDensity,
        lengthSec: songLengthSec,
        mode: 'SONG',
        audioUrl: sunoResponse.audio_url,
        lyricsUrl: null, // Will be updated when lyrics are processed
        captionsUrl: null,
        isPublic: false,
        visibilityScope: 'PRIVATE'
      }
    })

    // Create initial song stats
    await prisma.songStats.create({
      data: {
        songId: savedSong.id,
        plays: 0,
        uniqueListeners: 0,
        completionPct: 0.0,
        dailyReplays: 0,
        likes: 0,
        shares: 0,
        quizLiftDelta: 0.0
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        songId: savedSong.id,
        sunoId: sunoResponse.id,
        status: sunoResponse.status,
        message: 'Song generation started successfully!',
        newsCheck,
        lyrics: lyricPlan.lyrics,
        facts: factExtraction.facts,
        audioUrl: sunoResponse.audio_url
      }
    })

  } catch (error) {
    console.error('Song generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to generate song' },
      { status: 500 }
    )
  }
}