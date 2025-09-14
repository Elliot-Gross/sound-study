import { NextRequest, NextResponse } from 'next/server'
import { sunoAdapter } from '@/services/suno-adapter'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const songId = searchParams.get('songId')
    const sunoId = searchParams.get('sunoId')

    if (!songId || !sunoId) {
      return NextResponse.json({ error: 'Missing songId or sunoId' }, { status: 400 })
    }

    // Get real status from Suno API
    const clipStatus = await sunoAdapter.getClipStatus(sunoId)

    return NextResponse.json({
      success: true,
      data: {
        songId,
        sunoId,
        status: clipStatus.status,
        audioUrl: clipStatus.audio_url,
        progress: clipStatus.status === 'complete' ? 100 : 
                 clipStatus.status === 'streaming' ? 75 : 
                 clipStatus.status === 'queued' ? 25 : 0,
        message: clipStatus.status === 'complete' ? 'Song generated successfully!' :
                clipStatus.status === 'streaming' ? 'Song is streaming!' :
                clipStatus.status === 'queued' ? 'Song is queued for generation' :
                'Song generation in progress...'
      }
    })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}