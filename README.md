# Booksy Backend - Social Reading Platform

A complete backend system for a social reading platform built with NestJS, PostgreSQL, and MinIO.

## 🚀 Features

- **User Management**: Create and manage user profiles
- **Book Management**: Upload, store, and manage books
- **Social Posts**: Create and read posts about books
- **Reading Groups**: Join groups and set reading goals
- **File Storage**: MinIO integration for book and avatar uploads
- **API Documentation**: Complete Swagger documentation
- **Data Validation**: Comprehensive DTO validation

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js (v18+)
- npm

## 🐳 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo>
cd booksy-backend
```

### 2. Environment Configuration

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/booksy?schema=public"

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Application
PORT=3000
NODE_ENV=development
```

### 3. Start the System

```bash
# Start infrastructure
docker-compose up -d

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev

# Start application
npm run start:dev
```

### 4. Access Services

- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)

## 📚 API Documentation

### Data Transfer Objects (DTOs)

All endpoints use validated DTOs for type safety and input validation.

#### User DTOs

**CreateUserDto**

```typescript
{
  username: string;        // 3-30 characters
  email: string;          // Valid email format
  bio?: string;           // Optional, max 500 chars
  image?: string;         // Optional URL
  profileImage?: string;  // Optional URL
}
```

**UpdateUserDto**

```typescript
{
  username?: string;      // 3-30 characters
  bio?: string;          // Max 500 chars
  image?: string;        // URL
  profileImage?: string; // URL
}
```

#### Book DTOs

**CreateBookDto**

```typescript
{
  title: string; // 1-255 characters
  author: string; // 1-255 characters
  fileUrl: string; // MinIO file URL
  uploaderId: string; // User ID
}
```

#### Post DTOs

**CreatePostDto**

```typescript
{
  content: string;       // 1-1000 characters
  bookId?: string;       // Optional book reference
  authorId: string;      // User ID
}
```

**UpdatePostDto**

```typescript
{
  content: string; // 1-1000 characters
}
```

#### Group DTOs

**CreateGroupDto**

```typescript
{
  name: string;          // 1-100 characters
  description?: string;  // Optional, max 500 chars
  adminId: string;       // User ID
}
```

**UpdateGroupDto**

```typescript
{
  name?: string;         // 1-100 characters
  description?: string;  // Max 500 chars
}
```

**JoinGroupDto / LeaveGroupDto**

```typescript
{
  userId: string; // User ID
}
```

**SetReadingGoalDto**

```typescript
{
  bookId: string; // Book ID
  dailyPages: number; // 1-1000 pages
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}
```

#### Upload DTOs

**UploadBookDto**

```typescript
{
  title?: string;        // 1-255 characters
  author?: string;       // 1-255 characters
  userId?: string;       // User ID
}
```

**UploadAvatarDto**

```typescript
{
  userId: string; // User ID
}
```

**GetFilesDto**

```typescript
{
  bucket?: string;       // 'books' | 'avatars' | 'temp'
  userId?: string;       // User ID
}
```

**GetFileUrlDto**

```typescript
{
  expiry?: number;       // 1-168 hours (default: 24)
}
```

### API Endpoints

#### Users

- `GET /api/users` - List all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/username/:username` - Get user by username
- `PUT /api/users/profile/:id` - Update user profile
- `GET /api/users/:id/books` - Get user's books
- `GET /api/users/:id/posts` - Get user's posts
- `GET /api/users/:id/summaries` - Get user's summaries

#### Books

- `GET /api/books` - List all books
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Create a new book
- `GET /api/books/user/:userId` - Get books by uploader

#### Posts

- `GET /api/posts` - List all posts
- `GET /api/posts/:id` - Get post details
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/book/:bookId` - Get posts by book
- `GET /api/posts/author/:authorId` - Get posts by author

#### Groups

- `GET /api/groups` - List all groups
- `GET /api/groups/:id` - Get group details
- `POST /api/groups` - Create a new group
- `PUT /api/groups/:id` - Update group
- `POST /api/groups/:id/join` - Join group
- `POST /api/groups/:id/leave` - Leave group
- `POST /api/groups/:id/reading-goal` - Set reading goal
- `GET /api/groups/user/:userId` - Get user's groups

#### File Uploads

- `POST /api/upload/book` - Upload book file
- `POST /api/upload/avatar` - Upload avatar image
- `POST /api/upload/temp` - Upload temporary file
- `GET /api/upload/files` - List user files
- `GET /api/upload/url/:bucket/:fileName` - Get file URL
- `DELETE /api/upload/:bucket/:fileName` - Delete file
- `POST /api/upload/cleanup` - Cleanup temp files

## 🧪 Testing Examples

### Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "bio": "Book lover and avid reader"
  }'
```

### Upload a Book

```bash
curl -X POST http://localhost:3000/api/upload/book \
  -F "file=@/path/to/book.pdf" \
  -F "title=The Great Gatsby" \
  -F "author=F. Scott Fitzgerald" \
  -F "userId=USER_ID_FROM_STEP_1"
```

### Create a Book Record

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "fileUrl": "FILE_URL_FROM_STEP_2",
    "uploaderId": "USER_ID_FROM_STEP_1"
  }'
```

### Create a Post

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is an amazing book! Highly recommended.",
    "bookId": "BOOK_ID_FROM_STEP_3",
    "authorId": "USER_ID_FROM_STEP_1"
  }'
```

### Create a Group

```bash
curl -X POST http://localhost:3000/api/groups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Classic Literature Club",
    "description": "A group for discussing classic literature",
    "adminId": "USER_ID_FROM_STEP_1"
  }'
```

## 📁 Project Structure

```
booksy-backend/
├── src/
│   ├── app.module.ts          # Root module
│   ├── main.ts               # Bootstrap
│   ├── books/                # Book management
│   │   ├── dto/              # Book DTOs
│   │   ├── books.controller.ts
│   │   ├── books.service.ts
│   │   └── books.module.ts
│   ├── users/                # User management
│   │   ├── dto/              # User DTOs
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── posts/                # Social posts
│   │   ├── dto/              # Post DTOs
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts
│   │   └── posts.module.ts
│   ├── groups/               # Reading groups
│   │   ├── dto/              # Group DTOs
│   │   ├── groups.controller.ts
│   │   ├── groups.service.ts
│   │   └── groups.module.ts
│   ├── upload/               # File uploads
│   │   ├── dto/              # Upload DTOs
│   │   ├── upload.controller.ts
│   │   ├── upload.service.ts
│   │   └── upload.module.ts
│   └── prisma/               # Database configuration
├── prisma/
│   └── schema.prisma         # Database schema
├── docker-compose.yml        # Infrastructure setup
└── package.json
```

## 🔧 Database Schema

### Core Models

- **User**: User profiles and information
- **Book**: Book metadata and file storage
- **Post**: Social posts about books
- **Group**: Reading groups
- **GroupMember**: Group membership
- **ReadingGoal**: Reading goals for groups
- **ReadingProgress**: User reading progress
- **Summary**: Book summaries
- **Comment**: Inline book comments
- **SharedBook**: Book sharing

## 🚀 Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode
npm run start:debug        # Start with debugger

# Building
npm run build              # Build the application
npm run start:prod         # Start in production mode

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run tests with coverage

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

### Database Management

```bash
# View database in browser
npx prisma studio

# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name <migration_name>

# Generate Prisma client
npx prisma generate
```

## 🔒 Security & Validation

### Input Validation

- All endpoints use class-validator decorators
- Comprehensive DTO validation
- File type and size restrictions
- SQL injection protection via Prisma

### File Upload Security

- File type validation (PDF, EPUB, TXT for books; JPEG, PNG, GIF, WebP for avatars)
- File size limits (50MB for books, 5MB for avatars, 10MB for temp files)
- Secure file storage in MinIO
- Presigned URLs for secure access

### Current State (No Auth)

- All endpoints are public
- No authentication required
- Suitable for development/testing

## 🎯 Future Enhancements

1. **Authentication**: Add JWT-based authentication
2. **Real-time Features**: WebSocket for chat and notifications
3. **AI Integration**: Gemini for summaries and moderation
4. **Search**: Full-text search capabilities
5. **Analytics**: Reading statistics and insights
6. **Rate Limiting**: API rate limiting
7. **CORS**: Cross-origin resource sharing configuration

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   ```bash
   docker-compose ps
   docker-compose restart postgres
   ```

2. **MinIO Connection Failed**

   ```bash
   docker-compose logs minio
   docker-compose restart minio
   ```

3. **Validation Errors**

   - Check DTO requirements
   - Verify input data format
   - Check file type and size limits

4. **API Not Responding**
   ```bash
   npm run start:dev
   docker-compose ps
   ```

## 📊 Monitoring

### Health Checks

- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api
- **Database**: Check with Prisma Studio
- **MinIO**: Check console at http://localhost:9001

### Logs

```bash
# Application logs
npm run start:dev

# Docker logs
docker-compose logs -f

# Specific service logs
docker-compose logs postgres
docker-compose logs minio
```

---

The Booksy backend is now ready for development and testing! 🚀

All endpoints are public and ready to use with comprehensive validation and documentation.
