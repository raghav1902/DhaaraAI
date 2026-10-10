/**
 * currencyValidation.js
 * Comprehensive Indian Rupee validation, sanitization, denomination parsing, and boundary checks.
 * Eliminates unbounded "countless number" inputs across DhaaraAI Fee Studio.
 */

export const STATUTORY_CEILINGS = {
  property: 5000000000,      // ₹500 Crore (Maximum property valuation)
  civilCourt: 1000000000,    // ₹100 Crore (Maximum civil suit pecuniary claim)
  consumerCourt: 500000000,  // ₹50 Crore (Maximum consumer claim under CPA 2019)
  gstLiability: 100000000,   // ₹10 Crore (Maximum tax liability ledger)
  advocateIncome: 100000000, // ₹10 Crore (Maximum applicant income)
  gstMaxDays: 1825,          // 5 Years (1,825 days delay limit)
  advocateMaxHearings: 50    // 50 effective hearings limit
};

/**
 * Strips non-digits, strips leading zeroes, enforces maximum digit length,
 * and clamps to statutory ceiling.
 */
export function cleanRupeeInput(rawValue, maxVal = STATUTORY_CEILINGS.property) {
  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return { cleanStr: '', numVal: 0, isCapped: false };
  }

  // 1. Extract only numeric digits (0-9). Blocks negative '-', exponents 'e/E', signs '+', etc.
  const digitsOnly = String(rawValue).replace(/[^0-9]/g, '');

  if (!digitsOnly) {
    return { cleanStr: '', numVal: 0, isCapped: false };
  }

  // 2. Strip leading zeroes unless the whole string is just "0"
  let cleanStr = digitsOnly.replace(/^0+/, '');
  if (!cleanStr) {
    return { cleanStr: '0', numVal: 0, isCapped: false };
  }

  // 3. Prevent countless digits: clamp length to 11 digits (up to ₹999 Crore, safe in JS numbers)
  if (cleanStr.length > 11) {
    cleanStr = cleanStr.slice(0, 11);
  }

  let numVal = parseInt(cleanStr, 10);
  let isCapped = false;

  // 4. Clamping against statutory ceiling
  if (Number.isFinite(maxVal) && numVal > maxVal) {
    numVal = maxVal;
    cleanStr = String(maxVal);
    isCapped = true;
  }

  return { cleanStr, numVal, isCapped };
}

/**
 * Formats a number with Indian numeral grouping (e.g. 50,00,000).
 */
export function formatIndianNumber(num) {
  const val = Number(num);
  if (!Number.isFinite(val) || val <= 0) return '0';
  return Math.round(val).toLocaleString('en-IN');
}

/**
 * Converts a rupee number into clear Indian denomination words
 * (e.g. 50 Lakhs / 50 लाख, 2.5 Crores / 2.5 करोड़).
 */
export function formatRupeeInWords(num, isHindi = false) {
  const val = Number(num);
  if (!Number.isFinite(val) || val <= 0) return '';

  if (val < 1000) {
    return `₹${Math.round(val)}`;
  }

  if (val < 100000) {
    const thousands = (val / 1000).toLocaleString('en-IN', { maximumFractionDigits: 2 });
    return isHindi ? `${thousands} हज़ार` : `${thousands} Thousand`;
  }

  if (val < 10000000) {
    const lakhs = (val / 100000).toLocaleString('en-IN', { maximumFractionDigits: 2 });
    return isHindi ? `${lakhs} लाख` : `${lakhs} Lakh${Number(val / 100000) > 1 ? 's' : ''}`;
  }

  const crores = (val / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  return isHindi ? `${crores} करोड़` : `${crores} Crore${Number(val / 10000000) > 1 ? 's' : ''}`;
}

/**
 * Dual / bilingual denomination label for instant clarity (e.g. "50 Lakhs • 50 लाख").
 */
export function formatBilingualDenomination(num) {
  const val = Number(num);
  if (!Number.isFinite(val) || val < 1000) return '';

  const en = formatRupeeInWords(val, false);
  const hi = formatRupeeInWords(val, true);

  if (en === hi) return en;
  return `${en} • ${hi}`;
}

/**
 * Sanitizes integer bounded fields (e.g., days of delay, number of hearings).
 */
export function cleanBoundedInt(rawValue, min = 0, max = 100) {
  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return { cleanStr: '', numVal: min, isCapped: false };
  }
  const digitsOnly = String(rawValue).replace(/[^0-9]/g, '');
  if (!digitsOnly) {
    return { cleanStr: '', numVal: min, isCapped: false };
  }
  let numVal = parseInt(digitsOnly, 10);
  let isCapped = false;
  if (numVal > max) {
    numVal = max;
    isCapped = true;
  }
  if (numVal < min) {
    numVal = min;
  }
  return { cleanStr: String(numVal), numVal, isCapped };
}
