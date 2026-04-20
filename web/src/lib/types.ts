export type UserRole = "candidate" | "employer";

export type ContractType = "CLT" | "PJ" | "Temporário" | "Estágio" | "Freelance" | "Autônomo";
export type SalaryPeriod = "mês" | "semana" | "dia" | "hora";
export type WorkRegime = "Presencial" | "Remoto" | "Híbrido";
export type ExperienceLevel = "Sem experiência" | "Júnior" | "Pleno" | "Sênior";
export type SkillLevel = "Básico" | "Intermediário" | "Avançado";
export type ApplicationStatus = "Aplicada" | "Em análise" | "Entrevista" | "Aprovado" | "Recusado";
export type AvailabilityType = "Imediata" | "Data específica" | "Apenas sazonal";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

export interface Skill {
  name: string;
  level: SkillLevel;
  validated?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  course: string;
  level: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface CandidateProfile {
  userId: string;
  bio: string;
  avatar?: string;
  banner?: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: { name: string; level: string }[];
  salaryMin?: number;
  salaryMax?: number;
  salaryVisible: boolean;
  availability: AvailabilityType;
  availabilityDate?: string;
  desiredContracts: ContractType[];
  portfolio: { title: string; url: string; type: "link" | "image" | "file" }[];
  matchScore?: number;
  profileCompleteness: number;
  city: string;
  state: string;
}

export interface EmployerProfile {
  userId: string;
  companyName: string;
  logo?: string;
  banner?: string;
  description: string;
  sector: string;
  size: "MEI" | "Micro" | "Pequena" | "Média" | "Grande";
  city: string;
  state: string;
  website?: string;
  benefits: string[];
  rating: number;
  reviewCount: number;
  activeJobs: number;
}

export interface JobQuestion {
  id: string;
  text: string;
  required: boolean;
}

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  employerLogo?: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  contractType: ContractType;
  regime: WorkRegime;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: SalaryPeriod;
  experience: ExperienceLevel;
  city: string;
  state: string;
  seasonal: boolean;
  seasonStart?: string;
  seasonEnd?: string;
  featured: boolean;
  deadline: string;
  publishedAt: string;
  applications: number;
  maxApplications?: number;
  questions: JobQuestion[];
  benefits: string[];
  matchScore?: number;
  saved?: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  employerName: string;
  employerLogo?: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  coverLetter?: string;
  matchScore?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  sentAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar?: string;
  employerId: string;
  employerName: string;
  employerLogo?: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  messages: Message[];
}

export interface Notification {
  id: string;
  type: "new_job" | "application_update" | "new_message" | "job_expiring" | "seasonal";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
