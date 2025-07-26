# 📚 Booksy - Social Reading Platform

A comprehensive social reading platform built with modern technologies across web, mobile, and backend services. Booksy allows users to discover, read, and discuss books in a social environment.

## 🏗️ Architecture

This project consists of three main components:

- **Backend** - NestJS API with PostgreSQL and MinIO
- **Frontend** - Next.js web application with Tailwind CSS
- **Mobile** - Flutter cross-platform mobile app

## 🚀 Quick Start

### Prerequisites

- **Backend**: Node.js 18+, Docker, Docker Compose
- **Frontend**: Node.js 18+
- **Mobile**: Flutter SDK 3.7.2+

### Backend Setup

```bash
cd backend

# Start infrastructure (PostgreSQL + MinIO)
docker-compose up -d

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev

# Start development server
npm run start:dev
```

**Access Points:**
- API: http://localhost:3000
- API Docs: http://localhost:3000/api
- MinIO Console: http://localhost:9001 (minioadmin/minioadmin)

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Access Point:** http://localhost:3000

### Mobile Setup

```bash
cd mobile

# Install dependencies
flutter pub get

# Run on connected device/emulator
flutter run
```

## 🎯 Features

### Core Functionality
- **User Management** - Create profiles, manage settings
- **Book Library** - Upload, store, and organize books
- **Social Reading** - Share thoughts, create posts about books
- **Reading Groups** - Join communities, set reading goals
- **Cross-Platform** - Web and mobile experiences

### Backend Features
- RESTful API with comprehensive validation
- File storage with MinIO integration
- PostgreSQL database with Prisma ORM
- Swagger API documentation
- Content moderation capabilities

### Frontend Features
- Modern React with Next.js 15
- Tailwind CSS for styling
- Radix UI components
- Responsive design
- TypeScript support

### Mobile Features
- Flutter cross-platform app
- PDF/EPUB reader integration
- Offline reading capabilities
- Push notifications
- File picker for book uploads

## 📁 Project Structure

```
cursor-hackathon/
├── backend/                 # NestJS API Server
│   ├── src/
│   │   ├── auth/           # Authentication
│   │   ├── books/          # Book management
│   │   ├── groups/         # Reading groups
│   │   ├── posts/          # Social posts
│   │   ├── upload/         # File uploads
│   │   └── users/          # User management
│   ├── prisma/             # Database schema
│   └── docker-compose.yml  # Infrastructure
├── frontend/               # Next.js Web App
│   ├── app/               # App router pages
│   ├── components/        # Reusable UI components
│   └── lib/              # Utilities
└── mobile/                # Flutter Mobile App
    ├── lib/
    │   ├── core/          # App configuration
    │   ├── features/      # Feature modules
    │   └── shared/        # Shared models/services
    └── assets/           # App assets
```

## 🛠️ Technology Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: MinIO
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Language**: TypeScript
- **Icons**: Lucide React

### Mobile
- **Framework**: Flutter
- **State Management**: Riverpod
- **Navigation**: Go Router
- **HTTP Client**: Dio
- **PDF Reader**: Syncfusion PDF Viewer
- **Storage**: Flutter Secure Storage

## 🔧 Development

### Backend Development

```bash
cd backend

# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger

# Testing
npm run test               # Unit tests
npm run test:e2e           # End-to-end tests

# Database
npx prisma studio          # Database GUI
npx prisma migrate dev     # Create migration
```

### Frontend Development

```bash
cd frontend

# Development
npm run dev               # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
```

### Mobile Development

```bash
cd mobile

# Development
flutter run              # Run on device/emulator
flutter build apk        # Build Android APK
flutter build ios        # Build iOS app

# Code Generation
flutter packages pub run build_runner build  # Generate code
```

## 📚 API Documentation

The backend provides comprehensive API documentation at `http://localhost:3000/api` when running.

### Key Endpoints

- **Users**: `/api/users` - User management
- **Books**: `/api/books` - Book operations
- **Posts**: `/api/posts` - Social posts
- **Groups**: `/api/groups` - Reading groups
- **Upload**: `/api/upload` - File uploads

## 🔒 Security & Validation

- Input validation with class-validator
- File type and size restrictions
- SQL injection protection via Prisma
- Secure file storage with presigned URLs

## 🚀 Deployment

### Backend Deployment
- Containerized with Docker
- PostgreSQL database
- MinIO for file storage
- Environment-based configuration

### Frontend Deployment
- Optimized for Vercel deployment
- Static generation capabilities
- Image optimization
- SEO-friendly

### Mobile Deployment
- Cross-platform builds
- App store ready
- Firebase integration for notifications
- Secure storage for user data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the Cursor Hackathon and is for educational/demonstration purposes.

## 🆘 Support

For issues and questions:
- Check the individual README files in each directory
- Review API documentation at `/api` endpoint
- Check Docker logs for infrastructure issues

---

**Happy Reading! 📖✨**
