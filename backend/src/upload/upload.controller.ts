import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import {
  UploadBookDto,
  UploadAvatarDto,
  GetFilesDto,
  GetFileUrlDto,
} from './dto';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('book')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a book file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Book file (PDF, EPUB, TXT)',
        },
        title: {
          type: 'string',
          description: 'Book title',
        },
        author: {
          type: 'string',
          description: 'Book author',
        },
        userId: {
          type: 'string',
          description: 'User ID',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Book uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or data' })
  async uploadBook(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UploadBookDto,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/epub+zip',
      'text/plain',
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(
        'Invalid file type. Only PDF, EPUB, and TXT files are allowed.',
      );
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 50MB.');
    }

    const fileUrl = await this.uploadService.uploadBook(file, data.userId);

    return {
      message: 'Book uploaded successfully',
      fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      title: data.title,
      author: data.author,
    };
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an avatar image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image (JPEG, PNG, GIF, WebP)',
        },
        userId: {
          type: 'string',
          description: 'User ID',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Avatar uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or data' })
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UploadAvatarDto,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.',
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    const fileUrl = await this.uploadService.uploadAvatar(file, data.userId);

    return {
      message: 'Avatar uploaded successfully',
      fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  }

  @Post('temp')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a temporary file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Temporary file (any type)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Temporary file uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  async uploadTemp(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Validate file size (10MB limit for temp files)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    const fileUrl = await this.uploadService.uploadTemp(file);

    return {
      message: 'Temporary file uploaded successfully',
      fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      expiresIn: '1 hour',
    };
  }

  @Get('files')
  @ApiOperation({ summary: 'Get user files' })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
  async getUserFiles(@Query() query: GetFilesDto) {
    const files = await this.uploadService.listUserFiles(
      query.bucket,
      query.userId,
    );

    return {
      files,
      bucket: query.bucket,
      userId: query.userId,
    };
  }

  @Get('url/:bucket/:fileName')
  @ApiOperation({ summary: 'Get presigned URL for a file' })
  @ApiParam({ name: 'bucket', description: 'Bucket name' })
  @ApiParam({ name: 'fileName', description: 'File name' })
  @ApiResponse({ status: 200, description: 'File URL generated successfully' })
  async getFileUrl(
    @Param('bucket') bucket: string,
    @Param('fileName') fileName: string,
    @Query() query: GetFileUrlDto,
  ) {
    const fileUrl = await this.uploadService.getFileUrl(
      bucket,
      fileName,
      query.expiry,
    );

    return {
      fileUrl,
      bucket,
      fileName,
      expiryHours: query.expiry,
    };
  }

  @Delete(':bucket/:fileName')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({ name: 'bucket', description: 'Bucket name' })
  @ApiParam({ name: 'fileName', description: 'File name' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteFile(
    @Param('bucket') bucket: string,
    @Param('fileName') fileName: string,
  ) {
    await this.uploadService.deleteFile(bucket, fileName);

    return {
      message: 'File deleted successfully',
      bucket,
      fileName,
    };
  }

  @Post('cleanup')
  @ApiOperation({ summary: 'Cleanup temporary files' })
  @ApiResponse({
    status: 200,
    description: 'Temporary files cleaned up successfully',
  })
  async cleanupTempFiles() {
    await this.uploadService.cleanupTempFiles();

    return {
      message: 'Temporary files cleaned up successfully',
    };
  }
}
