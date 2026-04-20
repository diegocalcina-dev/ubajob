import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Usuários demo
  const hash = await bcrypt.hash('123456', 10);

  const employer = await prisma.user.upsert({
    where: { email: 'fernanda@pousada.com' },
    update: {},
    create: {
      name: 'Fernanda Costa',
      email: 'fernanda@pousada.com',
      password: hash,
      role: 'employer',
      employerProfile: {
        create: {
          sector: 'Turismo & Hotelaria',
          city: 'Ubatuba',
          state: 'SP',
          description: 'Pousada boutique na praia do Itamambuca.',
        },
      },
    },
  });

  const candidate = await prisma.user.upsert({
    where: { email: 'lucas@email.com' },
    update: {},
    create: {
      name: 'Lucas Ferreira',
      email: 'lucas@email.com',
      password: hash,
      role: 'candidate',
      candidateProfile: {
        create: {
          bio: 'Apaixonado por turismo e hospitalidade. Busco oportunidades no litoral norte de SP.',
          city: 'Ubatuba',
          state: 'SP',
          availability: 'Imediata',
          profileCompleteness: 72,
        },
      },
    },
  });

  // Vagas demo
  const jobs = [
    {
      title: 'Recepcionista de Hotel',
      description: 'Responsável pelo atendimento a hóspedes, check-in/check-out, gestão de reservas e suporte durante a estadia.',
      category: 'Turismo & Hotelaria',
      contractType: 'CLT',
      regime: 'Presencial',
      location: 'Ubatuba, SP',
      salaryMin: 1800,
      salaryMax: 2400,
      salaryPeriod: 'mes',
      benefits: ['Vale Refeição', 'Vale Transporte', 'Uniforme'],
      requirements: ['Inglês básico', 'Experiência em hotelaria', 'Disponibilidade para finais de semana'],
      tags: ['Turismo', 'Hotelaria', 'Recepção'],
    },
    {
      title: 'Garçom/Garçonete',
      description: 'Atendimento ao cliente em restaurante frente à praia. Temporada de verão.',
      category: 'Gastronomia',
      contractType: 'Temporario',
      regime: 'Presencial',
      location: 'Ubatuba, SP',
      salaryMin: 1400,
      salaryMax: 1800,
      salaryPeriod: 'mes',
      seasonal: true,
      seasonalStart: 'Dezembro',
      seasonalEnd: 'Março',
      benefits: ['Refeição no local', 'Gorjetas'],
      requirements: ['Experiência com atendimento', 'Disponibilidade nos fins de semana'],
      tags: ['Gastronomia', 'Sazonal', 'Verão'],
    },
    {
      title: 'Auxiliar de Cozinha',
      description: 'Apoio na preparação de alimentos, limpeza e organização da cozinha.',
      category: 'Gastronomia',
      contractType: 'CLT',
      regime: 'Presencial',
      location: 'Caraguatatuba, SP',
      salaryMin: 1400,
      salaryMax: 1600,
      salaryPeriod: 'mes',
      benefits: ['Refeição no local', 'Vale Transporte'],
      requirements: ['Vontade de aprender', 'Higiene e organização'],
      tags: ['Cozinha', 'Gastronomia'],
    },
    {
      title: 'Monitor de Mergulho',
      description: 'Condução de mergulhadores em pontos turísticos da região, incluindo Ilha das Couves e Laje de Santos.',
      category: 'Esportes & Lazer',
      contractType: 'PJ',
      regime: 'Presencial',
      location: 'Ubatuba, SP',
      salaryMin: 3000,
      salaryMax: 5000,
      salaryPeriod: 'mes',
      benefits: ['Equipamentos fornecidos', 'Comissão por grupo'],
      requirements: ['Certificado PADI', 'Experiência mínima 2 anos', 'Inglês intermediário'],
      tags: ['Mergulho', 'Turismo', 'Esportes'],
    },
    {
      title: 'Recepcionista – Trabalho Remoto',
      description: 'Atendimento a clientes via chat e telefone para pousada em Ilhabela. 100% remoto.',
      category: 'Turismo & Hotelaria',
      contractType: 'PJ',
      regime: 'Remoto',
      location: 'Ilhabela, SP',
      salaryMin: 2200,
      salaryMax: 2800,
      salaryPeriod: 'mes',
      benefits: ['Flexibilidade de horário', 'Home office'],
      requirements: ['Excelente comunicação escrita', 'Conhecimento em reservas online'],
      tags: ['Remoto', 'Hotelaria'],
    },
  ];

  for (const jobData of jobs) {
    const { benefits, requirements, tags, seasonal, seasonalStart, seasonalEnd, ...rest } = jobData;
    await prisma.job.create({
      data: {
        ...rest,
        seasonal: seasonal ?? false,
        seasonalStart: seasonalStart ?? null,
        seasonalEnd: seasonalEnd ?? null,
        employerId: employer.id,
        benefits: { create: benefits.map((v) => ({ value: v })) },
        requirements: { create: requirements.map((v) => ({ value: v })) },
        tags: { create: tags.map((v) => ({ value: v })) },
      },
    });
  }

  console.log(`✅ Seed completo!`);
  console.log(`   👤 Candidato: lucas@email.com / 123456`);
  console.log(`   🏢 Empregador: fernanda@pousada.com / 123456`);
  console.log(`   📋 ${jobs.length} vagas criadas`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
