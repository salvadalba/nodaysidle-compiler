import { describe, it, expect } from 'vitest';
import { z } from 'astro/zod';

// Recreate the schemas for testing
const visualStateSchema = z.object({
  type: z.enum(['code', 'terminal', 'ui', 'diagram']),
  content: z.string(),
  animation: z.enum(['fade', 'slide', 'scale', 'type']).optional(),
});

const codeBlockSchema = z.object({
  language: z.string(),
  code: z.string(),
  filename: z.string().optional(),
  highlightLines: z.array(z.number()).optional(),
});

const sectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  codeBlock: codeBlockSchema.optional(),
  visual: visualStateSchema.optional(),
});

const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  technologies: z.array(z.string()),
  sections: z.array(sectionSchema),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

describe('Content Collection Schema Validation', () => {
  describe('projectSchema', () => {
    it('should validate a complete valid project', () => {
      const validProject = {
        title: 'Test Project',
        description: 'A test project description',
        featured: true,
        order: 1,
        technologies: ['TypeScript', 'Svelte'],
        sections: [
          {
            id: 'intro',
            title: 'Introduction',
            content: 'This is the intro section',
          },
        ],
      };

      const result = projectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });

    it('should fail when title is missing', () => {
      const invalidProject = {
        description: 'A test project description',
        technologies: ['TypeScript'],
        sections: [],
      };

      const result = projectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });

    it('should fail when description is missing', () => {
      const invalidProject = {
        title: 'Test Project',
        technologies: ['TypeScript'],
        sections: [],
      };

      const result = projectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });

    it('should fail when technologies is not an array', () => {
      const invalidProject = {
        title: 'Test Project',
        description: 'A description',
        technologies: 'TypeScript',
        sections: [],
      };

      const result = projectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });

    it('should use default values for optional fields', () => {
      const minimalProject = {
        title: 'Minimal Project',
        description: 'A minimal project',
        technologies: [],
        sections: [],
      };

      const result = projectSchema.safeParse(minimalProject);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.featured).toBe(false);
        expect(result.data.order).toBe(0);
      }
    });
  });

  describe('sectionSchema', () => {
    it('should validate a complete section with code block', () => {
      const validSection = {
        id: 'section-1',
        title: 'First Section',
        content: 'Section content here',
        codeBlock: {
          language: 'typescript',
          code: 'const x = 1;',
          filename: 'example.ts',
        },
        visual: {
          type: 'code',
          content: 'Visual content',
          animation: 'type',
        },
      };

      const result = sectionSchema.safeParse(validSection);
      expect(result.success).toBe(true);
    });

    it('should fail when section id is missing', () => {
      const invalidSection = {
        title: 'Section Title',
        content: 'Content',
      };

      const result = sectionSchema.safeParse(invalidSection);
      expect(result.success).toBe(false);
    });

    it('should validate section without optional fields', () => {
      const minimalSection = {
        id: 'minimal',
        title: 'Minimal Section',
        content: 'Just content',
      };

      const result = sectionSchema.safeParse(minimalSection);
      expect(result.success).toBe(true);
    });
  });

  describe('visualStateSchema', () => {
    it('should validate all visual types', () => {
      const types = ['code', 'terminal', 'ui', 'diagram'] as const;

      types.forEach((type) => {
        const visual = { type, content: 'content' };
        const result = visualStateSchema.safeParse(visual);
        expect(result.success).toBe(true);
      });
    });

    it('should fail for invalid visual type', () => {
      const invalidVisual = {
        type: 'invalid',
        content: 'content',
      };

      const result = visualStateSchema.safeParse(invalidVisual);
      expect(result.success).toBe(false);
    });

    it('should validate all animation types', () => {
      const animations = ['fade', 'slide', 'scale', 'type'] as const;

      animations.forEach((animation) => {
        const visual = { type: 'code', content: 'content', animation };
        const result = visualStateSchema.safeParse(visual);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('codeBlockSchema', () => {
    it('should validate a complete code block', () => {
      const validCodeBlock = {
        language: 'typescript',
        code: 'const greeting = "Hello";',
        filename: 'greeting.ts',
        highlightLines: [1, 2, 3],
      };

      const result = codeBlockSchema.safeParse(validCodeBlock);
      expect(result.success).toBe(true);
    });

    it('should validate minimal code block', () => {
      const minimalCodeBlock = {
        language: 'javascript',
        code: 'console.log("hi");',
      };

      const result = codeBlockSchema.safeParse(minimalCodeBlock);
      expect(result.success).toBe(true);
    });

    it('should fail when language is missing', () => {
      const invalidCodeBlock = {
        code: 'some code',
      };

      const result = codeBlockSchema.safeParse(invalidCodeBlock);
      expect(result.success).toBe(false);
    });

    it('should fail when code is missing', () => {
      const invalidCodeBlock = {
        language: 'python',
      };

      const result = codeBlockSchema.safeParse(invalidCodeBlock);
      expect(result.success).toBe(false);
    });
  });
});
