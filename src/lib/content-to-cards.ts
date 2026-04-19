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

// ── Quick Check Generation — REMOVED ─────────────────────────────────────────
//
// Auto-generated quick checks produced garbled, truncated, incoherent wrong
// answers (e.g., "A process that is unrelated to of TCS..."). The algorithm
// mangled sentence fragments to create distractors, which never worked.
//
// Quick checks now ONLY come from explicitly authored content in the JSON files.
// No auto-generation.

// ── Main Conversion ───────────────────────────────────────────────────────────

/**
 * Convert an array of ContentBlocks into a deck of LessonCards.
 *
 * Converts all blocks to cards, merging images with adjacent text.
 * No auto-generated quick checks — only authored content from the JSON.
 */
export function convertBlocksToCards(blocks: ContentBlock[]): LessonCard[] {
  const cards: LessonCard[] = [];
  let cardIndex = 0;

  for (let blockIdx = 0; blockIdx < blocks.length; blockIdx++) {
    const block = blocks[blockIdx];

    if (block.type === 'image') {
      const imgData = {
        src: block.data.src ? String(block.data.src) : undefined,
        alt: String(block.data.alt || ''),
      };

      // Try to merge with the PREVIOUS text card
      const lastCard = cards[cards.length - 1];
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
            cards.push(card);
            cardIndex++;
          }
          blockIdx++; // skip the next text block since we consumed it
          continue;
        }
      }

      // Fallback: standalone visual card
      cards.push(convertImageBlock(block.data, cardIndex));
      cardIndex++;
      continue;
    }

    const blockCards = convertSingleBlock(block, cardIndex);
    for (const card of blockCards) {
      cards.push(card);
      cardIndex++;
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
      // Unknown block types (including future hand-authored 'quick-check' blocks
      // added directly to content JSON) are silently skipped.
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

