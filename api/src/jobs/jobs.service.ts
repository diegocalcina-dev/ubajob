import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';

const JOB_INCLUDE = {
  employer: { select: { id: true, name: true, avatar: true, employerProfile: { select: { logo: true, sector: true } } } },
  benefits: { select: { value: true } },
  requirements: { select: { value: true } },
  questions: { select: { value: true } },
  tags: { select: { value: true } },
  _count: { select: { applications: true } },
};

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    search?: string;
    category?: string;
    contractType?: string;
    regime?: string;
    location?: string;
    seasonal?: string;
    salaryMin?: string;
    salaryMax?: string;
  }) {
    const where: Record<string, unknown> = { active: true };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
        { category: { contains: query.search } },
      ];
    }
    if (query.category) where.category = query.category;
    if (query.contractType) where.contractType = query.contractType;
    if (query.regime) where.regime = query.regime;
    if (query.location) where.location = { contains: query.location };
    if (query.seasonal === 'true') where.seasonal = true;
    if (query.salaryMin) where.salaryMin = { gte: Number(query.salaryMin) };
    if (query.salaryMax) where.salaryMax = { lte: Number(query.salaryMax) };

    const jobs = await this.prisma.job.findMany({
      where,
      include: JOB_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });

    return jobs.map(this.formatJob);
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: JOB_INCLUDE,
    });
    if (!job) throw new NotFoundException('Vaga não encontrada');
    return this.formatJob(job);
  }

  async create(employerId: string, dto: CreateJobDto) {
    const { benefits, requirements, questions, tags, expiresAt, ...rest } = dto;

    const job = await this.prisma.job.create({
      data: {
        ...rest,
        employerId,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        benefits: benefits?.length ? { create: benefits.map((v) => ({ value: v })) } : undefined,
        requirements: requirements?.length ? { create: requirements.map((v) => ({ value: v })) } : undefined,
        questions: questions?.length ? { create: questions.map((v) => ({ value: v })) } : undefined,
        tags: tags?.length ? { create: tags.map((v) => ({ value: v })) } : undefined,
      },
      include: JOB_INCLUDE,
    });

    return this.formatJob(job);
  }

  async deactivate(id: string, employerId: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Vaga não encontrada');
    if (job.employerId !== employerId) throw new ForbiddenException();

    return this.prisma.job.update({ where: { id }, data: { active: false } });
  }

  async findByEmployer(employerId: string) {
    const jobs = await this.prisma.job.findMany({
      where: { employerId },
      include: JOB_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
    return jobs.map(this.formatJob);
  }

  private formatJob(job: any) {
    return {
      ...job,
      employerName: job.employer.name,
      employerLogo: job.employer.employerProfile?.logo,
      benefits: job.benefits.map((b) => b.value),
      requirements: job.requirements.map((r) => r.value),
      questions: job.questions.map((q) => q.value),
      tags: job.tags.map((t) => t.value),
      applications: job._count.applications,
    };
  }
}
