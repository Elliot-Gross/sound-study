import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Fetch songs from database
    const songs = await prisma.song.findMany({
      take: 20, // Limit to 20 songs
      orderBy: { createdAt: 'desc' },
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

    const formattedSongs = songs.map(song => ({
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
      }
    }))

    return NextResponse.json({
      success: true,
      data: {
        songs: formattedSongs
      }
    })

  } catch (error) {
    console.error('Songs fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    )
  }
}
