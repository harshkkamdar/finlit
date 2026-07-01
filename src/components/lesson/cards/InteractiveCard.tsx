'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Play,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { isFormulaSafe, getFormulaInputs } from '@/lib/formula-sanitizer';

// ── Types ─────────────────────────────────────────────────────────────────────

interface InteractiveCardProps {
  data: Record<string, unknown>;
  chapterColor: string;
}

interface BlockProps {
  data: Record<string, unknown>;
  chapterColor: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ── Slider Calculator ─────────────────────────────────────────────────────────

interface CalcField {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  slider: boolean;
}

function formatCalcNumber(n: number): string {
  if (typeof n !== 'number' || !isFinite(n)) return '\u2014';
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded)
    ? rounded.toLocaleString('en-IN')
    : rounded.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/**
 * Universal calculator card. Supports one or many inputs (declared via `config.inputs`,
 * via legacy `inputLabel`/`secondInputLabel`, or inferred from the formula), rendered as
 * sliders when a numeric range is known and as number fields otherwise. Handles both
 * single-number results and object results (whose fields are labelled by splitting
 * `outputLabel` on `|`).
 */
function SliderCalculator({ data, chapterColor }: BlockProps) {
  const config = (data.config as Record<string, unknown>) || {};
  const title = (data.title as string) || 'Calculator';
  const description = (data.description as string) || '';

  const formula = (config.formula as string) || '0';
  const outputLabel = (config.outputLabel as string) || 'Result';
  const outputPrefix = (config.outputPrefix as string) || '';
  const outputSuffix = (config.outputSuffix as string) || '';
  const subOutput = (config.subOutput as string) || (config.comparisonNote as string) || '';
  const positiveMessage = (config.positiveMessage as string) || '';
  const negativeMessage = (config.negativeMessage as string) || '';
  const comparisonFormula = (config.comparisonFormula as string) || '';
  const comparisonLabel = (config.comparisonLabel as string) || '';

  // Resolve the input fields the formula needs: prefer an explicit `config.inputs`
  // array, else pair the formula's variables with legacy single/second labels.
  // (No manual memoization — the React Compiler handles it; a manual useMemo here
  // trips on the `config` fallback object which isn't referentially stable.)
  const vars = getFormulaInputs(formula);
  const explicitInputs = Array.isArray(config.inputs)
    ? (config.inputs as Array<Record<string, unknown>>)
    : null;
  const legacyLabels = [config.inputLabel, config.secondInputLabel]
    .filter((l): l is string => typeof l === 'string');

  const rawFields: Array<Record<string, unknown>> =
    explicitInputs ?? vars.map((key, i) => ({ key, label: legacyLabels[i] }));
  const singleField = rawFields.length === 1;

  const fields: CalcField[] = rawFields.map((raw, i) => {
    const key = String(raw.key ?? vars[i] ?? `x${i}`);
    // A single-input card may carry its range on the config itself (legacy sliders).
    const rawMin = raw.min ?? (singleField ? config.min : undefined);
    const rawMax = raw.max ?? (singleField ? config.max : undefined);
    const rawStep = raw.step ?? (singleField ? config.step : undefined);
    const def = raw.default != null ? Number(raw.default) : NaN;
    const hasRange = rawMin != null && rawMax != null;
    const min = Number(rawMin ?? 0);
    const max = Number(rawMax ?? Math.max(4 * (Number.isFinite(def) ? def : 0), 100));
    return {
      key,
      label: String(raw.label ?? legacyLabels[i] ?? key),
      min,
      max,
      step: Number(rawStep ?? Math.max(1, Math.round((max - min) / 100))),
      default: Number.isFinite(def) ? def : Math.round((min + max) / 2),
      slider: hasRange,
    };
  });

  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    fields.forEach((f) => { initial[f.key] = f.default; });
    return initial;
  });

  const setValue = (key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const evaluate = (expr: string): number | Record<string, number> | null => {
    try {
      const keys = fields.map((f) => f.key);
      const body = `return (${expr.trim()});`;
      if (!isFormulaSafe(body, keys)) return null;
      // eslint-disable-next-line no-new-func
      const fn = new Function(...keys, body);
      return fn(...keys.map((k) => values[k] ?? 0));
    } catch {
      return null;
    }
  };

  const result = evaluate(formula);
  const comparison = comparisonFormula ? evaluate(comparisonFormula) : null;

  const objectEntries =
    result && typeof result === 'object'
      ? Object.entries(result).map(([k, v], i) => ({
          label: outputLabel.split('|').map((s) => s.trim())[i] ?? k,
          value: v as number,
        }))
      : null;
  const numberResult = typeof result === 'number' ? result : null;
  const invalid = result === null;

  return (
    <>
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: hexToRgba(chapterColor, 0.12) }}
        >
          <SlidersHorizontal className="w-4 h-4" style={{ color: chapterColor }} />
        </div>
        <h3 className="font-display font-semibold text-dark text-base">
          {title}
        </h3>
      </div>
      {description && (
        <p className="text-muted font-body text-sm mb-5 ml-[42px]">
          {description}
        </p>
      )}

      <div className="space-y-4 mb-6">
        {fields.map((field) => {
          const value = values[field.key] ?? field.default;
          const fillPercent =
            field.max > field.min
              ? ((value - field.min) / (field.max - field.min)) * 100
              : 0;
          return (
            <div key={field.key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-body font-medium text-dark/80">
                  {field.label}
                </label>
                <span
                  className="font-mono text-sm font-semibold px-2.5 py-0.5 rounded-md"
                  style={{ backgroundColor: hexToRgba(chapterColor, 0.1), color: chapterColor }}
                >
                  {value.toLocaleString('en-IN')}
                </span>
              </div>
              {field.slider ? (
                <>
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={value}
                    onChange={(e) => setValue(field.key, Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer touch-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 lg:[&::-webkit-slider-thumb]:w-5 lg:[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${chapterColor} ${fillPercent}%, #E5E7EB ${fillPercent}%)`,
                    }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted font-mono">
                      {field.min.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-muted font-mono">
                      {field.max.toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              ) : (
                <input
                  type="number"
                  inputMode="numeric"
                  value={Number.isFinite(value) ? value : ''}
                  onChange={(e) =>
                    setValue(field.key, e.target.value === '' ? 0 : Number(e.target.value))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-white font-mono text-base text-dark outline-none focus:ring-2 transition-shadow"
                  style={{ ['--tw-ring-color' as string]: hexToRgba(chapterColor, 0.35) }}
                />
              )}
            </div>
          );
        })}
        <style>{`
          input[type="range"]::-webkit-slider-thumb { background-color: ${chapterColor}; }
          input[type="range"]::-moz-range-thumb { background-color: ${chapterColor}; width:28px; height:28px; border-radius:50%; border:2px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.15); cursor:pointer; }
          @media (min-width: 1024px) {
            input[type="range"]::-moz-range-thumb { width:20px; height:20px; }
          }
        `}</style>
      </div>

      <div
        className="rounded-lg p-4 text-center"
        style={{ backgroundColor: hexToRgba(chapterColor, 0.06) }}
      >
        {objectEntries ? (
          <div className={`grid gap-3 ${objectEntries.length > 2 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {objectEntries.map((entry) => (
              <div key={entry.label}>
                <p className="text-xs text-muted font-body mb-1">{entry.label}</p>
                <motion.p
                  key={entry.value}
                  initial={{ scale: 0.95, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-lg lg:text-xl font-bold"
                  style={{ color: chapterColor }}
                >
                  {formatCalcNumber(entry.value)}
                </motion.p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted font-body mb-1">{outputLabel}</p>
            <motion.p
              key={String(numberResult)}
              initial={{ scale: 0.95, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-3xl lg:text-2xl font-bold"
              style={{ color: chapterColor }}
            >
              {invalid
                ? '—'
                : `${outputPrefix}${formatCalcNumber(numberResult as number)}${outputSuffix}`}
            </motion.p>
            {numberResult !== null && positiveMessage && negativeMessage && (
              <p className="text-sm font-body mt-2 text-dark/70">
                {numberResult >= 0 ? positiveMessage : negativeMessage}
              </p>
            )}
          </>
        )}
        {comparison !== null && typeof comparison === 'number' && comparisonLabel && (
          <p className="text-sm text-muted font-body mt-3 pt-3 border-t border-border">
            {comparisonLabel}:{' '}
            <span className="font-mono font-semibold text-dark/80">
              {formatCalcNumber(comparison)}
            </span>
          </p>
        )}
        {subOutput && (
          <p className="text-xs text-muted font-body italic mt-2">{subOutput}</p>
        )}
      </div>
    </>
  );
}

// ── Poll Block ────────────────────────────────────────────────────────────────

function PollBlock({ data, chapterColor }: BlockProps) {
  const config = data.config as Record<string, unknown> | undefined;
  const title = (data.title as string) || 'Quick Poll';
  const description = (data.description as string) || '';
  const options = (config?.options as string[]) || [];
  const footnote = (config?.footnote as string) || '';

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const hasVoted = selectedIndex !== null;

  return (
    <>
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: hexToRgba(chapterColor, 0.12) }}
        >
          <Play className="w-4 h-4 ml-0.5" style={{ color: chapterColor }} />
        </div>
        <h3 className="font-display font-semibold text-dark text-base">
          {title}
        </h3>
      </div>
      {description && (
        <p className="text-muted font-body text-sm mb-5 ml-[42px]">
          {description}
        </p>
      )}

      <AnimatePresence mode="wait">
        {!hasVoted ? (
          <motion.div
            key="options"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-2.5"
          >
            {options.map((option, idx) => (
              <motion.button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className="w-full text-left px-4 py-3 rounded-lg border-2 border-border font-body text-[15px] text-dark transition-all"
                whileHover={{
                  borderColor: chapterColor,
                  backgroundColor: hexToRgba(chapterColor, 0.04),
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-mono font-semibold shrink-0"
                    style={{ borderColor: hexToRgba(chapterColor, 0.4), color: chapterColor }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <CheckCircle2
                className="w-10 h-10 mx-auto mb-3"
                style={{ color: chapterColor }}
              />
            </motion.div>
            <p className="font-display font-semibold text-dark text-lg mb-1">
              Thanks for your answer!
            </p>
            <p className="text-muted font-body text-sm mb-3">
              You picked: <span className="font-medium text-dark">{options[selectedIndex]}</span>
            </p>
            {footnote && (
              <p className="text-muted font-body text-sm italic border-t border-border pt-3 mt-3">
                {footnote}
              </p>
            )}
            <button
              onClick={() => setSelectedIndex(null)}
              className="mt-3 text-sm font-body flex items-center gap-1 mx-auto transition-colors hover:opacity-80"
              style={{ color: chapterColor }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Vote again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Budget Allocator ──────────────────────────────────────────────────────────

function BudgetAllocator({ data, chapterColor }: BlockProps) {
  const title = (data.title as string) || 'Budget Allocator';
  const description = (data.description as string) || '';

  const [salary, setSalary] = useState(50000);
  const needs = Math.round(salary * 0.5);
  const wants = Math.round(salary * 0.3);
  const savings = salary - needs - wants;

  const categories = [
    { label: 'Needs (50%)', amount: needs, color: '#16A34A' },
    { label: 'Wants (30%)', amount: wants, color: '#F5A623' },
    { label: 'Savings (20%)', amount: savings, color: '#2563EB' },
  ];

  const fillPercent = ((salary - 10000) / (200000 - 10000)) * 100;

  return (
    <>
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: hexToRgba(chapterColor, 0.12) }}
        >
          <SlidersHorizontal className="w-4 h-4" style={{ color: chapterColor }} />
        </div>
        <h3 className="font-display font-semibold text-dark text-base">{title}</h3>
      </div>
      {description && (
        <p className="text-muted font-body text-sm mb-5 ml-[42px]">{description}</p>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-body font-medium text-dark/80">Monthly Salary</label>
          <span
            className="font-mono text-sm font-semibold px-2.5 py-0.5 rounded-md"
            style={{ backgroundColor: hexToRgba(chapterColor, 0.1), color: chapterColor }}
          >
            \u20B9{salary.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min={10000}
          max={200000}
          step={1000}
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer touch-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 lg:[&::-webkit-slider-thumb]:w-5 lg:[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${chapterColor} ${fillPercent}%, #E5E7EB ${fillPercent}%)`,
          }}
        />
        <style>{`
          input[type="range"]::-webkit-slider-thumb { background-color: ${chapterColor}; }
          input[type="range"]::-moz-range-thumb { background-color: ${chapterColor}; width:28px; height:28px; border-radius:50%; border:2px solid white; }
          @media (min-width: 1024px) {
            input[type="range"]::-moz-range-thumb { width:20px; height:20px; }
          }
        `}</style>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const percent = salary > 0 ? (cat.amount / salary) * 100 : 0;
          return (
            <div key={cat.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-body font-medium text-dark/80">{cat.label}</span>
                <motion.span
                  key={cat.amount}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-sm font-semibold"
                  style={{ color: cat.color }}
                >
                  \u20B9{cat.amount.toLocaleString('en-IN')}
                </motion.span>
              </div>
              <div className="w-full h-3 bg-fill-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: cat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Tap to Identify ───────────────────────────────────────────────────────────

function TapToIdentify({ data, chapterColor }: BlockProps) {
  const config = data.config as Record<string, unknown> | undefined;
  const title = (data.title as string) || 'Tap to Identify';
  const description = (data.description as string) || '';
  const items = (config?.items as Array<Record<string, unknown>>) || [];

  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  const handleTap = useCallback((idx: number) => {
    setRevealedIndices((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, []);

  return (
    <>
      <h3 className="font-display font-semibold text-dark text-base mb-1">{title}</h3>
      {description && (
        <p className="text-muted font-body text-sm mb-5">{description}</p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, idx) => {
          const label = (item.label as string) || (item.text as string) || `Item ${idx + 1}`;
          const answer = (item.answer as string) || (item.category as string) || '';
          const isRevealed = revealedIndices.has(idx);

          return (
            <motion.button
              key={idx}
              onClick={() => handleTap(idx)}
              className="relative p-4 rounded-lg border-2 text-left transition-all font-body text-sm min-h-[60px]"
              style={{
                borderColor: isRevealed ? chapterColor : '#E5E7EB',
                backgroundColor: isRevealed ? hexToRgba(chapterColor, 0.06) : 'white',
              }}
              whileHover={!isRevealed ? { borderColor: hexToRgba(chapterColor, 0.5) } : {}}
              whileTap={!isRevealed ? { scale: 0.97 } : {}}
            >
              <span className="font-medium text-dark">{label}</span>
              <AnimatePresence>
                {isRevealed && answer && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="block mt-1.5 text-xs font-semibold"
                    style={{ color: chapterColor }}
                  >
                    {answer}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

// ── Red Flag Checker ──────────────────────────────────────────────────────────

function RedFlagChecker({ data, chapterColor }: BlockProps) {
  const config = data.config as Record<string, unknown> | undefined;
  const title = (data.title as string) || 'Red Flag Checker';
  const description = (data.description as string) || '';
  const flags = (config?.flags as string[]) || (config?.items as string[]) || [];

  const [checkedFlags, setCheckedFlags] = useState<Set<number>>(new Set());

  const toggleFlag = useCallback((idx: number) => {
    setCheckedFlags((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  const checkedCount = checkedFlags.size;

  return (
    <>
      <h3 className="font-display font-semibold text-dark text-base mb-1">{title}</h3>
      {description && (
        <p className="text-muted font-body text-sm mb-5">{description}</p>
      )}
      <div className="space-y-2">
        {flags.map((flag, idx) => {
          const isChecked = checkedFlags.has(idx);
          return (
            <motion.button
              key={idx}
              onClick={() => toggleFlag(idx)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all font-body text-sm"
              style={{
                borderColor: isChecked ? '#E74C3C' : '#E5E7EB',
                backgroundColor: isChecked ? 'rgba(231, 76, 60, 0.05)' : 'white',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                style={{
                  borderColor: isChecked ? '#E74C3C' : '#9CA3AF',
                  backgroundColor: isChecked ? '#E74C3C' : 'transparent',
                }}
              >
                {isChecked && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </div>
              <span className={`text-dark/90 ${isChecked ? 'line-through text-dark/50' : ''}`}>
                {String(flag)}
              </span>
            </motion.button>
          );
        })}
      </div>
      {flags.length > 0 && (
        <p className="text-sm text-muted font-body mt-4 text-center">
          {checkedCount} of {flags.length} flagged
        </p>
      )}
    </>
  );
}

// ── Fallback ──────────────────────────────────────────────────────────────────

function InteractiveFallback({ data, chapterColor }: BlockProps) {
  const title = (data.title as string) || 'Interactive Element';
  const description = (data.description as string) || 'This interactive will be available soon.';

  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center py-4">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ backgroundColor: hexToRgba(chapterColor, 0.12) }}
      >
        <Play className="w-6 h-6 ml-0.5" style={{ color: chapterColor }} />
      </div>
      <p className="font-display text-lg text-dark font-semibold">{title}</p>
      <p className="text-muted text-sm font-body max-w-md">{description}</p>
      <span
        className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1 rounded-full"
        style={{
          backgroundColor: hexToRgba(chapterColor, 0.1),
          color: chapterColor,
        }}
      >
        Coming Soon
      </span>
    </div>
  );
}

// ── Main Router ───────────────────────────────────────────────────────────────

export default function InteractiveCard({ data, chapterColor }: InteractiveCardProps) {
  const interactiveType = (data.interactiveType as string) || '';

  const renderInteractive = (): ReactNode => {
    switch (interactiveType) {
      case 'slider-calculator':
      case 'income-expense-calculator':
      case 'compound-interest-calculator':
      case 'rule-of-72-calculator':
      case 'start-age-comparison':
        return <SliderCalculator data={data} chapterColor={chapterColor} />;
      case 'poll':
      case 'scenario-predictor':
      case 'timeline-quiz':
        return <PollBlock data={data} chapterColor={chapterColor} />;
      case 'budget-allocator':
        return <BudgetAllocator data={data} chapterColor={chapterColor} />;
      case 'tap-to-identify':
        return <TapToIdentify data={data} chapterColor={chapterColor} />;
      case 'red-flag-checker':
        return <RedFlagChecker data={data} chapterColor={chapterColor} />;
      default:
        return <InteractiveFallback data={data} chapterColor={chapterColor} />;
    }
  };

  return (
    <div
      className="lesson-card overflow-hidden"
      style={{ backgroundColor: '#F9FAFB' }}
    >
      {/* Top accent */}
      <div
        className="h-1 -mt-10 -mx-10 mb-6"
        style={{ backgroundColor: chapterColor }}
      />
      {renderInteractive()}
    </div>
  );
}
