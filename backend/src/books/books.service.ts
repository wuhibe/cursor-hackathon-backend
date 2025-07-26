import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findAll() {
    return this.prisma.book.findMany({
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

  async findById(id: string) {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        uploader: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: {
    title: string;
    author: string;
    fileUrl: string;
    uploaderId: string;
  }) {
    const book = await this.prisma.book.create({
      data,
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

    // Store the file URL in MinIO for better organization
    // The fileUrl from upload will be stored in the database
    return book;
  }

  async findByUploader(uploaderId: string) {
    return this.prisma.book.findMany({
      where: { uploaderId },
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
}
