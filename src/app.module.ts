import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BooksModule,
    UsersModule,
    PostsModule,
    GroupsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
