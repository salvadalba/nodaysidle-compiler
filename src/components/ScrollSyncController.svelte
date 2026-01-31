<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { scrollProgress, type SectionInfo } from '../stores/scrollProgress';

  export let containerSelector: string = '.narrative-panel__content';
  export let sectionSelector: string = '[data-section-id]';
  export let threshold: number = 0.1;

  let container: HTMLElement | null = null;
  let sections: SectionInfo[] = [];
  let observer: IntersectionObserver | null = null;
  let lastScrollY = 0;
  let isBrowser = false;

  function updateSectionInfo() {
    if (!isBrowser || !container) return;

    const sectionElements = container.querySelectorAll(sectionSelector);
    sections = Array.from(sectionElements).map((el, index) => {
      const element = el as HTMLElement;
      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      return {
        id: element.dataset.sectionId || `section-${index}`,
        index,
        element,
        top: rect.top + scrollTop,
        height: rect.height,
      };
    });
  }

  function calculateProgress() {
    if (!isBrowser || !container || sections.length === 0) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const viewportCenter = scrollTop + windowHeight * 0.4;

    const direction = scrollTop > lastScrollY ? 'down' : scrollTop < lastScrollY ? 'up' : null;
    lastScrollY = scrollTop;

    let currentSection: SectionInfo | null = null;
    let sectionProgress = 0;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.top;
      const sectionBottom = sectionTop + section.height;

      if (viewportCenter >= sectionTop && viewportCenter < sectionBottom) {
        currentSection = section;
        sectionProgress = (viewportCenter - sectionTop) / section.height;
        break;
      }
    }

    if (!currentSection && sections.length > 0) {
      if (viewportCenter < sections[0].top) {
        currentSection = sections[0];
        sectionProgress = 0;
      } else {
        currentSection = sections[sections.length - 1];
        sectionProgress = 1;
      }
    }

    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const globalProgress = documentHeight > 0 ? scrollTop / documentHeight : 0;

    if (currentSection) {
      scrollProgress.updateFromScroll(
        currentSection.id,
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

  function handleResize() {
    updateSectionInfo();
    calculateProgress();
  }

  onMount(() => {
    isBrowser = true;
    container = document.querySelector(containerSelector);

    if (!container) {
      console.warn(`ScrollSyncController: Container not found: ${containerSelector}`);
      return;
    }

    updateSectionInfo();
    calculateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = (entry.target as HTMLElement).dataset.sectionId;
          if (entry.isIntersecting && sectionId) {
            // Section visibility tracked
          }
        });
      },
      {
        threshold: [0, threshold, 0.5, 1],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    sections.forEach((section) => {
      if (observer) {
        observer.observe(section.element);
      }
    });
  });

  onDestroy(() => {
    if (isBrowser) {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (observer) {
        observer.disconnect();
      }
    }

    scrollProgress.reset();
  });
</script>

<slot />
