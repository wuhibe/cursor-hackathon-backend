import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.group.findMany({
      include: {
        admin: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        members: {
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
        _count: {
          select: {
            members: true,
            readingGoal: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        members: {
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
        readingGoal: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return group;
  }

  async create(data: { name: string; description?: string; adminId: string }) {
    return this.prisma.group.create({
      data: {
        ...data,
        members: {
          create: {
            userId: data.adminId,
            role: 'admin',
          },
        },
      },
      include: {
        admin: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        members: {
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

  async update(
    id: string,
    data: { name?: string; description?: string },
    adminId: string,
  ) {
    const group = await this.prisma.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    if (group.adminId !== adminId) {
      throw new ForbiddenException('Only group admin can update the group');
    }

    return this.prisma.group.update({
      where: { id },
      data,
      include: {
        admin: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        members: {
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

  async joinGroup(groupId: string, userId: string) {
    const existingMember = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
      },
    });

    if (existingMember) {
      throw new Error('User is already a member of this group');
    }

    return this.prisma.groupMember.create({
      data: {
        groupId,
        userId,
        role: 'member',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async leaveGroup(groupId: string, userId: string) {
    const member = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
      },
    });

    if (!member) {
      throw new Error('User is not a member of this group');
    }

    if (member.role === 'admin') {
      throw new Error(
        'Admin cannot leave the group. Transfer admin role first.',
      );
    }

    await this.prisma.groupMember.delete({
      where: { id: member.id },
    });

    return { message: 'Successfully left the group' };
  }

  async setReadingGoal(data: {
    groupId: string;
    bookId: string;
    dailyPages: number;
    startDate: Date;
    endDate: Date;
  }) {
    return this.prisma.readingGoal.create({
      data,
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getUserGroups(userId: string) {
    return this.prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            admin: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
    });
  }

  async isMember(groupId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
      },
    });

    return !!member;
  }

  async isAdmin(groupId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
        role: 'admin',
      },
    });

    return !!member;
  }
}
