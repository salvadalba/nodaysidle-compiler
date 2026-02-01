import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
  scrollProgress,
  shouldAnimate,
  sectionChanged,
  typingProgress,
} from '../../src/stores/scrollProgress';

describe('scrollProgress store', () => {
  beforeEach(() => {
    scrollProgress.reset();
  });

  describe('initial state', () => {
    it('should have null currentSection', () => {
      const state = get(scrollProgress);
      expect(state.currentSection).toBeNull();
    });

    it('should have progress at 0', () => {
      const state = get(scrollProgress);
      expect(state.progress).toBe(0);
    });

    it('should not be scrolling initially', () => {
      const state = get(scrollProgress);
      expect(state.isScrolling).toBe(false);
    });

    it('should have reducedMotion as false by default', () => {
      const state = get(scrollProgress);
      expect(state.reducedMotion).toBe(false);
    });
  });

  describe('setSection', () => {
    it('should update currentSection', () => {
      scrollProgress.setSection('section-1');
      const state = get(scrollProgress);
      expect(state.currentSection).toBe('section-1');
    });

    it('should move currentSection to previousSection on change', () => {
      scrollProgress.setSection('section-1');
      scrollProgress.setSection('section-2');
      const state = get(scrollProgress);
      expect(state.currentSection).toBe('section-2');
      expect(state.previousSection).toBe('section-1');
    });
  });

  describe('setProgress', () => {
    it('should update progress', () => {
      scrollProgress.setProgress(0.5);
      const state = get(scrollProgress);
      expect(state.progress).toBe(0.5);
    });

    it('should clamp progress to 0-1 range', () => {
      scrollProgress.setProgress(-0.5);
      expect(get(scrollProgress).progress).toBe(0);

      scrollProgress.setProgress(1.5);
      expect(get(scrollProgress).progress).toBe(1);
    });
  });

  describe('setReducedMotion', () => {
    it('should update reducedMotion state', () => {
      scrollProgress.setReducedMotion(true);
      const state = get(scrollProgress);
      expect(state.reducedMotion).toBe(true);
    });
  });

  describe('updateFromScroll', () => {
    it('should update all scroll-related state', () => {
      scrollProgress.updateFromScroll('section-2', 0.75, 0.5, 'down');
      const state = get(scrollProgress);
      expect(state.currentSection).toBe('section-2');
      expect(state.progress).toBe(0.75);
      expect(state.globalProgress).toBe(0.5);
      expect(state.direction).toBe('down');
      expect(state.isScrolling).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      scrollProgress.setSection('section-1');
      scrollProgress.setProgress(0.5);
      scrollProgress.reset();

      const state = get(scrollProgress);
      expect(state.currentSection).toBeNull();
      expect(state.progress).toBe(0);
    });
  });
});

describe('derived stores', () => {
  beforeEach(() => {
    scrollProgress.reset();
  });

  describe('shouldAnimate', () => {
    it('should be true when reducedMotion is false', () => {
      scrollProgress.setReducedMotion(false);
      expect(get(shouldAnimate)).toBe(true);
    });

    it('should be false when reducedMotion is true', () => {
      scrollProgress.setReducedMotion(true);
      expect(get(shouldAnimate)).toBe(false);
    });
  });

  describe('sectionChanged', () => {
    it('should be false initially', () => {
      expect(get(sectionChanged)).toBe(false);
    });

    it('should be true when section changes', () => {
      scrollProgress.setSection('section-1');
      scrollProgress.setSection('section-2');
      expect(get(sectionChanged)).toBe(true);
    });
  });

  describe('typingProgress', () => {
    it('should return scaled scroll progress when reducedMotion is false', () => {
      // Progress is scaled: 0-0.7 scroll maps to 0-1 typing
      scrollProgress.setProgress(0.35); // 0.35 / 0.7 = 0.5
      expect(get(typingProgress)).toBe(0.5);
    });

    it('should return 1 when reducedMotion is true', () => {
      scrollProgress.setReducedMotion(true);
      scrollProgress.setProgress(0.5);
      expect(get(typingProgress)).toBe(1);
    });
  });
});
