export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured_image: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  seo_score: number;
  is_published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  ai_suggestions?: string[];
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  og_image: string;
  seo_score: number;
  is_published: boolean;
  sections?: Section[];
}

export interface Section {
  id: string;
  type: 'hero' | 'text' | 'projects' | 'cta' | 'testimonials' | 'stats' | 'gallery';
  content: any;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  impact_metrics: Record<string, string>;
  image: string;
  technologies: string[];
  featured: boolean;
  case_study: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface AnalyticsEvent {
  id: string;
  visitor_id: string;
  event_type: string;
  page_path: string;
  referrer?: string;
  device_type: string;
  browser: string;
  os: string;
  country: string;
  city?: string;
  timestamp: string;
}

export interface ChatbotKnowledge {
  id: string;
  category: string;
  question: string;
  answer: string;
  ai_trained?: boolean;
  created_at?: string;
}

export interface SEOAudit {
  page_id: string;
  score: number;
  issues: SEOIssue[];
  suggestions: string[];
}

export interface SEOIssue {
  type: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  fix: string;
}

export interface AIRequest {
  type: 'content_generate' | 'seo_optimize' | 'improve' | 'analyze';
  content: string;
  context?: string;
}
