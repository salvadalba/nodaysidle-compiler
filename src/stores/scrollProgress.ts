import { writable, derived, type Readable } from 'svelte/store';

export interface ScrollState {
  currentSection: string | null;
  previousSection: string | null;
  progress: number; // 0-1 within current section
  globalProgress: number; // 0-1 across all sections
  isScrolling: boolean;
  direction: 'up' | 'down' | null;
  reducedMotion: boolean;
}

export interface SectionInfo {
  id: string;
  index: number;
  element: HTMLElement;
  top: number;
  height: number;
}

const initialState: ScrollState = {
  currentSection: null,
  previousSection: null,
  progress: 0,
  globalProgress: 0,
  isScrolling: false,
  direction: null,
  reducedMotion: false,
};

function createScrollProgressStore() {
  const { subscribe, set, update } = writable<ScrollState>(initialState);

  let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  let currentState: ScrollState = initialState;

  // Keep track of current state for synchronous access
  subscribe(state => {
    currentState = state;
  });

  return {
    subscribe,

    getCurrentSection(): string | null {
      return currentState.currentSection;
    },

    setSection(sectionId: string | null) {
      update((state) => ({
        ...state,
        previousSection: state.currentSection,
        currentSection: sectionId,
      }));
    },

    setProgress(progress: number) {
      update((state) => ({
        ...state,
        progress: Math.max(0, Math.min(1, progress)),
      }));
    },

    setGlobalProgress(progress: number) {
      update((state) => ({
        ...state,
        globalProgress: Math.max(0, Math.min(1, progress)),
      }));
    },

    setScrolling(isScrolling: boolean) {
      update((state) => ({
        ...state,
        isScrolling,
      }));
    },

    setDirection(direction: 'up' | 'down' | null) {
      update((state) => ({
        ...state,
        direction,
      }));
    },

    setReducedMotion(reducedMotion: boolean) {
      update((state) => ({
        ...state,
        reducedMotion,
      }));
    },

    updateFromScroll(
      sectionId: string | null,
      progress: number,
      globalProgress: number,
      direction: 'up' | 'down' | null
    ) {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      update((state) => ({
        ...state,
        previousSection: sectionId !== state.currentSection ? state.currentSection : state.previousSection,
        currentSection: sectionId,
        progress: Math.max(0, Math.min(1, progress)),
        globalProgress: Math.max(0, Math.min(1, globalProgress)),
        direction,
        isScrolling: true,
      }));

      scrollTimeout = setTimeout(() => {
        update((state) => ({
          ...state,
          isScrolling: false,
        }));
      }, 150);
    },

    reset() {
      set(initialState);
    },
  };
}

export const scrollProgress = createScrollProgressStore();

// Derived store for animation triggers
export const shouldAnimate: Readable<boolean> = derived(
  scrollProgress,
  ($scrollProgress) => !$scrollProgress.reducedMotion
);

// Derived store for section change detection
export const sectionChanged: Readable<boolean> = derived(
  scrollProgress,
  ($scrollProgress) =>
    $scrollProgress.currentSection !== $scrollProgress.previousSection &&
    $scrollProgress.currentSection !== null
);

// Derived store for typing animation progress
// Scale progress so typing completes at 70% scroll through section
export const typingProgress: Readable<number> = derived(
  scrollProgress,
  ($scrollProgress) => {
    if ($scrollProgress.reducedMotion) {
      return 1; // Show all text instantly when reduced motion is preferred
    }
    // Scale progress: 0-0.7 scroll maps to 0-1 typing progress
    // This ensures typing completes before leaving the section
    const scaled = Math.min(1, $scrollProgress.progress / 0.7);
    return scaled;
  }
);
