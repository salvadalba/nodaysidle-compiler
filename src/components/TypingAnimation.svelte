<script lang="ts">
  import { onMount } from 'svelte';
  import { typingProgress, scrollProgress } from '../stores/scrollProgress';

  export let text: string = '';
  export let progress: number | undefined = undefined;
  export let showCursor: boolean = true;
  export let cursorChar: string = '|';
  export let className: string = '';

  let reducedMotion = false;
  let mounted = false;

  // Use provided progress or fall back to store
  $: effectiveProgress = progress !== undefined ? progress : $typingProgress;

  // Calculate visible characters based on progress
  $: visibleLength = Math.floor(text.length * effectiveProgress);
  $: visibleText = reducedMotion ? text : text.slice(0, visibleLength);
  $: isComplete = visibleLength >= text.length;

  onMount(() => {
    mounted = true;
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = mediaQuery.matches;
    scrollProgress.setReducedMotion(reducedMotion);

    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      scrollProgress.setReducedMotion(reducedMotion);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  });
</script>

<span class="typing-animation {className}" aria-label={text}>
  <span class="typing-animation__text" aria-hidden="true">
    {#each visibleText.split('\n') as line, i}
      {#if i > 0}<br />{/if}{line}
    {/each}
  </span>
  {#if showCursor && !isComplete && mounted && !reducedMotion}
    <span class="typing-animation__cursor" aria-hidden="true">{cursorChar}</span>
  {/if}
</span>

<style>
  .typing-animation {
    display: inline;
    font-family: var(--font-mono);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .typing-animation__text {
    color: inherit;
  }

  .typing-animation__cursor {
    display: inline-block;
    color: var(--color-terminal-green);
    animation: cursor-blink 1s step-end infinite;
    margin-left: 1px;
  }

  @keyframes cursor-blink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0;
    }
  }

  /* Disable cursor animation for reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .typing-animation__cursor {
      animation: none;
      opacity: 1;
    }
  }
</style>
