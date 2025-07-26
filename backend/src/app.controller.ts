import { Controller, Get, HttpCode, Redirect, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @Redirect('/api', 301)
  root() {}

  @UseGuards(AuthGuard('jwt'))
  @Get('health-check')
  @ApiOperation({
    summary: 'Health check endpoint',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is running',
    example: 'ok',
  })
  @HttpCode(200)
  health() {
    return 'ok';
  }
}
