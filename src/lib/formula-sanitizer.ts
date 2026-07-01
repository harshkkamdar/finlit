/**
 * Validates that a formula string only contains safe mathematical operations.
 * Prevents arbitrary code execution when formulas from the database are evaluated
 * via `new Function()`.
 *
 * Allowed: digits, operators (+, -, *, /, %), parentheses, braces (for object literals
 * and statement blocks), commas, colons, dots, whitespace, comparison operators,
 * ternary, declaration/control-flow keywords, Math methods, the caller's allowlisted
 * variable names, object-literal property keys, and any variables the formula declares
 * locally (so IIFE-style formulas with helper variables are permitted).
 */

const SAFE_IDENTIFIERS = new Set([
  // Math methods
  'Math', 'pow', 'ceil', 'floor', 'round', 'abs', 'min', 'max', 'sqrt', 'log', 'PI',
  // Declaration + control-flow keywords (formulas may be IIFEs with local state)
  'return', 'const', 'let', 'var', 'if', 'else', 'while', 'for', 'do',
  'function', 'typeof', 'break', 'continue',
  // Boolean / nullish literals
  'true', 'false', 'null', 'undefined',
  // Numeric literals
  'NaN', 'Infinity',
]);

/**
 * Extract the names a formula introduces itself: `const`/`let`/`var` declarations,
 * assignment targets, and arrow-function parameters. These are local to the formula
 * (never globals), so they are safe to allow even though they aren't caller inputs.
 */
export function getLocalNames(formula: string): string[] {
  const src = formula.replace(/'[^']*'|"[^"]*"|`[^`]*`/g, '""');
  const names = new Set<string>();
  let m: RegExpExecArray | null;

  // `const x`, `let bal`, `var n`
  const declRe = /\b(?:const|let|var)\s+([a-zA-Z_$][\w$]*)/g;
  while ((m = declRe.exec(src)) !== null) names.add(m[1]);

  // Assignment targets: `x =` (not ==, =>), compound `x += ...`, and `x++` / `x--`.
  // Covers reassignments and comma-separated declarations (`let a = 1, b = 2`).
  const assignRe = /([a-zA-Z_$][\w$]*)\s*(?:=(?![=>])|[+\-*/%]=|\+\+|--)/g;
  while ((m = assignRe.exec(src)) !== null) names.add(m[1]);

  // Arrow-function parameters: `(a, b) => ...`
  const arrowRe = /\(([^()]*)\)\s*=>/g;
  while ((m = arrowRe.exec(src)) !== null) {
    for (const raw of m[1].split(',')) {
      const name = raw.trim().replace(/^\.\.\./, '').split('=')[0].trim();
      if (/^[a-zA-Z_$][\w$]*$/.test(name)) names.add(name);
    }
  }

  return [...names];
}

/**
 * The external variables a formula reads — every identifier that isn't a reserved
 * word, a Math method, or a name the formula declares locally. These are the inputs a
 * caller must supply (e.g. to render one field per variable). Order of first appearance
 * is preserved; duplicates are removed.
 */
export function getFormulaInputs(formula: string): string[] {
  const noStrings = formula.replace(/'[^']*'|"[^"]*"|`[^`]*`/g, '""');
  const noPropKeys = noStrings.replace(/([{,]\s*)[a-zA-Z_]\w*(\s*:)/g, '$1$2');
  const ids = noPropKeys.match(/[a-zA-Z_$][\w$]*/g) || [];
  const local = new Set(getLocalNames(formula));
  const out: string[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    if (SAFE_IDENTIFIERS.has(id) || local.has(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

/**
 * Check whether a formula string is safe to evaluate with `new Function()`.
 * @param formula - The formula string to validate
 * @param allowedVars - Variable names that are allowed (e.g., input keys)
 * @returns true if safe, false if potentially dangerous
 */
export function isFormulaSafe(formula: string, allowedVars: string[] = []): boolean {
  const allowed = new Set([
    ...SAFE_IDENTIFIERS,
    ...allowedVars,
    ...getLocalNames(formula),
  ]);

  // Remove string literals (shouldn't be in math formulas, but handle gracefully)
  const noStrings = formula.replace(/'[^']*'|"[^"]*"/g, '""');

  // Remove object-literal property keys, e.g. the `needs` in `{ needs: salary * 0.5 }`.
  // These are property names, not variable references — they never execute and so
  // shouldn't be required to be in the allowlist. A key sits at the start of a
  // property (after `{` or `,`) and is immediately followed by `:`. This leaves
  // ternary branches like `cond ? a : b` untouched, since `a`/`b` aren't preceded
  // by `{`/`,`, so real variable references are still validated.
  const noPropKeys = noStrings.replace(/([{,]\s*)[a-zA-Z_]\w*(\s*:)/g, '$1$2');

  // Extract all identifiers (sequences of word characters starting with a letter or _)
  const identifiers = noPropKeys.match(/[a-zA-Z_]\w*/g) || [];

  // Every identifier must be in the allowlist
  for (const id of identifiers) {
    if (!allowed.has(id)) {
      return false;
    }
  }

  // Block dangerous patterns even if identifiers pass
  const dangerous = /\b(eval|Function|import|require|fetch|XMLHttpRequest|document|window|globalThis|process|setTimeout|setInterval|constructor|prototype|__proto__)\b/;
  if (dangerous.test(formula)) {
    return false;
  }

  return true;
}
