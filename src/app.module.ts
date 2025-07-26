import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { BooksModule } from './books/books.module';
import { GroupsModule } from './groups/groups.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    BooksModule,
    UsersModule,
    PostsModule,
    AuthModule,
    GroupsModule,
    UploadModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
