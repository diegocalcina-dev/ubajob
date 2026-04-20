import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApplicationStatus } from '../types';

@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private apps: ApplicationsService) {}

  @Post()
  apply(@Request() req, @Body() body: { jobId: string; coverLetter?: string }) {
    return this.apps.apply(req.user.id, body.jobId, body.coverLetter);
  }

  @Get('mine')
  getMine(@Request() req) {
    return this.apps.getMyCandidatures(req.user.id);
  }

  @Get('job/:jobId')
  getJobApps(@Param('jobId') jobId: string, @Request() req) {
    return this.apps.getJobApplications(jobId, req.user.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
    @Request() req,
  ) {
    return this.apps.updateStatus(id, status, req.user.id);
  }
}
