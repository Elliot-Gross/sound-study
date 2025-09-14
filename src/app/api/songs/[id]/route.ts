import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const songId = params.id

    // Fetch song from database
    const song = await prisma.song.findUnique({
      where: { id: songId },
      include: {
        notes: true,
        creator: {
          select: {
            name: true,
            email: true
          }
        },
        stats: true
      }
    })

    if (!song) {
      return NextResponse.json(
        { error: 'Song not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        song: {
          id: song.id,
          title: song.notes.subject,
          subject: song.notes.subject,
          genre: song.styleGenre,
          bpm: song.bpm,
          lengthSec: song.lengthSec,
          audioUrl: song.audioUrl,
          lyricsUrl: song.lyricsUrl,
          captionsUrl: song.captionsUrl,
          mode: song.mode,
          createdAt: song.createdAt.toISOString(),
          stats: song.stats ? {
            plays: song.stats.plays,
            likes: song.stats.likes,
            shares: song.stats.shares
          } : {
            plays: 0,
            likes: 0,
            shares: 0
          },
          creator: {
            name: song.creator.name || 'Unknown',
            email: song.creator.email
          },
          lyrics: song.notes.cleanedText // For now, use notes content as lyrics
        }
      }
    })

  } catch (error) {
    console.error('Song fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch song' },
      { status: 500 }
    )
  }
}