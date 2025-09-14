import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { IngestionService } from '@/services/ingestion-service'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const uploadSchema = z.object({
  fileName: z.string(),
  fileType: z.enum(['text', 'pdf', 'docx', 'image']),
  fileSize: z.number(),
  content: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const subject = formData.get('subject') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 })
    }

    // Validate file
    const validation = IngestionService.validateFile(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Process file
    const processedFile = await IngestionService.processFile({
      file,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type === 'application/pdf' ? 'pdf' :
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'docx' : 'text'
    })

    // Save to database
    const notes = await prisma.notes.create({
      data: {
        userId: session.user.id,
        subject,
        rawRef: `uploads/${session.user.id}/${processedFile.id}`,
        cleanedText: processedFile.extractedText,
        topicTags: processedFile.topicTags,
        complexity: processedFile.complexity,
      },
      include: {
        facts: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        notesId: notes.id,
        processedFile: {
          id: processedFile.id,
          fileName: processedFile.fileName,
          fileType: processedFile.fileType,
          extractedText: processedFile.extractedText,
          topicTags: processedFile.topicTags,
          complexity: processedFile.complexity,
          ocrConfidence: processedFile.ocrConfidence,
        }
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}
