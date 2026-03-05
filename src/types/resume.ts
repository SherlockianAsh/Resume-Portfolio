export interface Profile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  summary: string;
  profileImage: string;
  [key: string]: unknown;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  displayOrder: number;
  [key: string]: unknown;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string | null;
  [key: string]: unknown;
}

export interface Skill {
  skillName: string;
  category: string;
  proficiencyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  [key: string]: unknown;
}

export interface Certification {
  certName: string;
  issuingOrg: string;
  issueDate: string;
  expiryDate: string | null;
  credentialUrl: string | null;
  [key: string]: unknown;
}

export interface Project {
  projectName: string;
  description: string;
  technologiesUsed: string;
  projectUrl: string | null;
  startDate: string;
  endDate: string | null;
  [key: string]: unknown;
}

export interface ResumeData {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  [key: string]: unknown;
}

