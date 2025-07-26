# MinIO Setup Guide for Booksy Backend

## 🚀 **Overview**

MinIO is used for file storage in the Booksy backend, handling:

- **Books**: PDF, EPUB, TXT files (50MB limit)
- **Avatars**: User profile images (5MB limit)
- **Temp Files**: Temporary uploads (10MB limit, auto-cleanup)

## 📋 **Prerequisites**

1. **Docker** (recommended) or **MinIO Server** installed
2. **Node.js** and **npm** for the backend
3. **PostgreSQL** database

## 🐳 **Docker Setup (Recommended)**

### 1. **Create Docker Compose File**

Add this to your `docker-compose.yml`:

```yaml
version: '3.8'
services:
  minio:
    image: minio/minio:latest
    container_name: booksy-minio
    ports:
      - '9000:9000'
      - '9001:9001'
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    restart: unless-stopped

  postgres:
    image: postgres:15
    container_name: booksy-postgres
    environment:
      POSTGRES_DB: booksy
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  minio_data:
  postgres_data:
```

### 2. **Start MinIO**

```bash
docker-compose up -d minio
```

### 3. **Access MinIO Console**

- **URL**: <http://localhost:9001>
- **Username**: minioadmin
- **Password**: minioadmin

## ⚙️ **Environment Configuration**

### 1. **Update `.env` File**

Add these MinIO configuration variables:

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

### 2. **Production Environment Variables**

For production, use secure credentials:

```env
MINIO_ENDPOINT=your-minio-server.com
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your-secure-access-key
MINIO_SECRET_KEY=your-secure-secret-key
```

## 📁 **Bucket Structure**

The system automatically creates these buckets:

```
minio/
├── books/           # Book files (PDF, EPUB, TXT)
│   └── {userId}/    # Organized by user
├── avatars/         # User profile images
│   └── {userId}/    # Organized by user
└── temp/            # Temporary files (auto-cleanup)
```

## 🔧 **API Endpoints**

### **File Upload Endpoints**

#### **Upload Book**

```http
POST /api/upload/book
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- file: PDF/EPUB/TXT file (max 50MB)
- title: Book title (optional)
- author: Book author (optional)
```

**Response:**

```json
{
  "message": "Book uploaded successfully",
  "fileUrl": "https://minio.example.com/books/user123/1234567890-book.pdf",
  "fileName": "book.pdf",
  "fileSize": 2048576,
  "mimeType": "application/pdf",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald"
}
```

#### **Upload Avatar**

```http
POST /api/upload/avatar
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- file: Image file (JPEG, PNG, GIF, WebP, max 5MB)
```

#### **Upload Temporary File**

```http
POST /api/upload/temp
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- file: Any file (max 10MB, expires in 1 hour)
```

### **File Management Endpoints**

#### **List User Files**

```http
GET /api/upload/files?bucket=books
Authorization: Bearer {token}
```

#### **Get File URL**

```http
GET /api/upload/url/{bucket}/{fileName}?expiry=24
Authorization: Bearer {token}
```

#### **Delete File**

```http
DELETE /api/upload/{bucket}/{fileName}
Authorization: Bearer {token}
```

#### **Cleanup Temporary Files**

```http
POST /api/upload/cleanup
Authorization: Bearer {token}
```

## 🔒 **Security Features**

### **File Validation**

- **Book Files**: PDF, EPUB, TXT only (50MB limit)
- **Avatar Files**: JPEG, PNG, GIF, WebP only (5MB limit)
- **Temp Files**: Any type (10MB limit, 1-hour expiry)

### **Access Control**

- All upload endpoints require authentication
- Files are organized by user ID
- Presigned URLs for secure access
- Automatic cleanup of temporary files

### **Bucket Policies**

- **Books & Avatars**: Public read access
- **Temp**: Private access with expiry

## 🚀 **Integration with Books Module**

### **Upload Book Flow**

1. **Upload File**: `POST /api/upload/book`
2. **Create Book Record**: `POST /api/books`
3. **Store File URL**: Save MinIO URL to database

### **Example Integration**

```typescript
// 1. Upload file to MinIO
const uploadResponse = await fetch('/api/upload/book', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const { fileUrl } = await uploadResponse.json();

// 2. Create book record
const bookResponse = await fetch('/api/books', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    fileUrl: fileUrl,
  }),
});
```

## 🧪 **Testing**

### **1. Start Services**

```bash
# Start MinIO and PostgreSQL
docker-compose up -d

# Start backend
npm run start:dev
```

### **2. Test Upload**

```bash
# Test book upload
curl -X POST http://localhost:3000/api/upload/book \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/book.pdf" \
  -F "title=Test Book" \
  -F "author=Test Author"
```

### **3. Verify in MinIO Console**

- Visit <http://localhost:9001>
- Login with minioadmin/minioadmin
- Check buckets and files

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Connection Refused**

   - Ensure MinIO is running: `docker-compose ps`
   - Check ports: 9000 (API), 9001 (Console)

2. **Authentication Failed**

   - Verify MINIO_ACCESS_KEY and MINIO_SECRET_KEY
   - Check MinIO console credentials

3. **File Upload Fails**

   - Check file size limits
   - Verify file type restrictions
   - Ensure authentication token is valid

4. **Bucket Not Found**
   - Buckets are created automatically on startup
   - Check MinIO console for bucket existence

### **Logs**

```bash
# MinIO logs
docker-compose logs minio

# Backend logs
npm run start:dev
```

## 📈 **Production Considerations**

### **1. Security**

- Use strong access keys
- Enable SSL/TLS
- Configure proper bucket policies
- Implement file scanning

### **2. Performance**

- Use CDN for public files
- Implement file compression
- Configure proper caching headers

### **3. Monitoring**

- Monitor storage usage
- Set up alerts for disk space
- Track upload/download metrics

### **4. Backup**

- Configure MinIO backup policies
- Regular database backups
- File integrity checks

## 🎯 **Next Steps**

1. **Test the upload functionality**
2. **Integrate with frontend**
3. **Add file processing (OCR, metadata extraction)**
4. **Implement file versioning**
5. **Add file sharing features**

The MinIO integration is now ready for use! 🚀
