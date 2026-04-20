import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(private jobs: JobsService) {}

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.jobs.findAll(query);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMine(@Request() req) {
    return this.jobs.findByEmployer(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobs.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() dto: CreateJobDto) {
    return this.jobs.create(req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deactivate(@Param('id') id: string, @Request() req) {
    return this.jobs.deactivate(id, req.user.id);
  }
}
