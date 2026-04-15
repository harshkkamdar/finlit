/**
 * Validates that a formula string only contains safe mathematical operations.
 * Prevents arbitrary code execution when formulas from the database are evaluated
 * via `new Function()`.
 *
 * Allowed: digits, operators (+, -, *, /, %), parentheses, braces (for object literals),
 * commas, colons, dots, whitespace, comparison operators, ternary, and specific
 * identifiers (Math methods, variable names from the allowlist, and common keywords).
 */

const SAFE_IDENTIFIERS = new Set([
  // Math methods
  'Math', 'pow', 'ceil', 'floor', 'round', 'abs', 'min', 'max', 'sqrt', 'log', 'PI',
  // JS keywords needed for formulas
  'return', 'true', 'false', 'null', 'undefined',
  // Numeric literals
  'NaN', 'Infinity',
]);

/**
 * Check whether a formula string is safe to evaluate with `new Function()`.
 * @param formula - The formula string to validate
 * @param allowedVars - Variable names that are allowed (e.g., input keys)
 * @returns true if safe, false if potentially dangerous
 */
export function isFormulaSafe(formula: string, allowedVars: string[] = []): boolean {
  const allowed = new Set([...SAFE_IDENTIFIERS, ...allowedVars]);

  // Remove string literals (shouldn't be in math formulas, but handle gracefully)
  const noStrings = formula.replace(/'[^']*'|"[^"]*"/g, '""');

  // Extract all identifiers (sequences of word characters starting with a letter or _)
  const identifiers = noStrings.match(/[a-zA-Z_]\w*/g) || [];

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
