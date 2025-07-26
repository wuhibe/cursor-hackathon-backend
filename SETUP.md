# Booksy Backend Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/booksy?schema=public"

# JWT Secret (for Passport)
JWT_SECRET="your-super-secret-jwt-key"

# Application
PORT=3000
NODE_ENV=development
```

## OAuth Provider Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs to: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env` file

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Homepage URL to: `http://localhost:3000`
4. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Client Secret to your `.env` file

## Database Setup

1. Make sure PostgreSQL is running
2. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

## Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run start:dev
   ```

## API Endpoints

### Authentication

- `GET /api/auth/me` - Get current user profile (authenticated)
- `GET /api/auth/session` - Get current session (authenticated)

### Books (Public)

- `GET /api/books` - List all books (public)
- `GET /api/books/:id` - Get book details (public)

### Books (Authenticated)

- `POST /api/books` - Upload a new book (authenticated)
- `GET /api/books/my-books` - Get user's uploaded books (authenticated)

## Authentication Flow

1. Users can authenticate via:

   - Google OAuth
   - GitHub OAuth
   - Email/Password (credentials)

2. Protected routes use `@UseGuards(AuthGuard)`
3. Public routes use `@Public()` decorator
4. Session information is available via `@Session()` decorator

## Project Structure

```
src/
├── auth/                 # BetterAuth integration
│   ├── auth.config.ts   # Auth configuration
│   ├── auth.module.ts   # Auth module
│   ├── auth.service.ts  # Auth business logic
│   ├── auth.controller.ts # Auth endpoints
│   └── decorators/      # Custom decorators
├── books/               # Books module (example)
├── prisma/              # Database configuration
└── app.module.ts        # Root module
```
