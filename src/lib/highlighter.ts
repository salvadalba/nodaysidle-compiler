import { createHighlighter, type Highlighter, type ThemedToken } from 'shiki';

let highlighterInstance: Highlighter | null = null;

const SUPPORTED_LANGUAGES = ['typescript', 'javascript', 'tsx', 'jsx', 'css', 'html', 'json', 'swift', 'bash', 'shell'] as const;
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Terminal-inspired theme matching our design tokens
const terminalTheme = {
  name: 'terminal-dark',
  type: 'dark' as const,
  colors: {
    'editor.background': '#0a0a0f',
    'editor.foreground': '#c8c8d8',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#6272a4' },
    },
    {
      scope: ['string', 'string.quoted'],
      settings: { foreground: '#f1fa8c' },
    },
    {
      scope: ['constant.numeric', 'constant.language'],
      settings: { foreground: '#ffb86c' },
    },
    {
      scope: ['keyword', 'storage.type', 'storage.modifier'],
      settings: { foreground: '#ff79c6' },
    },
    {
      scope: ['entity.name.function', 'support.function'],
      settings: { foreground: '#50fa7b' },
    },
    {
      scope: ['variable', 'variable.other', 'variable.parameter'],
      settings: { foreground: '#bd93f9' },
    },
    {
      scope: ['entity.name.type', 'entity.name.class', 'support.type'],
      settings: { foreground: '#8be9fd' },
    },
    {
      scope: ['punctuation', 'meta.brace'],
      settings: { foreground: '#c8c8d8' },
    },
    {
      scope: ['entity.name.tag'],
      settings: { foreground: '#ff79c6' },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: '#50fa7b' },
    },
  ],
};

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: ['github-dark'],
      langs: [...SUPPORTED_LANGUAGES],
    });
  }
  return highlighterInstance;
}

export interface HighlightedToken {
  content: string;
  color: string;
  fontStyle?: string;
}

export interface HighlightedLine {
  tokens: HighlightedToken[];
  content: string;
}

export async function highlightCode(
  code: string,
  language: string
): Promise<HighlightedLine[]> {
  const highlighter = await getHighlighter();

  // Normalize language name
  const lang = normalizeLanguage(language);

  const tokens = highlighter.codeToTokens(code, {
    lang,
    theme: 'github-dark',
  });

  return tokens.tokens.map((lineTokens, lineIndex) => {
    const line: HighlightedLine = {
      tokens: lineTokens.map((token) => ({
        content: token.content,
        color: token.color || '#c8c8d8',
        fontStyle: token.fontStyle === 1 ? 'italic' : undefined,
      })),
      content: lineTokens.map((t) => t.content).join(''),
    };
    return line;
  });
}

function normalizeLanguage(lang: string): SupportedLanguage {
  const normalized = lang.toLowerCase();

  const aliases: Record<string, SupportedLanguage> = {
    ts: 'typescript',
    js: 'javascript',
    sh: 'bash',
    zsh: 'bash',
  };

  if (normalized in aliases) {
    return aliases[normalized];
  }

  if (SUPPORTED_LANGUAGES.includes(normalized as SupportedLanguage)) {
    return normalized as SupportedLanguage;
  }

  return 'typescript'; // Default fallback
}

// Generate HTML for a single token
export function tokenToHtml(token: HighlightedToken): string {
  const style = `color: ${token.color}${token.fontStyle ? `; font-style: ${token.fontStyle}` : ''}`;
  return `<span style="${style}">${escapeHtml(token.content)}</span>`;
}

// Escape HTML special characters
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Convert highlighted lines to flat character array with colors
export interface ColoredChar {
  char: string;
  color: string;
  fontStyle?: string;
}

export function linesToColoredChars(lines: HighlightedLine[]): ColoredChar[] {
  const chars: ColoredChar[] = [];

  lines.forEach((line, lineIndex) => {
    line.tokens.forEach((token) => {
      for (const char of token.content) {
        chars.push({
          char,
          color: token.color,
          fontStyle: token.fontStyle,
        });
      }
    });

    // Add newline between lines (except for last line)
    if (lineIndex < lines.length - 1) {
      chars.push({ char: '\n', color: '#c8c8d8' });
    }
  });

  return chars;
}
