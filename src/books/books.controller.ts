import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { Public } from '../auth/decorators/public.decorator';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Public()
  async findAll() {
    const books = await this.booksService.findAll();
    return { books };
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const book = await this.booksService.findById(id);
    return { book };
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() data: { title: string; author: string; fileUrl: string },
    @Session() session: UserSession,
  ) {
    const book = await this.booksService.create({
      ...data,
      uploaderId: session.user.id,
    });
    return { book };
  }

  @Get('my-books')
  @UseGuards(AuthGuard)
  async findMyBooks(@Session() session: UserSession) {
    const books = await this.booksService.findByUploader(session.user.id);
    return { books };
  }
}
