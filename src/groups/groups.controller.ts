import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { Public } from '../auth/decorators/public.decorator';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @Public()
  async findAll() {
    const groups = await this.groupsService.findAll();
    return { groups };
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const group = await this.groupsService.findById(id);
    return { group };
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() data: { name: string; description?: string },
    @Session() session: UserSession,
  ) {
    const group = await this.groupsService.create({
      ...data,
      adminId: session.user.id,
    });
    return { group };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() data: { name?: string; description?: string },
    @Session() session: UserSession,
  ) {
    const group = await this.groupsService.update(id, data, session.user.id);
    return { group };
  }

  @Post(':id/join')
  @UseGuards(AuthGuard)
  async joinGroup(@Param('id') id: string, @Session() session: UserSession) {
    const member = await this.groupsService.joinGroup(id, session.user.id);
    return { member };
  }

  @Post(':id/leave')
  @UseGuards(AuthGuard)
  async leaveGroup(@Param('id') id: string, @Session() session: UserSession) {
    const result = await this.groupsService.leaveGroup(id, session.user.id);
    return result;
  }

  @Post(':id/reading-goal')
  @UseGuards(AuthGuard)
  async setReadingGoal(
    @Param('id') id: string,
    @Body()
    data: {
      bookId: string;
      dailyPages: number;
      startDate: string;
      endDate: string;
    },
    @Session() session: UserSession,
  ) {
    // Check if user is admin
    const isAdmin = await this.groupsService.isAdmin(id, session.user.id);
    if (!isAdmin) {
      throw new Error('Only group admin can set reading goals');
    }

    const readingGoal = await this.groupsService.setReadingGoal({
      groupId: id,
      bookId: data.bookId,
      dailyPages: data.dailyPages,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });

    return { readingGoal };
  }

  @Get('my-groups')
  @UseGuards(AuthGuard)
  async getMyGroups(@Session() session: UserSession) {
    const groups = await this.groupsService.getUserGroups(session.user.id);
    return { groups };
  }
}
