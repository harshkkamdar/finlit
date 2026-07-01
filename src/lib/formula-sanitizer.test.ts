/**
 * Standalone test for the formula sanitizer (no test runner installed).
 * Run with: npx tsx src/lib/formula-sanitizer.test.ts
 */
import { isFormulaSafe, getLocalNames } from './formula-sanitizer';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${name} (got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)})`);
}

const EMI =
  '(() => { const r = annualRate/100/12; const emi = principal * r * Math.pow(1+r,months) / (Math.pow(1+r,months)-1); const total = emi * months; const interest = total - principal; return { emi: Math.round(emi), total: Math.round(total), interest: Math.round(interest) }; })()';
const DEBT =
  '(() => { let bal = balance; let months = 0; let totalPaid = 0; while (bal > 1 && months < 360) { let interest = bal * 0.03; let payment = Math.max(bal * 0.05, 500); if (payment > bal + interest) payment = bal + interest; bal = bal + interest - payment; totalPaid += payment; months++; } return { months, totalPaid }; })()';

// --- Object-literal formulas (bug #1): property keys must be allowed ---
check('50/30/20 object literal',
  isFormulaSafe('return ({ needs: salary * 0.50, wants: salary * 0.30, savings: salary * 0.20 })', ['salary']), true);
check('emergency fund roadmap',
  isFormulaSafe('return ({ target3m: expenses * 3, monthsTo3m: Math.ceil((expenses * 3) / monthly) })', ['expenses', 'monthly']), true);

// --- IIFE formulas (bug #2): local vars + keywords must be allowed ---
check('EMI IIFE safe', isFormulaSafe(`return (${EMI});`, ['principal', 'annualRate', 'months']), true);
check('debt-payoff IIFE safe', isFormulaSafe(`return (${DEBT});`, ['balance']), true);

// --- getLocalNames extracts declared/assigned names ---
check('getLocalNames EMI', getLocalNames(EMI).sort(), ['emi', 'interest', 'r', 'total'].sort());
check('getLocalNames debt', getLocalNames(DEBT).sort(),
  ['bal', 'interest', 'months', 'payment', 'totalPaid'].sort());

// --- Plain formulas still pass ---
check('plain subtraction', isFormulaSafe('return (income - expenses)', ['income', 'expenses']), true);
check('Math method', isFormulaSafe('return (expenses * months)', ['expenses', 'months']), true);
check('ternary with real refs', isFormulaSafe('return (salary > 1000 ? salary : 0)', ['salary']), true);

// --- Security: dangerous input still rejected ---
check('blocks eval', isFormulaSafe('return (eval("1"))', ['salary']), false);
check('blocks unknown var as value', isFormulaSafe('return (foo * 2)', ['salary']), false);
check('blocks constructor escape', isFormulaSafe('return (({}).constructor)', ['salary']), false);
check('blocks unknown var used as object value', isFormulaSafe('return ({ needs: foo })', ['salary']), false);
check('blocks window even if assigned', isFormulaSafe('let x = window; return (x)', ['salary']), false);
check('blocks unknown global call', isFormulaSafe('return (alert(1))', ['salary']), false);

console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
