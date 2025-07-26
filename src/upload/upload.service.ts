import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private minioClient: Minio.Client;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: this.configService.get<number>('MINIO_PORT', 9000),
      useSSL: this.configService.get<boolean>('MINIO_USE_SSL', false),
      accessKey: this.configService.get<string>(
        'MINIO_ACCESS_KEY',
        'minioadmin',
      ),
      secretKey: this.configService.get<string>(
        'MINIO_SECRET_KEY',
        'minioadmin',
      ),
    });

    this.initializeBuckets();
  }

  private async initializeBuckets() {
    try {
      const buckets = ['books', 'avatars', 'temp'];

      for (const bucketName of buckets) {
        const exists = await this.minioClient.bucketExists(bucketName);
        if (!exists) {
          await this.minioClient.makeBucket(bucketName, 'us-east-1');
          this.logger.log(`Created bucket: ${bucketName}`);

          // Set public read policy for books and avatars
          if (bucketName === 'books' || bucketName === 'avatars') {
            const policy = {
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Principal: { AWS: ['*'] },
                  Action: ['s3:GetObject'],
                  Resource: [`arn:aws:s3:::${bucketName}/*`],
                },
              ],
            };

            await this.minioClient.setBucketPolicy(
              bucketName,
              JSON.stringify(policy),
            );
            this.logger.log(`Set public read policy for bucket: ${bucketName}`);
          }
        }
      }
    } catch (error) {
      this.logger.error('Failed to initialize MinIO buckets:', error);
    }
  }

  async uploadBook(file: Express.Multer.File, userId: string): Promise<string> {
    const fileName = `books/${userId}/${Date.now()}-${file.originalname}`;

    try {
      await this.minioClient.putObject(
        'books',
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
          'x-amz-meta-user-id': userId,
        },
      );

      const fileUrl = await this.minioClient.presignedGetObject(
        'books',
        fileName,
        24 * 60 * 60,
      ); // 24 hours
      return fileUrl;
    } catch (error) {
      this.logger.error('Failed to upload book:', error);
      throw new Error('Failed to upload book file');
    }
  }

  async uploadAvatar(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const fileName = `avatars/${userId}/${Date.now()}-${file.originalname}`;

    try {
      await this.minioClient.putObject(
        'avatars',
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
          'x-amz-meta-user-id': userId,
        },
      );

      const fileUrl = await this.minioClient.presignedGetObject(
        'avatars',
        fileName,
        24 * 60 * 60,
      ); // 24 hours
      return fileUrl;
    } catch (error) {
      this.logger.error('Failed to upload avatar:', error);
      throw new Error('Failed to upload avatar file');
    }
  }

  async uploadTemp(file: Express.Multer.File): Promise<string> {
    const fileName = `temp/${Date.now()}-${file.originalname}`;

    try {
      await this.minioClient.putObject(
        'temp',
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      const fileUrl = await this.minioClient.presignedGetObject(
        'temp',
        fileName,
        60 * 60,
      ); // 1 hour
      return fileUrl;
    } catch (error) {
      this.logger.error('Failed to upload temp file:', error);
      throw new Error('Failed to upload temporary file');
    }
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(bucketName, fileName);
      this.logger.log(`Deleted file: ${bucketName}/${fileName}`);
    } catch (error) {
      this.logger.error('Failed to delete file:', error);
      throw new Error('Failed to delete file');
    }
  }

  async getFileUrl(
    bucketName: string,
    fileName: string,
    expiryHours: number = 24,
  ): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        bucketName,
        fileName,
        expiryHours * 60 * 60,
      );
    } catch (error) {
      this.logger.error('Failed to generate file URL:', error);
      throw new Error('Failed to generate file URL');
    }
  }

  async listUserFiles(bucketName: string, userId: string): Promise<string[]> {
    try {
      const files: string[] = [];
      const stream = this.minioClient.listObjects(
        bucketName,
        `${bucketName}/${userId}/`,
        true,
      );

      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          files.push(obj.name);
        });

        stream.on('end', () => {
          resolve(files);
        });

        stream.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      this.logger.error('Failed to list user files:', error);
      throw new Error('Failed to list user files');
    }
  }

  async cleanupTempFiles(): Promise<void> {
    try {
      const stream = this.minioClient.listObjects('temp', '', true);
      const filesToDelete: string[] = [];

      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          // Delete files older than 24 hours
          const fileAge = Date.now() - new Date(obj.lastModified).getTime();
          if (fileAge > 24 * 60 * 60 * 1000) {
            filesToDelete.push(obj.name);
          }
        });

        stream.on('end', async () => {
          try {
            for (const fileName of filesToDelete) {
              await this.minioClient.removeObject('temp', fileName);
            }
            this.logger.log(`Cleaned up ${filesToDelete.length} temp files`);
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        stream.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      this.logger.error('Failed to cleanup temp files:', error);
      throw new Error('Failed to cleanup temporary files');
    }
  }
}
