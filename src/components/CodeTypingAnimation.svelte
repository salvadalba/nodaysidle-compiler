<script lang="ts">
  import { onMount } from 'svelte';
  import { typingProgress, scrollProgress } from '../stores/scrollProgress';
  import type { ColoredChar } from '../lib/highlighter';

  export let code: string = '';
  export let language: string = 'typescript';
  export let progress: number | undefined = undefined;
  export let showCursor: boolean = true;
  export let highlightedChars: ColoredChar[] = [];
  export let className: string = '';

  let reducedMotion = false;
  let mounted = false;

  // Use provided progress or fall back to store
  $: effectiveProgress = progress !== undefined ? progress : $typingProgress;

  // Calculate visible characters based on progress
  $: visibleLength = reducedMotion
    ? highlightedChars.length
    : Math.floor(highlightedChars.length * effectiveProgress);

  $: visibleChars = highlightedChars.slice(0, visibleLength);
  $: isComplete = visibleLength >= highlightedChars.length;

  // Group visible chars by line for rendering
  $: lines = groupCharsByLine(visibleChars);

  function groupCharsByLine(chars: ColoredChar[]): ColoredChar[][] {
    const result: ColoredChar[][] = [[]];
    let currentLine = 0;

    for (const char of chars) {
      if (char.char === '\n') {
        result.push([]);
        currentLine++;
      } else {
        result[currentLine].push(char);
      }
    }

    return result;
  }

  onMount(() => {
    mounted = true;
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

<pre class="code-typing {className}" aria-label={code}><code aria-hidden="true">{#each lines as line, lineIndex}{#if lineIndex > 0}
{/if}{#each line as char}<span style="color: {char.color}{char.fontStyle ? `; font-style: ${char.fontStyle}` : ''}">{char.char}</span>{/each}{/each}{#if showCursor && !isComplete && mounted && !reducedMotion}<span class="code-typing__cursor">|</span>{/if}</code></pre>

<style>
  .code-typing {
    margin: 0;
    padding: 0;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: var(--leading-code);
    background: transparent;
    overflow-x: auto;
    white-space: pre;
  }

  .code-typing code {
    display: block;
  }

  .code-typing__cursor {
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

  @media (prefers-reduced-motion: reduce) {
    .code-typing__cursor {
      animation: none;
      opacity: 1;
    }
  }
</style>
