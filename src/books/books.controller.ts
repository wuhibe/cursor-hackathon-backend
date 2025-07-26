import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Books retrieved successfully' })
  async findAll() {
    const books = await this.booksService.findAll();
    return { books };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Book retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findOne(@Param('id') id: string) {
    const book = await this.booksService.findById(id);
    return { book };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() data: CreateBookDto) {
    const book = await this.booksService.create(data);
    return { book };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get books by uploader' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Books retrieved successfully' })
  async findByUploader(@Param('userId') userId: string) {
    const books = await this.booksService.findByUploader(userId);
    return { books };
  }
}
