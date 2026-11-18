import projectData from './projectData.json';

// Typed view of projectData.json. Edit the JSON to add or change a project.
export interface Project {
  title: string;
  category: string;
  description: string;
  contributionTitle: string;
  contribution: string;
  functionTitle: string;
  functionDescription: string;
  imageAlt: string;
  imageUrl: string;
  url: string;
  offline?: boolean;
}

export const projects: Project[] = projectData;

// Filter categories, in the order they first appear in the data
export const projectCategories = [...new Set(projects.map((project) => project.category))];

// imageUrl is a bare filename in src/assets/ (case-sensitive)
export function projectImage(project: Project): string | undefined {
  return project.imageUrl ? new URL(`../assets/${project.imageUrl}`, import.meta.url).href : undefined;
}

// Placeholder text for a project without an image: "AI", or the category's initials
export function projectInitials(project: Project): string {
  if (project.category === 'AI') return 'AI';
  return project.category
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}
