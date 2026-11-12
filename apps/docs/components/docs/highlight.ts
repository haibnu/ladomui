// A small, dependency-free highlighter for the docs code blocks: TSX/JS, CSS and shell. It only
// has to make the examples on this site readable, not parse every corner of each language.

export type Language = 'tsx' | 'css' | 'bash' | 'text';
export type TokenKind = 'plain' | 'output' | 'comment' | 'string' | 'keyword' | 'tag' | 'attr' | 'fn' | 'number' | 'punct' | 'command' | 'flag' | 'prop';
export type Token = { kind: TokenKind; text: string };

const SHELL = /^(npx|npm|pnpm|yarn|node|cd|git|curl|export [A-Z_]+=|bun|bunx|mkdir|LADOM_UI_[A-Z_]+=)\b/;

/** The language of a snippet when none is given. */
export function detectLanguage(code: string): Language {
  const lines = code.split('\n').filter((l) => l.trim());
  // A command, or a terminal session that starts with one (the rest is its output).
  if (lines.length && SHELL.test(lines[0]!.trim())) return 'bash';
  if (/(^|\n)\s*(import|export)\s|\b(const|function|return)\b|<[A-Za-z]|=>/.test(code)) return 'tsx';
  if (/^\s*(@[\w-]+|:root|[.#]?[\w-]+[^{\n]*)\{/m.test(code) || /^\s*(--[\w-]+\s*:|@import\b)/m.test(code)) return 'css';
  // Anything else (Figma variant properties, prompts) is shown as plain text.
  return 'text';
}

const RULES: Record<Exclude<Language, 'text'>, [TokenKind, RegExp][]> = {
  tsx: [
    ['comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    ['string', /'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`/y],
    ['tag', /(?<=<\/?)[A-Za-z][\w.]*/y],
    ['keyword', /\b(?:import|from|export|default|function|return|const|let|var|if|else|as|type|interface|async|await|new|true|false|null|undefined|extends|typeof)\b/y],
    ['attr', /\b[a-zA-Z][\w-]*(?==)/y],
    ['fn', /\b[a-zA-Z_$][\w$]*(?=\()/y],
    ['number', /\b\d+(?:\.\d+)?\b/y],
    ['punct', /[{}()[\]<>/=;:,.*?!&|+-]/y],
  ],
  css: [
    ['comment', /\/\*[\s\S]*?\*\//y],
    ['string', /'[^'\n]*'|"[^"\n]*"/y],
    ['attr', /--[\w-]+/y],
    ['prop', /\b[a-z-]+(?=\s*:)/y],
    ['fn', /\b[a-z-]+(?=\()/y],
    ['number', /-?\b\d+(?:\.\d+)?(?:px|rem|em|%|ms|s|deg|vh|vw)?\b/y],
    ['keyword', /@[\w-]+|![a-z]+/y],
    ['punct', /[{}();:,]/y],
  ],
  bash: [
    ['comment', /#[^\n]*/y],
    ['string', /'[^'\n]*'|"[^"\n]*"/y],
    ['command', /(?<=^|\n|&&\s*|\|\s*)[\w.-]+=?\S*/y],
    ['flag', /(?<=\s)--?[\w-]+/y],
    ['punct', /&&|\||[;=]/y],
  ],
};

function tokenize(code: string, rules: [TokenKind, RegExp][]): Token[] {
  const tokens: Token[] = [];
  let plain = '';
  let i = 0;
  while (i < code.length) {
    let matched = false;
    for (const [kind, re] of rules) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m[0]) {
        if (plain) tokens.push({ kind: 'plain', text: plain });
        plain = '';
        tokens.push({ kind, text: m[0] });
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) plain += code[i++];
  }
  if (plain) tokens.push({ kind: 'plain', text: plain });
  return tokens;
}

/** Tokens per line, so the block can number its lines. */
export function highlight(code: string, language: Language): Token[][] {
  const tokens: Token[] = [];
  if (language === 'text') tokens.push({ kind: 'plain', text: code });
  else if (language === 'bash') {
    // Lines that are not commands are the output of the one above; they stay plain.
    code.split('\n').forEach((line, n) => {
      if (n > 0) tokens.push({ kind: 'plain', text: '\n' });
      if (!line) return;
      if (SHELL.test(line.trim()) || line.trim().startsWith('#')) tokens.push(...tokenize(line, RULES.bash));
      else tokens.push({ kind: 'output', text: line });
    });
  }
  else tokens.push(...tokenize(code, RULES[language]));
  const lines: Token[][] = [[]];
  for (const t of tokens) {
    t.text.split('\n').forEach((part, n) => {
      if (n > 0) lines.push([]);
      if (part) lines[lines.length - 1]!.push({ kind: t.kind, text: part });
    });
  }
  return lines;
}

export type PackageManager = 'npm' | 'pnpm' | 'yarn';
export const PACKAGE_MANAGERS: PackageManager[] = ['npm', 'pnpm', 'yarn'];

/** The same command for each package manager, when the snippet is an npx or npm command. */
export function forPackageManager(code: string, pm: PackageManager) {
  if (pm === 'npm') return code;
  const run = pm === 'pnpm' ? 'pnpm dlx' : 'yarn dlx';
  const add = pm === 'pnpm' ? 'pnpm add' : 'yarn add';
  return code
    .replace(/(^|&&\s*|\n|=\S+\s)npx /g, `$1${run} `)
    .replace(/(^|&&\s*|\n)npm (?:install|i) /g, `$1${add} `);
}

export const hasPackageManagerTabs = (code: string) => /(^|&&\s*|\n|=\S+\s)(npx |npm (install|i) )/.test(code);
