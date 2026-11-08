export type CertificateCategory = 'all' | 'ai' | 'security' | 'programming' | 'other';

export interface Certificate {
  id: string;
  issuer: string;
  name: string;
  category: CertificateCategory;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tag: 'CONCEPT' | 'HACKATHON';
  stage: string;
  description: string;
  points?: string[];
  tools?: string;
  role?: string;
  contribution?: string;
}

export interface HackathonAchievement {
  id: string;
  title: string;
  badge?: string;
  highlight?: boolean;
  date?: string;
  organizer?: string;
  team?: string;
  description: string;
  project?: string;
  hashtags?: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period?: string;
  score: string;
  details?: string;
  isMain?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}
