import type { ContentBlock } from '@/types';

// ── Card Types ────────────────────────────────────────────────────────────────

export type CardType =
  | 'text'
  | 'key-term'
  | 'callout'
  | 'visual'
  | 'interactive'
  | 'quick-check'
  | 'dialogue';

export interface BaseCard {
  id: string;
  type: CardType;
}

export interface TextCard extends BaseCard {
  type: 'text';
  text: string;
  illustration?: {
    src?: string;
    alt: string;
    caption?: string;
  };
}

export interface KeyTermCard extends BaseCard {
  type: 'key-term';
  term: string;
  definition: string;
}

export interface CalloutCard extends BaseCard {
  type: 'callout';
  variant: 'chip-says' | 'fun-fact' | 'tip' | 'warning' | 'key-takeaway';
  text: string;
  title?: string;
}

export interface VisualCard extends BaseCard {
  type: 'visual';
  src?: string;
  alt: string;
  caption?: string;
  description?: string;
}

export interface InteractiveCard extends BaseCard {
  type: 'interactive';
  data: Record<string, unknown>;
}

export interface DialogueCard extends BaseCard {
  type: 'dialogue';
  character: string;
  expression?: string;
  text: string;
}

export interface QuickCheckOption {
  text: string;
  isCorrect: boolean;
}

export interface QuickCheckCard extends BaseCard {
  type: 'quick-check';
  question: string;
  options: QuickCheckOption[];
}

export type LessonCard =
  | TextCard
  | KeyTermCard
  | CalloutCard
  | VisualCard
  | InteractiveCard
  | QuickCheckCard
  | DialogueCard;

// ── Sentence Splitting ────────────────────────────────────────────────────────

/**
 * Split text into sentences. Handles common abbreviations, numbers with
 * decimals, and avoids splitting on things like "Mr.", "e.g.", "Rs.", etc.
 */
function splitSentences(text: string): string[] {
  if (!text || !text.trim()) return [];

  // Normalize whitespace
  const normalized = text.replace(/\s+/g, ' ').trim();

  // Split on sentence-ending punctuation followed by a space and uppercase letter,
  // or followed by end of string. Avoid splitting on abbreviations.
  const abbreviations = /(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|e\.g|i\.e|Rs|St|Inc|Ltd|Co|no|No|approx)\./g;

  // Replace abbreviations temporarily
  let safe = normalized;
  const replacements: string[] = [];
  safe = safe.replace(abbreviations, (match) => {
    replacements.push(match);
    return `__ABBR${replacements.length - 1}__`;
  });

  // Also protect decimals in numbers like "3.5"
  safe = safe.replace(/(\d)\.(\d)/g, '$1__DOT__$2');

  // Split on sentence boundaries
  const parts = safe.split(/(?<=[.!?])\s+/);

  // Restore abbreviations and decimals
  return parts
    .map((part) => {
      let restored = part;
      restored = restored.replace(/__ABBR(\d+)__/g, (_, idx) => replacements[Number(idx)]);
      restored = restored.replace(/__DOT__/g, '.');
      return restored.trim();
    })
    .filter((s) => s.length > 0);
}

/**
 * Count sentences in text.
 */
function countSentences(text: string): number {
  return splitSentences(text).length;
}

/**
 * Group sentences into chunks of a given size.
 */
function chunkSentences(sentences: string[], chunkSize: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += chunkSize) {
    chunks.push(sentences.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
}

// ── Quick Check Generation ────────────────────────────────────────────────────

/**
 * Generate a quick check question from a key-term block.
 */
function generateKeyTermQuickCheck(
  term: string,
  definition: string,
  id: string
): QuickCheckCard {
  const wrongAnswers = generateWrongAnswers(definition);

  // Shuffle options — put correct answer at a random position
  const options: QuickCheckOption[] = [
    { text: definition, isCorrect: true },
    ...wrongAnswers.map((text) => ({ text, isCorrect: false })),
  ];

  // Deterministic shuffle based on term length to be consistent
  const shuffled = shuffleWithSeed(options, term.length);

  return {
    id,
    type: 'quick-check',
    question: `What is ${term}?`,
    options: shuffled,
  };
}

/**
 * Generate a quick check from text content — "Which of these is true?"
 */
function generateTextQuickCheck(
  textContent: string,
  id: string
): QuickCheckCard | null {
  const sentences = splitSentences(textContent);
  if (sentences.length < 1) return null;

  // Pick the most substantive sentence (longest) as the correct answer
  const sortedByLength = [...sentences].sort((a, b) => b.length - a.length);
  const correctStatement = sortedByLength[0];

  // Create two wrong alternatives by negating/altering the statement
  const wrongOptions = generateWrongStatements(correctStatement);

  const options: QuickCheckOption[] = [
    { text: correctStatement, isCorrect: true },
    ...wrongOptions.map((text) => ({ text, isCorrect: false })),
  ];

  const shuffled = shuffleWithSeed(options, textContent.length);

  return {
    id,
    type: 'quick-check',
    question: 'Which of these is true?',
    options: shuffled,
  };
}

/**
 * Generate plausible wrong answers for a definition.
 */
function generateWrongAnswers(definition: string): string[] {
  const words = definition.split(' ');

  // Strategy 1: Swap key adjectives/verbs to create wrong definitions
  const wrong1 = words.length > 4
    ? `A process that is unrelated to ${words.slice(Math.floor(words.length / 2)).join(' ')}`
    : `The opposite of ${definition.toLowerCase()}`;

  const wrong2 = words.length > 3
    ? `A term used in a completely different context than ${words.slice(0, 3).join(' ').toLowerCase()}`
    : `Something entirely different from what this describes`;

  return [wrong1, wrong2];
}

/**
 * Generate wrong statements from a correct one.
 */
function generateWrongStatements(correct: string): string[] {
  // Strategy: negate or add "not" to the statement
  const negated = correct.includes(' is ')
    ? correct.replace(' is ', ' is not ')
    : correct.includes(' are ')
    ? correct.replace(' are ', ' are not ')
    : `It is not true that ${correct.charAt(0).toLowerCase()}${correct.slice(1)}`;

  // Strategy 2: Replace with a generically wrong statement
  const generic = correct.length > 50
    ? `${correct.split(' ').slice(0, 4).join(' ')} has no practical applications in real life.`
    : 'This concept has been completely disproven by modern research.';

  return [negated, generic];
}

/**
 * Deterministic shuffle based on a numeric seed.
 */
function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = ((s * 1103515245 + 12345) & 0x7fffffff);
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ── Main Conversion ───────────────────────────────────────────────────────────

const QUICK_CHECK_INTERVAL = 5; // Insert a quick check after every 5 teach cards

/**
 * Convert an array of ContentBlocks into a deck of LessonCards.
 *
 * Two-pass approach:
 * Pass 1: Convert all blocks to cards, merging images with adjacent text
 * Pass 2: Insert quick checks at intervals
 *
 * This ensures quick checks never land between a text card and its image.
 */
export function convertBlocksToCards(blocks: ContentBlock[]): LessonCard[] {
  // ── Pass 1: Convert blocks, merge images with text ────────────────────────
  const rawCards: LessonCard[] = [];
  let cardIndex = 0;

  for (let blockIdx = 0; blockIdx < blocks.length; blockIdx++) {
    const block = blocks[blockIdx];

    if (block.type === 'image') {
      const imgData = {
        src: block.data.src ? String(block.data.src) : undefined,
        alt: String(block.data.alt || ''),
      };

      // Try to merge with the PREVIOUS text card
      const lastCard = rawCards[rawCards.length - 1];
      if (lastCard && lastCard.type === 'text' && !lastCard.illustration) {
        lastCard.illustration = imgData;
        continue;
      }

      // Try to merge with the NEXT text block (image comes before its text)
      const nextBlock = blocks[blockIdx + 1];
      if (nextBlock && nextBlock.type === 'text') {
        const textCards = convertTextBlock(nextBlock.data, cardIndex);
        if (textCards.length > 0) {
          textCards[0].illustration = imgData;
          for (const card of textCards) {
            rawCards.push(card);
            cardIndex++;
          }
          blockIdx++; // skip the next text block since we consumed it
          continue;
        }
      }

      // Fallback: standalone visual card
      rawCards.push(convertImageBlock(block.data, cardIndex));
      cardIndex++;
      continue;
    }

    const blockCards = convertSingleBlock(block, cardIndex);
    for (const card of blockCards) {
      rawCards.push(card);
      cardIndex++;
    }
  }

  // ── Pass 2: Insert quick checks at intervals ──────────────────────────────
  const cards: LessonCard[] = [];
  let teachCardsSinceLastCheck = 0;
  const pendingKeyTerms: Array<{ term: string; definition: string }> = [];
  const pendingTextBlocks: string[] = [];
  let qcIndex = rawCards.length;

  for (const card of rawCards) {
    cards.push(card);
    teachCardsSinceLastCheck++;

    // Track content for quick check generation
    if (card.type === 'key-term') {
      pendingKeyTerms.push({ term: card.term, definition: card.definition });
    } else if (card.type === 'text') {
      pendingTextBlocks.push(card.text);
    }

    // Insert a quick check after every QUICK_CHECK_INTERVAL teach cards
    if (teachCardsSinceLastCheck >= QUICK_CHECK_INTERVAL) {
      const quickCheck = generateQuickCheck(
        pendingKeyTerms,
        pendingTextBlocks,
        `qc-${qcIndex}`
      );
      if (quickCheck) {
        cards.push(quickCheck);
        qcIndex++;
      }
      teachCardsSinceLastCheck = 0;
    }
  }

  return cards;
}

/**
 * Convert a single ContentBlock into one or more LessonCards.
 */
function convertSingleBlock(
  block: ContentBlock,
  startIndex: number
): LessonCard[] {
  switch (block.type) {
    case 'text':
      return convertTextBlock(block.data, startIndex);
    case 'key-term':
      return [convertKeyTermBlock(block.data, startIndex)];
    case 'callout':
      return [convertCalloutBlock(block.data, startIndex)];
    case 'image':
      return [convertImageBlock(block.data, startIndex)];
    case 'interactive':
      return [convertInteractiveBlock(block.data, startIndex)];
    case 'dialogue':
      return [convertDialogueBlock(block.data, startIndex)];
    default:
      return [];
  }
}

function convertTextBlock(
  data: Record<string, unknown>,
  startIndex: number
): TextCard[] {
  // Handle both `data.text` and `data.content` field names
  const rawText = String(data.text || data.content || '');
  if (!rawText.trim()) return [];

  // Normalize paragraph breaks for splitting
  const paragraphs = rawText.split(/\n\n+/).filter(Boolean);
  const allText = paragraphs.join(' ');

  const wordCount = allText.split(/\s+/).length;
  const sentenceCount = countSentences(allText);

  // Keep short text blocks as a single card regardless of sentence count.
  // Only split if BOTH: more than 3 sentences AND more than 60 words.
  if (sentenceCount <= 3 || wordCount <= 60) {
    return [
      {
        id: `card-${startIndex}`,
        type: 'text',
        text: rawText.trim(),
      },
    ];
  }

  // Split into chunks of 3 sentences
  const sentences = splitSentences(allText);
  const chunks = chunkSentences(sentences, 3);

  return chunks.map((chunk, i) => ({
    id: `card-${startIndex}-${i}`,
    type: 'text' as const,
    text: chunk,
  }));
}

function convertKeyTermBlock(
  data: Record<string, unknown>,
  index: number
): KeyTermCard {
  return {
    id: `card-${index}`,
    type: 'key-term',
    term: String(data.term || ''),
    definition: String(data.definition || ''),
  };
}

function convertCalloutBlock(
  data: Record<string, unknown>,
  index: number
): CalloutCard {
  const variant = (data.variant as CalloutCard['variant']) || 'tip';
  return {
    id: `card-${index}`,
    type: 'callout',
    variant,
    text: String(data.content || data.text || ''),
    title: data.title ? String(data.title) : undefined,
  };
}

function convertImageBlock(
  data: Record<string, unknown>,
  index: number
): VisualCard {
  return {
    id: `card-${index}`,
    type: 'visual',
    src: data.src ? String(data.src) : undefined,
    alt: String(data.alt || ''),
    caption: data.caption ? String(data.caption) : undefined,
    description: data.description ? String(data.description) : undefined,
  };
}

function convertInteractiveBlock(
  data: Record<string, unknown>,
  index: number
): InteractiveCard {
  return {
    id: `card-${index}`,
    type: 'interactive',
    data,
  };
}

function convertDialogueBlock(
  data: Record<string, unknown>,
  index: number
): DialogueCard {
  return {
    id: `card-${index}`,
    type: 'dialogue',
    character: String(data.character || 'chip'),
    expression: data.expression ? String(data.expression) : undefined,
    text: String(data.text || data.content || ''),
  };
}

/**
 * Pick the best quick check to generate from accumulated content.
 * Prefers key-term checks; falls back to text-based checks.
 */
function generateQuickCheck(
  keyTerms: Array<{ term: string; definition: string }>,
  textBlocks: string[],
  id: string
): QuickCheckCard | null {
  // Prefer generating from the most recent key term
  if (keyTerms.length > 0) {
    const lastTerm = keyTerms[keyTerms.length - 1];
    // Remove it so we don't repeat
    keyTerms.pop();
    return generateKeyTermQuickCheck(lastTerm.term, lastTerm.definition, id);
  }

  // Fall back to text-based
  if (textBlocks.length > 0) {
    const lastText = textBlocks[textBlocks.length - 1];
    textBlocks.pop();
    return generateTextQuickCheck(lastText, id);
  }

  return null;
}
