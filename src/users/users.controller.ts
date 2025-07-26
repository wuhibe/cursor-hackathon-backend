import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { Public } from '../auth/decorators/public.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard)
  async getMyProfile(@Session() session: UserSession) {
    const user = await this.usersService.findById(session.user.id);
    return { user };
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  async updateMyProfile(
    @Session() session: UserSession,
    @Body()
    data: {
      username?: string;
      bio?: string;
      image?: string;
      profileImage?: string;
    },
  ) {
    const user = await this.usersService.updateProfile(session.user.id, data);
    return { user };
  }

  @Get(':id')
  @Public()
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return { user };
  }

  @Get('username/:username')
  @Public()
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    return { user };
  }

  @Get('profile/books')
  @UseGuards(AuthGuard)
  async getMyBooks(@Session() session: UserSession) {
    const books = await this.usersService.getUserBooks(session.user.id);
    return { books };
  }

  @Get('profile/summaries')
  @UseGuards(AuthGuard)
  async getMySummaries(@Session() session: UserSession) {
    const summaries = await this.usersService.getUserSummaries(session.user.id);
    return { summaries };
  }

  @Get('profile/posts')
  @UseGuards(AuthGuard)
  async getMyPosts(@Session() session: UserSession) {
    const posts = await this.usersService.getUserPosts(session.user.id);
    return { posts };
  }

  @Get(':id/books')
  @Public()
  async getUserBooks(@Param('id') id: string) {
    const books = await this.usersService.getUserBooks(id);
    return { books };
  }

  @Get(':id/summaries')
  @Public()
  async getUserSummaries(@Param('id') id: string) {
    const summaries = await this.usersService.getUserSummaries(id);
    return { summaries };
  }

  @Get(':id/posts')
  @Public()
  async getUserPosts(@Param('id') id: string) {
    const posts = await this.usersService.getUserPosts(id);
    return { posts };
  }
}
