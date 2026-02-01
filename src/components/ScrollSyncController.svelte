<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { scrollProgress, type SectionInfo } from '../stores/scrollProgress';

  export let containerSelector: string = '.narrative-panel__content';
  export let sectionSelector: string = '[data-section-id]';

  let container: HTMLElement | null = null;
  let sectionElements: HTMLElement[] = [];
  let isBrowser = false;
  let lastScrollY = 0;
  let currentSectionIndex = 0;

  function calculateProgress() {
    if (!isBrowser || sectionElements.length === 0) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const direction = scrollTop > lastScrollY ? 'down' : scrollTop < lastScrollY ? 'up' : null;
    lastScrollY = scrollTop;

    // Find which section is currently most visible
    let bestSection: HTMLElement | null = null;
    let bestVisibility = 0;
    let bestIndex = 0;

    sectionElements.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const sectionHeight = rect.height;

      // Calculate how much of the section is in the viewport
      const visibleTop = Math.max(0, sectionTop);
      const visibleBottom = Math.min(windowHeight, sectionBottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      // Weight visibility by position - prefer sections near top of viewport
      const centerOfSection = sectionTop + sectionHeight / 2;
      const distanceFromIdealPoint = Math.abs(centerOfSection - windowHeight * 0.35);
      const positionWeight = 1 - (distanceFromIdealPoint / windowHeight);

      const visibility = (visibleHeight / sectionHeight) * Math.max(0.5, positionWeight);

      if (visibility > bestVisibility) {
        bestVisibility = visibility;
        bestSection = section;
        bestIndex = index;
      }
    });

    if (bestSection) {
      const rect = bestSection.getBoundingClientRect();
      const sectionId = bestSection.dataset.sectionId || `section-${bestIndex}`;

      // Calculate progress within the section
      // Progress goes from 0 to 1 as the section scrolls from bottom of viewport to top
      const sectionProgress = Math.max(0, Math.min(1,
        1 - (rect.top / (windowHeight * 0.6))
      ));

      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const globalProgress = documentHeight > 0 ? scrollTop / documentHeight : 0;

      currentSectionIndex = bestIndex;

      scrollProgress.updateFromScroll(
        sectionId,
        sectionProgress,
        globalProgress,
        direction
      );
    }
  }

  function handleScroll() {
    if (isBrowser) {
      requestAnimationFrame(calculateProgress);
    }
  }

  function initializeSections() {
    if (!container) return;

    const elements = container.querySelectorAll(sectionSelector);
    sectionElements = Array.from(elements) as HTMLElement[];

    // Initial calculation
    calculateProgress();
  }

  onMount(() => {
    isBrowser = true;
    container = document.querySelector(containerSelector);

    if (!container) {
      console.warn(`ScrollSyncController: Container not found: ${containerSelector}`);
      return;
    }

    // Initialize after a short delay to ensure DOM is ready
    setTimeout(initializeSections, 50);
    setTimeout(initializeSections, 200);
    setTimeout(initializeSections, 500);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', initializeSections, { passive: true });
  });

  onDestroy(() => {
    if (isBrowser) {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', initializeSections);
    }

    scrollProgress.reset();
  });
</script>

<slot />
