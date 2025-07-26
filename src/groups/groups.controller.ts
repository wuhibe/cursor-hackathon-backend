import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import {
  CreateGroupDto,
  UpdateGroupDto,
  JoinGroupDto,
  LeaveGroupDto,
  SetReadingGoalDto,
} from './dto';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({ status: 200, description: 'Groups retrieved successfully' })
  async findAll() {
    const groups = await this.groupsService.findAll();
    return { groups };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ status: 200, description: 'Group retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async findOne(@Param('id') id: string) {
    const group = await this.groupsService.findById(id);
    return { group };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() data: CreateGroupDto) {
    const group = await this.groupsService.create(data);
    return { group };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async update(@Param('id') id: string, @Body() data: UpdateGroupDto) {
    const group = await this.groupsService.update(id, data);
    return { group };
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join a group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ status: 201, description: 'Joined group successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async joinGroup(@Param('id') id: string, @Body() data: JoinGroupDto) {
    const member = await this.groupsService.joinGroup(id, data.userId);
    return { member };
  }

  @Post(':id/leave')
  @ApiOperation({ summary: 'Leave a group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ status: 200, description: 'Left group successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async leaveGroup(@Param('id') id: string, @Body() data: LeaveGroupDto) {
    const result = await this.groupsService.leaveGroup(id, data.userId);
    return result;
  }

  @Post(':id/reading-goal')
  @ApiOperation({ summary: 'Set reading goal for a group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ status: 201, description: 'Reading goal set successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async setReadingGoal(
    @Param('id') id: string,
    @Body() data: SetReadingGoalDto,
  ) {
    const readingGoal = await this.groupsService.setReadingGoal({
      groupId: id,
      bookId: data.bookId,
      dailyPages: data.dailyPages,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });

    return { readingGoal };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user groups' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User groups retrieved successfully',
  })
  async getUserGroups(@Param('userId') userId: string) {
    const groups = await this.groupsService.getUserGroups(userId);
    return { groups };
  }
}
