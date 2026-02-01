import { defineCollection, z } from 'astro:content';

// Visual state types for section-to-visual mapping
const visualStateSchema = z.object({
  type: z.enum(['code', 'ui', 'terminal', 'diagram']),
  content: z.string(),
  language: z.string().optional(),
  animationDelay: z.number().default(0),
  animationDuration: z.number().default(300),
});

// Section schema for narrative content
const sectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  codeBlock: z.object({
    code: z.string(),
    language: z.string(),
    filename: z.string().optional(),
    highlightLines: z.array(z.number()).optional(),
  }).optional(),
  visual: visualStateSchema.optional(),
  revealElements: z.array(z.object({
    id: z.string(),
    animation: z.enum(['fade', 'slide-up', 'scale']).default('fade'),
    delay: z.number().default(0),
  })).optional(),
});

// Project schema - extracted for type export
const projectSchema = z.object({
  // Required fields
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  // Note: slug is automatically generated from filename by Astro

  // Project metadata
  category: z.enum(['web-app', 'mobile-app', 'cli-tool', 'library', 'design-system']),
  status: z.enum(['completed', 'in-progress', 'concept']).default('completed'),
  featured: z.boolean().default(false),
  order: z.number().default(0),

  // Dates
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),

  // Tech stack
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),

  // Visual assets
  thumbnail: z.object({
    src: z.string(),
    alt: z.string(),
  }).optional(),
  ogImage: z.string().optional(),

  // External links
  links: z.object({
    live: z.string().url().optional(),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
  }).optional(),

  // Sections for narrative scroll
  sections: z.array(sectionSchema).min(1, 'At least one section is required'),

  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
});

// Project collection schema
const projectsCollection = defineCollection({
  type: 'content',
  schema: projectSchema,
});

export const collections = {
  projects: projectsCollection,
};

// Export types for use in components
export type Project = z.infer<typeof projectSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type VisualState = z.infer<typeof visualStateSchema>;
