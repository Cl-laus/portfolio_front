
export interface Technology {
  id: number;
  name: string;
  icon: string;
  category: string;
}

export interface Image {
  id: number;
  url: string;
  displayOrder: number;
}

export interface Project {
  id: number;
  displayOrder: number;
  title: string;
  summary: string;
  description: string;
  links: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
  technologies: Technology[];
  images: Image[];
}
export interface SocialNetwork {
  id: number;
  name: string;
  icon: string;
  url: string;
}

export interface Information {
  id: number;
  fullName: string;
  jobTitle: string;
  tagLine: string;
  introText: string;
  photoPath: string | null;
  aboutTitle: string | null;
  aboutText: string;
  email: string;
  cv: string | null;
}