import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            uploadedBooks: true,
            summaries: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            uploadedBooks: true,
            summaries: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async updateUser(
    id: string,
    data: {
      username?: string;
      bio?: string;
      image?: string;
      profileImage?: string;
    },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        profileImage: true,
        updatedAt: true,
      },
    });
  }

  async getUserBooks(userId: string) {
    return this.prisma.book.findMany({
      where: { uploaderId: userId },
      include: {
        uploader: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });
  }

  async getUserSummaries(userId: string) {
    return this.prisma.summary.findMany({
      where: { userId },
      include: {
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

  async getUserPosts(userId: string) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
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
}
