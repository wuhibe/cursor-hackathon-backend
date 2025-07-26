import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { Public } from '../auth/decorators/public.decorator';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Public()
  async findAll() {
    const posts = await this.postsService.findAll();
    return { posts };
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findById(id);
    return { post };
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() data: { content: string; bookId?: string },
    @Session() session: UserSession,
  ) {
    const post = await this.postsService.create({
      ...data,
      authorId: session.user.id,
    });
    return { post };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() data: { content: string },
    @Session() session: UserSession,
  ) {
    // TODO: Add authorization check
    const post = await this.postsService.update(id, data);
    return { post };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string, @Session() session: UserSession) {
    const result = await this.postsService.delete(id, session.user.id);
    return result;
  }

  @Get('book/:bookId')
  @Public()
  async findByBook(@Param('bookId') bookId: string) {
    const posts = await this.postsService.findByBook(bookId);
    return { posts };
  }

  @Get('author/:authorId')
  @Public()
  async findByAuthor(@Param('authorId') authorId: string) {
    const posts = await this.postsService.findByAuthor(authorId);
    return { posts };
  }
}
