import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  getMe(@Request() req) {
    return this.users.getMe(req.user.id);
  }

  @Patch('me/candidate-profile')
  updateCandidateProfile(@Request() req, @Body() body: Record<string, unknown>) {
    return this.users.updateCandidateProfile(req.user.id, body);
  }

  @Patch('me/employer-profile')
  updateEmployerProfile(@Request() req, @Body() body: Record<string, unknown>) {
    return this.users.updateEmployerProfile(req.user.id, body);
  }
}
