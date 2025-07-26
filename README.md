# Booksy Backend

A social reading platform backend built with NestJS, Prisma, and BetterAuth.

## 🚀 Features

- **Authentication**: OAuth 2.0 with Google, GitHub, and email/password
- **Book Management**: Upload, read, and share books
- **Social Features**: Posts, comments, and group discussions
- **Reading Goals**: Track reading progress and set daily goals
- **AI Integration**: Gemini-powered summaries and moderation
- **Real-time Chat**: Group and direct messaging
- **Public Access**: Anonymous users can view public books and posts

## 🛠 Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: BetterAuth (OAuth 2.0, JWT)
- **File Storage**: MinIO (planned)
- **AI**: Google Gemini (planned)
- **Notifications**: Firebase/WebPush (planned)

## 📁 Project Structure

```
src/
├── auth/                 # BetterAuth integration
│   ├── auth.config.ts   # Auth configuration
│   ├── auth.module.ts   # Auth module
│   ├── auth.service.ts  # Auth business logic
│   ├── auth.controller.ts # Auth endpoints
│   └── decorators/      # Custom decorators
├── books/               # Books module
├── prisma/              # Database configuration
└── app.module.ts        # Root module
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/booksy?schema=public"

# BetterAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# Application
PORT=3000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 4. Start Development Server

```bash
npm run start:dev
```

## 🔐 Authentication

The application uses BetterAuth for authentication with the following providers:

- **Google OAuth**: Sign in with Google account
- **GitHub OAuth**: Sign in with GitHub account
- **Credentials**: Email/password authentication

### Protected Routes

Use the `@UseGuards(AuthGuard)` decorator to protect routes:

```typescript
@Get('profile')
@UseGuards(AuthGuard)
async getProfile(@Session() session: UserSession) {
  return { user: session.user };
}
```

### Public Routes

Use the `@Public()` decorator to allow anonymous access:

```typescript
@Get('books')
@Public()
async getAllBooks() {
  return { books: await this.booksService.findAll() };
}
```

## 📚 API Endpoints

### Authentication

- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/session` - Get current session

### Books

- `GET /api/books` - List all books (public)
- `GET /api/books/:id` - Get book details (public)
- `POST /api/books` - Upload a new book (authenticated)
- `GET /api/books/my-books` - Get user's uploaded books (authenticated)

## 🏗 Architecture

### Modules

1. **Auth Module**: Handles authentication and user sessions
2. **Books Module**: Manages book uploads, reading, and sharing
3. **Posts Module**: Social posts about books (planned)
4. **Groups Module**: Reading groups and discussions (planned)
5. **Chat Module**: Real-time messaging (planned)
6. **Summaries Module**: AI-powered book summaries (planned)
7. **Comments Module**: Inline book commenting (planned)
8. **Reading Module**: Progress tracking and goals (planned)
9. **Notifications Module**: Push notifications (planned)
10. **LLM Module**: Gemini AI integration (planned)

### Database Schema

The application uses Prisma with PostgreSQL and includes models for:

- **User**: User profiles and authentication
- **Book**: Book metadata and file storage
- **Post**: Social posts about books
- **Group**: Reading groups
- **ChatMessage**: Real-time messaging
- **ReadingGoal**: Reading progress tracking
- **Summary**: AI-generated book summaries
- **Comment**: Inline book comments
- **Account/Session**: BetterAuth authentication

## 🔧 Development

### Available Scripts

```bash
# Development
npm run start:dev    # Start with hot reload
npm run start:debug  # Start with debug mode

# Build
npm run build        # Build for production
npm run start:prod   # Start production server

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## 🚀 Deployment

### Environment Variables

Ensure all required environment variables are set in production:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- OAuth provider credentials (Google, GitHub)

### Docker Support

The project includes Docker configuration for easy deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📝 Contributing

1. Follow the TypeScript guidelines in `.cursorrules`
2. Use conventional commit messages
3. Write tests for new features
4. Update documentation as needed

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [NestJS Documentation](https://docs.nestjs.com/)
- [BetterAuth Documentation](https://www.better-auth.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
