import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@songstudy.app' },
    update: {},
    create: {
      email: 'demo@songstudy.app',
      name: 'Demo User',
      role: 'USER',
      locale: 'en-US',
      birthYear: 1995,
    },
  })

  // Create user profile
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      interests: ['mathematics', 'science', 'history'],
      preferredGenres: ['pop', 'rap', 'lo-fi'],
      privacyDefaults: {
        defaultVisibility: 'private',
        allowSharing: false,
        emailNotifications: true,
      },
    },
  })

  // Create sample notes
  const mathNotes = await prisma.notes.create({
    data: {
      userId: user.id,
      subject: 'mathematics',
      cleanedText: 'The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides. This is written as a² + b² = c² where c is the hypotenuse.',
      topicTags: ['geometry', 'triangles', 'theorem'],
      complexity: 'INTERMEDIATE',
    },
  })

  const scienceNotes = await prisma.notes.create({
    data: {
      userId: user.id,
      subject: 'science',
      cleanedText: 'Photosynthesis is the process by which plants convert light energy into chemical energy. The equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. This process occurs in the chloroplasts of plant cells.',
      topicTags: ['biology', 'plants', 'energy'],
      complexity: 'INTERMEDIATE',
    },
  })

  // Create sample facts
  await prisma.fact.createMany({
    data: [
      {
        notesId: mathNotes.id,
        text: 'The Pythagorean theorem applies only to right triangles',
        importance: 1,
        entities: ['Pythagorean theorem', 'right triangle'],
        mustInclude: true,
      },
      {
        notesId: mathNotes.id,
        text: 'The formula is a² + b² = c² where c is the hypotenuse',
        importance: 1,
        entities: ['formula', 'hypotenuse'],
        mustInclude: true,
      },
      {
        notesId: scienceNotes.id,
        text: 'Photosynthesis converts light energy to chemical energy',
        importance: 1,
        entities: ['photosynthesis', 'light energy', 'chemical energy'],
        mustInclude: true,
      },
      {
        notesId: scienceNotes.id,
        text: 'The process occurs in chloroplasts',
        importance: 2,
        entities: ['chloroplasts'],
        mustInclude: false,
      },
    ],
  })

  // Create sample songs
  const mathSong = await prisma.song.create({
    data: {
      notesId: mathNotes.id,
      createdBy: user.id,
      provider: 'SUNO',
      styleGenre: 'pop',
      bpm: 120,
      lyricDensity: 'MEDIUM',
      lengthSec: 60,
      mode: 'SONG',
      audioUrl: '/mock-audio/pythagorean-theorem.mp3',
      lyricsUrl: '/mock-lyrics/pythagorean-theorem.txt',
      captionsUrl: '/mock-captions/pythagorean-theorem.lrc',
      isPublic: true,
      visibilityScope: 'PUBLIC',
    },
  })

  const scienceSong = await prisma.song.create({
    data: {
      notesId: scienceNotes.id,
      createdBy: user.id,
      provider: 'SUNO',
      styleGenre: 'rap',
      bpm: 140,
      lyricDensity: 'HIGH',
      lengthSec: 90,
      mode: 'SONG',
      audioUrl: '/mock-audio/photosynthesis.mp3',
      lyricsUrl: '/mock-lyrics/photosynthesis.txt',
      captionsUrl: '/mock-captions/photosynthesis.lrc',
      isPublic: true,
      visibilityScope: 'PUBLIC',
    },
  })

  // Create song stats
  await prisma.songStats.createMany({
    data: [
      {
        songId: mathSong.id,
        plays: 245,
        uniqueListeners: 89,
        completionPct: 78.5,
        dailyReplays: 12,
        likes: 23,
        shares: 8,
        quizLiftDelta: 15.2,
      },
      {
        songId: scienceSong.id,
        plays: 189,
        uniqueListeners: 67,
        completionPct: 82.1,
        dailyReplays: 8,
        likes: 18,
        shares: 5,
        quizLiftDelta: 12.8,
      },
    ],
  })

  // Create sample quizzes
  const mathQuiz = await prisma.quiz.create({
    data: {
      songId: mathSong.id,
      userId: user.id,
      scheduledAt: new Date(),
      deliveredVia: 'WEB',
      completedAt: new Date(),
      scorePct: 85.0,
      confidenceAvg: 0.78,
    },
  })

  const scienceQuiz = await prisma.quiz.create({
    data: {
      songId: scienceSong.id,
      userId: user.id,
      scheduledAt: new Date(),
      deliveredVia: 'WEB',
      completedAt: new Date(),
      scorePct: 92.0,
      confidenceAvg: 0.85,
    },
  })

  // Create quiz items
  await prisma.quizItem.createMany({
    data: [
      {
        quizId: mathQuiz.id,
        type: 'MCQ',
        promptText: 'What is the Pythagorean theorem formula?',
        correctAnswer: 'a² + b² = c²',
        distractors: ['a + b = c', 'a² - b² = c²', 'a × b = c'],
        result: 'CORRECT',
        latencyMs: 2500,
      },
      {
        quizId: mathQuiz.id,
        type: 'RECALL',
        promptText: 'What type of triangle does the Pythagorean theorem apply to?',
        correctAnswer: 'Right triangle',
        distractors: [],
        result: 'CORRECT',
        latencyMs: 1800,
      },
      {
        quizId: scienceQuiz.id,
        type: 'MCQ',
        promptText: 'Where does photosynthesis occur in plant cells?',
        correctAnswer: 'Chloroplasts',
        distractors: ['Mitochondria', 'Nucleus', 'Cell wall'],
        result: 'CORRECT',
        latencyMs: 3200,
      },
      {
        quizId: scienceQuiz.id,
        type: 'CLOZE',
        promptText: 'Photosynthesis converts _____ energy to _____ energy.',
        correctAnswer: 'light, chemical',
        distractors: [],
        result: 'CORRECT',
        latencyMs: 2100,
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Created user: ${user.email}`)
  console.log(`📝 Created ${2} notes with facts`)
  console.log(`🎵 Created ${2} songs with stats`)
  console.log(`🧠 Created ${2} quizzes with items`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
