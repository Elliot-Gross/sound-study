# SongStudy - Learn Through Music

Transform your study materials into catchy songs that stick in your memory forever. SongStudy uses AI to convert notes, PDFs, and images into memorable educational songs.

## 🚀 Features

- **AI-Powered Song Generation**: Convert study materials into catchy songs using GPT-4 and Suno
- **Multi-Format Support**: Upload text, PDFs, DOCX files, or images with OCR
- **Smart Content Analysis**: Automatic topic extraction and complexity assessment
- **News Sensitivity Gate**: Automatically detects sensitive content and switches to narration mode
- **Interactive Learning**: Quizzes and spaced repetition for better retention
- **Beautiful UI**: Modern, responsive design with smooth animations

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **AI Services**: OpenAI GPT-4, Suno API, Tesseract OCR
- **Authentication**: NextAuth.js with Google/Email providers
- **Storage**: MinIO (S3-compatible) for file storage
- **Queue**: BullMQ with Redis for background jobs
- **Search**: OpenSearch for content discovery

## 📋 Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Redis server
- MinIO (S3-compatible storage)
- OpenAI API key
- Suno HackMIT API token

## 🚀 Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd songstudy
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys and database URLs in `.env.local`:
   ```env
   # OpenAI
   OPENAI_API_KEY=sk-proj-your-key-here
   
   # Suno HackMIT
   SUNO_HACKMIT_TOKEN=your-suno-token-here
   
   # Database
   DATABASE_URL=postgres://user:password@localhost:5432/songstudy
   REDIS_URL=redis://localhost:6379
   
   # Storage
   OBJECT_STORE_BUCKET=songstudy
   OBJECT_STORE_PUBLIC_BASE_URL=http://localhost:9000
   ```

3. **Start development services**
   ```bash
   # Start PostgreSQL, Redis, MinIO, and OpenSearch
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Set up database**
   ```bash
   pnpm db:push
   pnpm db:seed
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 app router
│   ├── api/               # API routes
│   ├── discover/          # Discover page
│   ├── create/            # Create song page
│   ├── my-songs/          # User's songs
│   ├── quizzes/           # Quiz interface
│   └── dashboard/         # Analytics dashboard
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── layout.tsx       # Main layout
├── lib/                  # Utilities and configurations
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Database client
│   └── utils.ts         # Helper functions
├── services/            # Business logic services
│   ├── llm-orchestrator.ts  # GPT-4 integration
│   ├── suno-adapter.ts     # Suno API integration
│   └── ingestion-service.ts # File processing & OCR
└── types/               # TypeScript type definitions
```

## 🔧 Development Scripts

```bash
# Development
pnpm dev                 # Start development server
pnpm build              # Build for production
pnpm start              # Start production server

# Database
pnpm db:generate        # Generate Prisma client
pnpm db:push           # Push schema changes
pnpm db:migrate        # Run migrations
pnpm db:seed           # Seed database

# Testing
pnpm test              # Run unit tests
pnpm test:e2e          # Run E2E tests
pnpm test:coverage     # Run tests with coverage

# Code Quality
pnpm lint              # Run ESLint
pnpm type-check        # Run TypeScript checks
```

## 🎵 How It Works

### 1. Content Ingestion
- Upload files (PDF, DOCX, images) or paste text
- OCR extracts text from images and PDFs
- AI analyzes content for topics and complexity

### 2. Song Generation
- GPT-4 extracts key facts and creates lyrics
- News sensitivity gate checks for appropriate content
- Suno API generates music with the lyrics
- Fallback to instrumental + TTS for sensitive content

### 3. Learning Experience
- Interactive player with captions
- Spaced repetition quizzes
- Progress tracking and analytics
- Personalized recommendations

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | Yes |
| `SUNO_HACKMIT_TOKEN` | Suno HackMIT API token | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `OBJECT_STORE_BUCKET` | MinIO bucket name | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test -- --grep "LLM Orchestrator"
pnpm test -- --grep "Suno Adapter"

# Run E2E tests
pnpm test:e2e

# Run with coverage
pnpm test:coverage
```

## 🚀 Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t songstudy .

# Run with docker-compose
docker-compose up -d
```

### Environment Setup
1. Set up production database (PostgreSQL)
2. Configure Redis instance
3. Set up MinIO or S3-compatible storage
4. Configure environment variables
5. Run database migrations
6. Deploy application

## 📊 Monitoring

The application includes:
- OpenTelemetry tracing
- Prometheus metrics
- Error tracking
- Performance monitoring
- Cost estimation for AI services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- 📧 Email: support@songstudy.app
- 💬 Discord: [Join our community](https://discord.gg/songstudy)
- 📖 Documentation: [docs.songstudy.app](https://docs.songstudy.app)
- 🐛 Issues: [GitHub Issues](https://github.com/songstudy/issues)

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Suno for music generation API
- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- All contributors and users

---

Made with ❤️ by the SongStudy team