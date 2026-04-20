import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        candidateProfile: {
          include: {
            desiredContracts: true,
            experiences: true,
            education: true,
            skills: true,
            languages: true,
          },
        },
        employerProfile: true,
      },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async updateCandidateProfile(userId: string, data: Record<string, unknown>) {
    return this.prisma.candidateProfile.update({
      where: { userId },
      data,
    });
  }

  async updateEmployerProfile(userId: string, data: Record<string, unknown>) {
    return this.prisma.employerProfile.update({
      where: { userId },
      data,
    });
  }
}
