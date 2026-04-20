import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsIn(['CLT', 'PJ', 'Temporario', 'Estagio', 'Autonomo'])
  contractType: string;

  @IsIn(['Presencial', 'Remoto', 'Hibrido'])
  regime: string;

  @IsString()
  location: string;

  @IsInt()
  @Min(0)
  salaryMin: number;

  @IsInt()
  @Min(0)
  salaryMax: number;

  @IsIn(['mes', 'semana', 'dia', 'hora'])
  salaryPeriod: string;

  @IsBoolean()
  @IsOptional()
  seasonal?: boolean;

  @IsString()
  @IsOptional()
  seasonalStart?: string;

  @IsString()
  @IsOptional()
  seasonalEnd?: string;

  @IsArray()
  @IsOptional()
  benefits?: string[];

  @IsArray()
  @IsOptional()
  requirements?: string[];

  @IsArray()
  @IsOptional()
  questions?: string[];

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  expiresAt?: string;
}
