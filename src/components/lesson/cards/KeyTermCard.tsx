'use client';

interface KeyTermCardProps {
  term: string;
  definition: string;
  chapterColor: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function KeyTermCard({ term, definition, chapterColor }: KeyTermCardProps) {
  return (
    <div
      className="lesson-card border-l-4 items-center text-center"
      style={{
        borderLeftColor: chapterColor,
        backgroundColor: hexToRgba(chapterColor, 0.08),
        borderColor: hexToRgba(chapterColor, 0.15),
      }}
    >
      {/* Small label */}
      <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted mb-4 block">
        Key Term
      </span>

      {/* Term */}
      <h2
        className="font-display text-2xl lg:text-3xl font-bold mb-3 lg:mb-4"
        style={{ color: chapterColor }}
      >
        {term}
      </h2>

      {/* Divider */}
      <div
        className="w-12 h-0.5 rounded-full mx-auto mb-4"
        style={{ backgroundColor: hexToRgba(chapterColor, 0.3) }}
      />

      {/* Definition */}
      <p className="text-dark/85 font-body text-base lg:text-lg leading-relaxed max-w-lg mx-auto">
        {definition}
      </p>
    </div>
  );
}
