import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile/:id')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return { user };
  }

  @Put('profile/:id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(@Param('id') id: string, @Body() data: UpdateUserDto) {
    const user = await this.usersService.updateUser(id, data);
    return { user };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return { user };
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get user by username' })
  @ApiParam({ name: 'username', description: 'Username' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    return { user };
  }

  @Get(':id/books')
  @ApiOperation({ summary: 'Get user books' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User books retrieved successfully',
  })
  async getUserBooks(@Param('id') id: string) {
    const books = await this.usersService.getUserBooks(id);
    return { books };
  }

  @Get(':id/summaries')
  @ApiOperation({ summary: 'Get user summaries' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User summaries retrieved successfully',
  })
  async getUserSummaries(@Param('id') id: string) {
    const summaries = await this.usersService.getUserSummaries(id);
    return { summaries };
  }

  @Get(':id/posts')
  @ApiOperation({ summary: 'Get user posts' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User posts retrieved successfully',
  })
  async getUserPosts(@Param('id') id: string) {
    const posts = await this.usersService.getUserPosts(id);
    return { posts };
  }
}
