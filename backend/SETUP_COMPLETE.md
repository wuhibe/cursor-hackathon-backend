# Booksy Backend - Complete Setup Guide (No Auth)

## 🚀 **Overview**

Booksy is a social reading platform backend with the following features:

- **Book Management**: Upload, read, and share books
- **Social Posts**: Create and read posts about books
- **Reading Groups**: Join groups and set reading goals
- **File Storage**: MinIO integration for book and avatar uploads
- **User Profiles**: Manage user profiles and content

## 📋 **Prerequisites**

1. **Docker** and **Docker Compose**
2. **Node.js** (v18+) and **npm**
3. **Git**

## 🐳 **Quick Start with Docker**

### 1. **Clone and Setup**

```bash
git clone <your-repo>
cd booksy-backend
```

### 2. **Environment Configuration**

Create a `.env` file in the root directory:

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

# Redis (for future features)
REDIS_URL=redis://localhost:6379
```

### 3. **Start Infrastructure**

```bash
# Start PostgreSQL, MinIO, and Redis
docker-compose up -d

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start the application
npm run start:dev
```

### 4. **Access Services**

- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)
- **PostgreSQL**: localhost:5432

## 📚 **API Endpoints**

### **Users**

- `GET /api/users` - List all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/username/:username` - Get user by username
- `PUT /api/users/profile/:id` - Update user profile
- `GET /api/users/:id/books` - Get user's books
- `GET /api/users/:id/posts` - Get user's posts
- `GET /api/users/:id/summaries` - Get user's summaries

### **Books**

- `GET /api/books` - List all books
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Create a new book
- `GET /api/books/user/:userId` - Get books by uploader

### **Posts**

- `GET /api/posts` - List all posts
- `GET /api/posts/:id` - Get post details
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/book/:bookId` - Get posts by book
- `GET /api/posts/author/:authorId` - Get posts by author

### **Groups**

- `GET /api/groups` - List all groups
- `GET /api/groups/:id` - Get group details
- `POST /api/groups` - Create a new group
- `PUT /api/groups/:id` - Update group
- `POST /api/groups/:id/join` - Join group
- `POST /api/groups/:id/leave` - Leave group
- `POST /api/groups/:id/reading-goal` - Set reading goal
- `GET /api/groups/user/:userId` - Get user's groups

### **File Uploads**

- `POST /api/upload/book` - Upload book file
- `POST /api/upload/avatar` - Upload avatar image
- `POST /api/upload/temp` - Upload temporary file
- `GET /api/upload/files` - List user files
- `GET /api/upload/url/:bucket/:fileName` - Get file URL
- `DELETE /api/upload/:bucket/:fileName` - Delete file
- `POST /api/upload/cleanup` - Cleanup temp files

## 🧪 **Testing the API**

### **1. Create a User**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "bio": "Book lover and avid reader"
  }'
```

### **2. Upload a Book**

```bash
curl -X POST http://localhost:3000/api/upload/book \
  -F "file=@/path/to/book.pdf" \
  -F "title=The Great Gatsby" \
  -F "author=F. Scott Fitzgerald" \
  -F "userId=USER_ID_FROM_STEP_1"
```

### **3. Create a Book Record**

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

### **4. Create a Post**

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is an amazing book! Highly recommended.",
    "bookId": "BOOK_ID_FROM_STEP_3",
    "authorId": "USER_ID_FROM_STEP_1"
  }'
```

### **5. Create a Group**

```bash
curl -X POST http://localhost:3000/api/groups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Classic Literature Club",
    "description": "A group for discussing classic literature",
    "adminId": "USER_ID_FROM_STEP_1"
  }'
```

## 📁 **Project Structure**

```
booksy-backend/
├── src/
│   ├── app.module.ts          # Root module
│   ├── main.ts               # Bootstrap
│   ├── books/                # Book management
│   ├── users/                # User management
│   ├── posts/                # Social posts
│   ├── groups/               # Reading groups
│   ├── upload/               # File uploads (MinIO)
│   └── prisma/               # Database configuration
├── prisma/
│   └── schema.prisma         # Database schema
├── docker-compose.yml        # Infrastructure setup
└── package.json
```

## 🔧 **Database Schema**

### **Core Models**

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

## 🚀 **Development Workflow**

### **1. Start Development Environment**

```bash
# Start all services
docker-compose up -d

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev

# Start development server
npm run start:dev
```

### **2. Database Management**

```bash
# View database in browser
npx prisma studio

# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name <migration_name>
```

### **3. MinIO Management**

- **Console**: http://localhost:9001
- **Credentials**: minioadmin/minioadmin
- **Buckets**: books, avatars, temp

## 📈 **Production Deployment**

### **1. Environment Variables**

```env
# Production Database
DATABASE_URL="postgresql://user:password@host:5432/booksy"

# Production MinIO
MINIO_ENDPOINT=your-minio-server.com
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your-secure-key
MINIO_SECRET_KEY=your-secure-secret

# Application
PORT=3000
NODE_ENV=production
```

### **2. Docker Deployment**

```bash
# Build production image
docker build -t booksy-backend .

# Run with production environment
docker run -p 3000:3000 --env-file .env.production booksy-backend
```

## 🔒 **Security Considerations**

### **Current State (No Auth)**

- All endpoints are public
- No authentication required
- Suitable for development/testing

### **Future Enhancements**

- Add JWT authentication
- Implement role-based access
- Add rate limiting
- Enable CORS configuration

## 🎯 **Next Steps**

### **Immediate**

1. **Test all endpoints** using the provided examples
2. **Verify MinIO integration** by uploading files
3. **Check database** using Prisma Studio

### **Future Features**

1. **Authentication**: Add JWT-based auth
2. **Real-time Chat**: WebSocket implementation
3. **AI Integration**: Gemini for summaries
4. **Notifications**: Push notifications
5. **Search**: Full-text search
6. **Analytics**: Reading statistics

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Database Connection Failed**

   ```bash
   # Check if PostgreSQL is running
   docker-compose ps

   # Restart database
   docker-compose restart postgres
   ```

2. **MinIO Connection Failed**

   ```bash
   # Check MinIO logs
   docker-compose logs minio

   # Restart MinIO
   docker-compose restart minio
   ```

3. **File Upload Fails**

   - Check file size limits
   - Verify file type restrictions
   - Ensure MinIO is accessible

4. **API Not Responding**

   ```bash
   # Check application logs
   npm run start:dev

   # Verify all services are running
   docker-compose ps
   ```

## 📊 **Monitoring**

### **Health Checks**

- **API**: http://localhost:3000/health
- **Database**: Check with Prisma Studio
- **MinIO**: Check console at http://localhost:9001

### **Logs**

```bash
# Application logs
npm run start:dev

# Docker logs
docker-compose logs -f

# Specific service logs
docker-compose logs postgres
docker-compose logs minio
```

The Booksy backend is now ready for development and testing! 🚀

All endpoints are public and ready to use. The system includes:

- ✅ Complete CRUD operations
- ✅ File upload with MinIO
- ✅ Database with PostgreSQL
- ✅ API documentation with Swagger
- ✅ Docker setup for easy deployment

Start building your frontend or testing the API endpoints! 🎉
