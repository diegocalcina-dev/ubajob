import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus } from '../types';

const APP_INCLUDE = {
  job: {
    select: {
      id: true, title: true, salaryMin: true, salaryMax: true, salaryPeriod: true,
      employer: { select: { id: true, name: true, employerProfile: { select: { logo: true } } } },
    },
  },
  candidate: {
    select: {
      id: true, name: true, avatar: true,
      candidateProfile: { select: { city: true, state: true, bio: true } },
    },
  },
};

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async apply(candidateId: string, jobId: string, coverLetter?: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || !job.active) throw new NotFoundException('Vaga não encontrada');

    const existing = await this.prisma.application.findFirst({ where: { candidateId, jobId } });
    if (existing) throw new ConflictException('Você já se candidatou a esta vaga');

    const app = await this.prisma.application.create({
      data: { candidateId, jobId, coverLetter },
      include: APP_INCLUDE,
    });
    return this.formatApp(app);
  }

  async getMyCandidatures(candidateId: string) {
    const apps = await this.prisma.application.findMany({
      where: { candidateId },
      include: APP_INCLUDE,
      orderBy: { appliedAt: 'desc' },
    });
    return apps.map(this.formatApp);
  }

  async getJobApplications(jobId: string, employerId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Vaga não encontrada');
    if (job.employerId !== employerId) throw new ForbiddenException();

    const apps = await this.prisma.application.findMany({
      where: { jobId },
      include: APP_INCLUDE,
      orderBy: { appliedAt: 'desc' },
    });
    return apps.map(this.formatApp);
  }

  async updateStatus(appId: string, status: ApplicationStatus, employerId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: appId },
      include: { job: true },
    });
    if (!app) throw new NotFoundException('Candidatura não encontrada');
    if (app.job.employerId !== employerId) throw new ForbiddenException();

    return this.prisma.application.update({ where: { id: appId }, data: { status } });
  }

  private formatApp(app: any) {
    return {
      id: app.id,
      jobId: app.job.id,
      jobTitle: app.job.title,
      employerId: app.job.employer.id,
      employerName: app.job.employer.name,
      employerLogo: app.job.employer.employerProfile?.logo,
      candidateId: app.candidate.id,
      candidateName: app.candidate.name,
      candidateAvatar: app.candidate.avatar,
      status: app.status,
      coverLetter: app.coverLetter,
      matchScore: app.matchScore,
      appliedAt: app.appliedAt,
    };
  }
}
