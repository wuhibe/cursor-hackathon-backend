"use client";
import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  BookOpen, 
  FileText, 
  Image, 
  X, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Trash2,
  Edit,
  Star,
  Calendar,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  blobToFile, 
  base64ToBlob, 
  blobToBase64, 
  formatFileSize, 
  getFileExtension,
  isImageFile,
  isPdfFile,
  isTextFile 
} from '@/lib/utils';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  rating?: number;
  coverImage?: string;
  content: string; // base64 encoded content
  isPublic: boolean;
}

const BookPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate fetching books from backend
    const mockBooks: Book[] = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
        genre: 'Classic',
        fileSize: 1024000, // 1MB
        fileType: 'pdf',
        uploadDate: '2024-01-15',
        rating: 4.5,
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop',
        content: 'base64_encoded_content_here',
        isPublic: true
      },
      {
        id: '2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'The story of young Scout Finch and her father Atticus in a racially divided Alabama town.',
        genre: 'Fiction',
        fileSize: 2048000, // 2MB
        fileType: 'pdf',
        uploadDate: '2024-01-10',
        rating: 4.8,
        coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop',
        content: 'base64_encoded_content_here',
        isPublic: true
      },
      {
        id: '3',
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian novel about totalitarianism and surveillance society.',
        genre: 'Science Fiction',
        fileSize: 1536000, // 1.5MB
        fileType: 'pdf',
        uploadDate: '2024-01-05',
        rating: 4.2,
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=300&fit=crop',
        content: 'base64_encoded_content_here',
        isPublic: false
      }
    ];
    setBooks(mockBooks);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleAddBook = async (formData: FormData) => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      // Convert file to base64 for backend storage
      const base64Content = await blobToBase64(uploadedFile);
      
      const newBook: Book = {
        id: Date.now().toString(),
        title: formData.get('title') as string,
        author: formData.get('author') as string,
        description: formData.get('description') as string,
        genre: formData.get('genre') as string,
        fileSize: uploadedFile.size,
        fileType: getFileExtension(uploadedFile.name),
        uploadDate: new Date().toISOString().split('T')[0],
        content: base64Content,
        isPublic: formData.get('isPublic') === 'true'
      };

      // In a real app, you would send this to your backend
      // await fetch('/api/books', { method: 'POST', body: JSON.stringify(newBook) });
      
      setBooks(prev => [newBook, ...prev]);
      setIsAddBookOpen(false);
      setUploadedFile(null);
    } catch (error) {
      console.error('Error uploading book:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewBook = (book: Book) => {
    setSelectedBook(book);
    setIsViewerOpen(true);
  };

  const handleDownloadBook = (book: Book) => {
    try {
      // Convert base64 back to blob
      const blob = base64ToBlob(book.content, `application/${book.fileType}`);
      const file = blobToFile(blob, `${book.title}.${book.fileType}`);
      
      // Create download link
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.title}.${book.fileType}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading book:', error);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const getFileIcon = (fileType: string) => {
    if (isImageFile(fileType)) return <Image className="w-4 h-4" />;
    if (isPdfFile(fileType)) return <FileText className="w-4 h-4" />;
    return <BookOpen className="w-4 h-4" />;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Books</h1>
        <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddBook(formData);
            }} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Select name="genre" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fiction">Fiction</SelectItem>
                    <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                    <SelectItem value="Classic">Classic</SelectItem>
                    <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                    <SelectItem value="Mystery">Mystery</SelectItem>
                    <SelectItem value="Romance">Romance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file">Book File</Label>
                <Input 
                  id="file" 
                  type="file" 
                  accept=".pdf,.txt,.doc,.docx,.epub"
                  onChange={handleFileUpload}
                  required 
                />
                {uploadedFile && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Selected: {uploadedFile.name} ({formatFileSize(uploadedFile.size)})
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="isPublic" 
                  name="isPublic" 
                  value="true"
                  className="rounded"
                />
                <Label htmlFor="isPublic">Make book public</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isUploading || !uploadedFile}>
                  {isUploading ? 'Uploading...' : 'Add Book'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddBookOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="Fiction">Fiction</SelectItem>
            <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
            <SelectItem value="Classic">Classic</SelectItem>
            <SelectItem value="Science Fiction">Science Fiction</SelectItem>
            <SelectItem value="Mystery">Mystery</SelectItem>
            <SelectItem value="Romance">Romance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Books Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{book.genre}</Badge>
                    {book.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {book.rating}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getFileIcon(book.fileType)}
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(book.fileSize)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {book.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {book.uploadDate}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {book.isPublic ? 'Public' : 'Private'}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleViewBook(book)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDownloadBook(book)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Book Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedBook?.title}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsViewerOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="flex-1 overflow-auto">
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Book Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Author:</span> {selectedBook.author}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Genre:</span> {selectedBook.genre}
                  </div>
                  <div>
                    <span className="text-muted-foreground">File Size:</span> {formatFileSize(selectedBook.fileSize)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Upload Date:</span> {selectedBook.uploadDate}
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4 min-h-[400px]">
                <div className="text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4" />
                  <p>Book content viewer would be implemented here</p>
                  <p className="text-sm">For PDF files, you could use a PDF viewer component</p>
                  <p className="text-sm">For text files, you could display the content directly</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookPage; 