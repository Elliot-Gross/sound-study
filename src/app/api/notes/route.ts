import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createNotesSchema = z.object({
  title: z.string(),
  subject: z.string(),
  content: z.string(),
  topicTags: z.array(z.string()).default([]),
  complexity: z.enum(['SIMPLE', 'INTERMEDIATE', 'ADVANCED']).default('SIMPLE')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createNotesSchema.parse(body)

    // Save notes to database
    const notes = await prisma.notes.create({
      data: {
        userId: 'cmfjsidkq00003e81qm607vuu', // Demo user ID
        subject: validatedData.subject,
        cleanedText: validatedData.content,
        topicTags: validatedData.topicTags,
        complexity: validatedData.complexity
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        notesId: notes.id,
        notes: {
          id: notes.id,
          subject: notes.subject,
          cleanedText: notes.cleanedText,
          topicTags: notes.topicTags,
          complexity: notes.complexity,
          createdAt: notes.createdAt.toISOString()
        }
      }
    })

  } catch (error) {
    console.error('Notes creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create notes' },
      { status: 500 }
    )
  }
}
