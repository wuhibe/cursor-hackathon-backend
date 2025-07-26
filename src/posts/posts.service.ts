import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.post.findMany({
      where: { moderated: true }, // Only show moderated posts
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

  async create(data: { content: string; bookId?: string; authorId: string }) {
    // TODO: Add AI moderation via Gemini
    // For now, we'll auto-approve posts
    const moderated = true; // This should be determined by AI moderation

    return this.prisma.post.create({
      data: {
        ...data,
        moderated,
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

  // TODO: Add AI moderation method
  async moderatePost(content: string): Promise<boolean> {
    // This should integrate with Gemini AI for content moderation
    // For now, return true (auto-approve)
    return true;
  }
}
