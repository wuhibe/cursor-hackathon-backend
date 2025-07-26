import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ContentModerationService } from './content-moderation.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentModerationService: ContentModerationService,
  ) {}

  async findAll() {
    return this.prisma.post.findMany({
      where: { moderated: true },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async create(data: CreatePostDto, authorId: string) {
    return this.prisma.post.create({
      data: {
        ...data,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
    });
  }

  async update(id: string, data: { content: string }) {
    const post = await this.prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
    });

    return post;
  }

  async delete(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return { message: 'Post deleted successfully' };
  }

  async findByBook(bookId: string) {
    return this.prisma.post.findMany({
      where: {
        bookId,
        moderated: true,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAuthor(authorId: string) {
    return this.prisma.post.findMany({
      where: {
        authorId,
        moderated: true,
        approved: true,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkModeratePost() {
    console.log('Checking for posts to moderate');
    const posts = await this.prisma.post.findMany({
      where: { approved: null },
    });
    if (posts.length === 0) {
      return;
    }

    const post = posts[0];

    const approval = await this.moderatePost(post.title, post.content);
    await this.prisma.post.update({
      where: { id: post.id },
      data: { approved: approval },
    });
  }

  async moderatePost(title: string, content: string): Promise<boolean> {
    return this.contentModerationService.moderateContent(title, content);
  }
}
