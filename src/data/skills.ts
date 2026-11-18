// Tools shown in the skills section and as floating tiles in the hero.
// color is the tool's brand color, used for its dot.

export type SkillGroup = 'Languages' | 'Frameworks' | 'AI' | 'Cloud & DevOps' | 'Data & tools';

export const skillGroups: SkillGroup[] = ['Languages', 'Frameworks', 'AI', 'Cloud & DevOps', 'Data & tools'];

export interface Skill {
  name: string;
  group: SkillGroup;
  color: string;
}

export const skills: Skill[] = [
  { name: 'JavaScript', group: 'Languages', color: '#f7df1e' },
  { name: 'TypeScript', group: 'Languages', color: '#4a90d9' },
  { name: 'Python', group: 'Languages', color: '#4b8bbe' },
  { name: 'Java', group: 'Languages', color: '#f89820' },
  { name: 'SQL', group: 'Languages', color: '#b0bec5' },
  { name: 'HTML', group: 'Languages', color: '#e34f26' },
  { name: 'CSS', group: 'Languages', color: '#4d9de0' },
  { name: 'Next.js', group: 'Frameworks', color: '#ffffff' },
  { name: 'React', group: 'Frameworks', color: '#61dafb' },
  { name: 'Vue.js', group: 'Frameworks', color: '#4fc08d' },
  { name: 'Flutter', group: 'Frameworks', color: '#54c5f8' },
  { name: 'FastAPI', group: 'Frameworks', color: '#05b8a6' },
  { name: 'Node.js', group: 'Frameworks', color: '#5fa04e' },
  { name: 'Laravel', group: 'Frameworks', color: '#ff2d20' },
  { name: 'RAG', group: 'AI', color: '#ef5da8' },
  { name: 'Agentic AI (Claude)', group: 'AI', color: '#d97757' },
  { name: 'LLM Integration', group: 'AI', color: '#9db2ad' },
  { name: 'AWS', group: 'Cloud & DevOps', color: '#ff9900' },
  { name: 'Docker', group: 'Cloud & DevOps', color: '#2496ed' },
  { name: 'NGINX', group: 'Cloud & DevOps', color: '#1fb456' },
  { name: 'Linux', group: 'Cloud & DevOps', color: '#fcc624' },
  { name: 'Jenkins', group: 'Cloud & DevOps', color: '#d24939' },
  { name: 'PostgreSQL', group: 'Data & tools', color: '#6f8fe8' },
  { name: 'MySQL', group: 'Data & tools', color: '#5e9ccf' },
  { name: 'Jira', group: 'Data & tools', color: '#4c9aff' },
  { name: 'WordPress', group: 'Data & tools', color: '#4aa3df' },
  { name: 'Photoshop', group: 'Data & tools', color: '#31a8ff' },
  { name: 'Lightroom', group: 'Data & tools', color: '#31a8ff' },
];
