import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ContentModerationService } from './content-moderation.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [PostsService, ContentModerationService],
  exports: [PostsService],
})
export class PostsModule {}
