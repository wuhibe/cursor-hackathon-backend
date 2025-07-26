import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async findAll() {
    const posts = await this.postsService.findAll();
    return { posts };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findById(id);
    return { post };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() data: CreatePostDto) {
    const post = await this.postsService.create(data);
    return { post };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(@Param('id') id: string, @Body() data: UpdatePostDto) {
    const post = await this.postsService.update(id, data);
    return { post };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async delete(@Param('id') id: string) {
    const result = await this.postsService.delete(id);
    return result;
  }

  @Get('book/:bookId')
  @ApiOperation({ summary: 'Get posts by book' })
  @ApiParam({ name: 'bookId', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async findByBook(@Param('bookId') bookId: string) {
    const posts = await this.postsService.findByBook(bookId);
    return { posts };
  }

  @Get('author/:authorId')
  @ApiOperation({ summary: 'Get posts by author' })
  @ApiParam({ name: 'authorId', description: 'Author ID' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async findByAuthor(@Param('authorId') authorId: string) {
    const posts = await this.postsService.findByAuthor(authorId);
    return { posts };
  }
}
